const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

// 匹配开头是数字
const numberPattern = /^[0-9]/;

/**
 * 
 * @param {String} inputPicture 
 * @param {String} outputOne 
 * @param {String} outputTow 
 */
const writeTofile = (inputPicture, outputOne, outputTow) => {
    const image = sharp(inputPicture);
    return image.metadata().then(metadata => {
        const helfWidth = Math.round(metadata.width / 2);
        console.info("outputOne:", outputOne, " outputTow:", outputTow);
        return [
            image.extract({ left: 0, top: 0, width: helfWidth, height: metadata.height }).toFile(outputOne),
            image.extract({ left: helfWidth, top: 0, width: helfWidth, height: metadata.height }).toFile(outputTow)
        ];
    });
};

/**
 * 
 */
const picTransition = () => {
    const distPath = path.resolve("dist");
    fs.existsSync(distPath) || fs.mkdirSync(distPath);

    const filesTask = fs.readdirSync("source").map(file => {
        const fileExt = path.extname(file);
        const [ prefix, first, second ] = file.replace(fileExt, "").split("-");
        
        const pageOne = `dist/${prefix}-${first}${fileExt}`;
        let pageTwo = `dist/${prefix}-${second}${fileExt}`;
        if(numberPattern.test(first) === false) {
            pageTwo = `dist/${prefix}-${first.substring(0, 1) + second}${fileExt}`;
        }

        console.info(pageOne, pageTwo);
        return writeTofile(`source/${file}`, pageOne, pageTwo);
    });

    console.info("filesTask:", filesTask);
};

picTransition();