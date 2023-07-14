import type { GetStaticPathsContext, GetStaticPropsContext } from 'next'
import getCollections from '@framework/api/content/getCollections'
import { Layout } from '@components/common'
import Link from 'next/link'
import Image from 'next/image'
import {
  IMG_PLACEHOLDER,
  PRODUCTS_AVAILABLE,
  SHOP_BY_COLLECTION,
} from '@components/utils/textVariables'
import { generateUri } from '@commerce/utils/uri-util'
export default function CollectionList(props: any) {
  const css = { maxWidth: '100%', height: 'auto' }
  return (
    <main className="w-full px-6 mx-auto md:w-4/5 sm:px-4">
      <section aria-labelledby="products-heading" className="mt-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 uppercase">
          {SHOP_BY_COLLECTION}
        </h2>
        {props?.data.length > 0 && (
          <div className="grid grid-cols-2 py-10 sm:gap-y-10 gap-y-6 sm:grid-cols-4 gap-x-6 lg:grid-cols-6 xl:gap-x-8">
            {props.data.map((collection: any, key: any) => (
              <Link key={key} passHref href={`/collection/${collection.slug}`}>
                <span key={collection.id} className="group">
                  <div className="relative w-full overflow-hidden bg-gray-100 rounded-lg aspect-w-1 aspect-h-1 sm:aspect-w-2 sm:aspect-h-3">
                    <div className="image-container">
                      <Image
                        src={
                          generateUri(collection.mainImage, 'h=1000&fm=webp') ||
                          IMG_PLACEHOLDER
                        }
                        alt={collection.name}
                        className="object-cover object-center w-full h-full group-hover:opacity-75 image"
                        fill
                      ></Image>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h1 className="flex w-full pt-2 font-medium text-gray-900 sm:text-xl text-md text-sm">
                      {collection.name}
                    </h1>

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
  )
}

CollectionList.Layout = Layout

export async function getStaticProps({
  params,
  locale,
  locales,
  preview,
}: GetStaticPropsContext) {
  const collectionData = await getCollections()
  return {
    props: {
      data: collectionData,
    },
    revalidate: 200,
  }
}
