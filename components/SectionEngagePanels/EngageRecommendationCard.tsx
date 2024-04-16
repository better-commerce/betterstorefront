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
import { Switch } from '@headlessui/react'

export interface SectionSliderProductCardProps {
  type: any
  campaignData: any
  subHeading?: any
  title?: any
  sku?: any
  isSlider?: boolean
  productPerRow?: any
}

const EngageRecommendationCard: FC<SectionSliderProductCardProps> = ({ type, campaignData, subHeading, title, sku, isSlider, productPerRow }) => {
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
        </div>
        <div className='grid grid-cols-1 mx-auto border sm:grid-cols-1 border-slate-200 rounded-2xl sm:max-w-5xl'>
          {productList?.map((item: any, index: number) => (
            <div key={`pdp-compare-product-${index}`} className={`relative flex-col w-64 h-auto text-left cursor-pointer height-auto-slide group lg:w-auto`}>
              <div className="grid items-center grid-cols-12 gap-3 p-2 border-b border-slate-300" key={index}>
                <div className="col-span-1">
                  <div className="flex-shrink-0">
                    <img width={140} height={60} src={generateUri(item?.image_url, 'h=200&fm=webp') || IMG_PLACEHOLDER} alt={item?.title || 'cart-item'} className="object-cover object-center w-10 rounded-lg sm:w-16 image" />
                  </div>
                </div>
                <div className="col-span-8">
                  <Link href={`${item?.product_url}`} passHref>
                    <h3 className="font-semibold text-black font-16 hover:text-sky-600">{item?.title}</h3>
                  </Link>
                </div>
                <div className="flex items-center justify-around col-span-3 gap-2">
                  <span className="font-normal font-12 text-slate-600">Use this product for recommendation</span>
                  <Switch checked={item?.isRecommended} className={`${item?.isRecommended ? 'bg-white' : 'bg-gray-300'} relative inline-flex h-[18px] w-[35px] shrink-0 cursor-pointer rounded-full border border-slate-300 transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`} >
                    <span className="sr-only">is Enable</span>
                    <span aria-hidden="true" className={`${item?.isRecommended ? 'translate-x-4' : 'translate-x-0'} pointer-events-none inline-block h-[15px] w-[15px] transform rounded-full bg-black shadow-lg ring-0 transition duration-200 ease-in-out`} />
                  </Switch>
                </div>
              </div>
            </div>
          ))}
        </div>

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

export default withOmnilytics(EngageRecommendationCard)
