import type { GetStaticPathsContext, GetStaticPropsContext } from 'next'
import { useRouter } from 'next/router'
import commerce from '@lib/api/commerce'
import ProductLayout from '@components/Layout/ProductLayout'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import { Cookie, STATIC_PAGE_CACHE_INVALIDATION_IN_MINS } from '@framework/utils/constants'
import { notFoundRedirect } from '@framework/utils/app-util'
import { getSecondsInMinutes, stringToNumber } from '@framework/utils/parse-util'
import { useTranslation } from '@commerce/utils/use-translation'
import ProductView from '@components/Product/ProductView'
import { IPagePropsProvider } from '@framework/contracts/page-props/IPagePropsProvider'
import { getPagePropType, PagePropType } from '@framework/page-props'
import { getPLPFilterSelection } from 'framework/utils/app-util'

export async function getStaticProps({ params, locale, locales, preview }: GetStaticPropsContext<{ slug: string; recordId: string }>) {
  const slug = params!?.slug[0]
  const props: IPagePropsProvider = getPagePropType({ type: PagePropType.PDP })
  const pageProps = await props.getPageProps({ slug, cookies: { [Cookie.Key.LANGUAGE]: locale } })

  if (pageProps?.notFound) {
    if (process.env.npm_lifecycle_event === 'build') {
      return {
        notFound: true
      }
    }
    return notFoundRedirect();
  }

  if (pageProps?.isRedirect) {
    return {
      redirect: {
        destination: pageProps?.redirect,
        permanent: false,
      },
    }
  }

  return {
    props: {
      ...pageProps,
    },
    revalidate: getSecondsInMinutes(STATIC_PAGE_CACHE_INVALIDATION_IN_MINS)
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
function Slug({ data, setEntities, recordEvent, slug, relatedProducts, availabelPromotions, allProductsByCategory, pdpLookbookProducts, pdpCachedImages, reviews, deviceInfo, config, campaignData, featureToggle, defaultDisplayMembership }: any) {
  const router = useRouter()
  const selectedFilters = getPLPFilterSelection()
  const translate = useTranslation()

  const productViewProps = {
    recordEvent,
    setEntities,
    data: data.product,
    slug,
    snippets: data?.snippets || [],
    relatedProducts,
    promotions: availabelPromotions,
    allProductsByCategory,
    pdpLookbookProducts,
    pdpCachedImages,
    reviews,
    deviceInfo,
    config,
    campaignData,
    featureToggle,
    defaultDisplayMembership,
    selectedFilters
  }

  return router.isFallback ? (
    <h1>{translate('common.message.loaderLoadingText')}</h1>
  ) : (
    data && (
      <ProductView {...productViewProps} />
    )
  )
}

Slug.ProductLayout = ProductLayout

export default withDataLayer(Slug, PAGE_TYPES.Product, true, ProductLayout)
