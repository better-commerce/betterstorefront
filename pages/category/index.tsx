import type { GetStaticPropsContext } from 'next'
import { getAllCategories } from '@framework/category'
import Link from 'next/link'
import { useRouter } from 'next/router'
import NextHead from 'next/head'
import { Layout } from '@components/common'
import { IMG_PLACEHOLDER } from '@components/utils/textVariables'
import { BETTERCOMMERCE_DEFAULT_LANGUAGE, SITE_NAME, SITE_ORIGIN_URL } from '@components/utils/constants'
import { STATIC_PAGE_CACHE_INVALIDATION_IN_MINS } from '@framework/utils/constants'
import { containsArrayData, getDataByUID, parseDataValue, setData } from '@framework/utils/redis-util'
import { Redis } from '@framework/utils/redis-constants'
import { logError } from '@framework/utils/app-util'
import { getSecondsInMinutes } from '@framework/utils/parse-util'
import { useTranslation } from '@commerce/utils/use-translation'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

export default function CategoryList(props: any) {
  let absPath = ''
  if (typeof window !== 'undefined') {
    absPath = window?.location?.href
  }
  const router = useRouter()
  const translate = useTranslation()
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
      <main className="container w-full mx-auto">
        <section aria-labelledby="products-heading ">
          <h1 className="block text-2xl font-semibold sm:text-3xl lg:text-4xl">
            {translate('label.category.shopByCategoryText')}
          </h1>
          {props?.data.length > 0 && (
            <div className="flow-root mt-1 sm:mt-0 ">
              <div className="my-0">
                <div className="box-content relative px-0 mt-2">
                  <div className="grid grid-cols-2 my-2 mb-6 gap-x-3 gap-y-3 md:grid-cols-5 lg:grid-cols-4 sm:my-4">
                    {props?.data?.map((category: any, key: number) => (
                      <div key={key} className="border bg-slate-100 rounded-2xl border-slate-100 hover:border-slate-300 " >
                        <div className="relative group">
                          <Link key={key} href={`/${category.link}`}>
                            {category?.image ? (
                              <div className="relative overflow-hidden aspect-w-1 aspect-h-1">
                                <img src={ `${category?.image}?fm=webp&h=800&w=400` || IMG_PLACEHOLDER } alt={category.name|| 'category'} className="object-cover object-center w-full h-auto sm:h-full aspect-[4/3]" height={900} />
                              </div>
                            ) : (
                              <div className="relative overflow-hidden aspect-[4/3]">
                                <img src={IMG_PLACEHOLDER} alt={category.name || 'category'} className="object-cover object-center w-full h-auto sm:h-full" width={600} height={900} />
                              </div>
                            )}
                            <span aria-hidden="true" className="absolute inset-x-0 bottom-4 h-1/3 opacity-40" />
                            <h2 className="relative flex items-center justify-center w-full py-3 text-sm tracking-wide text-center text-gray-700 capitalize bg-white rounded-b-2xl lg:mt-auto sm:text-lg bg-opacity-70 bg-nav dark:text-gray-700">
                              {category.name}
                            </h2>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
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
    </>
  )
}

CategoryList.Layout = Layout

export async function getStaticProps({
  params,
  locale,
  locales,
  preview,
}: GetStaticPropsContext) {
  let categoryUIDData: any
  try {
    const categoryUID =  Redis.Key.Category.AllCategory
    const cachedData = await getDataByUID([categoryUID])
    categoryUIDData = parseDataValue(cachedData, categoryUID)
    if(!containsArrayData(categoryUIDData)){
      categoryUIDData = await getAllCategories()
      await setData([{ key: categoryUID, value: categoryUIDData }])
    }
  } catch (error: any) {
    logError(error)

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
  return {
    props: {
      ...(await serverSideTranslations(locale ?? BETTERCOMMERCE_DEFAULT_LANGUAGE!)),
      data: categoryUIDData,
    },
    revalidate: getSecondsInMinutes(STATIC_PAGE_CACHE_INVALIDATION_IN_MINS)
  }
}
