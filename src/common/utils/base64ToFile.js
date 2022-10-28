/**
 * @desc base64转图片
 * @param {String} base64 - base64内容
 * @return {Blob}
 */
export default function base64ToFile(base64) {
  let bytes = window.atob(base64.split(',')[1]);
  let array = [];
  for(let i = 0; i < bytes.length; i++){
    array.push(bytes.charCodeAt(i));
  }
  return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
}