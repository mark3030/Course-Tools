import OSS from 'ali-oss';
import { message } from 'antd';
import { useEffect, useState } from "react";

const useUpload = (options = { maxSize: 2, type: "image/jpeg, image/jpg, image/png, image/gif, image/bmp", showUploadList: false, setLoading: null, ossData: {} }) => {
    const { maxSize = 2, type = "image/jpeg,image/jpg,image/png,image/gif,image/bmp", showUploadList = false, setLoading = null, ossData = {} } = options;
    const { i, prefix, ...ossOptions } = ossData;
    const types = type.split(",");
    const [loadStatus, setLoadStatus] = useState('');
    const [fileName, setFileName] = useState('');

    useEffect(() => {
        loadStatus != "" && message.info(loadStatus);
    }, [loadStatus]);

    /**
     * 自定义上传请求，根据不同场景进行定制
     * @param {Blob|File} file - blob或file数据
     * @returns {Promise} - OSS上传后的Promise对象
     */
    const uploadRequest = file => {
        return new OSS(ossOptions)
            .put(`${prefix}${file.name}`, file)
            .catch(err => {
                if (err.code === "ConnectionTimeoutError" && err.status === -2) {
                    console.warn("上传超时: ", ossPath)
                } else {
                    throw err;
                }
            });
    };

    /**
     * 上传前处理
     * @param {File} file - 文件对象
     * @returns {Boolean} - 是否上传
     */
    const beforeUpload = file => {
        if (!types.includes(file.type)) {
            message.error(`上传文件的类型不正确，请上传[${type}]类型。`);
            throw new Error(`上传文件的类型不正确，请上传[${type}]类型。`);
        }

        const isLt2M = file.size / 1024 / 1024 < maxSize;
        if (!isLt2M) {
            message.error(`上传文件大小不能超过${maxSize}M`);
            throw new Error(`上传文件大小不能超过${maxSize}M`);
        }

        setLoading && setLoading(true);
        setFileName(file.name.substring(0, file.name.indexOf(".")));

        // 处理文件上传
        uploadRequest(file)
            .then(() => {
                setLoadStatus(`${file.name} 上传成功。`);
                window.location.reload();
            })
            .finally(() => setLoading && setLoading(false));

        return false; // 是否覆盖上传功能
    };

    return {
        fileName,
        uploadProps: {
            accept: type,
            beforeUpload,
            showUploadList
        }
    };
};

export default useUpload;