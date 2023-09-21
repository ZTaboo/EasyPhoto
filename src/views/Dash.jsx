import {Button, Tooltip, InputNumber, Steps, Upload, message, Result, Input, Modal} from "antd";
import {Player} from "@lottiefiles/react-lottie-player";
import image from "../assets/animation/image.json";
import {createRef, useEffect, useState} from "react";
import {UploadOutlined} from "@ant-design/icons";
import {typeList} from "../data.js";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import {changeDpiDataUrl} from 'changedpi'
import "../assets/css/dash.css";
import {save} from "@tauri-apps/api/dialog";
import {invoke} from "@tauri-apps/api";
import {writeBinaryFile} from "@tauri-apps/api/fs";

const Dash = () => {
    const [current, setCurrent] = useState(0);
    const [fileList, setFileList] = useState([]);
    const [photoInfo, setPhotoInfo] = useState({});
    const [successInfo, setSuccessInfo] = useState()
    const next = () => {
        setCurrent(current + 1);
    };
    const Previous = () => {
        setCurrent(current - 1);
    };
    const reset = () => {
        setCurrent(0);
    }
    return (
        <div className={"dash-box"}>
            <Steps
                className={"select-none"}
                current={current}
                items={[
                    {
                        title: "选择文件",
                        description: "选择需要修改的照片文件",
                    },
                    {
                        title: "选择尺寸",
                        description: "选择证件照尺寸",
                    },
                    {
                        title: "制作证件照",
                        description: "裁剪/压缩/修改细节",
                    },
                    {
                        title: "完成",
                    }
                ]}
            />
            {current === 0 ? (
                <SelectImage
                    setFileList={setFileList}
                    next={next}
                />
            ) : current === 1 ? (
                <PhotoSize prev={Previous} next={next} onPhotoInfo={setPhotoInfo}/>
            ) : current === 2 ? (
                <CroppingImage fileList={fileList}
                               prev={Previous}
                               next={next}
                               onSuccessInfo={setSuccessInfo}
                               info={photoInfo}/>
            ) : current === 3 ? (
                <SuccessPhoto info={successInfo} reset={reset}/>
            ) : null}
        </div>
    );
};
export default Dash;
const SelectImage = ({setFileList, next}) => {
    return (
        <div
            className={"h-full flex justify-center"}
            style={{flexFlow: "column"}}
        >
            <Player src={image} autoplay className={"w-72 h-72"} loop></Player>
            <div className={"flex justify-center"}>
                <Upload
                    maxCount={1}
                    beforeUpload={(file) => {
                        setFileList([file]);
                        next();
                        return false;
                    }}
                >
                    <Button icon={<UploadOutlined/>} type={"dashed"} size={"large"}>
                        选择文件
                    </Button>
                </Upload>
            </div>
        </div>
    );
};

// 选择图像尺寸
const PhotoSize = ({prev, next, onPhotoInfo}) => {
    const [searchVal, setSearchVal] = useState('')
    const [listCon, setListCon] = useState({})
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [customInfo, setCustomInfo] = useState({
        width: 0,
        height: 0,
    })
    useEffect(() => {
        setListCon(typeList)
    }, [])
    const searchBtn = () => {
        let tmpList = typeList
        let endTypeList = {}
        Object.keys(typeList).map((item, index) => {
            tmpList[item].map((data) => {
                if (contains(data.type, searchVal)) {
                    if (endTypeList[item]) {
                        endTypeList[item] = [...endTypeList[item], data]
                    } else {
                        endTypeList[item] = [data]
                    }
                }
            })
        })
        setListCon(endTypeList)
    }

    function contains(mainString, searchString) {
        let regex = new RegExp(searchString);
        return regex.test(mainString);
    }

    const onOK = () => {
        if (customInfo && customInfo.width > 0 && customInfo.height > 0) {
            onPhotoInfo({
                type: "custom",
                width: 0,
                height: 0,
                widthPX: customInfo.width,
                heightPX: customInfo.height,
                proportion: customInfo.width / customInfo.height,
            })
            next()
        } else {
            messageApi.error('请输入宽高')
        }

    }

    return (
        <div className={"mt-5"}>
            {contextHolder}
            <Modal open={isModalOpen}
                   width={300}
                   onOk={onOK}
                   onCancel={() => setIsModalOpen(false)}
            >
                <div className={'mt-8'}>
                    <div className={'flex items-center pr-5'}>
                        <span style={{width: '60px'}}>宽度:</span>
                        <InputNumber value={customInfo.width} className={'w-full'}
                                     placeholder={'请输入宽度,单位:px'}
                                     min={1}
                                     max={9999}
                                     onChange={e => {
                                         setCustomInfo({...customInfo, width: e})
                                     }}
                        ></InputNumber>
                    </div>
                    <div className={'flex items-center pr-5 mt-3'}>
                        <span style={{width: '60px'}}>高度:</span>
                        <InputNumber className={'w-full'} value={customInfo.height}
                                     placeholder={'请输入宽度,单位:px'}
                                     min={1}
                                     max={9999}
                                     onChange={e => {
                                         setCustomInfo({...customInfo, height: e})
                                     }}
                        ></InputNumber>
                    </div>
                </div>
            </Modal>
            <div className={'flex items-center'} onKeyDown={e => {
                if (e.keyCode === 13) {
                    searchBtn()
                }
            }}>
                <span style={{width: '60px'}} className={'text-lg font-bold'}>搜索:</span>
                <Input size={"middle"} placeholder={'请输入尺寸标准用以搜索'}
                       value={searchVal}
                       onChange={e => {
                           if (e.target.value.trim() === '') {
                               setSearchVal('')
                               setListCon(typeList)
                           } else {
                               setSearchVal(e.target.value)
                           }
                       }}
                ></Input>
                <Button className={'ml-2 mb-3 mb-0'} type={"primary"} onClick={searchBtn}>搜索</Button>
            </div>
            <div className={'overflow-y-auto'}>
                {Object.keys(listCon).map((item, index) => (
                    <div key={index}>
                        <h1 className={"text-xl font-bold"}>{item}</h1>
                        <div className={"grid 2xl:grid-cols-6 xl:grid-cols-5 grid-cols-4 mt-3 mb-3 gap-3"}>
                            {listCon[item].map((item, index) => (
                                <div
                                    key={index}
                                    className={
                                        "rounded-md mx-auto hover:shadow-md pl-3 pr-3 pt-2 pb-2 cursor-pointer font-bold font-sans flex justify-center w-full"
                                    }
                                    style={{border: "1px solid #ccc"}}
                                    onClick={() => {
                                        onPhotoInfo(item);
                                        next();
                                    }}
                                >
                                    <div
                                        className={"flex items-center"}
                                        style={{flexFlow: "column"}}
                                    >
                                        <span className={'text-lg'}>{item.type}</span>
                                        <span className={"text-gray-500"} style={{fontSize: '12px'}}>
                    {item.width}CM x {item.height}CM | {item.widthPX} x {item.heightPX}PX
                  </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <div className={'float-right fixed bottom-10 right-10'}>
                <Button onClick={() => prev()} className={'mr-3'}>上一步</Button>
                <Tooltip title={'请根据标准进行自定义尺寸,否则可能和预期不符'} color={'purple'}>
                    <Button type={"dashed"} onClick={() => setIsModalOpen(true)}>自定义尺寸</Button>
                </Tooltip>
            </div>
        </div>
    );
};
// 裁剪图像
const CroppingImage = ({fileList, prev, info, next, onSuccessInfo}) => {
    const [image, setImage] = useState("");
    const cropperRef = createRef();
    const [messageApi, contextHolder] = message.useMessage();
    const [configCon, setConfigCon] = useState({
        dpi: 300,
        compressibility: 80,
    })
    useEffect(() => {
        const reader = new FileReader();
        reader.onload = () => {
            setImage(reader.result.toString());
        };
        reader.readAsDataURL(fileList[0]);
    }, []);
    const croppingBtn = async () => {
        const filePath = await save({
            filters: [
                {
                    name: 'Image',
                    extensions: ['jpg', 'jpeg']
                }
            ]
        })
        const dirPath = filePath.replace(/[^\\]+$/, '');
        let option = {
            width: info.widthPX,
            height: info.heightPX,
        };
        // 获取url并且修改dpi
        const canUrl = changeDpiDataUrl(cropperRef.current.cropper
            .getCroppedCanvas(option)
            .toDataURL("image/jpeg", configCon.compressibility / 100), configCon.dpi);
        // 图像文件大小
        let size = dataURItoBlob(canUrl).size / 1024;
        const base64Data = canUrl.split(',')[1];
        const bytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
        try {
            await writeBinaryFile(filePath, bytes)
            onSuccessInfo({path: dirPath, size: size.toFixed(1)})
            messageApi.success(`保存成功,文件大小为:${size.toFixed(1)}kb`);
            next()
        } catch (e) {
            messageApi.error('保存失败', e)
        }
    };

    //   计算图像大小
    function dataURItoBlob(dataURI) {
        const byteString = atob(dataURI.split(",")[1]);
        const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        return new Blob([ab], {type: mimeString});
    }

    return (
        <div>
            {contextHolder}
            <Cropper
                ref={cropperRef}
                aspectRatio={info.proportion}
                className={"w-full h-72"}
                src={image}
                viewMode={1}
                autoCropArea={1} // 自动裁剪
                cropBoxMovable={false} // 裁剪区域可否移动
                dragMode="move"
                toggleDragModeOnDblclick={false} // 启用此选项可在裁剪器上单击两次时切换拖动模式。"crop""move"
                restore
            ></Cropper>
            <div className={'grid grid-cols-4 mt-3 mb-3'}>
                <div className={'flex items-center'}>
                    <Tooltip title={'此值不清楚具体作用无需修改'} color={'purple'} placement={'bottom'}>
                        <span className={'mr-4'}>DPI:</span>
                    </Tooltip>
                    <InputNumber min={76} max={720} value={configCon.dpi} onChange={e => {
                        setConfigCon({...configCon, dpi: e})
                    }}></InputNumber>
                </div>
                <div className={'flex items-center'}>
                    <span className={'mr-4'}>压缩率:</span>
                    <InputNumber min={1}
                                 max={100}
                                 value={configCon.compressibility}
                                 formatter={(value) => `${value}%`}
                                 parser={(value) => value.replace('%', '')}
                                 onChange={e => {
                                     setConfigCon({...configCon, compressibility: e})
                                 }}></InputNumber>
                </div>
            </div>
            <div className={'flex justify-end'}>
                <Button onClick={() => prev()} className={'mr-5'}>上一步</Button>
                <Button onClick={croppingBtn} type={"primary"} color={'red'}>制作/保存</Button>
            </div>
        </div>
    );
};

const SuccessPhoto = ({info, reset}) => {
    const [describe, setTitle] = useState('')
    const [messageApi, contextHolder] = message.useMessage();
    useEffect(() => {
        console.log(info)
        setTitle(`保存路径:${info.path} 文件大小:${info.size} kb`)
    }, [])
    return (
        <div>
            {contextHolder}
            <Result
                status="success"
                title={"证件照制作完成"}
                subTitle={describe}
                extra={[
                    <Button key="console" onClick={async () => {
                        invoke('open_path', {path: info.path}).catch(e => {
                            console.log('open path error:', e)
                            messageApi.error(`系统错误:${e}`)
                        })
                    }}>
                        打开文件夹
                    </Button>,
                    <Button type="primary" key="buy" onClick={reset}>继续制作</Button>,
                ]}
            />
        </div>
    )
}