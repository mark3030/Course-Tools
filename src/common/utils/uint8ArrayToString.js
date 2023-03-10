export const uint8ArrayToString = data => {
    let str = "", i = 0, len, c;
    let char2, char3;
    
    len = data.length;
    while (i < len) {
        c = data[i++];
        switch (c >> 4) {
            case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
                // 0xxxxxxx
                str += String.fromCharCode(c);
                break;
            case 12: case 13:
                // 110x xxxx 10xx xxxx
                char2 = data[i++];
                str += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
                break;
            case 14:
                // 1110 xxxx 10xx xxxx 10xx xxxx
                char2 = data[i++];
                char3 = data[i++];
                str += String.fromCharCode(((c & 0x0F) << 12) | ((char2 & 0x3F) << 6) | ((char3 & 0x3F) << 0));
                break;
        }
    }
    return str;
};