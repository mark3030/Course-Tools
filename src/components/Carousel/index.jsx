import { Carousel, Image } from 'antd';
import React, { useState } from 'react';

const CarouselTem = ({ list, dots, autoplay, imageRef = null }) => {
  const [isLoad, setIsLoad] = useState(true)

  const onLoad = () => {
    setIsLoad(false)
  }

  return (
    <Carousel
      ref={imageRef}
      dots={dots}
      autoplay={autoplay}
      effect="fade"
    >
      {list && list.map((item, idx) => (
        <Image
          alt="图片"
          key={idx}
          preview={false}
          src={item}
          onLoad={onLoad}
          placeholder={true}
        />
      ))}
    </Carousel>
  )
}

export default CarouselTem
