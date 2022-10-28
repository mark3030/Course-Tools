
/**
 * 阅读器弹窗派遣事件, parent把事件派遣出
 *
 * @param {Object} data 需要派遣的数据
 * @param {String} type 类型
 */
export const epubDispatch = (data, type) => {
  var custom_event = new CustomEvent('epubClickMsg', {
    detail: {
      type: type,
      ...data,
    }
  })
  window.parent.dispatchEvent(custom_event)
}

/**
 * indexeDb更新派遣事件
 *
 * @param {Boolean} isUpdate 是否更新
 */
export const dbDispatch = () => {
  var custom_event = new CustomEvent('indexedDbUpdate', {
    isUpdate: true
  })
  window.dispatchEvent(custom_event)
}


/**
 *播放事件
 *
 * @param {Boolean} detail 播放事件
 */
export const playsDispatch = (elements, type) => {
  var custom_event = new CustomEvent('playsUpdate', {
    detail: {
      type: type
    }
  })
  elements.current.dispatchEvent(custom_event)
}


/**
 *音量更新事件
 *
 * @param {Boolean} isUpdate 是否更新
 */
 export const volumeDispatch = (value) => {
  var custom_event = new CustomEvent('volumeUpdate', {
    detail: {
      volume: value
    }
  })
  window.dispatchEvent(custom_event)
}
