import { volumeDispatch } from '@common/utils/dispatchEvent';
import { exitFullscreen, isFullscreen, launchFullscreen } from '@common/utils/fullScreen';
import { defaultVolume, updateVolume } from '@common/utils/globalConstant';
import { TooltipItem } from '@components/IconText';
import { Slider } from 'antd';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import './index.less';



function closewin() {
  if (navigator.userAgent.indexOf("Firefox") !== -1 || navigator.userAgent.indexOf("Chrome") !== -1) {
    window.location.href = "about:blank";
  } else {
    window.opener = null;
    window.open("", "_self");
  }
  window.close();
}

const LeftSite = ({
  type,
  code,
  origin
}) => {

  const history = useHistory()
  const [volumePrecent, setVolumePrecent] = useState(defaultVolume)
  const [volumeShow, setVolumeShow] = useState(false)

  useEffect(() => {
    window.addEventListener('volumeUpdate', volumeMessage)
    return () => {
      window.removeEventListener('volumeUpdate', volumeMessage)
    }
  }, [])

  const volumeMessage = (e) =>{
    setVolumePrecent(e.detail.volume)
  }

  const fullChange = () => {
    if (isFullscreen()) exitFullscreen()
    else launchFullscreen(document.body) // 整个页面进入全屏
  }

  const onChange = (value) => {
    volumeDispatch(value)
    updateVolume(value)
    setVolumePrecent(value)
  }

  return (
    <>
      {type === 'view' && (<div className="fs0 backg-icon bdrs40 lh1 mt12">
        <TooltipItem
          text="返回"
          iconType="icon-cebianlan-fanhui"
          onClick={() => { history.goBack() }}
        />
      </div>)}

      <div className="fs0 backg-icon bdrs40 lh1 mt12">
        <TooltipItem
          text={isFullscreen() ? "退出全屏" : "全屏"}
          iconType={isFullscreen() ? "icon-cebianlan-tuichuquanping" : "icon-cebianlan-quanping"}
          onClick={fullChange}
        />
      </div>

      <div className="fs0 backg-icon bdrs40 lh1 mt12 pr">
        <TooltipItem
          text="音量"
          iconType={volumePrecent === 0 ? "icon-cebianlan-jingyin" : "icon-cebianlan-yinliangda"}
          onClick={() => setVolumeShow(!volumeShow)}
        />

        {volumeShow && (<div className="ps yinliang_style">
          <Slider value={volumePrecent} tooltipVisible={false} onChange={onChange} onAfterChange={onChange} />
        </div>)}
      </div>

      {type === 'cd' && (
        <div className="fs0 backg-icon bdrs40 lh1 mt12">
          <TooltipItem text="帮助" iconType="icon-yiwen" />
        </div>
      )}

      <div className="fs0 backg-icon bdrs40 lh1 mt12">
        <TooltipItem text="编辑" iconType="icon-cebianlan-bianji" />
      </div>

      {type === 'cd' && (
        <div className="fs0 backg-icon bdrs40 lh1 mt12">
          <TooltipItem text="退出" iconType="icon-cebianlan-tuichu" onClick={closewin} />
        </div>
      )}
    </>
  )
}

export default LeftSite
