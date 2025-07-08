import type { GetStaticPathsContext, GetStaticPropsContext } from 'next'
import { useRouter } from 'next/router'
import commerce from '@lib/api/commerce'
import ProductLayout from '@components/Layout/ProductLayout'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import { STATIC_PAGE_CACHE_INVALIDATION_IN_MINS } from '@framework/utils/constants'
import { notFoundRedirect } from '@framework/utils/app-util'
import { getSecondsInMinutes } from '@framework/utils/parse-util'
import { useTranslation } from '@commerce/utils/use-translation'
import { IPagePropsProvider } from '@framework/contracts/page-props/IPagePropsProvider'
import { getPagePropType, PagePropType } from '@framework/page-props'
import { getPLPFilterSelection } from 'framework/utils/app-util'
import { serverSideMicrositeCookies } from '@commerce/utils/uri-util'
import UsedProductView from '@components/Product/UsedProductView'

export async function getStaticProps({ params, locale, locales, preview }: GetStaticPropsContext<{ slug: string; recordId: string }>) {
  const slug = params!?.slug[0]
  const props: IPagePropsProvider = getPagePropType({ type: PagePropType.PDP })
  const cookies = serverSideMicrositeCookies(locale!)
  const pageProps = await props.getPageProps({ slug, cookies })

  if (pageProps?.notFound) {
    return {
      notFound: true,
      revalidate: getSecondsInMinutes(STATIC_PAGE_CACHE_INVALIDATION_IN_MINS),
    }
  }

  if (pageProps?.isRedirect) {
    return {
      redirect: {
        destination: pageProps?.redirect,
        permanent: false,
      },
      revalidate: getSecondsInMinutes(STATIC_PAGE_CACHE_INVALIDATION_IN_MINS),
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
      return `/used/${product?.slug}`
    } else return `/used/${product?.slug}`
  })
  return {
    paths: paths,
    fallback: 'blocking',
  }
}
function Slug({ data, setEntities, recordEvent, slug, relatedProducts, deviceInfo, config, featureToggle, defaultDisplayMembership }: any) {
  const router = useRouter()
  const selectedFilters = getPLPFilterSelection()
  const translate = useTranslation()

  const usedProductViewProps = {
    recordEvent,
    setEntities,
    data: data?.product,
    slug,
    snippets: data?.snippets || [],
    relatedProducts,
    deviceInfo,
    config,
    featureToggle,
    defaultDisplayMembership,
    selectedFilters
  }

  return router.isFallback ? (
    <h1>{translate('common.message.loaderLoadingText')}</h1>
  ) : (
    data && (
      <UsedProductView {...usedProductViewProps} />
    )
  )
}

Slug.ProductLayout = ProductLayout

export default withDataLayer(Slug, PAGE_TYPES.Product, true, ProductLayout)
