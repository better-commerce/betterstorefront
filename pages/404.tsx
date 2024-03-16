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
            <link rel="canonical" id="canonical" href={SITE_ORIGIN_URL + router.asPath} />
            <title>404 Error</title>
            <meta name="title" content="404 Error" />
            <meta name="description" content="404 Error" />
            <meta name="keywords" content="404 Error" />
            <meta property="og:image" content="" />
            <meta property="og:title" content="404 Error" key="ogtitle" />
            <meta property="og:description" content="404 Error" key="ogdesc" />
          </NextHead>
          <div className="w-full px-10 pt-8 pb-24 pr-10 bg-yellow-100">
            <div className="py-4 error-container sm:py-12">
              <div className="w-full px-10 pr-10 mt-24 mb-8 text-center error-text-section">
                <h1 className='text-5xl font-bold text-yellow-800 font-h1-xl'>404</h1>
                <h2 className="mb-2 font-semibold text-yellow-600 font-32">
                  Page Not Found
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
      {isMobile && (
        <>
          <div className="w-full px-10 pt-8 pb-24 pr-10 bg-yellow-100">
            <div className="py-4 error-container sm:py-12">
              <div className="w-full px-10 pr-10 mt-24 mb-8 text-center error-text-section">
                <h1 className='text-5xl font-bold font-h1-xl'>404</h1>
                <h2 className="mb-2 font-semibold text-black font-32">
                  Page Not Found
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

NotFound.Layout = LayoutError
