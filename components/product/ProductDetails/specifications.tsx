import { PRODUCT_SPECIFICATION, PERFECT_FOR, FABRIC_CARE, COLLAR, WASH_CARE, IMG_PLACEHOLDER } from '@components/utils/textVariables'
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
      <div className="grid px-4 sm:grid-cols-12 sm:px-4 md:px-6 lg:px-6 2xl:px-0">
        <div className="sm:col-span-8">
          <div className="flex-1 pb-0 pr-4 sm:pb-4">
            <h2 className="flex items-center text-2xl font-semibold">
              {PRODUCT_SPECIFICATION}
            </h2>
            {attrGroup['whyweloveit']?.length > 0 && (
              <div className="pb-2 mb-1 border-b border-gray-200 sm:pb-3 sm:mb-3">
                <div className="flex flex-wrap ul-li-disc">
                  {attrGroup['whyweloveit'].map((detail: any, cdx: number) => (
                    <div
                      key={`product-${cdx}-detil-value`}
                      className="text-slate-600 dark:text-slate-300"
                      dangerouslySetInnerHTML={{
                        __html: detail.value || detail.value,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <div className="flex flex-col">
              <div className="grid grid-cols-2 gap-x-2 gap-y-0 sm:gap-x-4 sm:gap-y-1 sm:grid-cols-3">
                {attrGroup['product.collar']?.length > 0 && (
                  <div className="pb-2 mb-1 border-b border-gray-200 sm:pb-3 sm:mb-3">
                    <div className="flex flex-col mt-3 sm:mt-3">
                      <h4 className="mb-1 text-xs font-medium text-gray-400 uppercase sm:mb-2">
                        {COLLAR}
                      </h4>
                    </div>
                    <div className="flex flex-wrap">
                      {attrGroup['product.collar'].map(
                        (collarAttr: any, cdx: number) => (
                          <div className="flex justify-start comma" key={cdx}>
                            <span className="pr-1 mt-1 text-xs font-normal text-dark-brown sm:text-sm">
                              {collarAttr.fieldText}
                              <span className="s-icon">,</span>
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
                {attrGroup['fabric.type']?.length > 0 && (
                  <div className="pb-2 mb-1 border-b border-gray-200 sm:pb-3 sm:mb-3">
                    <div className="flex flex-col mt-3 sm:mt-3">
                      <h4 className="mb-1 text-xs font-medium text-gray-400 uppercase sm:mb-2">
                        {translate('label.product.specifications.fabricText')}
                      </h4>
                    </div>
                    <div className="flex flex-wrap">
                      {attrGroup['fabric.type']?.map(
                        (featureAttr: any, featureAttrdx: number) => (
                          <div
                            className="flex justify-start comma"
                            key={featureAttrdx}
                          >
                            <span className="pr-1 mt-1 text-xs font-normal text-dark-brown sm:text-sm">
                              {featureAttr?.fieldText}
                              <span className="s-icon">,</span>
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

                {attrGroup['occasion.type']?.length > 0 && (
                  <div className="pb-2 mb-1 border-b border-gray-200 sm:pb-3 sm:mb-3">
                    <div className="flex flex-col mt-3 sm:mt-3">
                      <h4 className="mb-1 text-xs font-medium text-gray-400 uppercase sm:mb-2">
                        Occasion
                      </h4>
                    </div>
                    <div className="flex flex-wrap">
                      {attrGroup['occasion.type']?.map(
                        (lengthAttr: any, ldx: number) => (
                          <div className="flex justify-start comma" key={ldx}>
                            <span className="pr-1 mt-1 text-xs font-normal text-dark-brown sm:text-sm">
                              {lengthAttr.fieldText}
                              <span className="s-icon">,</span>
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
                {attrGroup['product.fabric']?.length > 0 && (
                  <div className="pb-2 mb-1 border-b border-gray-200 sm:pb-3 sm:mb-3">
                    <div className="flex flex-col mt-3 sm:mt-3">
                      <h4 className="mb-1 text-xs font-medium text-gray-400 uppercase sm:mb-2">
                        {translate('label.product.specifications.fabricTypeText')}
                      </h4>
                    </div>
                    <div className="flex flex-wrap">
                      {attrGroup['product.fabric']?.map(
                        (fabric: any, fdx: number) => (
                          <div className="flex justify-start comma" key={fdx}>
                            <span className="pr-1 mt-1 text-xs font-normal text-dark-brown sm:text-sm dark:text-black">
                              {fabric.fieldText}
                              <span className="s-icon">,</span>
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
                {attrGroup['clothing.size']?.length > 0 && (
                  <div className="pb-2 mb-1 border-b border-gray-200 sm:pb-3 sm:mb-3">
                    <div className="flex flex-col mt-3 sm:mt-3">
                      <h4 className="mb-1 text-xs font-medium text-gray-400 uppercase sm:mb-2">
                        {translate('label.product.specifications.fitText')}
                      </h4>
                    </div>
                    <div className="flex flex-wrap">
                      {attrGroup['clothing.size']?.map(
                        (fit: any, fdx: number) => (
                          <div className="flex justify-start comma" key={fdx}>
                            <span className="pr-1 mt-1 text-xs font-normal text-dark-brown sm:text-sm dark:text-black">
                              {fit.fieldText}
                              <span className="s-icon">,</span>
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
                {attrGroup['dress.style']?.length > 0 && (
                  <div className="pb-2 mb-1 border-b border-gray-200 sm:pb-3 sm:mb-3">
                    <div className="flex flex-col mt-3 sm:mt-3">
                      <h4 className="mb-1 text-xs font-medium text-gray-400 uppercase sm:mb-2">
                        {translate('label.product.specifications.dressStyleText')}
                      </h4>
                    </div>
                    <div className="flex flex-wrap">
                      {attrGroup['dress.style']?.map(
                        (fit: any, fdx: number) => (
                          <div className="flex justify-start comma" key={fdx}>
                            <span className="pr-1 mt-1 text-xs font-normal text-dark-brown sm:text-sm dark:text-black">
                              {fit.fieldText}
                              <span className="s-icon">,</span>
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
                {attrGroup['clothing.type']?.length > 0 && (
                  <div className="pb-2 mb-1 border-b border-gray-200 sm:pb-3 sm:mb-3">
                    <div className="flex flex-col mt-3 sm:mt-3">
                      <h4 className="mb-1 text-xs font-medium text-gray-400 uppercase sm:mb-2">
                        {translate('label.product.specifications.clothingText')}
                      </h4>
                    </div>
                    <div className="flex flex-wrap">
                      {attrGroup['clothing.type']?.map(
                        (fit: any, fdx: number) => (
                          <div className="flex justify-start comma" key={fdx}>
                            <span className="pr-1 mt-1 text-xs font-normal text-dark-brown sm:text-sm dark:text-black">
                              {fit.fieldText}
                              <span className="s-icon">,</span>
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
                    {PERFECT_FOR}
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
                    {FABRIC_CARE}
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
                          <span className="s-icon">,</span>
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
                    {WASH_CARE}
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
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {attrGroup['tools.product_group']?.length > 0 && (
                <div>
                  <div className="flex flex-col mt-6">
                    <h4 className="mb-2 text-xs font-medium text-gray-400 uppercase">
                      {translate('label.product.specifications.productGroupText')}
                    </h4>
                  </div>
                  <div className="grid">
                    <div className="flex w-full m-colum-div">
                      {attrGroup['tools.product_group']?.map(
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
                </div>
              )}
              {attrGroup['tools.type']?.length > 0 && (
                <div>
                  <div className="flex flex-col mt-6">
                    <h4 className="mb-2 text-xs font-medium text-gray-400 uppercase">
                     {translate('label.product.specifications.typeText')}
                    </h4>
                  </div>
                  <div className="grid">
                    <div className="flex w-full m-colum-div">
                      {attrGroup['tools.type']?.map(
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
                </div>
              )}
              {attrGroup['tools.dust_class']?.length > 0 && (
                <div>
                  <div className="flex flex-col mt-6">
                    <h4 className="mb-2 text-xs font-medium text-gray-400 uppercase">
                      {translate('label.product.specifications.dustClassText')}
                    </h4>
                  </div>
                  <div className="grid">
                    <div className="flex w-full m-colum-div">
                      {attrGroup['tools.dust_class']?.map(
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
                </div>
              )}
              {attrGroup['tools.power']?.length > 0 && (
                <div>
                  <div className="flex flex-col mt-6">
                    <h4 className="mb-2 text-xs font-medium text-gray-400 uppercase">
                      {translate('label.product.specifications.PowerText')}
                    </h4>
                  </div>
                  <div className="grid">
                    <div className="flex w-full m-colum-div">
                      {attrGroup['tools.power']?.map(
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
                </div>
              )}
              {attrGroup['tools.voltage']?.length > 0 && (
                <div>
                  <div className="flex flex-col mt-6">
                    <h4 className="mb-2 text-xs font-medium text-gray-400 uppercase">
                      {translate('label.product.specifications.VoltageText')}
                    </h4>
                  </div>
                  <div className="grid">
                    <div className="flex w-full m-colum-div">
                      {attrGroup['tools.voltage']?.map(
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
                </div>
              )}
              {attrGroup['global.ishazardous']?.length > 0 && (
                <div>
                  <div className="flex flex-col mt-6">
                    <h4 className="mb-2 text-xs font-medium text-gray-400 uppercase">
                      {translate('label.product.specifications.hazardousText')}
                    </h4>
                  </div>
                  <div className="grid">
                    <div className="flex w-full m-colum-div">
                      {attrGroup['global.ishazardous']?.map(
                        (fabriccareAttr: any, idx: number) => (
                          <p
                            className="ml-0 text-xs sm:text-sm text-dark-brown care-p mob-full-p"
                            key={idx}
                          >
                            {fabriccareAttr?.fieldText == 'TRUE' ? 'Yes' : 'No'}
                            <span className="s-icon s-right-space"> </span>
                          </p>
                        )
                      )}
                    </div>
                  </div>
                </div>
              )}
              {attrGroup['tools.battery_included']?.length > 0 && (
                <div>
                  <div className="flex flex-col mt-6">
                    <h4 className="mb-2 text-xs font-medium text-gray-400 uppercase">
                      {translate('label.product.specifications.batteryIncludedText')}
                    </h4>
                  </div>
                  <div className="grid">
                    <div className="flex w-full m-colum-div">
                      {attrGroup['tools.battery_included']?.map(
                        (fabriccareAttr: any, idx: number) => (
                          <p
                            className="ml-0 text-xs sm:text-sm text-dark-brown care-p mob-full-p"
                            key={idx}
                          >
                            {fabriccareAttr?.fieldText == 'TRUE' ? 'Yes' : 'No'}
                            <span className="s-icon s-right-space"> </span>
                          </p>
                        )
                      )}
                    </div>
                  </div>
                </div>
              )}
              {attrGroup['tools.battery_capacity']?.length > 0 && (
                <div>
                  <div className="flex flex-col mt-6">
                    <h4 className="mb-2 text-xs font-medium text-gray-400 uppercase">
                      {translate('label.product.specifications.batteryCapacityText')}
                    </h4>
                  </div>
                  <div className="grid">
                    <div className="flex w-full m-colum-div">
                      {attrGroup['tools.battery_capacity']?.map(
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
                </div>
              )}
              {attrGroup['tools.tool_type']?.length > 0 && (
                <div>
                  <div className="flex flex-col mt-6">
                    <h4 className="mb-2 text-xs font-medium text-gray-400 uppercase">
                      {translate('label.product.specifications.toolTypeText')}
                    </h4>
                  </div>
                  <div className="grid">
                    <div className="flex w-full m-colum-div">
                      {attrGroup['tools.tool_type']?.map(
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
                </div>
              )}

              {attrGroup['hardware.sub-type']?.length > 0 && (
                <div>
                  <div className="flex flex-col mt-6">
                    <h4 className="mb-2 text-xs font-medium text-gray-400 uppercase">
                      {translate('label.product.specifications.subTypeText')}
                    </h4>
                  </div>
                  <div className="grid">
                    <div className="flex w-full m-colum-div">
                      {attrGroup['hardware.sub-type']?.map(
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
                </div>
              )}
              {attrGroup['hardware.type']?.length > 0 && (
                <div>
                  <div className="flex flex-col mt-6">
                    <h4 className="mb-2 text-xs font-medium text-gray-400 uppercase">
                      {translate('label.product.specifications.hardwareTypeText')}
                    </h4>
                  </div>
                  <div className="grid">
                    <div className="flex w-full m-colum-div">
                      {attrGroup['hardware.type']?.map(
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
                </div>
              )}
              {attrGroup['hardware.product_group']?.length > 0 && (
                <div>
                  <div className="flex flex-col mt-6">
                    <h4 className="mb-2 text-xs font-medium text-gray-400 uppercase">
                      {translate('label.product.specifications.harwareProductGroupText')}
                    </h4>
                  </div>
                  <div className="grid">
                    <div className="flex w-full m-colum-div">
                      {attrGroup['hardware.product_group']?.map(
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
                </div>
              )}
              {attrGroup['security.power_source']?.length > 0 && (
                <div>
                  <div className="flex flex-col mt-6">
                    <h4 className="mb-2 text-xs font-medium text-gray-400 uppercase">
                    {translate('label.product.specifications.powerSourceText')}
                    </h4>
                  </div>
                  <div className="grid">
                    <div className="flex w-full m-colum-div">
                      {attrGroup['security.power_source']?.map(
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
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="sm:col-span-4">
          {imageTagGroup?.specification?.length && (
            <div className="my-6 sm:col-span-1 specifications sm:my-0">
              <Swiper
                slidesPerView={1.3}
                spaceBetween={8}
                navigation={true}
                loop={false}
                freeMode={true}
                modules={[FreeMode]}
                breakpoints={{
                  640: {
                    slidesPerView: 1.3,
                  },
                  768: {
                    slidesPerView: 1.3,
                  },
                  1024: {
                    slidesPerView: 1.3,
                  },
                }}
              >
                <div
                  role="list"
                  className="inline-flex mx-4 space-x-0 sm:mx-0 lg:mx-0 lg:space-x-0 lg:grid lg:grid-cols-4 lg:gap-x-0"
                >
                  {imageTagGroup?.specification?.map(
                    (img: any, iid: number) => (
                      <SwiperSlide
                        className={`px-0 ${
                          iid === 0 && isOnlyMobile ? 'cs-mr-1' : ''
                        } `}
                        key={`product-${iid}-swiper-detil`}
                      >
                        <div className="image-container" style={{ paddingTop }}>
                          <Image
                            priority
                            layout="fill"
                            objectFit="contain"
                            quality="100"
                            onLoad={({ target }) => {
                              const { naturalWidth, naturalHeight } =
                                target as HTMLImageElement
                              setPaddingTop(`0`)
                            }}
                            src={
                              generateUri(img?.image, 'fm=webp&h=450&q=40') ||
                              IMG_PLACEHOLDER
                            }
                            //src={img?.image}
                            alt={img.name||'slider-image'}
                            className="image"
                          ></Image>
                          {/* <Image src={img?.image} className="bhdLno" layout="fill" alt={img.name}></Image> */}
                        </div>
                      </SwiperSlide>
                    )
                  )}
                </div>
              </Swiper>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
