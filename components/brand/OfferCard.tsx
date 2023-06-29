import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { SHOP_NOW } from '@components/utils/textVariables'

const OfferCard = ({ title, description, src }: any) => {
  const [bgColour, setBgColor] = useState('')
  const [fontColor, setFontColour] = useState('text-black')

  useEffect(() => {
    if (title === 'Free Delivery') {
      setBgColor('bg-[#FEBD18]')
    }
    if (title === 'Newsletter') {
      setBgColor('bg-[#212530]')
      setFontColour('text-white')
    }
    if (title === 'Offers') {
      setBgColor('bg-[#2125300D]')
    }
    if (title === 'Bag') {
      setBgColor('bg-[#FFEBCD]')
    }
  }, [title])

  return (
    <div
      className={`flex flex-col items-start pl-10 ${bgColour} h-[400px] justify-evenly py-2`}
    >
      <Image
        alt="logo"
        src={src || '/assets/images/Dewalt.svg'}
        width={62}
        height={51}
      ></Image>
      <p
        className={`text-[20px] w-3/4 text-start ${fontColor} font-semibold uppercase leading-8 py-5`}
      >
        {description}
      </p>
      <button
        className={`hover:opacity-80 ${
          fontColor == 'text-white'
            ? 'bg-white text-black'
            : 'bg-black text-white'
        } font-semibold uppercase py-3 px-6 rounded-md`}
      >
        {SHOP_NOW}
      </button>
    </div>
  )
}

export default OfferCard
