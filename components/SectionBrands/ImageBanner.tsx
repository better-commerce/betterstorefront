import React from 'react'
import { IMG_PLACEHOLDER } from '@components//utils/textVariables'
import Router from 'next/router'
import { generateUri } from '@commerce/utils/uri-util'
import { useTranslation } from '@commerce/utils/use-translation'

const ImageBanner = ({
  heading,
  manufacturerSettingTypeImgBanner,
  link,
}: any) => {
  const translate = useTranslation()
  return (
    <div className="grid grid-cols-1 md:grid-cols-2">
      <div className="bg-gray-500 h-[225px] md:h-[452px] w-full">
        <img
          src={generateUri(manufacturerSettingTypeImgBanner, 'h=240&fm=webp') || '/brands/ImageBanner.png'||IMG_PLACEHOLDER}
          height={240}
          width={320}
          alt={manufacturerSettingTypeImgBanner || 'ImgBanner'}
          className="w-full h-full"
        />
      </div>
      <div className="flex flex-col items-start bg-yellow-500 px-14 h-[225px] md:h-[452px] justify-evenly py-2">
        <h2 className="text-2xl md:text-4xl tracking-wider">
          {heading ? heading : translate('label.kitBuilder.buildPackageHeadingText')}
        </h2>
        <button
          className="bg-black uppercase font-semibold text-white hover:opacity-80 py-3 px-6 rounded-md"
          onClick={() => {
            Router.push(link ? link : '#')
          }}
        >
          {translate('common.label.shopNowText')}
        </button>
      </div>
    </div>
  )
}

export default ImageBanner
