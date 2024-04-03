import dynamic from 'next/dynamic'
import NextHead from 'next/head'
import { useRouter } from 'next/router'
import { BETTERCOMMERCE_DEFAULT_LANGUAGE, EmptyObject, PAGE_PREVIEW_CONTENT_ENDPOINT, SITE_ORIGIN_URL, } from '@components/utils/constants'
import { BETTERCMS_BASE_URL } from '@framework/utils/constants'
import fetcher from '@framework/fetcher'
import Layout from '@components/Layout/Layout'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import commerce from '@lib/api/commerce'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from '@commerce/utils/use-translation'
import { removeQueryString } from '@commerce/utils/uri-util'
const SectionHero2 = dynamic(() => import('@components/SectionHero/SectionHero2'))
const DiscoverMoreSlider = dynamic(() => import('@components/DiscoverMoreSlider'))
const SectionSliderProductCard = dynamic(() => import('@components/SectionSliderProductCard'))
const BackgroundSection = dynamic(() => import('@components/BackgroundSection/BackgroundSection'))
const SectionSliderLargeProduct = dynamic(() => import('@components/SectionSliderLargeProduct'))
const SectionSliderCategories = dynamic(() => import('@components/SectionSliderCategories/SectionSliderCategories'))
const SectionPromo3 = dynamic(() => import('@components/SectionPromo3'))
const PAGE_TYPE = PAGE_TYPES.Home
function PreviewPage({ slug, pageContents, dealOfTheWeekProductPromoDetails, deviceInfo, config }: any) {
  const router = useRouter()
  const translate = useTranslation()
  const cleanPath = removeQueryString(router.asPath)
  const pageSlugClass = pageContents?.slug === "cookies" ? "companyCke-text" : "";
  return (
    <>
      {(pageContents?.metatitle || pageContents?.metadescription || pageContents?.metakeywords) && (
        <NextHead>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
          <link rel="canonical" id="canonical" href={SITE_ORIGIN_URL + cleanPath} />
          <title>{pageContents?.metatitle || translate('common.label.homeText')}</title>
          <meta name="title" content={pageContents?.metatitle || translate('common.label.homeText')} />
          {pageContents?.metadescription && (
            <meta name="description" content={pageContents?.metadescription} />
          )}
          {pageContents?.metakeywords && (
            <meta name="keywords" content={pageContents?.metakeywords} />
          )}
          <meta property="og:image" content={pageContents?.image} />
          {pageContents?.metatitle && (
            <meta property="og:title" content={pageContents?.metatitle} key="ogtitle" />
          )}
          {pageContents?.metadescription && (
            <meta property="og:description" content={pageContents?.metadescription} key="ogdesc" />
          )}
        </NextHead>
      )}

      <div className="relative overflow-hidden nc-PageHome">
        <SectionHero2 data={pageContents?.banner} />
        <div className="mt-24 lg:mt-32">
          <DiscoverMoreSlider heading={pageContents?.categoryheading} data={pageContents?.category} />
        </div>
        <div className="container relative my-24 space-y-24 lg:space-y-32 lg:my-32">
          <SectionSliderProductCard data={pageContents?.newarrivals} heading={pageContents?.newarrivalheading} />
          <div className="relative py-16 lg:py-20">
            <BackgroundSection />
            <SectionSliderCategories data={pageContents?.departments} heading={pageContents?.departmentheading} />
          </div>
          <SectionSliderLargeProduct data={pageContents?.newlookbook} heading={pageContents?.lookbookheading} cardStyle="style2" />
          <SectionPromo3 data={pageContents?.subscription} />
        </div>
      </div>
    </>
  )
}
export async function getServerSideProps(context: any) {
  const { locale } = context
  const slug = context.query.slug
  const { result: pageContents }: any = await fetcher({
    url: `${PAGE_PREVIEW_CONTENT_ENDPOINT}`,
    method: 'get',
    params: { id: '', slug: slug.join('/'), workingVersion: true, cachedCopy: false },
    headers: {
      DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID,
    },
    baseUrl: BETTERCMS_BASE_URL,
  })

  let dealOfTheWeekProductPromoDetails: any = EmptyObject
  if (pageContents) {
    const dealOfTheWeekProducts = pageContents?.featureproduct
    if (dealOfTheWeekProducts?.length && dealOfTheWeekProducts[0]?.recordId) {
      dealOfTheWeekProductPromoDetails = await commerce.getProductPromos({ query: dealOfTheWeekProducts[0]?.recordId, cookies: {} })
    }
  }

  return {
    props: {
      ...(await serverSideTranslations(locale ?? BETTERCOMMERCE_DEFAULT_LANGUAGE!)),
      slug: slug,
      pageContents: pageContents || {},
      dealOfTheWeekProductPromoDetails,
    }, // will be passed to the page component as props
  }
}

PreviewPage.Layout = Layout
export default withDataLayer(PreviewPage, '')
