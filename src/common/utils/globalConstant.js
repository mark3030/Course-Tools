//默认显示缩放倍数
const defaultScaleMultiple = 1

//鼠标滚轮，缩放倍数
const wheelScaleMultiple = 1

//放大缩小按钮，缩放倍数
const buttonScaleMultiple = 2

//最大缩放倍数
const maxScaleMultiple = 7

//最小缩放倍数
const minScaleMultiple = 1

//当前页面显示多少页
const pageSize = 2

//loading显示最大数
const loadingPercent = 90

//默认音量
let defaultVolume = 60

function updateVolume (value){
  defaultVolume = value
}

export {
  defaultScaleMultiple,
  wheelScaleMultiple,
  buttonScaleMultiple,
  maxScaleMultiple,
  minScaleMultiple,
  pageSize,
  loadingPercent,
  defaultVolume,
  updateVolume
}
