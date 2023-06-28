import React from 'react'
import Image from 'next/image'
import { SHOP_NOW } from '@components/utils/textVariables'

const ImageBanner = ({ heading, manufacturerSettingTypeImgBanner }: any) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2">
      <div className="bg-gray-500 h-[452px] w-full">
        <Image
          src={manufacturerSettingTypeImgBanner || '/brands/ImageBanner.png'}
          height={240}
          width={320}
          alt={manufacturerSettingTypeImgBanner || ''}
          className="w-full h-full"
        />
      </div>
      <div className="flex flex-col items-start bg-yellow-500 px-14 h-[452px] justify-evenly py-2">
        <h2 className="text-4xl tracking-wider">
          {heading ? heading : 'BUILD A BESPOKE PACKAGE WITH OUR KIT BUILDER'}
        </h2>
        <button className="bg-black text-white hover:opacity-80 py-3 px-6 rounded-md">
          {SHOP_NOW}
        </button>
      </div>
    </div>
  )
}

export default ImageBanner
