import { IMG_PLACEHOLDER } from '@components/utils/textVariables'
import 'swiper/css'
import 'swiper/css/navigation'
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode } from 'swiper'
import Image from 'next/image'
import { groupBy } from 'lodash'
import { useState } from 'react'
import { generateUri } from '@commerce/utils/uri-util'
import { useTranslation } from '@commerce/utils/use-translation'
export default function ProductSpecifications({
  attrGroup,
  product,
  deviceInfo,
}: any) {
  const imageTagGroup = groupBy(product?.images, 'tag')
  const [paddingTop, setPaddingTop] = useState('0')
  const { isOnlyMobile } = deviceInfo
  const translate = useTranslation()
  return (
    <>
      <div className="grid gap-10 px-4 sm:grid-cols-12 sm:px-4 md:px-6 lg:px-6 2xl:px-0">
        <div className={`${imageTagGroup?.specification?.length > 0 ? 'sm:col-span-7' : 'sm:col-span-12'}`}>
          <div className="flex-1 pb-0 pr-4 sm:pb-4">
            <h2 className="flex items-center pb-2 text-2xl font-semibold md:text-3xl sm:pb-2 h2-heading-text dark:text-black">
              Product Details<span className='sr-only'>{' '}of {product?.name}</span>
            </h2>
            {attrGroup['whyweloveit']?.length > 0 && (
              <div className="pt-2 mt-1 border-t border-gray-200 sm:pt-3 sm:mt-3">
                <div className="flex flex-wrap ul-li-disc text-limit-lines">
                  {attrGroup['whyweloveit'].map((detail: any, cdx: number) => (
                    <div key={`product-${cdx}-detail-value`} className="product-detail-description text-slate-600 dark:text-slate-600" dangerouslySetInnerHTML={{ __html: detail.value || detail.value, }} />
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <div className="flex flex-col">
              <div className='grid grid-cols-1 gap-x-2 gap-y-0 sm:gap-x-4 sm:gap-y-1 sm:grid-cols-1'>
                {attrGroup['material']?.length > 0 && (
                  <div className="pt-2 mt-1 border-t border-gray-200 sm:pt-3 sm:mt-3">
                    <div className="flex flex-col mt-3 sm:mt-3">
                      <h4 className="mb-1 text-xs font-medium text-gray-400 uppercase sm:mb-2">
                        Material
                      </h4>
                    </div>
                    <div className="flex flex-wrap">
                      {attrGroup['material']?.map(
                        (lengthAttr: any, ldx: number) => (
                          <div className="flex justify-start comma" key={ldx}>
                            <span className="pr-1 mt-1 font-normal capitalize text-slate-600 product-detail-description">
                              {lengthAttr.fieldText}
                              {attrGroup['material']?.length > 1 &&
                                <span className="s-icon">,</span>
                              }
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
                {attrGroup['lookAfterMe']?.length > 0 && (
                  <div className="pt-2 mt-1 border-t border-gray-200 sm:pt-3 sm:mt-3">
                    <div className="flex flex-col mt-3 sm:mt-3">
                      <h4 className="mb-1 text-xs font-medium text-gray-400 uppercase sm:mb-2">
                        Look After Me
                      </h4>
                    </div>
                    <div className="flex flex-wrap">
                      {attrGroup['lookAfterMe']?.map(
                        (lengthAttr: any, ldx: number) => (
                          <div className="flex justify-start comma" key={ldx}>
                            <span className="pr-1 mt-1 font-normal capitalize">
                              <div dangerouslySetInnerHTML={{ __html: lengthAttr.fieldText, }} className="mt-2 font-normal text-slate-600 sm:block product-detail-description" />
                              {attrGroup['lookAfterMe']?.length > 1 &&
                                <span className="s-icon">,</span>
                              }
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {attrGroup['product.perfectfor']?.length > 0 && (
              <>
                <div className="flex flex-col mt-3 sm:mt-3">
                  <h4 className="mb-1 text-xs font-medium text-gray-400 uppercase sm:mb-2">
                    {translate('label.product.specifications.perfectForText')}
                  </h4>
                </div>
                <div className="grid grid-cols-2 gap-4 pr-4 mt-0 sm:grid-cols-4">
                  {attrGroup['product.perfectfor']?.map(
                    (perfectAttr: any, pdx: number) => (
                      <div className="flex justify-start comma" key={pdx}>
                        <Image
                          alt="Specification"
                          src={`/assets/icons/${perfectAttr.fieldText
                            .toLowerCase()
                            .replace(' ', '')}.svg`}
                          width={32}
                          height={32}
                          layout="fixed"
                        />
                        <span className="pl-2 mt-1 text-sm font-normal text-dark-brown sm:text-sm">
                          {perfectAttr?.fieldText}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </>
            )}
            {attrGroup['product.fabriccare']?.length > 0 && (
              <>
                <div className="flex flex-col mt-6">
                  <h4 className="mb-2 text-xs font-medium text-gray-400 uppercase">
                    {translate('label.product.specifications.fabricCareText')}
                  </h4>
                </div>
                <div className="grid">
                  <div className="flex w-full">
                    {attrGroup['product.fabriccare']?.map(
                      (fabriccareAttr: any, idx: number) => (
                        <p
                          className="ml-0 text-xs sm:text-sm text-dark-brown care-p"
                          key={idx}
                        >
                          {fabriccareAttr?.fieldText}
                          {attrGroup['product.fabriccare']?.length > 1 &&
                            <span className="s-icon">,</span>
                          }
                        </p>
                      )
                    )}
                  </div>
                </div>
              </>
            )}
            {attrGroup['product.washcare']?.length > 0 && (
              <>
                <div className="flex flex-col mt-6">
                  <h4 className="mb-2 text-xs font-medium text-gray-400 uppercase">
                    {translate('label.product.specifications.washCareText')}
                  </h4>
                </div>
                <div className="grid">
                  <div className="flex w-full m-colum-div">
                    {attrGroup['product.washcare']?.map(
                      (fabriccareAttr: any, idx: number) => (
                        <p
                          className="ml-0 text-xs sm:text-sm text-dark-brown care-p mob-full-p"
                          key={idx}
                        >
                          {fabriccareAttr?.fieldText}
                          <span className="s-icon s-right-space"> </span>
                        </p>
                      )
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        {imageTagGroup?.specification?.length && (
          <div className="sm:col-span-5">
            <div className="my-6 sm:col-span-1 specifications sm:my-0">
              <Swiper slidesPerView={1.3} spaceBetween={8} navigation={true} loop={false} freeMode={true} modules={[FreeMode]} breakpoints={{ 640: { slidesPerView: 1.3, }, 768: { slidesPerView: 1.3, }, 1024: { slidesPerView: 1.3, }, }} >
                <div role="list" className="inline-flex mx-4 space-x-0 sm:mx-0 lg:mx-0 lg:space-x-0 lg:grid lg:grid-cols-4 lg:gap-x-0" >
                  {imageTagGroup?.specification?.map(
                    (img: any, iid: number) => (
                      <SwiperSlide className={`px-0 ${iid === 0 && isOnlyMobile ? 'cs-mr-1' : ''} `} key={`product-${iid}-swiper-detail`} >
                        <div className="image-container" style={{ paddingTop }}>
                          <img onLoad={({ target }) => { const { naturalWidth, naturalHeight } = target as HTMLImageElement; setPaddingTop(`0`) }} src={generateUri(img?.image, 'fm=webp&h=450&q=40') || IMG_PLACEHOLDER} alt={img.name || 'slider-image'} className="image rounded-2xl" />
                        </div>
                      </SwiperSlide>
                    )
                  )}
                </div>
              </Swiper>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
