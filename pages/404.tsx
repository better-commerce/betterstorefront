import type { GetStaticPropsContext } from 'next'
import NextHead from 'next/head'
import Link from 'next/link'
import { SITE_ORIGIN_URL } from '@components/utils/constants'
import { useRouter } from 'next/router'
import { Cookie, STATIC_PAGE_CACHE_INVALIDATION_IN_200_SECONDS } from '@framework/utils/constants'
import { useTranslation } from '@commerce/utils/use-translation'
import LayoutError from '@components/Layout/LayoutError'
import { IPagePropsProvider } from '@framework/contracts/page-props/IPagePropsProvider'
import { getPagePropType, PagePropType } from '@framework/page-props'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import useAnalytics from '@components/services/analytics/useAnalytics'
import { EVENTS_MAP } from '@components/services/analytics/constants'

export async function getStaticProps({
  preview,
  locale,
  locales,
}: GetStaticPropsContext) {
  const config = { locale, locales }
  const props: IPagePropsProvider = getPagePropType({ type: PagePropType.COMMON })
  const pageProps = await props.getPageProps({ cookies: { [Cookie.Key.LANGUAGE]: locale } })

  return {
    props: {
      ...pageProps,
    },
    revalidate: STATIC_PAGE_CACHE_INVALIDATION_IN_200_SECONDS
  }
}

function NotFound({ deviceInfo }: any) {
  const translate = useTranslation()
  const router = useRouter()
  const { isMobile, isIPadorTablet, isOnlyMobile } = deviceInfo

  useAnalytics(EVENTS_MAP.EVENT_TYPES.PageViewed, {
    entityName: PAGE_TYPES.NotFound,
    entityType: EVENTS_MAP.ENTITY_TYPES.Page,
    eventType: EVENTS_MAP.EVENT_TYPES.PageViewed,
  })

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
            <title>{translate('label.404.titleText')}</title>
            <meta name="title" content={translate('label.404.titleText')} />
            <meta name="description" content={translate('label.404.titleText')} />
            <meta name="keywords" content={translate('label.404.titleText')} />
            <meta property="og:image" content="" />
            <meta property="og:title" content={translate('label.404.titleText')} key="ogtitle" />
            <meta property="og:description" content={translate('label.404.titleText')} key="ogdesc" />
          </NextHead>
          <div className="w-full px-10 pt-8 pb-24 pr-10 bg-yellow-100">
            <div className="py-4 error-container sm:py-12">
              <div className="w-full px-10 pr-10 mt-24 mb-8 text-center error-text-section">
                <h1 className='text-5xl font-bold text-yellow-800 font-h1-xl'>404</h1>
                <h2 className="mb-2 font-semibold text-yellow-600 font-32">
                  {translate('label.404.pageNotFoundText')}
                </h2>
                <p className="font-16 text-brown-light">
                  {translate('common.label.pageErrorDesc')}
                </p>
              </div>
              <div className="mx-auto mt-5 text-center w-80">
                <Link href="/" className="block p-4 text-sm font-semibold text-center text-white bg-black rounded-3xl" >
                  {translate('common.label.backToHomepageText')}
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
                  {translate('label.404.pageNotFoundText')}
                </h2>
                <p className="font-16 text-brown-light">
                  {translate('common.label.pageErrorDesc')}
                </p>
              </div>
              <div className="mx-auto mt-5 text-center w-80">
                <Link href="/" className="block p-4 text-sm font-semibold text-center text-white bg-black rounded-3xl" >
                  {translate('common.label.backToHomepageText')}
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

export default withDataLayer(NotFound, PAGE_TYPES.NotFound)
