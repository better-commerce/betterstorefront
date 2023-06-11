import type { GetStaticPropsContext } from 'next'
import commerce from '@lib/api/commerce'
import LayoutError from '../components/common/Layout/LayoutError'
import { Text } from '@components/ui'
import Image from "next/legacy/image";
import {
  ERROR_PAGE_NOT_FOUND,
  ERROR_PAGE_NOT_FOUND_MESSAGE,
} from '@components/utils/textVariables'

export async function getStaticProps({
  preview,
  locale,
  locales,
}: GetStaticPropsContext) {
  const config = { locale, locales }
  const { pages } = await commerce.getAllPages({ config, preview })
  const { categories, brands } = await commerce.getSiteInfo({ config, preview })
  return {
    props: {
      pages,
      categories,
      brands,
    },
    revalidate: 200,
  }
}

export default function NotFound({ deviceInfo }: any) {
  const { isMobile, isIPadorTablet, isOnlyMobile } = deviceInfo;
  return (
    <>
      {!isMobile && (
        <>
          <div className="w-full py-14 p-5">
            <div className="error-container">
              <div className="error-text-section w-full text-center mb-8 mt-24">
                <h1 className="text-black sm:text-2xl font-semibold mb-2">
                  404 : Page Not Found
                </h1>
                <p className="text-black">
                  Check that you typed the address correctly. Maybe go back to
                  your previous page or try using our site search to find
                  something specific.
                </p>
              </div>
              <div className="w-40 mx-auto text-center mt-5">
                <a
                  href="/"
                  className="text-white bg-black block p-4 text-center text-sm font-semibold"
                >
                  Back to Homepage
                </a>
              </div>
            </div>
          </div>
        </>
      )}
      {isMobile && (
        <>
          <div className="w-full py-8 px-10 pr-10">
            <div className="error-container">
              <div className="error-text-section w-full text-left mb-8 mt-24 px-10 pr-10">
                <h1 className="text-black text-base font-semibold mb-2">
                  404 : Page Not Found
                </h1>
                <p className="text-brown-light text-xs">
                  Check that you typed the address correctly. Maybe go back to
                  your previous page or try using our site search to find
                  something specific.
                </p>
              </div>
              <div className="w-40 mx-auto text-center mt-5">
                <a
                  href="/"
                  className="text-white bg-black block p-4 text-center text-sm font-semibold"
                >
                  Back to Homepage
                </a>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

NotFound.Layout = LayoutError
