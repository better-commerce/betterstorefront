import React from 'react'
import Link from 'next/link'
import { resolve } from 'url'

interface IMidBannerTextProps {
  readonly data: any
  readonly mid: any
}

const MidBannerText: React.FC<IMidBannerTextProps> = ({ data, mid }: IMidBannerTextProps) => {
  return (
    <>
      {data &&
        <section className="relative w-full" key={mid}>
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 bg-[#FCD673] mb-5 mt-5">
            <div className="flex justify-center sm:p-10">
              <img
                src={data?.midbanner_image}
                alt="information"
                className="object-cover w-full"
              />
            </div>
            <div className="p-5 mt-8 sm:mt-0 sm:p-10 sm:!pr-20 flex justify-center flex-col">
              <h2 className="text-lg font-semibold leading-6 text-left">
                {data?.midbanner_title}
              </h2>
              <div
                dangerouslySetInnerHTML={{
                  __html: data?.midbanner_description,
                }}
                className="text-sm mid-banner-text page-list-bullet"
              />
              <div className="flex justify-center mt-10">
                <Link href={resolve("/", data?.midbanner_buttonlink)} passHref legacyBehavior>
                  <a className="flex justify-center w-32 py-3 pl-5 pr-5 text-sm font-semibold text-white uppercase bg-black rounded">
                    {data?.midbanner_buttontext}
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </section>
      }
    </>
  )
}

export default MidBannerText