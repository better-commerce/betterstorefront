import React from 'react'
import ProductCard from '@components/ProductCard'
import ImageGallery from 'react-image-gallery'
import 'react-image-gallery/styles/css/image-gallery.css'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'

interface Props {
  lookbookData: any
  defaultDisplayMembership: any
  featureToggle: any
}

const LookbookGrid: React.FC<Props> = ({ lookbookData, defaultDisplayMembership, featureToggle }: Props) => {
  if (!lookbookData) { return <></> }

  const { products } = lookbookData
  const { results, deviceInfo } = products

  const renderProducts = () => {
    if (results?.length < 4) {
      return (
        <Swiper spaceBetween={20} slidesPerView={4}>
          {results?.map((product: any, index: number) => (
            <SwiperSlide key={index}>
                <ProductCard data={product} deviceInfo={deviceInfo} defaultDisplayMembership={defaultDisplayMembership} featureToggle={featureToggle} />
            </SwiperSlide>
          ))}
        </Swiper>
      )
    } else {
      const mid = results?.length < 8 ?  4 : Math.ceil(results?.length / 2);
      const upperChunk = results?.slice(0, mid);
      const lowerChunk = results?.slice(mid);

      return (
        <div className="grid grid-rows-2 space-x-4">
          <div className="row-span-1">
            <Swiper spaceBetween={20} slidesPerView={4} className="mb-4">
              {upperChunk?.map((product:any, index:number) => (
                <SwiperSlide key={index}>
                  <ProductCard
                    data={product}
                    deviceInfo={deviceInfo}
                    defaultDisplayMembership={defaultDisplayMembership}
                    featureToggle={featureToggle}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>  
          <div className="row-span-1 space-x-4">
            {lowerChunk?.length > 0 && (
              <Swiper spaceBetween={20} slidesPerView={4} >
                {lowerChunk?.map((product:any, index:number) => (
                  <SwiperSlide key={index}>
                    <ProductCard
                      data={product}
                      deviceInfo={deviceInfo}
                      defaultDisplayMembership={defaultDisplayMembership}
                      featureToggle={featureToggle}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
           </div> 
        </div>
      );
    }
  }

  return (
    <div className="my-16">
      <p className="text-2xl font-semibold my-4"> {lookbookData?.name?.toUpperCase()} </p>
      <div className="flex felx-col md:flex-row md:space-x-4">
        <div className="md:w-1/3">
          <ImageGallery items={[ { original: lookbookData?.mainImage, thumbnail: lookbookData?.mainImage, }, ]} showThumbnails={false} />
        </div>
        <div className="md:w-2/3">{renderProducts()}</div>
      </div>
    </div>
  )
}

export default LookbookGrid
