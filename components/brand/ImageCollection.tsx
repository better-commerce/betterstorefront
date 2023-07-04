import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'

import SwiperCore, { Navigation } from 'swiper'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { IMG_PLACEHOLDER } from '@components/utils/textVariables'
import Link from 'next/link'

SwiperCore.use([Navigation])

export default function ImageCollection({
  heading,
  range,
  ImageArray,
  showTitle,
}: any) {
  const [ImageArrayToDisp, setImageArrayToDisp] = useState<any>([])
  let TotalValues: number = 0

  function handleRangeChange() {
    return range * 2
  }

  function handleImageArray(count: number) {
    if (ImageArray !== undefined) {
      if (ImageArray[0]?.name === 'BrangLogo') {
        setImageArrayToDisp(ImageArray.slice(1, count + 1))
      } else {
        setImageArrayToDisp(ImageArray.slice(0, count))
      }
    }
  }

  useEffect(() => {
    TotalValues = handleRangeChange()
    handleImageArray(TotalValues)
  }, [ImageArray])

  return (
    <>
      <div id="ImageCollection" className={`grid grid-cols-${range} gap-5`}>
        {ImageArrayToDisp.map((val: any, Idx: number) => {
          return (
            <Link
              key={Idx}
              className="flex items-center justify-evenly border-orange-500 border-solid border group bg-orange-600"
              href={val.link ? val.link : '#'}
            >
              {val.title !== '' && (
                <p
                  key={Idx}
                  className="absolute bg-gray-50 w-48 py-4 px-7 /pl-8 m-auto uppercase rounded-md z-50 md:text-lg text-sm font-semibold"
                >
                  {val.title.replace(/([A-Z]+)/g, ' $1').replace(/^ /, '')}
                </p>
              )}
              <Image
                alt="logo"
                key={Idx}
                src={val.url || IMG_PLACEHOLDER}
                width={305}
                height={224}
                className="w-full group-hover:opacity-20"
              ></Image>
            </Link>
          )
        })}
      </div>
    </>
  )
}
