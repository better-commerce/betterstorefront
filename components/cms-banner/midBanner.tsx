import React from 'react'
import Link from 'next/link'
import { resolve } from 'url'

interface IMidBannerProps {
  readonly data: any
  mid: any
}

const MidBanner: React.FC<IMidBannerProps> = ({ data, mid }: IMidBannerProps) => {
  return (
    <>
      <div className="relative w-full mt-3" key={mid}>
        {data?.midhero_image != '' ? (
          <>
            <img
              src={data?.midhero_image}
              alt={data?.midhero_title}
              className="w-full max-w-full mob-min-height"
            />
          </>
        ) : (
          <></>
        )}
        <div className="absolute top-0 w-full h-full container-ffx left-2/4 -translate-x-2/4">
          <h2 className="absolute text-4xl font-semibold leading-10 uppercase top-10">
            {data?.midhero_title}
          </h2>
          {data?.midhero_buttonlink != '' ? (
            <>
              <Link href={resolve("/", data?.midhero_buttonlink)} legacyBehavior>
                <a className="absolute py-3 pl-5 pr-5 text-sm font-semibold text-white uppercase bg-black rounded bottom-10">{data?.midhero_buttontext}</a>
              </Link>
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    </>
  )
}

export default MidBanner