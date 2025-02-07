import dynamic from 'next/dynamic'
import NextHead from 'next/head'
import { useRouter } from 'next/router'
import { CURRENT_THEME, EmptyObject, PAGE_PREVIEW_CONTENT_ENDPOINT, SITE_ORIGIN_URL, } from '@components/utils/constants'
import { BETTERCMS_BASE_URL } from '@framework/utils/constants'
import fetcher from '@framework/fetcher'
import Layout from '@components/Layout/Layout'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import { maxBasketItemsCount, sanitizeRelativeUrl } from '@framework/utils/app-util'
import commerce from '@lib/api/commerce'
import { Hero } from '@components/ui'
const PromotionBanner = dynamic(
  () => import('@components/home/PromotionBanner')
)
import { useTranslation } from '@commerce/utils/use-translation'
import { IPagePropsProvider } from '@framework/contracts/page-props/IPagePropsProvider'
import { getPagePropType, PagePropType } from '@framework/page-props'
import Link from 'next/link'
import { generateUri, removeQueryString } from '@commerce/utils/uri-util'
import { IMG_PLACEHOLDER } from '@components/utils/textVariables'
import SectionHero2 from '@components/SectionHero/SectionHero2'
import DiscoverMoreSlider from '@components/DiscoverMoreSlider'
import SectionSliderProductCard from '@components/SectionSliderProductCard'
import SectionBrandCard from '@components/SectionBrandCard'
import BackgroundSection from '@components/BackgroundSection/BackgroundSection'
import SectionSliderCategories from '@components/SectionSliderCategories/SectionSliderCategories'
import SectionSliderLargeProduct from '@components/SectionSliderLargeProduct'
import { useEffect, useRef, useState } from 'react'
import Glide from '@glidejs/glide'
const Heading = dynamic(() => import('@components/home/Heading'))
const ContentEditorJS = dynamic(() => import("@components/content-editor"), {
  ssr: false,
});
const Loader = dynamic(() => import('@components/ui/LoadingDots'))

const PAGE_TYPE = PAGE_TYPES.Home
function PreviewPage({ slug, pageContents, dealOfTheWeekProductPromoDetails, deviceInfo, config, featureToggle, defaultDisplayMembership }: any) {
  const router = useRouter()
  const translate = useTranslation()
  const pageSlugClass = pageContents?.slug === "cookies" ? "companyCke-text" : "";
  const sliderRef = useRef(null);
  const [isShow, setIsShow] = useState(false);
  useEffect(() => {
    const OPTIONS: Partial<Glide.Options> = {
      perView: 6, gap: 16, bound: true,
      breakpoints: {
        1280: { gap: 16, perView: 6, },
        1279: { gap: 16, perView: 6, },
        1023: { gap: 16, perView: 5, },
        768: { gap: 16, perView: 4, },
        500: { gap: 16, perView: 1.5, },
      },
    };
    if (!sliderRef.current) return;

    let slider = new Glide(sliderRef.current, OPTIONS);
    slider.mount();
    setIsShow(true);
    return () => {
      slider.destroy();
    };
  }, [sliderRef]);
  const cleanPath = removeQueryString(router.asPath)
  return (
    <>
      {(pageContents?.metatitle || pageContents?.metadescription || pageContents?.metakeywords) && (
        <NextHead>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
          <link rel="canonical" id="canonical" href={pageContents?.canonical || SITE_ORIGIN_URL + cleanPath} />
          <title>{pageContents?.metatitle || translate('common.label.homeText')}</title>
          <meta name="title" content={pageContents?.metatitle || translate('common.label.homeText')} />
          {pageContents?.metadescription && (<meta name="description" content={pageContents?.metadescription} />)}
          {pageContents?.metakeywords && (<meta name="keywords" content={pageContents?.metakeywords} />)}
          <meta property="og:image" content={pageContents?.image} />
          {pageContents?.metatitle && (<meta property="og:title" content={pageContents?.metatitle} key="ogtitle" />)}
          {pageContents?.metadescription && (<meta property="og:description" content={pageContents?.metadescription} key="ogdesc" />)}
        </NextHead>
      )}
      <div className="relative overflow-hidden nc-PageHome homepage-main dark:bg-white">
        {CURRENT_THEME === 'cam' ? <Hero banners={pageContents?.banner} deviceInfo={deviceInfo} /> : <SectionHero2 data={pageContents?.banner} />}
        {pageContents?.about?.length > 0 && pageContents?.about?.map((data: any, dataIdx: number) => (
          <div key={dataIdx} className='container relative flex flex-col pt-10 mt-0 mb-7 sm:mb-8 lg:mb-12'>
            <div className='grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-60'>
              <div className='flex flex-col justify-center text-center'>
                <h3 className='text-4xl font-semibold text-orange-500'>{data?.about_title}</h3>
                <div className='pt-4 text-xl font-normal text-black sm:pt-6 cms-para' dangerouslySetInnerHTML={{ __html: data?.about_description }}></div>
              </div>
              <div className='flex flex-col sm:p-10'>
                <img alt={data?.about_title} src={generateUri(data?.about_image, 'h=500&fm=webp') || IMG_PLACEHOLDER} className='object-cover object-top w-full h-full rounded-xl' />
              </div>
            </div>
          </div>
        ))}
        {pageContents?.allcategories?.length > 0 &&
          <div className='container relative flex flex-col pt-10 mt-0 mb-7 sm:mb-8 lg:mb-12'>
            <div className='grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6'>
              {pageContents?.allcategories?.map((data: any, dataIdx: number) => (
                <div className='flex flex-col justify-center p-4 text-center rounded-lg shadow-md hover:bg-white hover:shadow-xl bg-slate-50' key={`data-${dataIdx}`}>
                  <div className='h-60'>
                    <img alt={data?.allcategories_name} src={generateUri(data?.allcategories_image, 'h=300&fm=webp') || IMG_PLACEHOLDER} className='object-cover object-top w-full h-60 rounded-xl' />
                  </div>
                  <Link href={data?.allcategories_link} className='flex items-center justify-center w-full font-semibold text-orange-500 h-14 text-md'>{data?.allcategories_name}</Link>
                </div>
              ))}
            </div>
          </div>
        }
        {pageContents?.brandheading?.length > 0 &&
          <div className='container relative flex flex-col pt-10 mt-0 mb-1 sm:mb-1'>
            <div className='grid justify-center grid-cols-1 sm:grid-cols-1'>
              {pageContents?.brandheading?.map((data: any, dataIdx: number) => (
                <h4 key={dataIdx} className='text-3xl font-semibold text-center text-black'>{data?.brandheading_title}</h4>
              ))}
            </div>
          </div>
        }
        {pageContents?.allbrands?.length > 0 &&
          <div className='container relative flex flex-col pt-10 mt-0 mb-7 sm:mb-8 lg:mb-12'>
            <div className='grid grid-cols-2 gap-4 sm:grid-cols-6 sm:gap-6'>
              {pageContents?.allbrands?.map((data: any, dataIdx: number) => (
                <div className='flex flex-col justify-center p-4 text-center bg-white rounded-lg shadow-md hover:shadow-xl' key={`data-${dataIdx}`}>
                  <div className='h-32'>
                    <img alt={data?.allbrands_name} src={generateUri(data?.allbrands_image, 'h=300&fm=webp') || IMG_PLACEHOLDER} className='object-cover object-center w-full h-32 rounded-xl' />
                  </div>
                </div>
              ))}
            </div>
          </div>
        }
        {pageContents?.promotionbanner != "" && CURRENT_THEME == 'etag' &&
          <div className='flex flex-col pt-10 mt-0'>
            <img alt="Banner" src={generateUri(pageContents?.promotionbanner, 'h=400&fm=webp') || IMG_PLACEHOLDER} className='object-cover object-center w-full h-full' />
          </div>
        }
        {pageContents?.shopbygender?.length > 0 &&
          <div className='container relative flex flex-col pt-10 mt-0 sm:mt-24 mb-7 sm:mb-8 lg:mb-12'>
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
              {pageContents?.shopbygender?.map((item: any, itemIdx: number) => (
                <div key={`banner-${itemIdx}`}>
                  <Link href={sanitizeRelativeUrl(`/${item?.link}`)} passHref legacyBehavior>
                    <a className='relative flex flex-col items-center justify-center w-full image-overlay-container rounded-xl'>
                      <img alt={item?.title} src={generateUri(item?.url, 'h=1000&fm=webp') || IMG_PLACEHOLDER} className='object-cover object-top w-full h-full rounded-xl' />
                      <div className='absolute z-10 flex flex-col justify-center space-y-2 text-center top-1/2'>
                        <span className='font-bold text-white sm:text-5xl'>{item?.title}</span>
                        <span className='font-semibold text-white sm:text-xl'>Shop Now</span>
                      </div>
                    </a>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        }

        {pageContents?.shopbycategory?.length > 0 &&
          <div className={`nc-SectionSliderProductCard product-card-slider container pl-4 sm:pl-0 sm:mt-8 sm:pt-8 pt-4 relative`}>
            <div ref={sliderRef} className={`flow-root ${isShow ? "" : "invisible"}`}>
              {pageContents?.shopbycategoryheading?.map((h: any, iIdx: number) => (
                <Heading key={iIdx} className="mb-4 lg:mb-6 text-neutral-900 dark:text-neutral-50" desc="" rightDescText={h?.shopbycategoryheading_subtitle} hasNextPrev >
                  {h?.shopbycategoryheading_title}
                </Heading>
              ))}
              <div className="glide__track" data-glide-el="track">
                <ul className="glide__slides">
                  {pageContents?.shopbycategory?.map((item: any, index: number) => (
                    <li key={index} className={`glide__slide product-card-item home-product-card`}>
                      <Link href={sanitizeRelativeUrl(`/${item?.link}`)}>
                        <div className='relative flex flex-col rounded-lg'>
                          <img alt={item?.title} src={generateUri(item?.url, 'h=450&fm=webp') || IMG_PLACEHOLDER} className='object-cover object-top w-full rounded-lg h-96' />
                          <span className='absolute flex flex-col w-full px-2 py-4 space-y-2 text-center text-white rounded bg-red-600/80 bottom-2 left-2 image-name-overlay'>
                            <span className='text-lg font-semibold sm:text-xl'>{item?.title}</span>
                            <span className='text-2xl font-semibold sm:text-3xl'>{item?.description}</span>
                            <span>Shop Now</span>
                          </span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        }
        {featureToggle?.features?.enableCategory && pageContents?.category?.length > 0 &&
          <div className='flex flex-col justify-center gap-4 py-6 text-center bg-white sm:py-10'>
            <div className='container flex flex-col justify-center gap-4 mx-auto text-center'>
              {pageContents?.categoryheading?.length > 0 && pageContents?.categoryheading?.map((heading: any, hIdx: number) => (
                <h3 className='mb-4 text-xl font-semibold sm:text-3xl text-sky-700 sm:mb-6' key={`heading-${hIdx}`}>{heading?.categoryheading_title}</h3>
              ))}
              <div className='grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-6'>
                {pageContents?.category?.map((item: any, itemIdx: number) => (
                  <Link href={item?.category_link} passHref
                    className='flex flex-col gap-5 p-2 bg-white border border-gray-200 rounded shadow sm:p-6 group hover:border-gray-400 zoom-section'
                    key={`category-${itemIdx}`}
                  >
                    <div className='flex flex-col w-full'>
                      <img src={generateUri(item?.category_image, 'h=400&fm=webp') || IMG_PLACEHOLDER} alt={item?.category_title} className='w-full h-full' />
                    </div>
                    <div className='flex flex-col gap-5'>
                      <h3 className='flex items-center justify-center w-full h-10 p-1 text-xs font-medium text-center text-white uppercase bg-red-700 rounded sm:h-auto sm:p-2 sm:text-sm'>
                        {item?.category_title}
                      </h3>
                      <p className='text-xs font-normal text-black sm:text-sm sm:min-h-16 min-h-16'>
                        {item?.category_subtitle}
                      </p>
                    </div>
                    <div className='items-end justify-center flex-1'>
                      <div className='px-6 py-2 text-xs font-medium text-white uppercase rounded sm:py-3 sm:text-sm bg-sky-600 group-hover:bg-sky-500'>
                        {item?.category_buttontext}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        }
        {pageContents?.bannerimage && pageContents?.bannerimage != "" &&
          <div className='flex flex-col w-full'>
            <img src={pageContents?.bannerimage} className='w-full h-full' alt='Promotion' />
          </div>
        }
        {pageContents?.brandcategory?.length > 0 &&
          <div className='flex flex-col justify-center gap-4 py-6 text-center bg-gray-50 sm:py-10'>
            <div className='container grid grid-cols-2 gap-2 mx-auto sm:grid-cols-4 sm:gap-6'>
              {pageContents?.brandcategory?.map((item: any, itemIdx: number) => (
                <Link href={item?.brandcategory_link} passHref className='flex flex-col gap-5 p-2 bg-white border border-gray-200 rounded shadow sm:p-6 group hover:border-gray-400 zoom-section' key={`brand-category-${itemIdx}`}>
                  <div className='flex flex-col w-full'>
                    <img src={generateUri(item?.brandcategory_image, 'h=400&fm=webp') || IMG_PLACEHOLDER} alt={item?.brandcategory_title} className='w-full h-full' />
                  </div>
                  <div className='flex flex-col gap-5'>
                    <h3 className='flex items-center justify-center w-full h-10 p-1 text-xs font-medium text-center text-white uppercase bg-red-700 rounded'>{item?.brandcategory_title}</h3>
                    <p className='text-xs font-normal text-black sm:text-sm sm:min-h-16 min-h-16'>{item?.brandcategory_subtitle}</p>
                  </div>
                  <div className='items-end justify-center flex-1'>
                    <div className='px-6 py-2 text-xs font-medium text-white uppercase rounded sm:py-3 sm:text-sm bg-sky-600 group-hover:bg-sky-500'>
                      {item?.brandcategory_buttontext}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        }
        {pageContents?.promobanner && pageContents?.promobanner != "" &&
          <div className='flex flex-col w-full'>
            <img src={pageContents?.promobanner} className='w-full h-full' alt='Promotion' />
          </div>
        }

        {pageContents?.brands?.length > 0 &&
          <div className='flex flex-col w-full py-6 bg-gray-50 sm:py-10'>
            <div className='container flex flex-col gap-4 mx-auto'>
              {pageContents?.brandheading?.length > 0 && pageContents?.brandheading?.map((heading: any, hIdx: number) => (
                <h3 className='mb-4 text-xl font-semibold text-center uppercase sm:text-3xl text-sky-700 sm:mb-6' key={hIdx}>{heading?.brandheading_title}</h3>
              ))}
              <div className='grid items-center grid-cols-4 gap-4 text-center'>
                {pageContents?.brands?.map((item: any, itemIdx: number) => (
                  <Link href={item?.brands_link} passHref key={`brands-${itemIdx}`} className='flex flex-col items-center justify-center text-center w-ful'>
                    <img src={generateUri(item?.brands_image, 'h=300&fm=webp') || IMG_PLACEHOLDER} alt={item?.brands_name} className='w-full h-auto p-0 sm:p-10' />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        }
        {featureToggle?.features?.enableTrendingCategory &&
          <div className="mt-14 sm:mt-24 lg:mt-32">
            <DiscoverMoreSlider heading={pageContents?.categoryheading} data={pageContents?.category} />
          </div>
        }
        {pageContents?.range?.length > 0 && pageContents?.range?.map((heading: any, hIdx: number) => (
          <div className='container flex flex-col pt-5 mx-auto bg-white sm:pt-10' key={`range-heading-${hIdx}`}>
            <h3 className='mb-4 text-xl font-semibold text-center uppercase sm:text-3xl text-sky-700 sm:mb-6'>{heading?.range_title}</h3>
            {pageContents?.newarrivals?.length > 0 || pageContents?.shoprange?.length > 0 &&
              <SectionSliderProductCard deviceInfo={deviceInfo} data={pageContents?.newarrivals || pageContents?.shoprange} heading={pageContents?.newarrivalheading} featureToggle={featureToggle} defaultDisplayMembership={defaultDisplayMembership} />
            }
          </div>
        ))}
        {pageContents?.branddescription && pageContents?.branddescription != "" &&
          <div className='container flex flex-col pt-5 mx-auto bg-white sm:pt-10'>
            <div className='flex flex-col w-full'>
              <div className='pt-4 text-xs font-normal text-gray-500 border-t border-gray-200 sm:pt-6 cms-para' dangerouslySetInnerHTML={{ __html: pageContents?.branddescription }}></div>
            </div>
          </div>
        }

        <div className={`${CURRENT_THEME != 'green' ? 'space-y-16 sm:space-y-24 lg:space-y-32' : ''} ${CURRENT_THEME === 'cam' ? 'space-y-0 sm:space-y-0 lg:space-y-0 my-0 sm:my-0 lg:my-0' : ''}  container relative my-16 sm:my-24 lg:my-32 product-collections`}>
          {pageContents?.brand?.length > 0 &&
            <div className='flex flex-col w-full p-8 bg-emerald-100 nc-brandCard'>
              {pageContents?.brand?.slice(0, 1).map((b: any, bIdx: number) => (
                <div key={`brands-${bIdx}`}>
                  <SectionBrandCard data={b} />
                </div>
              ))}
            </div>
          }
          {pageContents?.departments?.length > 0 &&
            <div className="relative py-10 sm:py-16 lg:py-20 bg-section-hide">
              <BackgroundSection />
              <SectionSliderCategories data={pageContents?.departments} heading={pageContents?.departmentheading} />
            </div>
          }
          {pageContents?.newlookbook?.length > 0 &&
            <SectionSliderLargeProduct data={pageContents?.newlookbook} heading={pageContents?.lookbookheading} featureToggle={featureToggle} defaultDisplayMembership={defaultDisplayMembership} cardStyle="style2" />
          }
          {pageContents?.brand?.length > 0 &&
            <div className='flex flex-col w-full p-8 bg-yellow-100 nc-brandCard'>
              {pageContents?.brand?.slice(1, 2).map((b: any, bIdx: number) => (
                <SectionBrandCard data={b} key={bIdx} />
              ))}
            </div>
          }
          {pageContents?.nevermisssale?.length > 0 &&
            <SectionSliderProductCard deviceInfo={deviceInfo} data={pageContents?.nevermisssale} heading={pageContents?.saleheading} featureToggle={featureToggle} defaultDisplayMembership={defaultDisplayMembership} />
          }
          {pageContents?.brand?.length > 0 &&
            <div className='flex flex-col w-full p-8 bg-gray-50 nc-brandCard'>
              {pageContents?.brand?.slice(2, 3).map((b: any, bIdx: number) => (
                <SectionBrandCard data={b} key={bIdx} />
              ))}
            </div>
          }
          {pageContents?.popular?.length > 0 &&
            <SectionSliderProductCard deviceInfo={deviceInfo} data={pageContents?.popular} heading={pageContents?.popularheading} featureToggle={featureToggle} defaultDisplayMembership={defaultDisplayMembership} />
          }
          {pageContents?.dummydata?.length > 0 &&
            <div className={`flex w-full flex-col sm:mt-6 mt-6`}>
              {pageContents?.dummydata?.map((item: any, itemIdx: number) => (
                <div key={itemIdx} className={`flex flex-col p-4 rounded-md gap-10 ${item?.dummydata_background}`}>
                  <h2 className='text-2xl font-semibold text-black'>{item?.dummydata_title}</h2>
                  <div className='flex flex-1 rounded-sm'>
                    <img src={generateUri(item?.dummydata_image, 'h=400&fm=webp') || IMG_PLACEHOLDER} alt={item?.dummydata_image_imgalttxt} className='flex-1 w-40 h-auto rounded-sm' />
                  </div>
                  <div className='frame-class' dangerouslySetInnerHTML={{ __html: item?.dummydata_description?.replaceAll("&lt;", "<")?.replaceAll("&gt;", ">") }}></div>
                  <div className='grid grid-cols-4 gap-4'>
                    {item?.dummydata_multipleimage?.map((data: any, index: number) => (
                      <div key={index} className='items-center justify-center w-full bg-white border border-gray-200 rounded-md'>
                        <img src={data} className='w-full h-full p-2 rounded-md' alt={item?.title} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          }
          {pageContents?.ContentEditor && pageContents?.ContentEditor != "" && <ContentEditorJS value={JSON.parse(pageContents?.ContentEditor)} />}
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
    cookies: context?.req?.cookies || {}
  })

  let dealOfTheWeekProductPromoDetails: any = EmptyObject
  if (pageContents) {
    const dealOfTheWeekProducts = pageContents?.featureproduct
    if (dealOfTheWeekProducts?.length && dealOfTheWeekProducts[0]?.recordId) {
      dealOfTheWeekProductPromoDetails = await commerce.getProductPromos({ query: dealOfTheWeekProducts[0]?.recordId, cookies: context?.req?.cookies || {} })
    }
  }
  const props: IPagePropsProvider = getPagePropType({ type: PagePropType.COMMON })
  const pageProps = await props.getPageProps({ cookies: context?.req?.cookies })

  return {
    props: {
      ...pageProps,
      slug: slug,
      pageContents: pageContents || {},
      dealOfTheWeekProductPromoDetails,
    }, // will be passed to the page component as props
  }
}

PreviewPage.Layout = Layout
export default withDataLayer(PreviewPage, '')
