import type { GetStaticPropsContext } from 'next'
import { getAllCategories } from '@framework/category'
import Link from 'next/link'
import { useRouter } from 'next/router'
import NextHead from 'next/head'
import Layout from '@components/Layout/Layout'
import { IMG_PLACEHOLDER } from '@components/utils/textVariables'
import { BETTERCOMMERCE_DEFAULT_LANGUAGE, SITE_NAME, SITE_ORIGIN_URL } from '@components/utils/constants'
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
import { serverSideMicrositeCookies } from '@commerce/utils/uri-util'

function CategoryPage(props: any) {
  let absPath = ''
  if (typeof window !== 'undefined') {
    absPath = window?.location?.href
  }
  const router = useRouter()
  const translate = useTranslation()

  useAnalytics(AnalyticsEventType.CATEGORY_VIEWED, { category: null, entityName: PAGE_TYPE, entityType: EVENTS_MAP.ENTITY_TYPES.Category, })

  return (
    <>
      <NextHead>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <link rel="canonical" href={SITE_ORIGIN_URL + router.asPath} />
        <title>{translate('label.category.categoryText')}</title>
        <meta name="title" content={translate('label.category.categoryText')} />
        <meta name="description" content={translate('label.category.categoryText')} />
        <meta name="keywords" content={translate('label.category.categoryText')} />

        <meta property="og:image" content="" />
        <meta property="og:title" content={translate('label.category.categoryText')} key="ogtitle" />
        <meta property="og:description" content={translate('label.category.categoryText')} key="ogdesc" />
        <meta property="og:site_name" content={SITE_NAME} key="ogsitename" />
        <meta property="og:url" content={absPath || SITE_ORIGIN_URL + router.asPath} key="ogurl" />
      </NextHead>
      <div className='w-full dark:bg-white'>
        <main className="container w-full pt-6 mx-auto sm:pt-10 theme-account-container dark:bg-white">
          <section aria-labelledby="products-heading ">
            <h1 className="block text-2xl font-semibold sm:text-3xl lg:text-4xl dark:text-black">{translate('label.category.shopByCategoryText')}</h1>
            {props?.data?.length > 0 && (
              <div className="box-content relative grid grid-cols-2 my-8 gap-x-6 gap-y-6 md:grid-cols-5 lg:grid-cols-4 sm:my-10">
                {props?.data?.sort((a: any, b: any) => a?.name?.localeCompare(b?.name))?.map((category: any, key: number) => (
                  category?.link != null &&
                  <div key={key} className="relative border bg-slate-100 rounded-2xl border-slate-200 hover:border-slate-300 group">
                    <Link key={key} href={`/${category?.link}`}>
                      {category?.image ? (
                        <div className="relative overflow-hidden aspect-w-1 aspect-h-1 min-h-[300px]">
                          <img src={`${category?.image}?fm=webp&h=300&w=400` || IMG_PLACEHOLDER} alt={category?.name || 'category'} className="object-cover rounded-2xl object-center w-full h-auto sm:h-full aspect-[4/3]" height={900} />
                        </div>
                      ) : (
                        <div className="relative overflow-hidden aspect-h-1">
                          <img src={IMG_PLACEHOLDER} alt={category?.name || 'category'} className="object-cover object-center w-full h-auto sm:h-full rounded-2xl" width={200} height={300} />
                        </div>
                      )}
                      <span aria-hidden="true" className="absolute inset-x-0 bottom-4 h-1/3 opacity-40" />
                      <h2 className="relative flex items-center justify-center w-full py-3 text-sm font-semibold tracking-wide text-center text-black capitalize bg-white rounded-b-2xl lg:mt-auto sm:text-lg bg-opacity-70 bg-nav dark:text-gray-700">
                        {category?.name}
                      </h2>
                    </Link>
                  </div>
                ))}
              </div>
            )}
            {props?.data.length == 0 && (
              <>
                <div className="flex flex-col py-32 text-center">
                  <h1 className="w-full mx-auto text-4xl font-bold text-gray-200">
                    {translate('label.category.noCategoryAvailableText')}
                  </h1>
                </div>
              </>
            )}
          </section>
        </main>
      </div>
    </>
  )
}

CategoryPage.Layout = Layout

export async function getStaticProps({
  params,
  locale,
  locales,
  preview,
}: GetStaticPropsContext) {
  let categoryUIDData: any
  try {
    const categoryUID = Redis.Key.Category.AllCategory + '_' + locale
    const cachedData = await getDataByUID([categoryUID])
    categoryUIDData = parseDataValue(cachedData, categoryUID)
    if (!containsArrayData(categoryUIDData)) {
      categoryUIDData = await getAllCategories({ [Cookie.Key.LANGUAGE]: locale })
      await setData([{ key: categoryUID, value: categoryUIDData }])
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
        redirect: {
          destination: errorUrl,
          permanent: false,
        },
      }
    }
  }

  const props: IPagePropsProvider = getPagePropType({ type: PagePropType.COMMON })
  const cookies = serverSideMicrositeCookies(locale!)
  const pageProps = await props.getPageProps({ cookies })

  return {
    props: {
      ...pageProps,
      data: categoryUIDData,
    },
    revalidate: getSecondsInMinutes(STATIC_PAGE_CACHE_INVALIDATION_IN_MINS)
  }
}

const PAGE_TYPE = PAGE_TYPES.Category

export default withDataLayer(CategoryPage, PAGE_TYPE)