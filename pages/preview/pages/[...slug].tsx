import dynamic from 'next/dynamic'
import NextHead from 'next/head'
import Image from 'next/image'
import { isEmpty } from 'lodash'
import { useRouter } from 'next/router'
import { EmptyObject, PAGE_PREVIEW_CONTENT_ENDPOINT, SITE_ORIGIN_URL, } from '@components/utils/constants'
import { BETTERCMS_BASE_URL } from '@framework/utils/constants'
import fetcher from '@framework/fetcher'
import { Layout } from '@components/common'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import { maxBasketItemsCount } from '@framework/utils/app-util'
import { IMG_PLACEHOLDER } from '@components/utils/textVariables'
import os from 'os'
import commerce from '@lib/api/commerce'
import { Hero } from '@components/ui'
const PromotionBanner = dynamic(
  () => import('@components/home/PromotionBanner')
)
import BestSellerProduct from '@components/product/BestSellerProduct'
const Heading = dynamic(() => import('@components/home/Heading'))
const Categories = dynamic(() => import('@components/home/Categories'))
const Collections = dynamic(() => import('@components/home/Collections'))
const ProductSlider = dynamic(() => import('@components/home/ProductSlider'))
const Loader = dynamic(() => import('@components/ui/LoadingDots'))

const PAGE_TYPE = PAGE_TYPES.Home
function PreviewPage({ slug, pageContents, dealOfTheWeekProductPromoDetails, deviceInfo, config }: any) {
  const router = useRouter()
  const pageSlugClass = pageContents?.slug === "cookies" ? "companyCke-text" : "";
  return (
    <>
      {(pageContents?.metatitle ||
        pageContents?.metadescription ||
        pageContents?.metakeywords) && (
          <NextHead>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1, maximum-scale=5"
            />
            <link
              rel="canonical"
              id="canonical"
              href={pageContents?.canonical || SITE_ORIGIN_URL + router.asPath}
            />
            <title>{pageContents?.metatitle || 'Home'}</title>
            <meta name="title" content={pageContents?.metatitle || 'Home'} />
            {pageContents?.metadescription && (
              <meta name="description" content={pageContents?.metadescription} />
            )}
            {pageContents?.metakeywords && (
              <meta name="keywords" content={pageContents?.metakeywords} />
            )}
            <meta property="og:image" content={pageContents?.image} />
            {pageContents?.metatitle && (
              <meta
                property="og:title"
                content={pageContents?.metatitle}
                key="ogtitle"
              />
            )}
            {pageContents?.metadescription && (
              <meta
                property="og:description"
                content={pageContents?.metadescription}
                key="ogdesc"
              />
            )}
          </NextHead>
        )}

      
      <div className='mb-6'><Hero banners={pageContents?.banners} deviceInfo={deviceInfo} /></div>
      <div className='container mx-auto'>
        <div className='flex flex-col'>
          <BestSellerProduct products={pageContents?.products} deviceInfo={deviceInfo} maxBasketItemsCount={maxBasketItemsCount(config)} />
        </div>
        <div className='flex flex-col'>
          {pageContents?.listdata?.length > 0 && pageContents?.listdata?.map((data: any, dataIdx: number) => (
            <div key={dataIdx} className={`grid grid-cols-1 gap-0 mb-10 sm:mb-20 sm:grid-cols-12 ${dataIdx % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
              <div className={`sm:p-10 p-4 bg-header-color sm:col-span-6 ${dataIdx % 2 === 0 ? 'sm:order-1 order-2' : 'sm:order-2 order-2'}`}>
                <h2 className='font-semibold text-white'>{data?.listdata_title}</h2>
                <div className="px-0 py-4 text-white sm:py-10 font-16 list-para" dangerouslySetInnerHTML={{ __html: data?.listdata_description }} />
              </div>
              <div className={`sm:col-span-6 ${dataIdx % 2 === 0 ? 'sm:order-2 order-1' : 'sm:order-1 order-1'}`}>
                <img src={data?.listdata_image} className='object-cover w-full h-full' alt={`Image ${dataIdx + 1}`} />
              </div>
            </div>
          ))}
        </div>

      </div>
    </>
  )
}
export async function getServerSideProps(context: any) {
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
      slug: slug,
      pageContents: pageContents || {},
      dealOfTheWeekProductPromoDetails,
    }, // will be passed to the page component as props
  }
}

PreviewPage.Layout = Layout
export default withDataLayer(PreviewPage, '')
