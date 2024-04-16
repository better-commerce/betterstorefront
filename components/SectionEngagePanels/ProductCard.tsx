import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import cn from 'classnames'
import Cookies from 'js-cookie'
import { getCurrencySymbol, getFeaturesConfig, logError } from '@framework/utils/app-util'
import { priceFormat, roundToDecimalPlaces, stringToBoolean, tryParseJson } from '@framework/utils/parse-util'
import { useUI } from '@components/ui'
import { generateUri } from '@commerce/utils/uri-util'
import { IMG_PLACEHOLDER } from '@components/utils/textVariables'
import Heading from '@components/Heading/Heading'
import { ENGAGE_QUERY_USER_EVENTS, ENGAGE_QUERY_USER_ITEMS, ENGAGE_TRENDING, EngageEventTypes } from '@components/utils/constants'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import SwiperCore, { Navigation } from 'swiper'
import { ArrowLeftIcon, ArrowRightCircleIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import { Cookie } from '@framework/utils/constants'
import withOmnilytics from '@components/shared/withOmnilytics'

export interface SectionSliderProductCardProps {
  type: any
  campaignData: any
  subHeading?: any
  title?: any
  sku?: any
}

const EngageProductCard: FC<SectionSliderProductCardProps> = ({ type, campaignData, subHeading, title, sku }) => {
  const [productList, setProductList] = useState<any>(undefined)
  const [currentCampaign, setCurrentCampaign] = useState<any>(undefined)
  const { isCompared } = useUI()
  const currencyCode = getCurrencySymbol()
  const swiperRef: any = useRef(null)
  const isComparedEnabled = useMemo(() => {
    return getFeaturesConfig()?.features?.enableCompare && stringToBoolean(isCompared)
  }, [])

  const fetchCampaignProducts = useCallback(async () => {
    try {
      const chCookie: any = tryParseJson(Cookies.get(Cookie.Key.ENGAGE_SESSION))
      let apiUrl: any
      let baseUrl: any
      let params: any = {}

      switch (type) {
        case EngageEventTypes.RECENTLY_VIEWED:
          baseUrl = ENGAGE_QUERY_USER_EVENTS
          apiUrl = '/recentitems'
          params = {
            ch_data: JSON.stringify({
              data: { user_uuid: chCookie?.user_id, exclusion_item_id: 'index', limit: 12 },
            }),
          }
          break
        case EngageEventTypes.SIMILAR_PRODUCTS_SORTED:
          baseUrl = ENGAGE_QUERY_USER_ITEMS
          apiUrl = '/similaritemssorted'
          params = {
            ch_data: JSON.stringify({
              data: { user_uuid: chCookie?.user_id, current_item_id: sku, base_category: '', limit: 12 },
            }),
          }
          break
        case EngageEventTypes.SIMILAR_PRODUCTS:
          baseUrl = ENGAGE_QUERY_USER_ITEMS
          apiUrl = '/similaritems'
          params = {
            ch_data: JSON.stringify({
              data: { user_uuid: chCookie?.user_id, current_item_id: sku, base_category: '', limit: 12 },
            }),
          }
          break
        case EngageEventTypes.ALSO_BOUGHT:
          baseUrl = ENGAGE_QUERY_USER_ITEMS
          apiUrl = '/alsobought'
          params = {
            ch_data: JSON.stringify({
              data: { user_uuid: chCookie?.user_id, current_item_id: sku, base_category: '', limit: 12 },
            }),
          }
          break
        case EngageEventTypes.BOUGHT_TOGETHER:
          baseUrl = ENGAGE_QUERY_USER_ITEMS
          apiUrl = '/boughttogether'
          params = {
            ch_data: JSON.stringify({
              data: { user_uuid: chCookie?.user_id, current_item_id: sku, base_category: '', limit: 12 },
            }),
          }
          break
        case EngageEventTypes.TRENDING_FIRST_ORDER:
          baseUrl = ENGAGE_TRENDING
          apiUrl = '/byfirstorder'
          params = {
            ch_data: JSON.stringify({
              data: { limit: 12 },
            }),
          }
          break
        default:
          return {}
      }

      if (!baseUrl || !apiUrl) return {}

      const response = await axios.get(baseUrl + apiUrl, {
        params: {
          ch_guid: campaignData?.guid,
          ch_data: params?.ch_data,
        },
      })
      setProductList(response?.data?.items)
    } catch (error: any) {
      logError(error)
    }
  }, [type, sku, campaignData])

  useEffect(() => {
    fetchCampaignProducts()
  }, [type, campaignData])

  if (!productList || productList?.length < 1) {
    return <></>
  }

  return (
    <div className={`nc-SectionSliderProductCard`}>
      <div>
        <div className="flex justify-between gap-1 mb-5 lg:gap-3 sm:mb-10">
          <h2 className="flex-1 pb-0 pr-4 mb-2 text-3xl font-semibold md:text-4xl">{title}</h2>
          <div className="flex gap-4">
            <button aria-label="Arrow Left" onClick={() => swiperRef.current.swiper.slidePrev()} className="flex items-center justify-center arrow-container">
              <ArrowLeftIcon className="w-10 h-10 p-2 border rounded-full border-slate-200 hover:border-slate-400" />
            </button>
            <button aria-label="Arrow Right" onClick={() => swiperRef.current.swiper.slideNext()} className="flex items-center justify-center arrow-container">
              <ArrowRightIcon className="w-10 h-10 p-2 border rounded-full border-slate-200 hover:border-slate-400" />
            </button>
          </div>
        </div>
        <Swiper className="px-4 bg-white sm:px-0 min-cls-h" slidesPerView={1.1} spaceBetween={10} navigation={false} ref={swiperRef} breakpoints={{ 640: { slidesPerView: 1.1 }, 768: { slidesPerView: 4.01 }, 1024: { slidesPerView: 4.01 } }}>
          {productList?.map((item: any, index: number) => (
            <SwiperSlide key={`pdp-compare-product-${index}`} className={`relative flex-col w-64 h-auto pb-5 text-left cursor-pointer height-auto-slide group lg:w-auto`}>
              <div key={index} className={cn(`nc-ProductCard relative flex flex-col sm:group bg-transparent mb-6`)}>
                <div className="relative flex-shrink-0 overflow-hidden bg-slate-50 dark:bg-slate-300 rounded-3xl z-1 group">
                  <ButtonLink isComparedEnabled={isComparedEnabled} href={`${item?.product_url}`} itemPrice={item?.price} productName={item?.title}>
                    <div className="flex w-full h-0 aspect-w-11 aspect-h-12">
                      <img src={generateUri(item?.image_url, 'h=400&fm=webp') || IMG_PLACEHOLDER} className="object-cover object-top w-full h-full drop-shadow-xl" alt={item?.title} />
                    </div>
                  </ButtonLink>
                </div>

                <ButtonLink isComparedEnabled={isComparedEnabled} href={`${item?.product_url}`} itemPrice={item?.price} productName={item?.title}>
                  <div className="space-y-4 px-2.5 pt-5 pb-2.5">
                    <div>
                      <h2 className="text-base text-left font-semibold transition-colors min-h-[60px] nc-ProductCard__title">{item?.title}</h2>
                      <p className={`text-sm text-left text-slate-500 dark:text-slate-400 mt-1`}>{item?.brand}</p>
                    </div>
                    <div className="flex items-center justify-between ">
                      <div className="font-semibold font-14 text-green">
                        {currencyCode}
                        {roundToDecimalPlaces(item?.price, 2)}
                        {priceFormat(item?.sale_price) > priceFormat(item?.price) && (
                          <span className="px-1 font-normal text-gray-400 line-through font-12">
                            {currencyCode}
                            {roundToDecimalPlaces(item?.sale_price, 2)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </ButtonLink>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
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
