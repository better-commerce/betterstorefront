import type { GetStaticPropsContext } from 'next'
import getCollections from '@framework/api/content/getCollections'
import { Layout } from '@components/common'
import Link from 'next/link'
import { IMG_PLACEHOLDER, PRODUCTS_AVAILABLE, SHOP_BY_COLLECTION } from '@components/utils/textVariables'
import { generateUri } from '@commerce/utils/uri-util'
import { SITE_NAME, SITE_ORIGIN_URL } from '@components/utils/constants'
import NextHead from 'next/head'
import { useRouter } from 'next/router'
import { STATIC_PAGE_CACHE_INVALIDATION_IN_MINS } from '@framework/utils/constants'
import { containsArrayData, getDataByUID, parseDataValue, setData } from '@framework/utils/redis-util'
import { Redis } from '@framework/utils/redis-constants'
import { logError } from '@framework/utils/app-util'
import { getSecondsInMinutes } from '@framework/utils/parse-util'
export default function CollectionList(props: any) {
  const router =useRouter();
  const css = { maxWidth: '100%', height: 'auto' }
  return (
    <>
      <NextHead>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="canonical" href={SITE_ORIGIN_URL + router.asPath} />
        <title>Collections</title>
        <meta name="title" content="Collections" />
        <meta name="description" content="Collections" />
        <meta name="keywords" content="Collections" />
        <meta property="og:image" content="" />
        <meta property="og:title" content="Collections" key="ogtitle" />
        <meta property="og:description" content="Collections" key="ogdesc" />
        <meta property="og:site_name" content={SITE_NAME} key="ogsitename" />
        <meta property="og:url" content={SITE_ORIGIN_URL + router.asPath}  key="ogurl" />
      </NextHead>
      <main className="container w-full mx-auto">
        <section aria-labelledby="products-heading" className="mt-8">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 uppercase">
            {SHOP_BY_COLLECTION}
          </h1>
          {props?.data.length > 0 && (
            <div className="grid grid-cols-2 py-10 sm:gap-y-10 gap-y-6 sm:grid-cols-4 gap-x-6 lg:grid-cols-6 xl:gap-x-8">
              {props.data.map((collection: any, key: any) => (
                <Link key={key} passHref href={`/collection/${collection.slug}`}>
                  <span key={collection.id} className="group">
                    <div className="relative w-full overflow-hidden bg-gray-100 rounded-lg aspect-w-1 aspect-h-1 sm:aspect-w-2 sm:aspect-h-3">
                      <div className="relative image-container">
                        <img src={ generateUri(collection.mainImage, 'h=1000&fm=webp') || IMG_PLACEHOLDER } alt={collection.name || 'image'} className="object-cover object-center w-full h-full group-hover:opacity-75 image" sizes="(max-width: 500px) 100px, (max-width: 1023px) 400px, 1000px" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h2 className="flex w-full pt-2 text-sm font-medium text-gray-900 sm:text-xl text-md">
                        {collection.name}
                      </h2>

                      <h4 className="w-full pt-1 text-xs font-normal text-gray-500 sm:text-sm">
                        {collection.noOfRecords}{' '}
                        <span className="italic">{PRODUCTS_AVAILABLE}</span>
                      </h4>
                    </div>
                  </span>
                </Link>
              ))}
            </div>
          )}
          {props?.data.length == 0 && (
            <>
              <div className="flex flex-col py-32 text-center">
                <h2 className="w-full mx-auto text-4xl font-bold text-gray-200">
                  No Collection Available
                </h2>
              </div>
            </>
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
  const collectionUID = Redis.Key.Collection
  const cachedData = await getDataByUID([ collectionUID ])
  let collectionUIDData: any = parseDataValue(cachedData, collectionUID) || []
  try {
    if (!containsArrayData(collectionUIDData)) {
      collectionUIDData = await getCollections()
      await setData([{ key: collectionUID, value: collectionUIDData }])
    }
    return {
      props: {
        data: collectionUIDData,
      },
      revalidate: getSecondsInMinutes(STATIC_PAGE_CACHE_INVALIDATION_IN_MINS)
    }
  } catch (error: any) {
    logError(error)

    let errorUrl = '/500'
    const errorData = error?.response?.data
    if (errorData?.errorId) {
      errorUrl = `${errorUrl}?errorId=${errorData.errorId}`
    }

    return {
      props: {
        data: collectionUIDData,
      },
      redirect: {
        destination: errorUrl,
        permanent: false,
      },
    }
  }
}
