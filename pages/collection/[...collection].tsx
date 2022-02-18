import type { GetStaticPathsContext, GetStaticPropsContext } from 'next'
import getCollections from '@framework/api/content/getCollections'
import { Layout } from '@components/common'
import Link from 'next/link'
import getCollectionBySlug from '@framework/api/content/getCollectionBySlug'
import ProductFilterRight from '@components/product/Filters/filtersRight'
import ProductFiltersTopBar from '@components/product/Filters/FilterTopBar'
import ProductGrid from '@components/product/Grid'
import { data } from 'autoprefixer'

export default function CollectionPage(props: any) {
  const handleFilters = () => {}

  return (
    <main className="pb-24">
      <div className="text-center py-16 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
          {props.name}
        </h1>
        <h1 className="text-xl mt-2 font-bold tracking-tight text-gray-500">
          {props.products.total} results
        </h1>
      </div>
      <div className="grid grid-cols-12 gap-1 max-w-7xl mx-auto overflow-hidden sm:px-6 lg:px-8">
        {props.allowFaucets && (
          <div className="col-span-3">
            <ProductFilterRight
              handleFilters={handleFilters}
              products={props.products}
              routerFilters={{}}
            />
          </div>
        )}
        <div className="col-span-9">
          <ProductGrid
            products={props.products}
            currentPage={props.currentPage}
            handlePageChange={() => {}}
            handleInfiniteScroll={() => {}}
          />
        </div>
        <div></div>
      </div>
    </main>
  )
}

CollectionPage.Layout = Layout

export async function getStaticProps({ params }: any) {
  const slug: any = params!.collection
  const data = await getCollectionBySlug(slug[0])
  return {
    props: {
      ...data,
    },
    revalidate: 60,
  }
}

export async function getStaticPaths() {
  const data = await getCollections()
  return {
    paths: data
      .map((col: any) => {
        if (col.slug) {
          return `/collection/${col.slug}`
        }
      })
      .filter((i: any) => !!i),
    fallback: 'blocking',
  }
}
