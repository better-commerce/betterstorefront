// Base Imports
import React from 'react'

// Package Imports
import Link from 'next/link'
import NextHead from 'next/head'
import type { GetStaticPropsContext } from 'next'

// Component Imports
import LayoutError from '../components/common/Layout/LayoutError'

// Other Imports
import { getSecondsInMinutes } from '@framework/utils/parse-util'
import { STATIC_PAGE_CACHE_INVALIDATION_IN_MINS } from '@framework/utils/constants'

export async function getStaticProps({
  preview,
  locale,
  locales,
}: GetStaticPropsContext) {
  const config = { locale, locales }
  return {
    props: {
    },
    revalidate: getSecondsInMinutes(STATIC_PAGE_CACHE_INVALIDATION_IN_MINS),
  }
}

export default function InternalServerError({ deviceInfo }: any) {
  const { isMobile, isIPadorTablet } = deviceInfo
  let absPath = ''
  if (typeof window !== 'undefined') {
    absPath = window?.location?.href
  }
  return (
    <>
      <NextHead>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <link rel="canonical" id="canonical" href={absPath} />
        <title>500 Error</title>
        <meta name="title" content="500 Error" />
        <meta name="description" content="500 Error" />
        <meta name="keywords" content="500 Error" />
        <meta property="og:image" content="" />
        <meta property="og:title" content="500 Error" key="ogtitle" />
        <meta property="og:description" content="500 Error" key="ogdesc" />
      </NextHead>

      {(isMobile || isIPadorTablet) ? (
        <>
          <div className="w-full px-10 py-8 pr-10">
            <div className="error-container">
              <div className="w-full px-10 pr-10 mt-24 mb-8 text-left error-text-section">
                <h1 className="mb-2 text-base font-semibold text-black">
                  500 : Internal Server Error
                </h1>
                <p className="text-xs text-brown-light">
                  Check that you typed the address correctly. Maybe go back to
                  your previous page or try using our site search to find
                  something specific.
                </p>
              </div>
              <div className="w-40 mx-auto mt-5 text-center">
                <Link
                  href="/"
                  className="block p-4 text-sm font-semibold text-center text-white bg-black"
                >
                  Back to Homepage
                </Link>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="w-full p-5 bg-[#f7f6f6] pb-14">
            <div className="error-container">
              <div className="w-full mt-1 mb-8 text-center error-text-section">
                <img src='/assets/images/500-error.gif' width="540" height="302" className='mx-auto' alt='500 Error' />
                <h1 className="mb-2 font-semibold text-black">
                  Internal Server Error
                </h1>
                <h2 className='font-semibold text-orange-600'>WE'VE DOWNED TOOLS</h2>
                <p className="text-gray-400 font-16">
                  To carry on shopping with free next day delivery
                </p>
              </div>
              <div className="w-auto mx-auto mt-3 text-center">
                <Link
                  href="/"
                  className="block p-4 text-sm font-semibold text-center text-white btn-primary"
                >
                  Click Here
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

InternalServerError.Layout = LayoutError
