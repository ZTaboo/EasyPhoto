import {Player} from "@lottiefiles/react-lottie-player";
import image from "../assets/animation/image.json";
import {Button, message, Radio, Spin, Upload} from "antd";
import {createRef, useState} from "react";
import {UploadOutlined} from "@ant-design/icons";
import imglyRemoveBackground from "@imgly/background-removal"
import {writeBinaryFile} from "@tauri-apps/api/fs";
import {save} from "@tauri-apps/api/dialog";
import bgImg from '../assets/images/bg.png'

const Matting = () => {
    const [fileList, setFileList] = useState([])
    const [tmpUrl, setTmpUrl] = useState('')
    const [tmpFileUrl, setTmpFileUrl] = useState('')
    const [spinning, setSpinning] = useState(false)
    const [successStatus, setSuccessStatus] = useState(false)
    const [color, setColor] = useState('transparent')
    const [messageApi, contextHolder] = message.useMessage();
    const colorList = [
        {
            type: 'transparent',
            color: 'transparent'
        },
        {
            type: 'white',
            color: '#fff'
        },
        {
            type: 'red',
            color: '#D9001B'
        },
        {
            type: 'blue',
            color: '#02A7F0'
        }
    ]
    const clean = () => {
        setFileList([])
        setTmpUrl('')
        setTmpFileUrl(null)
        setSpinning(false)
        setSuccessStatus(false)
    }
    const toImg = () => {
        setSpinning(true)
        let config = {
            debug: true,
            publicPath: "/", // path to the wasm files
            model: "medium",
        };
        let file = fileList[0]
        const fileSlice = file.slice(0, file.size);
        const blob = new Blob([fileSlice], {type: file.type});
        imglyRemoveBackground(blob, config).then(r => {
            const url = URL.createObjectURL(r);
            setTmpUrl(url)
            setSpinning(false)
            setSuccessStatus(true)
        })
    }

    const saveImage = async () => {
        let typeList = ['png']

        let img = new Image()
        img.src = tmpUrl
        let canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        let ctx = canvas.getContext('2d')
        if (color !== 'transparent') {
            typeList.push('jpeg')
            typeList.push('jpg')
            ctx.fillStyle = color
            ctx.fillRect(0, 0, img.width, img.height);
        }
        ctx.drawImage(img, 0, 0, img.width, img.height);
        const filePath = await save({
            filters: [
                {
                    name: 'Image',
                    extensions: typeList
                }
            ]
        })
        const bytes = Uint8Array.from(atob(canvas.toDataURL().split(',')[1]), c => c.charCodeAt(0));
        try {
            await writeBinaryFile(filePath, bytes)
            messageApi.success(`保存成功，路径：${filePath}`);
        } catch (e) {
            messageApi.open({
                type: 'error',
                content: '保存失败',
            });
        }

    }
    return (
        <>
            {contextHolder}
            <div className={'h-full'}>
                {
                    fileList.length <= 0 ?
                        <div
                            className={"h-full flex justify-center"}
                            style={{flexFlow: "column"}}
                        >
                            <Player src={image} autoplay className={"w-72 h-72"} loop></Player>
                            <div className={"flex justify-center"}>
                                <Upload
                                    maxCount={1}
                                    beforeUpload={(file) => {
                                        const fileSlice = file.slice(0, file.size);
                                        const blob = new Blob([fileSlice], {type: file.type});
                                        const url = URL.createObjectURL(blob);
                                        setTmpFileUrl(url)
                                        setFileList([file]);
                                        return false;
                                    }}
                                >
                                    <Button icon={<UploadOutlined/>} type={"dashed"} size={"large"}>
                                        选择文件
                                    </Button>
                                </Upload>
                            </div>
                        </div>
                        :
                        <div className={'h-full'}>
                            <div className={'h-5/6 flex justify-center items-center'}>
                                <Spin spinning={spinning}>
                                    <div className={'flex justify-center items-center'}
                                         style={color === 'transparent' ? {background: `url(${bgImg})`} : {background: color}}>
                                        <img src={tmpUrl === "" ? tmpFileUrl : tmpUrl}
                                             className={'w-auto h-1/3 max-h-96'}
                                             alt=""/>
                                    </div>
                                </Spin>
                            </div>
                            <div className={tmpUrl === "" ? 'hidden' : 'flex justify-center mb-5'}>
                                <Radio.Group value={color} onChange={e => {
                                    setColor(e.target.value)
                                }}>
                                    {
                                        colorList.map(item => (
                                            <Radio value={item.color} key={item.type}>
                                                {item.type === 'transparent' ?
                                                    <div className={'w-10 h-10'} style={{background: `url(${bgImg})`}}>
                                                    </div>
                                                    :
                                                    <div style={{background: item.color}} className={'w-10 h-10'}>
                                                    </div>
                                                }
                                            </Radio>
                                        ))
                                    }
                                </Radio.Group>
                            </div>

                            <div className={'flex justify-center mt-3'}>
                                <Button onClick={clean}>重新选择</Button>
                                <Button className={'ml-5'} onClick={toImg} disabled={successStatus}>处理图像</Button>
                                <Button className={'ml-5'} type={"primary"} onClick={saveImage}
                                        disabled={!successStatus}>保存</Button>
                            </div>
                        </div>
                }
            </div>
        </>
    )
}

export default Matting