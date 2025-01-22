import React from "react";
import Image from 'next/image'
import { generateUri } from "@commerce/utils/uri-util";
import Patterns from "@components/brand/Patterns";
import { IMG_PLACEHOLDER } from "@components/utils/textVariables";

interface IHeroBannerImageProps {
  readonly header: any
  readonly headIdx: number
}

const HeroBannerImage: React.FC<IHeroBannerImageProps> = ({ header, headIdx }: IHeroBannerImageProps) => {
  return (
    <section className='relative w-full bg-header-color' key={headIdx}>
      <div className='grid grid-cols-1 gap-0 mx-auto container-ffx sm:overflow-hidden sm:grid-cols-12'>
        <div className='flex flex-col justify-center h-full py-6 text-left left-info sm:col-span-5 sm:py-0'>
          <h1 className="text-white dark:text-white font-semibold sm:tracking-[7.2px] tracking-wider uppercase">{header?.hero_title}</h1>
          <div className="py-2 text-white dark:text-white font-46 banner-subheading page-list-bullet" dangerouslySetInnerHTML={{ __html: header?.hero_description }}></div>
        </div>
        <div className='relative flex flex-col justify-center h-full right-info sm:pl-12 sm:col-span-7'>
          <Patterns />
          <img  src={generateUri(header?.hero_image, 'h=693&fm=webp') || IMG_PLACEHOLDER} className="z-10 object-cover object-center w-full" alt="banner Image" width={615} height={693} />
        </div>
      </div>
    </section>
  )
}

export default HeroBannerImage