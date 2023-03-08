import { Progress, Tooltip } from 'antd';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import './index.less';


export const IconAndText = ({
  wrapperClass = '',
  iconClass = 'primary-color',
  text,
  textClass = 'text-color',
  onClick = null
}) => {
  if (!text) {
    return null
  }
  return (
    <span
      className={classNames('align-middle items-top', wrapperClass)}
      onClick={(e) => {
        onClick && onClick()
        e.preventDefault()
      }}
    >
      <i className={classNames('iconfont', iconClass)}></i>
      <span
        className={classNames('flex-1', textClass)}
        title={text}
      >
        {text}
      </span>
    </span>
  )
}

export const TooltipItem = ({ text, iconType, onClick }) => {
  return (
    <Tooltip placement="top" title={text}>
      <i className={`iconfont pointer fs32 text-color-white ${iconType}`}
        onClick={() => {
          onClick && onClick()
        }}
      ></i>
    </Tooltip>
  )
}

export const IconClick = ({
  isActive,
  iconClass,
  onClick,
  wrapperClass,
}) => {
  return (
    <i
      className={classNames('iconfont fs40 text-color-secondary pointer', iconClass, wrapperClass, {
        'text-color-extra': isActive,
        'text-color-secondary': !isActive
      })}
      onClick={() => {
        onClick && onClick()
      }}
    ></i>
  )
}


export const IconRecord = ({
  showNum = 3,
  wrapperClass = null,
  clickEvent,
  dispatchAudio,
  showEval,
  activeType
}) => {
  const [num, setNum] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    setNum(0)
    setProgress(0)
    if (!showEval || !activeType || activeType != 'record') return
    let timer = setInterval(() => {
      setNum(num => {
        num += 1
        if (num > showNum) {
          num = 0
        }
        return num
      })
    }, 400);
    let protimer = setInterval(() => {
      setProgress(progress => {
        progress += 400
        if (Math.ceil(progress / (1 * 60 * 1000) * 100) >= 100) {
          progress = 0
          dispatchAudio && dispatchAudio()
          clearInterval(protimer)
        }
        return progress
      })
    }, 400);
    return () => {
      clearInterval(protimer)
      clearInterval(timer)
    }
  }, [showEval, activeType])

  return (
    <>
      <div className={classNames("ib pr pointer bdrs100 backg-white box-shadow-record tc", wrapperClass)}
        onClick={clickEvent}
      >
        {showEval && (<div className={classNames("icon-record icon-record-right ps right vam")}>
          {Array(showNum).fill('')?.map((el, i) => {
            if (num - 1 >= i) {
              return <i key={i} className={classNames(`yinpin-record yinpin-left${i + 1}`)}></i>
            }
          })}
        </div>)}

        <Progress
          type="circle"
          trailColor="#ffffff"
          strokeColor="#3A517B"
          percent={Math.ceil(progress / (1 * 60 * 1000) * 100)}
          width={60}
          showInfo={false}
        ></Progress>

        <i className="iconfont fs28 icon-luyin text-color-record ps half-center topF50 leftF50" />
        {showEval && (<div className={classNames("icon-record icon-record-left ps left vam")}>
          {Array(showNum).fill('')?.map((el, i) => {
            if (num - 1 >= i) {
              return <i key={i} className={classNames(`yinpin-record fr yinpin-right${i + 1}`)}></i>
            }
          })}
        </div>)}
      </div>
    </>
  )
}


export const IconVolume = ({
  showNum = 2,
  wrapperClass = null,
  clickEvent,
  showEval,
  activeType
}) => {

  const [num, setNum] = useState(2)

  useEffect(() => {
    if (!showEval || !activeType || activeType != 'volume') {
      setNum(2)
      return
    }
    let timeter = setInterval(() => {
      setNum(num => {
        num += 1
        if (num > showNum) {
          num = 0
        }
        return num
      })
    }, 400);
    return () => {
      clearInterval(timeter)
    }
  }, [showEval, activeType])

  return (
    <>
      <div className={classNames("ib pr w60 h60 pointer bdrs100 backg-white box-shadow-record tc", wrapperClass)}
        onClick={clickEvent}
      >
        <div className="ib pr lh60">
          <i className="iconfont fs28 icon-24gf-volumeZero text-color-record" />
          <div className={classNames("recordering ps right vam")}>
            {Array(showNum).fill('')?.map((el, i) => {
              if (num - 1 >= i) {
                return <i key={i} className={classNames(`yinpin-record yinpin-right${i + 1}`)}></i>
              }
            })}
          </div>
        </div>
      </div>
    </>
  )
}

export const IconYinpin = ({
  showNum = 5,
  wrapperClass = null,
  clickEvent,
  audioData = null,
  showEval,
  activeType
}) => {
  const [active, setActive] = useState(0)

  useEffect(() => {
    setActive(0)
    if (!showEval || !activeType || activeType != 'yinpin') return
    let timeter = setInterval(() => {
      setActive(active => {
        active += 1
        if (active > showNum) {
          active = 1
        }
        return active
      })
    }, 400);
    return () => {
      setActive(0)
      clearInterval(timeter)
    }
  }, [showEval, activeType])

  return (
    <>
      <div className={classNames("ib pr w60 h60 pointer bdrs100 backg-white box-shadow-record icon-audio lh54 tc", wrapperClass)}
        onClick={clickEvent}
      >
        {Array(showNum).fill('')?.map((el, i) => {
          return <div key={i} className={classNames(`hr block hr${i + 1}`, {
            'backg-record': !!audioData,
            'backg-yinpin': active === i + 1,
          })} />
        })}
      </div>
    </>
  )
}
