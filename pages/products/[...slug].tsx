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
}: GetStaticPropsContext<{ slug: string; recordId: string }>) {
  let product = null,
    reviews = null,
    relatedProducts = null,
    pdpLookbook = null,
    pdpCachedImages = null
  let availabelPromotions = null
  let pdpLookbookProducts = {}

  try {
    const productPromise = commerce.getProduct({ query: params!?.slug[0] })
    product = await productPromise

    const availabelPromotionsPromise = commerce.getProductPromos({
      query: product?.product?.recordId,
    })
    availabelPromotions = await availabelPromotionsPromise

    const relatedProductsPromise = commerce.getRelatedProducts({
      query: product?.product?.recordId,
    })
    relatedProducts = await relatedProductsPromise

    // relatedProducts)

    const reviewPromise = commerce.getProductReview({
      query: product?.product?.recordId,
    })
    reviews = await reviewPromise

    // GET SELECTED PRODUCT ALL REVIEWS
    const pdpLookbookPromise = commerce.getPdpLookbook({
      query: product?.product?.stockCode,
    })

    pdpLookbook = await pdpLookbookPromise

    if (pdpLookbook?.lookbooks?.length > 0) {
      // GET SELECTED PRODUCT ALL REVIEWS
      const pdpLookbookProductsPromise = commerce.getPdpLookbookProduct({
        query: pdpLookbook?.lookbooks[0]?.slug,
      })
      pdpLookbookProducts = await pdpLookbookProductsPromise
    }

    try {
      if (product?.product?.productCode) {
        // GET SELECTED PRODUCT ALL REVIEWS
        const pdpCachedImagesPromise = commerce.getPdpCachedImage({
          query: product?.product?.productCode,
        })

        pdpCachedImages = await pdpCachedImagesPromise
      }
    } catch (imageE) {}
  } catch (error: any) {}

  const infraPromise = commerce.getInfra()
  const infra = await infraPromise
  return {
    props: {
      data: product,
      slug: params!.slug[0],
      globalSnippets: infra?.snippets ?? [],
      snippets: product?.snippets,
      relatedProducts: relatedProducts,
      availabelPromotions: availabelPromotions,
      reviews: reviews,
    },
    revalidate: 200,
  }
}

export async function getStaticPaths({ locales }: GetStaticPathsContext) {
  const { products } = await commerce.getAllProductPaths()
  let paths = products?.map((product: any) => {
    if (!product?.slug?.includes('products/')) {
      return `/products/${product?.slug}`
    } else return `/${product?.slug}`
  })
  return {
    paths: paths,
    fallback: 'blocking',
  }
}

function Slug({
  data,
  setEntities,
  recordEvent,
  slug,
  relatedProducts,
  availabelPromotions,
  pdpLookbookProducts,
  pdpCachedImages,
  reviews,
  deviceInfo,
}: any) {
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
        relatedProducts={relatedProducts}
        promotions={availabelPromotions}
        pdpLookbookProducts={pdpLookbookProducts}
        pdpCachedImages={pdpCachedImages}
        reviews={reviews}
        deviceInfo={deviceInfo}
      />
    )
  )
}

Slug.Layout = Layout

export default withDataLayer(Slug, PAGE_TYPES.Product)
