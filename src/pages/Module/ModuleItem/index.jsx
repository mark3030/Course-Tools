import ImageCarousel from "@components/Carousel";
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';

const ModuleItem = ({ list }) => {
  const [activeIdx, setActiveIdx] = useState(null)

  useEffect(() => {
    setActiveIdx(0)
  }, [list])

  return (
    <>
      {list?.map((item, idex) => {
        if (!item.hide) {
          return (<div key={item.id}
            className={classNames("pr flex2 pointer module_shadow", {
              'flex3': idex === list.length - 1 && idex !== activeIdx,
              'flex4': idex !== list.length - 1 && idex === activeIdx,
              'flex5': idex === list.length - 1 && idex === activeIdx,
            })}
            style={{ background: item.background }}
            onMouseEnter={() => setActiveIdx(idex)}
            onClick={() => alert(item.name)}
          >
            <div className={`${idex === activeIdx ? 'module_item_active' : 'module_item'}`}>
              <i className={`iconfont ${item.icon} fs48 bdrs40 backg-white text-color-icon`}></i>
              <p className={classNames("fs24 lh33 text-color-white module_item_p")}>{item.name}</p>
              <div style={{ width: document.body.clientWidth * 0.5, maxWidth: '500px' }} className={classNames(idex === activeIdx ? 'carousel_item_active' : 'carousel_item')}>
                <ImageCarousel list={item.banners} dots={false} autoplay={true} />
              </div>
            </div>
          </div>)
        }
      })}
    </>
  )
}

export default ModuleItem