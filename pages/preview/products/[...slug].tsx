import type { GetStaticPathsContext, GetStaticPropsContext } from 'next'
import { useRouter } from 'next/router'
import commerce from '@lib/api/commerce'
import Layout from '@components/Layout/Layout'
import { ProductView } from '@components/Product'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import { maxBasketItemsCount } from '@framework/utils/app-util'
import { Cookie, STATIC_PAGE_CACHE_INVALIDATION_IN_200_SECONDS } from '@framework/utils/constants'
import { useTranslation } from '@commerce/utils/use-translation'
import { getPagePropType, PagePropType } from '@framework/page-props'
import { IPagePropsProvider } from '@framework/contracts/page-props/IPagePropsProvider'
import { serverSideMicrositeCookies } from '@commerce/utils/uri-util'

export async function getStaticProps({ params, locale, locales, preview }: GetStaticPropsContext<{ slug: string }>) {
  const props: IPagePropsProvider = getPagePropType({ type: PagePropType.PDP_PREVIEW })
  const cookies = serverSideMicrositeCookies(locale!)
  const pageProps = await props.getPageProps({ slug: params!.slug[0], cookies })

  return {
    props: {
      ...pageProps,
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
