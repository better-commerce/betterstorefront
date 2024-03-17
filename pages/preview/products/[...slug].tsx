import type { GetStaticPathsContext, GetStaticPropsContext } from 'next'
import { useRouter } from 'next/router'
import commerce from '@lib/api/commerce'
import { Layout } from '@components/common'
import { ProductView } from '@components/product'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import { maxBasketItemsCount } from '@framework/utils/app-util'
import { STATIC_PAGE_CACHE_INVALIDATION_IN_200_SECONDS } from '@framework/utils/constants'
import { useTranslation } from '@commerce/utils/use-translation'

export async function getStaticProps({ params, locale, locales, preview }: GetStaticPropsContext<{ slug: string }>) {
  let pdpCachedImages = null
  const productPromise = commerce.getProductPreview({ query: params!.slug[0] })
  const product = await productPromise

  const infraPromise = commerce.getInfra()
  const infra = await infraPromise

  try {
    if (product?.product?.productCode) {
      // GET SELECTED PRODUCT ALL REVIEWS
      const pdpCachedImagesPromise = commerce.getPdpCachedImage({
        query: product?.product?.productCode,
      })

      pdpCachedImages = await pdpCachedImagesPromise
    }
  } catch (error: any) {}

  return {
    props: {
      data: product,
      slug: params!.slug[0],
      globalSnippets: infra?.snippets ?? [],
      snippets: product?.snippets ?? [],
      pdpCachedImages: pdpCachedImages?.images
        ? JSON.parse(pdpCachedImages?.images)
        : [],
    },
    revalidate: STATIC_PAGE_CACHE_INVALIDATION_IN_200_SECONDS
  }
}

export async function getStaticPaths({ locales }: GetStaticPathsContext) {
  const { products } = await commerce.getAllProductPaths()
  let paths = products.map((product: any) => {
    if (!product.slug.includes('preview/')) {
      return `/preview/${product.slug}`
    } else return `/${product.slug}`
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
  pdpCachedImages,
  deviceInfo,
  config,
}: any) {
  const router = useRouter()
  const translate = useTranslation()
  return router.isFallback ? (
    <h1>{translate('common.message.loaderLoadingText')}</h1>
  ) : (
    data && (
      <ProductView
        recordEvent={recordEvent}
        setEntities={setEntities}
        data={data.product}
        slug={slug}
        snippets={data.snippets}
        isPreview={true}
        pdpCachedImages={pdpCachedImages}
        deviceInfo={deviceInfo}
        maxBasketItemsCount={maxBasketItemsCount(config)}
      />
    )
  )
}

Slug.Layout = Layout

export default withDataLayer(Slug, PAGE_TYPES.Product)
