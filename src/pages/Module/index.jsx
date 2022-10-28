import { leftStyle } from '@common/utils/onlineStyles';
import LeftSite from '@components/LeftSite';
import classNames from 'classnames';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './index.module.less';
import ModuleItem from './ModuleItem';


const modules = [
  {
    "id": "dianzishu",
    "name": "电子课本",
    "icon": "icon-dianzishu",
    "background": "#F38D03",
    "banners": ["assets/images/ebook.png"],
    "hide": false
  },
  {
    "id": "jinglian",
    "name": "精炼",
    "icon": "icon-jinglian",
    "background": "#F2C251",
    "banners": ["assets/images/jl.png"],
    "hide": false
  },
  {
    "id": "weike",
    "name": "微课",
    "icon": "icon-jingjiang",
    "background": "#FF9F2A",
    "banners": ["assets/images/weike-1.png", "assets/images/weike-2.png"],
    "hide": false
  },
  {
    "id": "yuyinpingce",
    "name": "英语评测",
    "icon": "icon-kewenlangdu",
    "background": "#F1D35C",
    "banners": ["assets/images/read.png"],
    "hide": false
  }
];

const Module = () => {
  let { code, origin } = useParams();
  const [height, setHeight] = useState(document.body.clientHeight / 10 - 9);

  const sizeChange = useCallback(() => {
    setHeight(document.body.clientHeight / 10 - 9)
  })

  useEffect(() => {
    sizeChange()
    window.addEventListener('resize', sizeChange)
    return () => {
      window.removeEventListener('resize', sizeChange)
    }
  }, [])

  return (
    <div className="h-full w-full overflow-hidden backg-white">
      <div className="ps" style={leftStyle}><LeftSite type='cd' code={code} origin={origin} /></div>
      <div className={classNames("h-full w-full flex1 flex module_box")} style={{ marginLeft: height }}>
        <ModuleItem list={modules} />
      </div>
    </div>
  )
}

export default Module;