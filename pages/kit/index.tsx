// Base Imports
import { useEffect, useState } from 'react'

// Package Imports
import cookie from 'cookie'
import sortBy from 'lodash/sortBy'
import NextHead from 'next/head'
import { useRouter } from 'next/router'
import type { GetServerSideProps } from 'next'
import Cookies from 'js-cookie'

// Component Imports
import { Layout } from '@components/common'
import BrandCard from '@components/kit/BrandCard'


// Other Imports
import { useUI } from '@components/ui'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import { kitBrandPlatform } from '@framework/api/endpoints/kitbuilder'
import { SITE_NAME, SITE_ORIGIN_URL, EmptyObject, EmptyString, EmptyGuid } from '@components/utils/constants'
import useAnalytics from '@components/services/analytics/useAnalytics'
import { EVENTS_MAP } from '@components/services/analytics/constants'
import commerce from '@lib/api/commerce'
import dynamic from 'next/dynamic'
import useCart from '@components/services/cart'
import { Cookie } from '@framework/utils/constants'
import { removeQueryString } from '@commerce/utils/uri-util'
import { IPagePropsProvider } from '@framework/contracts/page-props/IPagePropsProvider'
import { PagePropType, getPagePropType } from '@framework/page-props'

function KitPage({ brandPlatforms, deviceInfo, metaTitle, metaDescription, metaKeywords, pageContentsWeb, pageContentsMobileWeb }: any) {
  const [brandPlatformsState, setBrandPlatformsState] = useState<any>(null)
  const { openActiveKitAlert, closeModal, setKitBasket, setOverlayLoaderState, hideOverlayLoaderState } = useUI()
  const router = useRouter()
  const cleanPath = removeQueryString(router.asPath)

  const { getCart } = useCart()
  useEffect(() => {
    setBrandPlatformsState(sortBy(brandPlatforms, 'displayOrder'))
  }, [brandPlatforms])

  useEffect(() => {
    const getKitBasket = async () => {
      const basketId = Cookies.get(Cookie.Key.KIT_BASKET_ID)
      if (!basketId) return
      setOverlayLoaderState({ visible: true, message: 'Loading...' })
      const basket = await getCart({ basketId })
      hideOverlayLoaderState()
      if (basket?.id !== EmptyGuid) {
        setKitBasket(basket)
        openActiveKitAlert()
      } else {
        closeModal()
      }
    }
    getKitBasket()
  }, [])

  let absPath = ''
  if (typeof window !== 'undefined') {
    absPath = window?.location?.href
  }
  return (
    <>
      <NextHead>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="canonical" id="canonical" href={SITE_ORIGIN_URL + cleanPath} />
        <title>BetterTools Cordless Power Tool Kit Builder Home Page</title>
        <meta name="title" content={metaTitle} />
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content={metaKeywords} />
        <meta property="og:image" content="" />
        <meta property="og:title" content={metaTitle} key="ogtitle" />
        <meta property="og:description" content={metaDescription} key="ogdesc" />
        <meta property="og:site_name" content={SITE_NAME} key="ogsitename" />
        <meta property="og:url" content={SITE_ORIGIN_URL + cleanPath} key="ogurl" />
      </NextHead>
      <div className="flex flex-col w-full px-4 py-10 sm:py-20 bg-teal sm:px-0">
        <h1 className="text-xl font-semibold text-center text-yellow-400 sm:text-4xl">
          WELCOME TO KITBUILDER
        </h1>
        <h2 className="mt-3 font-medium text-center text-white capitalize font-20">
          Start building your custom kit of cordless power tools
        </h2>
        <div className="flex justify-center gap-2 mt-6 sm:gap-6">
          <div className="flex flex-col items-center justify-center gap-2 text-center border-2 border-yellow-400 rounded-md w-28 h-28">
            <span className="font-semibold text-yellow-400 font-32">1</span>
            <span className="font-medium text-white font-14"> Pick a brand </span>
          </div>
          <div className="flex flex-col items-center justify-center gap-2 text-center border-2 border-yellow-400 rounded-md w-28 h-28">
            <span className="font-semibold text-yellow-400 font-32">2</span>
            <span className="font-medium text-white font-14"> Add kit items </span>
          </div>
          <div className="flex flex-col items-center justify-center gap-2 text-center border-2 border-yellow-400 rounded-md w-28 h-28">
            <span className="font-semibold text-yellow-400 font-32">3</span>
            <span className="font-medium text-white font-14"> Add to basket </span>
          </div>
        </div>
      </div>

      <div className="container flex flex-col pt-4 pb-10 mx-auto mob-container sm:pb-20 sm:pt-6">
        <h2 className="!mb-3 mt-2 font-24 font-semibold dark:text-black">
          Pick a brand to start a kit
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {brandPlatformsState?.map((o: any) => (
            <BrandCard key={o.id} {...o} />
          ))}
        </div>
      </div>
    </>
  )
}

const PAGE_TYPE = PAGE_TYPES['Page']
KitPage.Layout = Layout

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const { ctx }: any = context
  const cookies = cookie.parse((context?.req && context?.req?.headers?.cookie) || EmptyString)
  try {
    const brandPlatforms = await kitBrandPlatform({ cookies })

    const props: IPagePropsProvider = getPagePropType({ type: PagePropType.COMMON })
    const pageProps = await props.getPageProps({ cookies: context?.req?.cookies })
    return {
      props: {
        ...pageProps,
        brandPlatforms,
      },
    }
  } catch (error) {
    return {
      props: {
        brandPlatforms: [],
      },
    }
  }
}


export default withDataLayer(KitPage, PAGE_TYPE)