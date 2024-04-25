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
import { ENGAGE_QUERY_USER_EVENTS, ENGAGE_QUERY_USER_ITEMS, ENGAGE_QUERY_TRENDING, EngageEventTypes, EmptyString, ENGAGE_QUERY_COLLABORATIVE, ENGAGE_QUERY_INTEREST, ENGAGE_QUERY_SEARCH, ENGAGE_QUERY_COUPON, ENGAGE_QUERY_CUSTOMER, EmptyObject } from '@components/utils/constants'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import SwiperCore, { Navigation } from 'swiper'
import { ArrowLeftIcon, ArrowRightCircleIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import { Cookie } from '@framework/utils/constants'
import withOmnilytics from '@components/shared/withOmnilytics'
import { Switch } from '@headlessui/react'
import { getReqPayload } from '@components/utils/engageQuery'

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
  const { isCompared, user } = useUI()
  const [campaignDetails, setCampaignDetails] = useState<any>(undefined)
  const currencyCode = getCurrencySymbol()
  const swiperRef: any = useRef(null)
  const [isProductRecommended, setIsProductRecommended] = useState<any>(EmptyObject)
  const [isLoading, setIsLoading] = useState(false)

  const onToggleRecommendation = useCallback(
    async (product: any) => {
      if (isLoading) return
      setIsLoading(true)
      try {
        const res = await axios.post(`${ENGAGE_QUERY_CUSTOMER}/excludeforrecommendation`, {
          ch_data: {
            bc_user_id: user?.userId,
            item_id: product?.item_id,
            exclude: product?.use_for_recommendation,
          },
        })
        if (res?.data?.success) {
          setIsProductRecommended((v: any) => ({
            ...v,
            [product?._id]: !v[product?._id] ?? false,
          }))
        }
      } catch (error) {
        logError(error)
      } finally {
        setIsLoading(false)
      }
    },
    [user, isProductRecommended, isLoading],
  )

  const isComparedEnabled = useMemo(() => {
    return getFeaturesConfig()?.features?.enableCompare && stringToBoolean(isCompared)
  }, [])

  const fetchCampaignProducts = useCallback(async () => {
    try {
      const chCookie: any = tryParseJson(Cookies.get(Cookie.Key.ENGAGE_SESSION))
      let apiUrl: any
      let baseUrl: any
      let currentCampaign = { campaign_uuid: EmptyString, component_type: EmptyString, campaign_type: EmptyString }

      if (campaignData) {
        const { campaigns = [] } = campaignData?.campaigns?.find((campaign: any) => campaign?._id === type) || EmptyObject
        currentCampaign = { campaign_uuid: campaigns?.[0]?.campaign_uuid, component_type: campaigns?.[0]?.component_type, campaign_type: campaigns?.[0]?.campaign_type }
        setCampaignDetails(campaigns?.[0])
      }

      switch (type) {
        case EngageEventTypes.PURCHASE_HISTORY:
          baseUrl = ENGAGE_QUERY_CUSTOMER
          apiUrl = '/purchasehistory'
          break
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
          apiUrl = '/itempurchase'
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

      const chDataPayload: any = getReqPayload({ type, chCookie, limit: 12, currentCampaign, user })

      const response = await axios.get(baseUrl + apiUrl, {
        params: {
          ch_guid: campaignData?.ch_guid,
          ch_data: chDataPayload,
        },
      })
      if (response?.data?.items?.length > 0) {
        setProductList(response?.data?.items)
        const productRecommendedObj: any = EmptyObject
        response?.data?.items?.forEach((product: any) => {
          productRecommendedObj[product?._id] = product?.use_for_recommendation
        })
        setIsProductRecommended((v: any) => ({ ...v, ...productRecommendedObj }))
      }
    } catch (error: any) {
      logError(error)
    }
  }, [type, campaignData])

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
          <h2 className="flex-1 pb-0 pr-4 mb-2 text-xl font-semibold md:text-4xl">{title || campaignDetails?.campaign_title}</h2>
        </div>
        <div className='grid grid-cols-1 mx-auto border sm:grid-cols-1 border-slate-200 rounded-2xl sm:max-w-5xl'>
          {productList?.map((item: any, index: number) => (
            <div key={`pdp-compare-product-${index}`} className={`relative flex-col sm:w-64 w-full h-auto text-left cursor-pointer height-auto-slide group lg:w-auto`}>
              <div className="grid items-center grid-cols-1 gap-3 p-2 border-b sm:grid-cols-12 border-slate-300" key={index}>
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
                  <Switch checked={isProductRecommended?.[item?._id]} onChange={() => onToggleRecommendation(item)} className={`${isProductRecommended?.[item?._id] ? 'bg-white' : 'bg-gray-300'} relative inline-flex h-[18px] w-[35px] shrink-0 cursor-pointer rounded-full border border-slate-300 transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`} >
                    <span className="sr-only">is Enable</span>
                    <span aria-hidden="true" className={`${isProductRecommended?.[item?._id] ? 'translate-x-4' : 'translate-x-0'} pointer-events-none inline-block h-[15px] w-[15px] transform rounded-full bg-black shadow-lg ring-0 transition duration-200 ease-in-out`} />
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
