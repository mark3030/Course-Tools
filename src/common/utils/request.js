const MAX_SIZE = 1024 * 1024 * 300; // 300M
const mediaFilter = [".jpg", ".jpeg", ".png", ".mp3", ".mp4", ".json"];

/**
 * ajax请求zip文件
 * @param {object} options ajax请求参数
 * @property {string} [ooptions.url] 请求地址
 * @property {string} [ooptions.type] 请求类型 GET | POST
 * @property {string} [ooptions.responseType] 响应数据类型
 * @property {function} [ooptions.success] 获取成功的回调方法
 * @property {function} [ooptions.error] 获取失败的回调方法
 * @param {boolean} withCredentials 
 * @param {object} headers 
 */
export const request = (options, withCredentials, headers) => {
    let url = options.url;
    let type = options.type || "GET";
    let responseType = options.responseType;
    let success = options.success;
    let error = options.error;
    let ready = options.ready;

    let xhr = new XMLHttpRequest();
    let xhrPrototype = XMLHttpRequest.prototype;
    let header;

    if (!("overrideMimeType" in xhrPrototype)) {
        Object.defineProperty(xhrPrototype, "overrideMimeType", {
            value: function xmlHttpRequestOverrideMimeType() { }
        });
    }

    if (withCredentials) {
        xhr.withCredentials = true;
    }

    xhr.onreadystatechange = function () {
        switch (this.readyState) {
            case XMLHttpRequest.UNSENT: break; // 代理被创建，但尚未调用 open() 方法。
            case XMLHttpRequest.OPENED: break; // open() 方法已经被调用。
            case XMLHttpRequest.HEADERS_RECEIVED: // send() 方法已经被调用，并且头部和状态已经可获得。
                let fileSize = this.getResponseHeader('Content-Length');
                if (fileSize >= MAX_SIZE) {
                    error && error({ status: this.status, message: '文件大小超出限额', stack: new Error().stack });
                    this.abort();
                } else {
                    ready && ready(fileSize);
                }
                break;
            case XMLHttpRequest.LOADING: break; // 下载中； responseText 属性已经包含部分数据。
            case XMLHttpRequest.DONE: // 下载操作已完成。
                if (this.status === 200) {
                    success && success(this.response);
                } else if (this.status !== 0) {
                    error && error({ status: this.status, message: this.response, stack: new Error().stack });
                }
                break;
        }
    };

    xhr.onerror = error || function (err) { console.error(err); };
    console.log("request:", type, url);
    xhr.open(type, url, true);

    for (header in headers) {
        xhr.setRequestHeader(header, headers[header]);
    }

    switch (responseType) {
        case "json": xhr.setRequestHeader("Accept", "application/json"); break;
        case "document": xhr.responseType = "document"; break;
        case "binary": xhr.responseType = "arraybuffer"; break;
        case "arrayBuffer": xhr.responseType = "arraybuffer"; break;
        case "blob": xhr.responseType = "blob"; break;
        default:
            const ext = url.substring(url.lastIndexOf("."));
            if(mediaFilter.includes(ext)) { // 媒体文件使用 arraybuffer
                xhr.responseType = "arraybuffer";
            }
            break;
    }

    xhr.send();
};