import type { GetStaticPropsContext } from 'next'
import getCollections from '@framework/api/content/getCollections'
import Layout from '@components/Layout/Layout'
import Link from 'next/link'
import { IMG_PLACEHOLDER } from '@components/utils/textVariables'
import { EmptyGuid, EmptyString, SITE_NAME, SITE_ORIGIN_URL } from '@components/utils/constants'
import NextHead from 'next/head'
import { useRouter } from 'next/router'
import { Cookie, STATIC_PAGE_CACHE_INVALIDATION_IN_MINS } from '@framework/utils/constants'
import { containsArrayData, getDataByUID, parseDataValue, setData } from '@framework/utils/redis-util'
import { Redis } from '@framework/utils/redis-constants'
import { logError } from '@framework/utils/app-util'
import { getSecondsInMinutes } from '@framework/utils/parse-util'
import { useTranslation } from '@commerce/utils/use-translation'
import { PHASE_PRODUCTION_BUILD } from 'next/constants'
import { IPagePropsProvider } from '@framework/contracts/page-props/IPagePropsProvider'
import { getPagePropType, PagePropType } from '@framework/page-props'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import useAnalytics from '@components/services/analytics/useAnalytics'
import { EVENTS_MAP } from '@components/services/analytics/constants'
import { AnalyticsEventType } from '@components/services/analytics'

function CollectionList(props: any) {
  const router = useRouter();
  const translate = useTranslation()

  const extras = { originalLocation: SITE_ORIGIN_URL + router.asPath }
  useAnalytics(AnalyticsEventType.VIEW_PLP_ITEMS, { ...{ ...extras }, plpDetails: props, product: null, itemIsBundleItem: false, entityType: EVENTS_MAP.ENTITY_TYPES.Collection, })

  return (
    <>
      <NextHead>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="canonical" href={SITE_ORIGIN_URL + router.asPath} />
        <title>{translate('label.collection.collectionsText')}</title>
        <meta name="title" content={translate('label.collection.collectionsText')} />
        <meta name="description" content={translate('label.collection.collectionsText')} />
        <meta name="keywords" content={translate('label.collection.collectionsText')} />
        <meta property="og:image" content="" />
        <meta property="og:title" content={translate('label.collection.collectionsText')} key="ogtitle" />
        <meta property="og:description" content={translate('label.collection.collectionsText')} key="ogdesc" />
        <meta property="og:site_name" content={SITE_NAME} key="ogsitename" />
        <meta property="og:url" content={SITE_ORIGIN_URL + router.asPath} key="ogurl" />
      </NextHead>
      <main className="container w-full mx-auto theme-account-container dark:bg-white">
        <section aria-labelledby="products-heading" className="mt-12">
          <h1 className="block text-2xl font-semibold sm:text-3xl lg:text-4xl dark:text-black">
            {translate('label.collection.shopByCollectionText')}
          </h1>
          {props?.data.length > 0 && (
            <div className="grid grid-cols-2 py-10 sm:gap-y-3 sm:grid-cols-5 gap-x-3 gap-y-4 lg:grid-cols-4 xl:gap-x-3">
              {props.data.map((collection: any, key: any) => (
                <Link key={key} passHref href={`/collection/${collection.slug}`}>
                  <span key={collection.id} className="block mb-8 group">
                    <div className="relative w-full pb-0 overflow-hidden bg-gray-100 rounded-lg aspect-w-1 aspect-h-1 sm:aspect-w-2 sm:aspect-h-3">
                      <div className="relative image-container">
                        <img src={IMG_PLACEHOLDER} alt={collection.name || 'image'} className="object-cover object-center w-full h-full group-hover:opacity-75 image" />
                      </div>
                    </div>
                    <div className="justify-center flex-1 w-full text-center">
                      <h2 className="flex justify-center w-full pt-2 text-sm font-medium text-gray-900 sm:text-xl text-md">
                        {collection.name}
                      </h2>
                    </div>
                  </span>
                </Link>
              ))}
            </div>
          )}
          {props?.data.length == 0 && (
            <div className="flex flex-col py-32 text-center">
              <h2 className="w-full mx-auto text-4xl font-bold text-gray-200">
                {translate('label.collection.noCollectionAvailableText')}
              </h2>
            </div>
          )}
        </section>
      </main>
    </>
  )
}

CollectionList.Layout = Layout

export async function getStaticProps({
  params,
  locale,
  locales,
  preview,
}: GetStaticPropsContext) {
  const props: IPagePropsProvider = getPagePropType({ type: PagePropType.COMMON })
  const pageProps = await props.getPageProps({ cookies: { [Cookie.Key.LANGUAGE]: locale } })
  const collectionUID = Redis.Key.Collection
  const cachedData = await getDataByUID([collectionUID])
  let collectionUIDData: any = parseDataValue(cachedData, collectionUID) || []
  try {
    if (!containsArrayData(collectionUIDData)) {
      collectionUIDData = await getCollections({ [Cookie.Key.LANGUAGE]: locale })
      await setData([{ key: collectionUID, value: collectionUIDData }])
    }
    return {
      props: {
        ...pageProps,
        data: collectionUIDData,
      },
      revalidate: getSecondsInMinutes(STATIC_PAGE_CACHE_INVALIDATION_IN_MINS)
    }
  } catch (error: any) {
    logError(error)

    if (process.env.NEXT_PHASE !== PHASE_PRODUCTION_BUILD) {
      let errorUrl = '/500'
      const errorData = error?.response?.data
      if (errorData?.errorId) {
        errorUrl = `${errorUrl}?errorId=${errorData.errorId}`
      }

      return {
        props: {
          ...pageProps,
          data: collectionUIDData,
        },
        redirect: {
          destination: errorUrl,
          permanent: false,
        },
      }
    }
  }
}

export default withDataLayer(CollectionList, PAGE_TYPES.Collection)