import type { GetStaticPathsContext, GetStaticPropsContext } from 'next'
import { useRouter } from 'next/router'
import commerce from '@lib/api/commerce'
import { Layout } from '@components/common'
import { ProductView } from '@components/product'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import { LOADER_LOADING } from '@components/utils/textVariables'

export async function getStaticProps({
  params,
  locale,
  locales,
  preview,
  ...rest
}: GetStaticPropsContext<{ slug: any }>) {
  // const productPromise = commerce.getProduct({
  //   query: 'products/' + params!.slug[params!.slug.length - 1],
  // })

  //our format is /products/:path*/:id* which means path will be all the items until the last item which is the id
  //everytime you change next.config.js rewrites you have to adapt these functions to accomodate the new format
  const productIdFromSlug = params!.slug[params!.slug.length - 1]

  const productSlug = params!.slug.slice(0, params!.slug.length - 1)

  const rewrittenFormat = productSlug.join('/') + '/p/' + productIdFromSlug

  const productPromise = () =>
    commerce.getProduct({
      query: rewrittenFormat,
    })
  const product = await productPromise()
  return {
    props: {
      data: product,
      //we need to return the updated slug format
      // slug: params!.slug[0],
      slug: rewrittenFormat,
    },
    revalidate: 200,
  }
}

export async function getStaticPaths({ locales }: GetStaticPathsContext) {
  const { products } = await commerce.getAllProductPaths()
  let paths = products.map((product: any) => {
    if (!product.slug.includes('products/')) {
      return `/products/${product.slug}`
    } else return `/${product.slug}`
  })
  return {
    paths: paths,
    fallback: 'blocking',
  }
}

function Slug({ data, setEntities, recordEvent, slug }: any) {
  const router = useRouter()
  return router.isFallback ? (
    <h1>{LOADER_LOADING}</h1>
  ) : (
    data && (
      <ProductView
        recordEvent={recordEvent}
        setEntities={setEntities}
        data={data.product}
        slug={slug}
        snippets={data.snippets}
      />
    )
  )
}

Slug.Layout = Layout

export default withDataLayer(Slug, PAGE_TYPES.Product)
