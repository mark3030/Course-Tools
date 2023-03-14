import { mainTemplate } from '@/templates/hanzi';
import OSS from 'ali-oss';
import html2canvas from 'html2canvas';
import JSZip from 'jszip';
import path from "path-webpack";
import { useState } from "react";
import { uint8ArrayToString } from '../utils/uint8ArrayToString';

const WINDOW_URL = typeof URL != "undefined" ? URL : (typeof window != "undefined" ? (window.URL || window.webkitURL || window.mozURL) : undefined);

const PACKAGE_TEMPLATES = {
    type: "application/an+zip",
    ext: ".an.zip",

    main: 'index.html',
    cover: 'cover.png',
    script: 'scripts/animate.min.js',
    spell: 'data/spell.mp3',
    whole: 'data/whole.mp3',
};

const download = (blob, fileName = "cover", ext = ".png") => {
    const link = document.createElement('a');
    link.download = `${fileName}${ext}`;
    link.href = WINDOW_URL.createObjectURL(blob);
    document.body.appendChild(link);
    link.click();
    link.remove();
}

const usePackage = (options = { base: 'templates/hanzi', thumbContainer: '#thumb_container', ossData: {} }) => {
    const { base = 'templates/hanzi', thumbContainer = '#thumb_container', ossData = {} } = options;
    const { prefix, ...ossOptions } = ossData;
    const [graphicsData, setGraphicsData] = useState({});


    /**
     * 添加文件到zip包中
     * @param {Object} file - 需要加入zip包的文件
     * @property {String} [file.name] - 文件名称
     * @property {JSON|InputByType} [file.data] - 文件内容
     * @returns {Promise} - jszip对象
     */
    const addZipFile_ = (file, jsZip) => {
        if (file.type === "json") {
            jsZip.file(file.name, JSON.stringify(file.data), { compression: "DEFLATE" });
        } else {
            return jsZip.file(file.name, file.data, { compression: "DEFLATE" });
        }
    }

    /**
     * 加载远程文件内容
     * @param {File} file - 下载远程文件
     * @property {String} [url] - 文件地址
     * @returns {Promise} - request任务
     */
    const loadOssContent_ = (file, client) => {
        return client
            .get(file.path)
            .then(({ res, content }) => {
                const data = file.type === 'string' ? uint8ArrayToString(content) : content;
                if (res.status === 200) return { name: file.name, data, type: file.type };
                else throw Error('获数据失败');
            })
            .catch(console.error);
    };

    const createHtml_ = (file, client) => {
        return loadOssContent_(file, client)
            .then(file => {
                const graphics = JSON.parse(file.data);
                setGraphicsData(graphics);
                return {
                    name: file.name,
                    type: file.type,
                    data: mainTemplate(graphics)
                }
            });
    };

    const genCover_ = file => {
        const options = {
            dpi: 120, // 图片清晰度问题
            allowTaint: true,
            useCORS: true, // 支持跨域打印图片
            // width: 398,
            // height: 572
        };
        
        return new Promise((resolve, reject) => setTimeout(() => {
            const selectors = document.querySelector(thumbContainer);
            html2canvas(selectors, options).then(canvas => {
                canvas.toBlob(blob => resolve({
                    name: file.name,
                    type: file.type,
                    data: blob
                }));
            }).catch(reject)
        }, 800))
        // .then(file => download(file.data));
    };

    const genPackage = ({ json, spell, whole, character, pinyin }, isDownload) => {
        const jsZip = new JSZip();
        // jsZip.file("mimetype", PACKAGE_TEMPLATES.type, { compression: "STORE" });

        const client = new OSS(ossOptions);
        const templatesPath = prefix.replace('audio', base);
        const ossUrls = [
            { name: PACKAGE_TEMPLATES.script, path: path.join(templatesPath, PACKAGE_TEMPLATES.script), type: 'string' },
            { name: PACKAGE_TEMPLATES.spell, path: spell, type: 'binary' },
            { name: PACKAGE_TEMPLATES.whole, path: whole, type: 'binary' },
        ];
        let urlLoads = ossUrls.map(file => loadOssContent_(file, client));
        urlLoads.push(
            createHtml_({ name: PACKAGE_TEMPLATES.main, path: json, type: 'text' }, client),
            genCover_({ name: PACKAGE_TEMPLATES.cover, type: 'binary' })
        );

        return Promise.all(urlLoads)
            .then(files => files.forEach(file => addZipFile_(file, jsZip)))
            .then(() => jsZip.generateAsync({ type: "blob" }))
            .then(blob => isDownload ? download(blob, `${character}_${pinyin || 'pinyin'}`, PACKAGE_TEMPLATES.ext) : blob)
            .then(() => setGraphicsData({}))
            .catch(console.error);
    };

    return {
        graphicsData,
        genPackage
    };
};

export default usePackage;