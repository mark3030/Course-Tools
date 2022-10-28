
export const toolBarStyle = (scale, origin) => {
  return `transform: scale(${scale});
          transform-origin: ${origin};
          transition: transform 0.3s linear;`
}

export const styleDom = (dom, scale, origin, position, translateX) => {
  if (!dom) return
  dom.style.top = "50%"
  dom.style.position = "absolute"
  position
  dom.style.transform = `scale(${scale}) ${translateX} translateY(-50%)`
  dom.style.transformOrigin = origin
}

export const normalStyle = (color, height, borderRadius) => {
  return {
    backgroundColor: `${color}`,
    height: `${height}`,
    borderRadius: `${borderRadius}`
  }
}

export const handleStyle = (width, height, marginTop) => {
  return {
    width: `${width}`,
    height: `${height}`,
    background: `#FFFFFF`,
    boxShadow: `0px 0px 4px 0px rgba(0, 0, 0, 0.2)`,
    border: `0px`,
    marginTop: `${marginTop}`
  }
}

export const leftStyle = {
  bottom: '24px',
  left: '24px',
  zIndex: 1000
}

export const gridStyle = {
  width: 140,
  textAlign: 'center',
  padding: 0,
  fontSize: 0
};

export const optionStyle = {
  background: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.6) 100%)',
}

export const bodyScale = (type) => {
  if (!document?.getElementById('viewer')?.getElementsByClassName('epub-view')) return
  let epubViewList = document?.getElementById('viewer')?.getElementsByClassName('epub-view')

  for (var i = 0; i < epubViewList?.length; i++) {
    if (!epubViewList[i]?.childNodes?.length > 0) return

    let iframeDom = epubViewList[i]?.getElementsByTagName('iframe')[0]?.contentWindow.document.querySelector('.h5ds-swiper-layers-box ')
      || epubViewList[i]?.getElementsByTagName('iframe')[0]?.contentWindow.document.body //兼容旧的电子书

    let iframeDomDiv = iframeDom?.querySelector('.h5ds-swiper-layers')
      || iframeDom?.querySelector('div')  //兼容旧的电子书

    if (!iframeDomDiv?.style) return
    let objectRect = iframeDom?.getBoundingClientRect()

    let scale = (type && type === 'double'
      ? objectRect?.width / 2
      : objectRect?.width)
      / iframeDomDiv?.clientWidth

    if (scale * iframeDomDiv?.clientHeight > objectRect.height) {
      scale = objectRect?.height / iframeDomDiv?.clientHeight
    }

    styleDom(
      iframeDomDiv,
      scale,
      (type && type === 'double'
        ? (i === 0 ? 'right 0' : 'left 0')
        : '0 0'),
      (type && type === 'double'
        ? (i === 0 ? iframeDomDiv.style.right = '0' : iframeDomDiv.style.left = '0')
        : iframeDomDiv.style.left = '50%'),
      (type && type === 'double'
        ? 'translateX(0)'
        : 'translateX(-50%)')
    )
  }
}

export const stepScale = () => {
  let parent = document.querySelector('.stepviewer')
  let children = document.querySelector('.stepviewer>div')
  if (!parent || !children) return
  let scale = parent.clientHeight / children.clientHeight
  children.style.transform = `scale(${scale})`
  children.style.transformOrigin = `center 0`
}

export const epubModalStyle = (type, width) => {
  return {
    height: type === 'audio' ? 'auto' : document.body.clientHeight * 0.7,
    width: width || 'auto',
    minWidth: '614px',
    maxWidth: document.body.clientWidth * 0.7,
    overflow: 'auto'
  }
}


export const slideWidth = (length) =>{
  switch(length){
    case 1:
      return 0.4;
    case 2:
      return 1.0;
    case 3:
      return 1.4
    default:
      return 1.4
  }
}
