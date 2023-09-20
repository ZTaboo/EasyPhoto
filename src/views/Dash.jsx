import {Button, Steps, Upload} from "antd";
import {Player} from "@lottiefiles/react-lottie-player";
import image from '../assets/animation/image.json'
import {useEffect, useState} from "react";
import {UploadOutlined} from "@ant-design/icons";
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import '../assets/css/dash.css'

const Dash = () => {
    const [current, setCurrent] = useState(0)
    const [fileList, setFileList] = useState([])
    const [photoInfo, setPhotoInfo] = useState({})
    const next = () => {
        setCurrent(current + 1)
    }
    const Previous = () => {
        setCurrent(current - 1)
    }
    return (
        <div className={'dash-box'}>
            <Steps
                className={'select-none'}
                current={current}
                items={[
                    {
                        title: '选择文件',
                        description: '选择需要修改的照片文件',
                    },
                    {
                        title: '选择尺寸',
                        description: '选择证件照尺寸',
                    }, {
                        title: '裁剪图像',
                        description: '对照片进行裁剪',
                    },
                    {
                        title: '压缩图像',
                        description: '对照片进行压缩',
                    },
                ]}
            />
            {
                current === 0
                    ?
                    <SelectImage fileList={fileList}
                                 setFileList={setFileList}
                                 next={next}
                    />
                    :
                    current === 1 ?
                        <PhotoSize next={next} onPhotoInfo={setPhotoInfo}/>
                        :
                        current === 2
                            ?
                            <CroppingImage fileList={fileList} prev={Previous} info={photoInfo}/> : current === 3
                                ?
                                <SelectImage/> : null
            }
        </div>
    )
}
export default Dash;
const SelectImage = ({fileList, setFileList, next}) => {
    return (
        <div className={'h-full flex justify-center'} style={{flexFlow: 'column'}}>
            <Player src={image} autoplay className={'w-72 h-72'} loop></Player>
            <div className={'flex justify-center'}>
                <Upload
                    maxCount={1}
                    beforeUpload={(file) => {
                        setFileList([...fileList, file])
                        next()
                        return false
                    }}
                >
                    <Button icon={<UploadOutlined/>} type={'dashed'} size={'large'}>选择文件</Button>
                </Upload>
            </div>
        </div>
    )
}

// 选择图像尺寸
const PhotoSize = ({next, onPhotoInfo}) => {
    let typeList = {
        '普通证件照': [
            {
                type: '一寸证件照',
                width: 25,
                height: 35,
                proportion: 5 / 7
            },
            {
                type: '二寸证件照',
                width: 35,
                height: 53,
                proportion: 1
            }
        ]
    }
    return (
        <div className={'mt-5'}>
            {
                Object.keys(typeList).map((item, index) => (
                    <div key={index}>
                        <h1 className={'text-xl font-bold'}>{item}</h1>
                        <div className={'grid grid-cols-4 mt-3 mb-3'}>
                            {
                                typeList[item].map((item, index) => (
                                    <div
                                        key={index}
                                        className={'rounded-md mx-auto hover:shadow-md w-44 pl-3 pr-3 pt-2 pb-2 cursor-pointer font-bold font-sans flex justify-center'}
                                        style={{border: '1px solid #ccc'}}
                                        onClick={() => {
                                            onPhotoInfo(item)
                                            next()
                                        }}
                                    >
                                        <div className={'flex items-center'} style={{flexFlow: 'column'}}>
                                            <h1>{item.type}</h1>
                                            <span className={'text-gray-500'}>{item.width}mm x {item.height}mm</span>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                ))
            }
            <Button onClick={() => next()}>btn</Button>
        </div>
    )
}
// 裁剪图像
const CroppingImage = ({fileList, prev, info}) => {
    const [image, setImage] = useState('')
    useEffect(() => {
        console.log(info)
        const reader = new FileReader();
        reader.onload = () => {
            setImage(reader.result.toString());
        };
        reader.readAsDataURL(fileList[0]);
    }, [])
    return (
        <div>
            <Cropper
                aspectRatio={info.proportion}
                className={'w-full h-72'}
                src={image}
                viewMode={1}
                responsive
            ></Cropper>
            <Button onClick={() => {
                console.log(image)
            }}>btn</Button>
            <Button onClick={() => prev()}>Prev</Button>
        </div>
    )
}