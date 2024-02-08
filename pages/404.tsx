import type { GetStaticPropsContext } from 'next'
import NextHead from 'next/head'
import commerce from '@lib/api/commerce'
import LayoutError from '../components/common/Layout/LayoutError'
import Link from 'next/link'
import { SITE_ORIGIN_URL } from '@components/utils/constants'
import { useRouter } from 'next/router'
import { STATIC_PAGE_CACHE_INVALIDATION_IN_200_SECONDS } from '@framework/utils/constants'

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
    revalidate: STATIC_PAGE_CACHE_INVALIDATION_IN_200_SECONDS
  }
}

export default function NotFound({ deviceInfo }: any) {
  const router = useRouter()
  const { isMobile, isIPadorTablet, isOnlyMobile } = deviceInfo
  return (
    <>
      {!isMobile && (
        <>
          <NextHead>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1, maximum-scale=1"
            />
            <link rel="canonical" id="canonical" href={SITE_ORIGIN_URL+router.asPath} />
            <title>404 Error</title>
            <meta name="title" content="404 Error" />
            <meta name="description" content="404 Error" />
            <meta name="keywords" content="404 Error" />
            <meta property="og:image" content="" />
            <meta property="og:title" content="404 Error" key="ogtitle" />
            <meta property="og:description" content="404 Error" key="ogdesc" />
          </NextHead>
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
                <Link
                  href="/"
                  className="btn btn-primary"
                >
                  Back to Homepage
                </Link>
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
                <Link
                  href="/"
                  className="btn btn-primary"
                >
                  Back to Homepage
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

NotFound.Layout = LayoutError
