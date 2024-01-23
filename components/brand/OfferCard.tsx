import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { IMG_PLACEHOLDER, SHOP_NOW } from '@components/utils/textVariables'
import Router from 'next/router'
import { generateUri } from '@commerce/utils/uri-util'

const OfferCard = ({
  title,
  description,
  src,
  link,
  index,
  buttonText,
  key,
}: any) => {
  const [bgColour, setBgColor] = useState('')
  const [fontColor, setFontColour] = useState('text-black')

  useEffect(() => {
    if (index === 0) {
      setBgColor('bg-[#FEBD18]')
    }
    if (index === 1) {
      setBgColor('bg-[#212530]')
      setFontColour('text-white')
    }
    if (index === 2) {
      setBgColor('bg-[#2125300D]')
    }
    if (index === 3) {
      setBgColor('bg-[#FFEBCD]')
    }
  }, [title])

  function handleClick(link: any) {
    Router.push(link ? link : '#')
  }

  return (
    <div
      key={`offers-${key}`}
      className={`flex flex-col items-start pl-10 ${bgColour} h-[400px] justify-evenly py-2`}
    >
      <img
        alt="brand"
        src={generateUri(src, 'h=51&fm=webp') || IMG_PLACEHOLDER}
        width={62}
        height={51}
        className="h-auto w-10 sm:w-16"
      />
      <div
        className={`text-[20px] w-3/4 text-start ${fontColor} font-semibold cursor-default uppercase leading-8 py-5`}
      >
        {description}
      </div>
      <button
        className={`hover:opacity-80 ${
          fontColor == 'text-white'
            ? 'bg-white text-black'
            : 'bg-black text-white'
        } font-semibold uppercase py-3 px-6 rounded-md`}
        onClick={() => handleClick(link)}
      >
        {buttonText ? buttonText : { SHOP_NOW }}
      </button>
    </div>
  )
}
export default OfferCard
