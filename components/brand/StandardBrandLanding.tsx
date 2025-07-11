import { generateUri } from "@commerce/utils/uri-util"
import { CURRENT_THEME } from "@components/utils/constants"
import dynamic from "next/dynamic"
import { IMG_PLACEHOLDER } from "@components/utils/textVariables"
import Link from "next/link"
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import Prev from '@components/shared/NextPrevIcon/Prev'
import Next from '@components/shared/NextPrevIcon/Next'
import { ImageBanner, ImageCollection, PlainText, Video } from '@components/SectionBrands'
import { useTranslation } from "@commerce/utils/use-translation"
import StandardBrandListData from "./StandardBrandListData"
const ProductCard = dynamic(() => import('@components/ProductCard'))
const HeadingWithButton = dynamic(() => import('@components/Heading/HeadingWithButton'))
import MultiBrandVideo from '@components/SectionBrands/MultiBrandVideo'
import Slider from '@components/SectionBrands/Slider'
import BrandDisclosure from '@components/SectionBrands/Disclosure'
import { sanitizeRelativeUrl } from "@framework/utils/app-util"
import { useEffect, useState } from "react"


export default function StandardBrandLanding({ resPcHero, brandGuidePages, resPc1, resPc2, resPc3, resIc1, swiperRefIc1, ic1Title, pc3Title, pc2Title, pc1Title, faq, swiperRefPc1, onToggleBrandListPage, sliderRefNew, swiperRefPc2, pHeading, pText, swiperRefPc3, saleProductCollectionRes, swiperRef, manufacturerStateVideoHeading, manufacturerStateVideoName, midBanners, midBannerHeading, midBannerLink, bgColor, textColor, multipleBrandVideoName, multipleBrandVideos, imgFeatureCollection, textNames, manufacturerStateTextHeading, handleClick, featureToggle, emptyHtmlString, imageCategoryCollectionResponse, brandDetails, sanitizedDescription, excludeOOSProduct, onEnableOutOfStockItems, isProductCompare, showCompareProducts, isValidating, clearAll, config, productDataToPass, handlePageChange, handleInfiniteScroll, deviceInfo, maxBasketItemsCount, handleFilters, data, state, handleSortBy, isCompared, campaignData, removeFilter, defaultDisplayMembership, closeCompareProducts, hideListHeader }: any) {
  const translate = useTranslation()
  const { isMobile, isOnlyMobile } = deviceInfo
  const [navigationVisibility, setNavigationVisibility] = useState({ nav0: false, nav1: false, nav2: false, nav3: false, nav4: false, })

  useEffect(() => {
    const calculateSlidesPerView = (width: number) => {
      if (width >= 1800) return { slidesPerView: 5, slidesPerViewBlog: 4 }
      if (width >= 1024) return { slidesPerView: 4, slidesPerViewBlog: 4 }
      if (width >= 768) return { slidesPerView: 3, slidesPerViewBlog: 3 }
      if (width >= 640) return { slidesPerView: 2.3, slidesPerViewBlog: 2.5 }
      return { slidesPerView: 1.4, slidesPerViewBlog: 1.5 }
    }

    const updateNavigationVisibility = () => {
      const width = window?.innerWidth || 0
      const { slidesPerView, slidesPerViewBlog } = calculateSlidesPerView(width)

      setNavigationVisibility({
        nav0: (resIc1?.images?.length || 0) > slidesPerView,
        nav1: (resPc1?.length || 0) > slidesPerView,
        nav2: (resPc2?.length || 0) > slidesPerView,
        nav3: (resPc3?.length || 0) > slidesPerView,
        nav4: (brandGuidePages?.length || 0) > slidesPerViewBlog,
      })
    }

    updateNavigationVisibility()
    window.addEventListener('resize', updateNavigationVisibility)
    return () => window.removeEventListener('resize', updateNavigationVisibility)
  }, [resIc1, resPc1, resPc2, resPc3, brandGuidePages])

  return (
    <>
      <h1 className={`block text-2xl sr-only capitalize dark:text-black ${CURRENT_THEME == 'green' ? 'sm:text-4xl lg:text-5xl font-bold' : 'sm:text-3xl lg:text-4xl font-semibold'}`}>
        {brandDetails?.name}
      </h1>
      {featureToggle?.features?.enableForPCSite ? (
        resPcHero?.images?.length > 0 && (
          <div className='flex flex-col w-full mt-1'>
            <Swiper navigation={true} loop={true} className="flex items-center justify-center w-full mx-auto mt-0 mySwiper sm:px-0 sm:mt-0">
              {resPcHero?.images?.map((img: any, idx: number) => (
                <SwiperSlide key={`horizontal-slider-${idx}`}>
                  <Link href={img.link || '#'}>
                    <img
                      width={1920}
                      height={350}
                      src={generateUri(img.url, 'h=1000&fm=webp') || IMG_PLACEHOLDER}
                      alt={img?.name || 'Collection Banner'}
                      className="object-cover object-center w-full !h-[350px] !max-h-[350px] cursor-pointer"
                      loading={idx < 2 ? "eager" : "lazy"}
                    />
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )
      ) : (
        <></>
      )}
      <div className="container w-full pb-0 mx-auto bg-white md:pb-4">
        {featureToggle?.features?.enableForPCSite ? (
          <></>
        ) : (
          <div className="grid grid-cols-1 gap-5 mt-10 md:grid-cols-12">
            <div className="flex md:col-span-9 flex-col items-center px-4 sm:px-10 py-4 sm:py-10 rounded-xl brand-rounded-xl bg-teal-500 min-h-[350px] md:min-h-[85vh] lg:min-h-[55vh] justify-evenly pt-2">
              <img alt="Brand Logo" src={brandDetails.logoImageName || IMG_PLACEHOLDER} width={212} height={200} loading="eager" className="w-[120px] md:w-[212px] h-auto rounded-2xl" />
              {brandDetails?.shortDescription != emptyHtmlString &&
                <div dangerouslySetInnerHTML={{ __html: brandDetails?.shortDescription }} className="w-3/4 py-5 text-2xl font-medium leading-10 text-center text-white uppercase" />
              }
              <button className="px-6 py-3 font-medium text-black uppercase bg-white rounded-md hover:opacity-80" onClick={handleClick} > {translate('common.label.shopNowText')} </button>
            </div>
            <ImageCollection range={1} AttrArray={imageCategoryCollectionResponse || []} showTitle={true} />
          </div>
        )}

        {resIc1?.images?.length > 0 &&
          <div className="container flex flex-col !px-0 mx-auto bg-white sm:pt-10 pt-6 slider-btn-css">
            <div className='flex items-center justify-between gap-6 pb-4 sm:justify-start sm:pb-8'>
              <h3 className="font-semibold text-black title-page">{ic1Title}</h3>
            </div>
            <div className='relative'>
              {navigationVisibility.nav0 && <div className="flex justify-between mb-2 slider-out-btn">
                <Prev onClickPrev={() => swiperRefIc1.current?.swiper?.slidePrev()} />
                <Next onClickNext={() => swiperRefIc1.current?.swiper?.slideNext()} />
              </div>}
              <Swiper slidesPerView={1.3} spaceBetween={16} ref={swiperRefIc1} navigation={false} loop={true} className={deviceInfo?.isMobile ? 'mob-navigation-hide' : 'border border-gray-200 bg-white shadow p-2 rounded'} breakpoints={{ 640: { slidesPerView: 1.3 }, 768: { slidesPerView: 3 }, 1024: { slidesPerView: 4 }, 1800: { slidesPerView: 5 } }}>
                {resIc1?.images?.map((item: any, pId: number) => (
                  <SwiperSlide key={pId} className="relative inline-flex flex-col h-auto text-left cursor-pointer height-auto-slide group lg:w-auto">
                    <Link href={sanitizeRelativeUrl(`/${item?.link}`)} className='flex flex-col items-center justify-center w-full gap-2'>
                      <div className='flex flex-col !items-center !justify-center w-full !h-[250px]'>
                        <img src={item?.url} alt={item?.name} className='object-contain !w-auto !h-[220px] mx-auto' />
                      </div>
                      <h3 className='pb-4 text-sm font-medium text-center text-sky-700'>{item?.name}</h3>
                    </Link>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        }

        {resPc1?.length > 0 &&
          <div className="container flex flex-col !px-0 mx-auto bg-white sm:pt-10 pt-6 slider-btn-css">
            <div className='flex items-center justify-between gap-6 pb-4 sm:justify-start sm:pb-8'>
              <h3 className="font-semibold text-black title-page">{pc1Title}</h3>
            </div>
            <div className='relative'>
              {navigationVisibility.nav1 && <div className="flex justify-between mb-2 slider-out-btn">
                <Prev onClickPrev={() => swiperRefPc1.current?.swiper?.slidePrev()} />
                <Next onClickNext={() => swiperRefPc1.current?.swiper?.slideNext()} />
              </div>}
              <Swiper slidesPerView={1.3} spaceBetween={16} ref={swiperRefPc1} navigation={false} loop={true} className={deviceInfo?.isMobile ? 'mob-navigation-hide' : ''} breakpoints={{ 640: { slidesPerView: 1.3 }, 768: { slidesPerView: 3 }, 1024: { slidesPerView: 4 }, 1800: { slidesPerView: 5 } }}>
                {resPc1?.map((item: any, pId: number) => (
                  <SwiperSlide key={pId} className="relative inline-flex flex-col h-auto text-left cursor-pointer height-auto-slide group lg:w-auto">
                    <ProductCard data={item} featureToggle={featureToggle} deviceInfo={deviceInfo} defaultDisplayMembership={defaultDisplayMembership} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        }

        {resPc2?.length > 0 &&
          <div className="container flex flex-col !px-0 mx-auto bg-white sm:pt-10 pt-6 slider-btn-css">
            <div className='flex items-center justify-between gap-6 pb-4 sm:justify-start sm:pb-8'>
              <h3 className="font-semibold text-black title-page">{pc2Title}</h3>
            </div>
            <div className='relative'>
              {navigationVisibility.nav2 && <div className="flex justify-between mb-2 slider-out-btn">
                <Prev onClickPrev={() => swiperRefPc2.current?.swiper?.slidePrev()} />
                <Next onClickNext={() => swiperRefPc2.current?.swiper?.slideNext()} />
              </div>}
              <Swiper slidesPerView={1.3} spaceBetween={16} ref={swiperRefPc2} navigation={false} loop={true} className={deviceInfo?.isMobile ? 'mob-navigation-hide' : ''} breakpoints={{ 640: { slidesPerView: 1.3 }, 768: { slidesPerView: 3 }, 1024: { slidesPerView: 4 }, 1800: { slidesPerView: 5 } }}>
                {resPc2?.map((item: any, pId: number) => (
                  <SwiperSlide key={pId} className="relative inline-flex flex-col h-auto text-left cursor-pointer height-auto-slide group lg:w-auto">
                    <ProductCard data={item} featureToggle={featureToggle} deviceInfo={deviceInfo} defaultDisplayMembership={defaultDisplayMembership} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        }

        {resPc3?.length > 0 &&
          <div className="container flex flex-col !px-0 mx-auto bg-white sm:pt-10 pt-6 slider-btn-css">
            <div className='flex items-center justify-between gap-6 pb-4 sm:justify-start sm:pb-8'>
              <h3 className="font-semibold text-black title-page">{pc3Title}</h3>
            </div>
            <div className='relative'>
              {navigationVisibility.nav3 && <div className="flex justify-between mb-2 slider-out-btn">
                <Prev onClickPrev={() => swiperRefPc3.current?.swiper?.slidePrev()} />
                <Next onClickNext={() => swiperRefPc3.current?.swiper?.slideNext()} />
              </div>}
              <Swiper slidesPerView={1.3} spaceBetween={16} ref={swiperRefPc3} navigation={false} loop={true} className={deviceInfo?.isMobile ? 'mob-navigation-hide' : ''} breakpoints={{ 640: { slidesPerView: 1.3 }, 768: { slidesPerView: 3 }, 1024: { slidesPerView: 4 }, 1800: { slidesPerView: 5 } }}>
                {resPc3?.map((item: any, pId: number) => (
                  <SwiperSlide key={pId} className="relative inline-flex flex-col h-auto text-left cursor-pointer height-auto-slide group lg:w-auto">
                    <ProductCard data={item} featureToggle={featureToggle} deviceInfo={deviceInfo} defaultDisplayMembership={defaultDisplayMembership} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        }
        {pHeading && <div className='flex flex-col w-full gap-4 px-4 py-4 my-4 sm:my-10 bg-slate-100 rounded-xl sm:px-6 sm:py-8'>
          <h3 className="font-semibold text-black title-page">{pHeading}</h3>
          <p className='text-sm font-medium text-gray-700'>{pText}</p>
        </div>}

        {featureToggle?.features?.enableForPCSite &&
          <StandardBrandListData
            featureToggle={featureToggle}
            brandDetails={brandDetails}
            sanitizedDescription={sanitizedDescription}
            excludeOOSProduct={excludeOOSProduct}
            onEnableOutOfStockItems={onEnableOutOfStockItems}
            isProductCompare={isProductCompare}
            showCompareProducts={showCompareProducts}
            isValidating={isValidating}
            clearAll={clearAll}
            config={config}
            productDataToPass={productDataToPass}
            handlePageChange={handlePageChange}
            handleInfiniteScroll={handleInfiniteScroll}
            deviceInfo={deviceInfo}
            maxBasketItemsCount={maxBasketItemsCount}
            handleFilters={handleFilters}
            data={data}
            state={state}
            handleSortBy={handleSortBy}
            isCompared={isCompared}
            campaignData={campaignData}
            removeFilter={removeFilter}
            defaultDisplayMembership={defaultDisplayMembership}
            closeCompareProducts={closeCompareProducts}
            hideListHeader={hideListHeader}
          />
        }

        {!featureToggle?.features?.enableForPCSite &&
          <>
            <PlainText textNames={textNames || []} heading={manufacturerStateTextHeading} />
            <div className="mt-0 md:mt-2">
              <Video heading={manufacturerStateVideoHeading} name={manufacturerStateVideoName} />
            </div>

            <div className="w-full mt-10 md:mt-20">
              {/* NOTE : manufacturerSettingType for this widget is 'ImageBanner' & code is 'MidBanner' */}
              <ImageBanner midBanners={midBanners} heading={midBannerHeading} link={midBannerLink} bgColor={bgColor} textColor={textColor} />

              {/* NOTE : manufacturerSettingType for this widget is 'Video' & code is 'MultipleBrandVideos' */}
              {multipleBrandVideoName ?
                <div className="mt-10 lg:mt-20">
                  <MultiBrandVideo videos={multipleBrandVideos || ''} name={multipleBrandVideoName || ''} />
                </div> : null
              }
            </div>
          </>
        }
      </div>

      {!featureToggle?.features?.enableForPCSite && <div className="container w-full mx-auto">
        {isOnlyMobile ? (
          <div className="mb-2 max-h-[30vh]">
            <Slider images={imgFeatureCollection?.images || []} isBanner={false} />
          </div>
        ) : (
          <div className="mb-2">
            <ImageCollection range={4} AttrArray={imgFeatureCollection?.images || []} />
          </div>
        )}
        {saleProductCollectionRes?.length > 0 && (
          <div className="mt-10 border-gray-200 border-y">
            <div className={`nc-SectionSliderProductCard`}>
              <div ref={sliderRefNew} className={`flow-root`}>
                <div className="flex justify-between">
                  <HeadingWithButton
                    className="mt-10 mb-6 capitalize lg:mb-8 text-neutral-900 dark:text-neutral-50"
                    desc=""
                    rightDescText="2024"
                    hasNextPrev
                    onButtonClick={onToggleBrandListPage}
                    buttonText="See All"
                  >
                    {translate('label.product.saleProductText')}
                  </HeadingWithButton>
                </div>
                <div className="glide__track" data-glide-el="track">
                  <ul className="glide__slides">
                    {saleProductCollectionRes?.map((item: any, index: number) => (
                      <li key={index} className={`glide__slide`}>
                        <ProductCard
                          data={item}
                          featureToggle={featureToggle}
                          defaultDisplayMembership={defaultDisplayMembership}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="max-w-4xl mx-auto my-10">
          <p className="mb-6 text-3xl font-semibold capitalize md:text-4xl text-slate-900">{faq.title}</p>
          {faq?.results?.map((val: any, Idx: number) => {
            return (
              <BrandDisclosure key={Idx} heading={val.faq} details={val.ans} />
            )
          })}
        </div>
      </div>}
      {brandGuidePages?.length > 0 && featureToggle?.features?.enableForPCSite &&
        <div className="container flex flex-col pt-6 mx-auto mb-6 bg-white sm:pt-10 slider-btn-css">
          <div className='flex items-center justify-between gap-6 pb-4 sm:justify-start sm:pb-8'>
            <h3 className="font-semibold text-black title-page">Buying Guides</h3>
          </div>
          <div className='relative'>
            {navigationVisibility.nav4 && <div className="flex justify-between mb-2 slider-out-btn">
              <Prev onClickPrev={() => swiperRef.current?.swiper?.slidePrev()} />
              <Next onClickNext={() => swiperRef.current?.swiper?.slideNext()} />
            </div>}
            <Swiper slidesPerView={1.3} spaceBetween={16} ref={swiperRef} navigation={false} loop={true} className={deviceInfo?.isMobile ? 'mob-navigation-hide' : 'border border-gray-200 bg-white shadow p-2 rounded'} breakpoints={{ 640: { slidesPerView: 1.3 }, 768: { slidesPerView: 3 }, 1024: { slidesPerView: 4 }, 1800: { slidesPerView: 4 } }}>
              {brandGuidePages?.map((item: any, pId: number) => (
                <SwiperSlide key={pId} className="relative inline-flex flex-col h-auto text-left cursor-pointer height-auto-slide group lg:w-auto">
                  <Link href={sanitizeRelativeUrl(`/${item?.slug}`)} className='flex flex-col items-center justify-center w-full gap-2'>
                    <div className='flex flex-col !items-center !justify-center w-full !h-[250px]'>
                      <img src={item?.fields?.hero[0]?.hero_image} alt={item?.name} className='object-contain !w-auto !h-[220px] mx-auto' />
                    </div>
                    <h3 className='pb-4 text-sm font-medium text-center text-sky-700'>{item?.name}</h3>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      }
    </>
  )
}