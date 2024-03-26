import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'

import SwiperCore, { Navigation } from 'swiper'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { IMG_PLACEHOLDER } from '@new-components/utils/textVariables'
import Link from 'next/link'
import { generateUri } from '@commerce/utils/uri-util'

SwiperCore.use([Navigation])

export default function ImageCollection({ heading, range, AttrArray }: any) {
  const [bannerCollection, setbannerCollection] = useState<any>([])
  let TotalValues: number = 0

  function handleRangeChange() {
    return range * 2
  }

  function handleImageArray(count: number) {
    if (AttrArray !== undefined) {
      if (AttrArray[0]?.name === 'BrangLogo') {
        setbannerCollection(AttrArray.slice(1, count + 1))
      } else {
        setbannerCollection(AttrArray.slice(0, count))
      }
    }
  }

  useEffect(() => {
    TotalValues = handleRangeChange()
    handleImageArray(TotalValues)
  }, [AttrArray])

  return (
    <div id="ImageCollection" className={`grid grid-cols-${range} gap-5`}>
      {bannerCollection.map((val: any, Idx: number) => {
        return (
          <Link key={Idx} className="flex items-center border border-solid bg-sky-700 border-sky-700 justify-evenly group" href={val.link ? val.link : val.slug ? val.slug : '/#'} >
            {val.title !== '' && (
              <p key={`${val.title ? val.title : val.name}${Idx}`} className="absolute z-10 flex text-[#212530] justify-center py-2 m-auto mt-24 text-sm font-semibold uppercase rounded-md bg-gray-50 px-9 sm:px-8 sm:mt-0 sm:py-4 md:text-md 2xl:text-lg" >
                {' '}
                <span className="md:max-w-[10rem] 2xl:max-w-[13rem] truncate">
                  {val.title ? val.title.replace(/([A-Z]+)/g, ' $1').replace(/^ /, '') : val.name}
                </span>
              </p>
            )}
            <img alt="logo" key={Idx} src={generateUri(val.url, 'h=224&fm=webp') ? generateUri(val.url, 'h=224&fm=webp') || IMG_PLACEHOLDER : val.image || IMG_PLACEHOLDER} width={305} height={224} className="w-full group-hover:opacity-80" />
          </Link>
        )
      })}
    </div>
  )
}
