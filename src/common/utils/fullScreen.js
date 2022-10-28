// 全屏设置
export const launchFullscreen = (element) => {
  if (element.requestFullscreen) {
   element.requestFullscreen()
  } else if (element.mozRequestFullScreen) {
   element.mozRequestFullScreen()
  } else if (element.msRequestFullscreen) {
   element.msRequestFullscreen()
  } else if (element.webkitRequestFullscreen) {
   element.webkitRequestFullScreen()
  }
}

// 退出全屏
export const exitFullscreen = () => {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
}

//是否全屏
export const isFullscreen = () =>{
  return document.fullscreenElement ||
  document.msFullscreenElement ||
  document.mozFullScreenElement ||
  document.webkitFullscreenElement || false;
}
