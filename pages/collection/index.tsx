import type { GetStaticPathsContext, GetStaticPropsContext } from 'next'
import getCollections from '@framework/api/content/getCollections'
import { Layout } from '@components/common'
import Link from 'next/link'

export default function CollectionList(props: any) {
  
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
      <section aria-labelledby="products-heading" className="mt-8">
        <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
          Shop by Collection
        </h2>

        <div className="py-10 grid grid-cols-2 sm:gap-y-10 gap-y-6 sm:grid-cols-4 gap-x-6 lg:grid-cols-5 xl:gap-x-8">
          {props.data.map((collection: any, key: any) => (
            <Link key={key} href={`/collection/${collection.slug}`}>
              <a
                key={collection.id}
                href={`/collection/${collection.slug}`}
                className="group"
              >
                <div className="relative w-full aspect-w-1 aspect-h-1 rounded-lg overflow-hidden sm:aspect-w-2 sm:aspect-h-3">
                  <img
                    src={
                      collection.mainImage ||
                      'https://tailwindui.com/img/ecommerce-images/category-page-01-image-card-01.jpg'
                    }
                    // alt={collection.imageAlt}
                    className="w-full h-full object-center object-cover group-hover:opacity-75"
                  />                 
                </div>
                <div className='flex-1'>
                   <h1
                    className="pt-2 text-gray-900 font-medium sm:text-xl text-md flex w-full"
                  >
                    {collection.name}
                  </h1>

                   <h4
                    className="pt-1 text-gray-500 font-normal sm:text-sm text-xs w-full"
                  >
                    {collection.noOfRecords}{' '} <span className='italic'>Products available</span>
                  </h4>
                </div>
              </a>
            </Link>
          ))}
        </div>
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
