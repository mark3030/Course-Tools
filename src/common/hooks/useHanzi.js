import OSS from 'ali-oss';
import path from "path-webpack";
import { useEffect, useState } from "react";
import { uint8ArrayToString } from '../utils/uint8ArrayToString';

const useHanzi = (options = { base: 'templates', graphicsLib: "makemeahanzi/graphics.txt", dictionary : 'makemeahanzi/dictionary.txt', ossData: {}, completed: null }) => {
    const { base = 'templates', graphicsLib = "makemeahanzi/graphics.txt", dictionary = 'makemeahanzi/dictionary.txt', ossData = {}, completed = null } = options;
    const {prefix, ...ossOptions } = ossData;
    const [graphics, setGraphics] = useState([]);

    useEffect(() => {
        completed && completed(true);
        loadLibrary_();
    }, []);

    const loadLibrary_ = () => {
        const libPath = path.join(prefix.replace('audio', base), graphicsLib);

        return new OSS(ossOptions)
            .get(libPath)
            .then(({ res, content }) => {
                if (res.status === 200) return content;
                else throw Error('获数据失败');
            })
            .then(data => uint8ArrayToString(data).split(/[\n]/))
            .then(data => setGraphics(data))
            .then(() => completed && completed(false))
            .catch(err => {
                if (err.code === "ConnectionTimeoutError" && err.status === -2) {
                    console.warn("获取文件失败: ", libPath)
                } else {
                    throw err;
                }
            });
    };

    const getGraphicsData_ = (character, pinyin) => {
        let graphicsData = null;
        graphics.forEach(item => {
            if (!item || item === "" || item == undefined) return;
            const graphicsData_ = JSON.parse(item);
            if(graphicsData_.character !== character) return;
            
            graphicsData = {
                ...graphicsData_,
                pinyin: [ pinyin ], 
                spell: `${character}_${pinyin}_spell.mp3`,
                whole: `${character}_${pinyin}_whole.mp3`
                // spell: "data/spell.mp3",
                // whole: "data/whole.mp3"
            }
        });

        return graphicsData ? new Blob([JSON.stringify(graphicsData)], { type: 'application/json' }) : false;
    };

    const generateAnimate = (file, prefix) => {
        if(file instanceof File) {
            const [ character, pinyin ] = file.name.split('_');
            const mp3Path = path.join(prefix, character, file.name);
            const jsonPath = path.join(prefix, character, `${character}.json`);
            
            return {
                [mp3Path]: file,
                [jsonPath]: getGraphicsData_(character, pinyin)
            };

        } else {
            const { json, spell, whole, character, pinyin } = file;
            const jsonPath = json || path.join(prefix, character, `${character}.json`);

            return {
                [jsonPath]: getGraphicsData_(character, pinyin)
            };
        }
    };

    return {
        fileName: graphicsLib,
        generateAnimate
    };
};

export default useHanzi;