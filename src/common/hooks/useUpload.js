import OSS from 'ali-oss';
import { message } from 'antd';
import path from "path-webpack";

const useUpload = (options = { multiple: false, maxSize: 2, type: "image/jpeg,image/jpg,image/png,image/gif,image/bmp", showUploadList: false, ossData: {}, generateFolder: null, startd: null, completed: null }) => {
    const { multiple = false, maxSize = 2, type = "image/jpeg,image/jpg,image/png,image/gif,image/bmp", showUploadList = false, ossData = {}, generateFolder = null, startd = null, completed = null } = options;
    const { i, prefix, ...ossOptions } = ossData;
    const types = type.split(",");
    
    /**
     * 自定义上传请求，根据不同场景进行定制
     * @param {Blob|File} file - blob或file数据
     * @returns {Promise} - OSS上传后的Promise对象
     */
    const uploadRequest = file => {
        const files = generateFolder ? generateFolder(file, prefix) : path.join(prefix, file.name);
        const client = new OSS(ossOptions);

        let putTask = null;
        if (typeof files === 'string') {
            putTask = client.put(files, file);
        } else if(typeof files === 'object') {
            const tasks = Object.keys(files).map(name => client.put(name, files[name]));
            putTask = Promise.all(tasks);
        }

        let msg = '处理成功。', keyword = null;
        if(file instanceof File) {
            msg = `${file.name} 上传成功。`;
            keyword = file.name.split('_').shift();
        } else {
            msg = `${file.character}_${file.pinyin} 生成动画成功。`;
            keyword = file.character;
        }

        if(putTask) {
            return putTask
                .then(() => completed && completed(keyword))
                .then(() => message.success(msg))
                .catch(err => {
                    if(err.message === 'Must provide Buffer/Blob/File for put.') {
                        message.error('上传的文件内容不正确，请联系管理员！');
                    }
                    console.warn(err);
                })
                .finally(() => startd && startd(false));
        }
        return putTask;
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

        const filenames_ = file.name.split('_');
        if(filenames_.length < 3) {
            message.error('上传的文件名称不正确，请查看帮助后重试！');
            throw new Error('上传的文件名称不正确，请查看帮助后重试！');
        }

        const isLt2M = file.size / 1024 / 1024 < maxSize;
        if (!isLt2M) {
            message.error(`上传文件大小不能超过${maxSize}M`);
            throw new Error(`上传文件大小不能超过${maxSize}M`);
        }

        startd && startd(true);

        // 处理文件上传
        uploadRequest(file);

        return false; // 是否覆盖上传功能
    };

    return {
        uploadRequest,
        uploadProps: {
            multiple,
            accept: type,
            beforeUpload,
            showUploadList
        }
    };
};

export default useUpload;