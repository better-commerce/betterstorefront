import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import cn from 'classnames'
import Cookies from 'js-cookie'
import { Swiper, SwiperSlide } from 'swiper/react'
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import 'swiper/css'
import 'swiper/css/navigation'
import { cleanUrl, getCurrencySymbol, getFeaturesConfig, logError } from '@framework/utils/app-util'
import { roundToDecimalPlaces, stringToBoolean, tryParseJson } from '@framework/utils/parse-util'
import { useUI } from '@components/ui'
import { generateUri } from '@commerce/utils/uri-util'
import { IMG_PLACEHOLDER } from '@components/utils/textVariables'
import { ENGAGE_QUERY_COLLABORATIVE, ENGAGE_QUERY_COUPON, ENGAGE_QUERY_INTEREST, ENGAGE_QUERY_USER_EVENTS, ENGAGE_QUERY_USER_ITEMS, ENGAGE_QUERY_SEARCH, ENGAGE_QUERY_TRENDING, EmptyString, EngageEventTypes } from '@components/utils/constants'
import { Cookie } from '@framework/utils/constants'
import withOmnilytics from '@components/shared/withOmnilytics'
import { getReqPayload } from '@components/utils/engageQuery'

export interface SectionSliderProductCardProps {
  product: any
  type: any
  heading?: any
  campaignData: any
  subHeading?: any
  title?: any
  isSlider?: boolean
  productPerRow?: any
  productLimit?: any
  forceDisplay?: boolean
}

const EngageProductCard: FC<SectionSliderProductCardProps> = ({ product, type, heading, campaignData, subHeading, title, isSlider, productPerRow, productLimit, forceDisplay = false }) => {

  /**
   * Do not render if campaigns were not found for this page.
   */
  if (!campaignData || !campaignData?.campaigns || campaignData?.campaigns?.length < 1) {
    return <></>
  }

  const [productList, setProductList] = useState<any>(undefined)
  const { isCompared, user } = useUI()
  const currencyCode = getCurrencySymbol()
  const swiperRef: any = useRef(null)
  const [campaignDetails, setCampaignDetails] = useState<any>(undefined)
  const isComparedEnabled = useMemo(() => {
    return getFeaturesConfig()?.features?.enableCompare && stringToBoolean(isCompared)
  }, [isCompared])

  const fetchCampaignProducts = useCallback(async () => {
    try {
      const chCookie: any = tryParseJson(Cookies.get(Cookie.Key.ENGAGE_SESSION))
      let apiUrl: any
      let baseUrl: any
      let currentCampaign = { campaign_uuid: EmptyString, component_type: EmptyString, campaign_type: EmptyString }

      if (campaignData) {
        const { campaigns = [] } = campaignData?.campaigns?.find((campaign: any) => campaign?._id === type) || {}
        currentCampaign = { campaign_uuid: campaigns?.[0]?.campaign_uuid, component_type: campaigns?.[0]?.component_type, campaign_type: campaigns?.[0]?.campaign_type }
        setCampaignDetails(campaigns?.[0])
      }

      if (!currentCampaign?.campaign_uuid && !forceDisplay) return

      switch (type) {
        case EngageEventTypes.RECENTLY_VIEWED:
          baseUrl = ENGAGE_QUERY_USER_EVENTS
          apiUrl = '/recentitems'
          break
        case EngageEventTypes.SIMILAR_PRODUCTS_SORTED:
          baseUrl = ENGAGE_QUERY_USER_ITEMS
          apiUrl = '/similaritemssorted'
          break
        case EngageEventTypes.SIMILAR_PRODUCTS:
          baseUrl = ENGAGE_QUERY_USER_ITEMS
          apiUrl = '/similaritems'
          break
        case EngageEventTypes.ALSO_BOUGHT:
          baseUrl = ENGAGE_QUERY_USER_ITEMS
          apiUrl = '/alsobought'
          break
        case EngageEventTypes.BOUGHT_TOGETHER:
          baseUrl = ENGAGE_QUERY_USER_ITEMS
          apiUrl = '/boughttogether'
          break
        case EngageEventTypes.TRENDING_FIRST_ORDER:
          baseUrl = ENGAGE_QUERY_TRENDING
          apiUrl = '/byfirstorder'
          break
        case EngageEventTypes.COLLAB_ITEM_VIEW:
          baseUrl = ENGAGE_QUERY_COLLABORATIVE
          apiUrl = '/itemview'
          break
        case EngageEventTypes.COLLAB_USER_ITEMS_VIEW:
          baseUrl = ENGAGE_QUERY_COLLABORATIVE
          apiUrl = '/useritemsview'
          break
        case EngageEventTypes.COLLAB_ITEM_PURCHASE:
          baseUrl = ENGAGE_QUERY_COLLABORATIVE
          apiUrl = '/itempurchase'
          break
        case EngageEventTypes.INTEREST_USER_ITEMS:
          baseUrl = ENGAGE_QUERY_INTEREST
          apiUrl = '/userinterestitems'
          break
        case EngageEventTypes.TRENDING_COLLECTION:
          baseUrl = ENGAGE_QUERY_TRENDING
          apiUrl = '/collection'
          break
        case EngageEventTypes.COUPON_COLLECTION:
          baseUrl = ENGAGE_QUERY_COUPON
          apiUrl = '/collection'
          break
        case EngageEventTypes.SEARCH:
          baseUrl = ENGAGE_QUERY_SEARCH
          apiUrl = ''
          break
        case EngageEventTypes.CROSS_SELL_BY_CATEGORIES:
          baseUrl = ENGAGE_QUERY_USER_ITEMS
          apiUrl = '/crosssellbycategories'
          break
        case EngageEventTypes.CROSS_SELL_ITEMS_SORTED:
          baseUrl = ENGAGE_QUERY_USER_ITEMS
          apiUrl = '/crosssellitemssorted'
          break
        default:
          return
      }

      const chDataPayload: any = getReqPayload({ type, chCookie, limit: productLimit, product, currentCampaign, user })

      const response = await axios.get(baseUrl + apiUrl, {
        params: {
          ch_guid: campaignData?.ch_guid,
          ch_data: chDataPayload,
        },
      })
      setProductList(response?.data?.items)
    } catch (error: any) {
      logError(error)
    }
  }, [type, campaignData])

  useEffect(() => {
    if (campaignData) {
      fetchCampaignProducts()
    }
  }, [campaignData])

  if (!productList || productList?.length < 1) {
    return <></>
  }

  return (
    <>
      <hr className="border-slate-200 dark:border-slate-700" />
      <div className={`nc-SectionSliderProductCard flex flex-col w-full pt-0 cart-recently-viewed sm:pt-10 pdp-engage-product-card`}>
        <div>
          <div className="flex justify-between gap-1 mb-5 lg:gap-3 sm:mb-10">
            <h2 className="flex-1 pb-0 pr-4 mb-2 text-xl font-semibold md:text-4xl dark:text-black">{title || campaignDetails?.campaign_title}</h2>
            {isSlider &&
              <div className="flex gap-4">
                <button aria-label="Arrow Left" onClick={() => swiperRef.current.swiper.slidePrev()} className="flex items-center justify-center arrow-container">
                  <ArrowLeftIcon className="w-10 h-10 p-2 border rounded-full border-slate-200 hover:border-slate-400" />
                </button>
                <button aria-label="Arrow Right" onClick={() => swiperRef.current.swiper.slideNext()} className="flex items-center justify-center arrow-container">
                  <ArrowRightIcon className="w-10 h-10 p-2 border rounded-full border-slate-200 hover:border-slate-400" />
                </button>
              </div>
            }
          </div>
          {isSlider ? (
            <Swiper className="px-4 bg-white sm:px-0 min-cls-h" slidesPerView={2} spaceBetween={10} navigation={false} ref={swiperRef} breakpoints={{ 640: { slidesPerView: 2 }, 768: { slidesPerView: productPerRow }, 1024: { slidesPerView: productPerRow } }}>
              {productList?.map((item: any, index: number) => (
                <SwiperSlide key={`pdp-compare-product-${index}`} className={`relative flex-col w-64 h-auto pb-5 text-left cursor-pointer height-auto-slide group lg:w-auto`}>
                  <div key={index} className={cn(`nc-ProductCard relative flex flex-col sm:group bg-transparent mb-6`)}>
                    <div className="relative flex-shrink-0 overflow-hidden bg-slate-50 dark:bg-slate-300 rounded-3xl z-1 group">
                      <ButtonLink isComparedEnabled={isComparedEnabled} href={`${cleanUrl(item?.product_url)}`} itemPrice={item?.price} productName={item?.title}>
                        <div className="flex w-full h-0 aspect-w-11 aspect-h-12">
                          <img src={generateUri(item?.image_url, 'h=400&fm=webp') || IMG_PLACEHOLDER} className="object-cover object-top w-full h-full drop-shadow-xl" alt={item?.title} />
                        </div>
                      </ButtonLink>
                    </div>

                    <ButtonLink isComparedEnabled={isComparedEnabled} href={`${cleanUrl(item?.product_url)}`} itemPrice={item?.price} productName={item?.title}>
                      <div className="space-y-4 px-2.5 pt-5 pb-2.5">
                        <div>
                          <h2 className="text-sm sm:text-sm text-left font-semibold transition-colors min-h-[60px] nc-ProductCard__title">{item?.title}</h2>
                          <p className={`text-sm text-left text-slate-500 dark:text-slate-400 mt-1`}>{item?.brand}</p>
                        </div>
                        <div className="flex items-center justify-between ">
                          <div className="font-semibold font-14 text-green">
                            {currencyCode}
                            {roundToDecimalPlaces(item?.sale_price, 2)}
                          </div>
                        </div>
                      </div>
                    </ButtonLink>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className={`grid grid-cols-2 gap-3 sm:grid-cols-${productPerRow}`}>
              {productList?.map((item: any, index: number) => (
                <div key={`pdp-compare-product-${index}`} className={`relative flex-col sm:w-64 w-auto h-auto sm:pb-5 pb-2 text-left cursor-pointer height-auto-slide group lg:w-auto`}>
                  <div key={index} className={cn(`nc-ProductCard relative flex flex-col sm:group bg-transparent sm:mb-6 mb-2`)}>
                    <div className="relative flex-shrink-0 overflow-hidden bg-slate-50 dark:bg-slate-300 rounded-3xl z-1 group">
                      <ButtonLink isComparedEnabled={isComparedEnabled} href={`${cleanUrl(item?.product_url)}`} itemPrice={item?.price} productName={item?.title}>
                        <div className="flex w-full h-0 aspect-w-11 aspect-h-12">
                          <img src={generateUri(item?.image_url, 'h=400&fm=webp') || IMG_PLACEHOLDER} className="object-cover object-top w-full h-full drop-shadow-xl" alt={item?.title} />
                        </div>
                      </ButtonLink>
                    </div>

                    <ButtonLink isComparedEnabled={isComparedEnabled} href={`${cleanUrl(item?.product_url)}`} itemPrice={item?.price} productName={item?.title}>
                      <div className="space-y-4 px-2.5 sm:pt-5 pt-2 pb-2.5">
                        <div>
                          <h2 className="text-xs sm:text-sm text-left font-semibold transition-colors sm:min-h-[50px] min-h-[40px] nc-ProductCard__title">{item?.title}</h2>
                          <p className={`text-sm text-left text-slate-500 dark:text-slate-400 mt-1`}>{item?.brand}</p>
                        </div>
                        <div className="flex items-center justify-between ">
                          <div className="font-semibold font-14 text-green">
                            {currencyCode}
                            {roundToDecimalPlaces(item?.sale_price, 2)}
                          </div>
                        </div>
                      </div>
                    </ButtonLink>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
const ButtonLink = (props: any) => {
  const { isComparedEnabled, children, href, handleHover, itemPrice, productName, onClick } = props
  if (isComparedEnabled) {
    return (
      <div className="flex flex-col w-full" onClick={onClick}>
        {children}
      </div>
    )
  }
  return (
    <Link passHref href={href} className="img-link-display" title={`${productName} \t ${itemPrice}`}>
      {children}
    </Link>
  )
}

export default withOmnilytics(EngageProductCard)
