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
          <div className="w-full px-10 pt-8 pb-24 pr-10 bg-red-100">
            <div className="py-4 error-container sm:py-12">
              <div className="w-full px-10 pr-10 mt-24 mb-8 text-center error-text-section">
                <h1 className='text-5xl font-bold text-red-800 font-h1-xl'>500</h1>
                <h2 className="mb-2 font-semibold text-red-600 font-32">
                  Internal Server Error
                </h2>
                <p className="font-16 text-brown-light">
                  Check that you typed the address correctly. Maybe go back to your previous page or try using our site search to find something specific.
                </p>
              </div>
              <div className="mx-auto mt-5 text-center w-80">
                <Link href="/" className="block p-4 text-sm font-semibold text-center text-white bg-black rounded-3xl" >
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="w-full px-10 pt-8 pb-24 pr-10 bg-red-100">
            <div className="py-4 error-container sm:py-12">
              <div className="w-full px-10 pr-10 mt-24 mb-8 text-center error-text-section">
                <h1 className='text-5xl font-bold text-red-800 font-h1-xl'>500</h1>
                <h2 className="mb-2 font-semibold text-red-600 font-32">
                  Internal Server Error
                </h2>
                <p className="font-16 text-brown-light">
                  Check that you typed the address correctly. Maybe go back to your previous page or try using our site search to find something specific.
                </p>
              </div>
              <div className="mx-auto mt-5 text-center w-80">
                <Link href="/" className="block p-4 text-sm font-semibold text-center text-white bg-black rounded-3xl" >
                  Back to Home
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
