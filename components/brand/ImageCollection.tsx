import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'

import SwiperCore, { Navigation } from 'swiper'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { IMG_PLACEHOLDER } from '@components/utils/textVariables'
import Link from 'next/link'

SwiperCore.use([Navigation])

export default function ImageCollection({ heading, range, AttrArray }: any) {
  const [ImageArrayToDisp, setImageArrayToDisp] = useState<any>([])
  const [obj, setObj] = useState({
    productName: '',
    prodSlug: '',
    prodImage: '',
  })
  let TotalValues: number = 0

  function handleRangeChange() {
    return range * 2
  }

  function handleImageArray(count: number) {
    if (AttrArray !== undefined) {
      if (AttrArray[0]?.name === 'BrangLogo') {
        setImageArrayToDisp(AttrArray.slice(1, count + 1))
      } else {
        setImageArrayToDisp(AttrArray.slice(0, count))
      }
    }
  }

  useEffect(() => {
    TotalValues = handleRangeChange()
    handleImageArray(TotalValues)
  }, [AttrArray])

  return (
    <>
      <div id="ImageCollection" className={`grid grid-cols-${range} gap-5`}>
        {ImageArrayToDisp.map((val: any, Idx: number) => {
          return (
            <Link
              key={Idx}
              className="flex items-center justify-evenly border-orange-500 border-solid border group bg-orange-600"
              href={val.link ? val.link : val.slug ? val.slug : '/#'}
            >
              {val.title !== '' && (
                <p
                  key={Idx}
                  className="absolute flex bg-gray-50 px-9 sm:px-8  mt-24 sm:mt-0 justify-center py-2 sm:py-4 m-auto uppercase rounded-md z-50 md:text-md 2xl:text-lg text-sm font-semibold"
                >
                  {' '}
                  <span className="md:max-w-[10rem] 2xl:max-w-[13rem] truncate">
                    {val.title
                      ? val.title.replace(/([A-Z]+)/g, ' $1').replace(/^ /, '')
                      : val.name}
                  </span>
                </p>
              )}
              <Image
                alt="logo"
                key={Idx}
                src={val.url ? val.url || IMG_PLACEHOLDER : val.image}
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
