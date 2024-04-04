// Base Imports
import { useEffect, useState, useRef } from 'react'
import dynamic from 'next/dynamic'
// Package Imports
import axios from 'axios'
import Link from 'next/link'
import { maxBasketItemsCount } from '@framework/utils/app-util'
import cartHandler from '@components/services/cart'
import { Swiper, SwiperSlide } from 'swiper/react'
import { decrypt } from '@framework/utils/cipher'
import 'swiper/css'
import 'swiper/css/navigation'
import { NEXT_GET_CATALOG_PRODUCTS } from '@components/utils/constants'

// Component Imports
import { LoadingDots } from '@components/ui'

// Other Imports

import { useUI } from '@components/ui/context'
import { LocalStorage } from '@components/utils/payment-constants'
import { dateFormat, tryParseJson } from '@framework/utils/parse-util'
import {
  NEXT_REFERRAL_BY_EMAIL,
  NEXT_REFERRAL_INFO,
} from '@components/utils/constants'
const ProductCard = dynamic(() => import('@components/ProductCard'))
import { useTranslation } from '@commerce/utils/use-translation'

export default function RecentlyViewedProduct({ deviceInfo, config, productPerRow }: any) {
  const translate = useTranslation()
  const { addToCart } = cartHandler()
  const [splitBasketProducts, setSplitBasketProducts] = useState<any>({})
  const [recentlyViewedState, setRecentlyViewedState] = useState<any>([])
  const swiperRefBasket: any = useRef(null)
  const [isReferModalOpen, setIsReferModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const {
    user,
    cartItems,
    isGuestUser,
  } = useUI()
  const [referralObj, setReferralObj] = useState({
    id: '',
    userId: '',
    name: '',
    slug: '',
    invitesSent: 0,
    clickOnInvites: 0,
    successfulInvites: 0,
  })
  const [referralOffers, setReferralOffers] = useState<any>(null)
  const [isReferralSlugLoading, setIsReferralSlugLoading] = useState(false)

  const recentlyViewedProds = () => {
    let prodStockCodes: any = []
    try {
      if (localStorage.getItem(LocalStorage.Key.RECENTLY_VIEWED)) {
        const recentProductsJson: any = decrypt(
          localStorage.getItem(LocalStorage.Key.RECENTLY_VIEWED)!
        )
        prodStockCodes = tryParseJson(recentProductsJson) || []
        async function fetchProductsByStockCodes() {
          const data = {
            sortBy: '',
            sortOrder: '',
            currentPage: 1,
            pageSize: 10,
            filters: [],
            stockCodes: prodStockCodes,
          }
          setIsLoading(true)
          const res: any = await axios
            .post(NEXT_GET_CATALOG_PRODUCTS, data)
            .then((results: any) => {
              setRecentlyViewedState(results?.data?.products?.results)
              setIsLoading(false)
            })
            .catch((err) => {
              //console.log(err)
            })
        }
        fetchProductsByStockCodes()
      }
    } catch (error) { }
  }

  const handleReferralByEmail = async () => {
    // setIsReferModalOpen(true)
    let referrerEmail = user?.email
    setIsReferralSlugLoading(true)
    let { data: data } = await axios.post(NEXT_REFERRAL_BY_EMAIL, {
      email: referrerEmail,
    })
    if (data?.referralDetails?.id) {
      setReferralObj(data?.referralDetails)
      setIsReferralSlugLoading(false)
    } else {
      setIsReferralSlugLoading(false)
    }
  }

  const handleReferralInfo = async () => {
    let { data: data } = await axios.get(NEXT_REFERRAL_INFO)
    if (data?.referralDetails?.referrerPromo && !isGuestUser) {
      setReferralOffers(data?.referralDetails)
      setIsReferModalOpen(true)
      handleReferralByEmail()
    }
  }

  const groupItemsByDeliveryDate = (items: any) => {
    if (items?.length < 1) {
      return []
    }
    const groupedItems: any = {}

    if (items?.length) {
      for (const item of items) {
        const deliveryDate = dateFormat(item?.deliveryDateTarget, 'DD/MM/yyyy')
        if (groupedItems.hasOwnProperty(deliveryDate)) {
          groupedItems[deliveryDate].push(item)
        } else {
          groupedItems[deliveryDate] = [item]
        }
      }
    }

    return groupedItems
  }

  useEffect(() => {
    recentlyViewedProds()
    let splitProducts = groupItemsByDeliveryDate(cartItems?.lineItems)
    setSplitBasketProducts(splitProducts)
  }, [cartItems?.lineItems])

  useEffect(() => {
    handleReferralInfo()
  }, [])

  return (
    recentlyViewedState?.length > 0 && (
      <>
        <hr className="border-slate-200 dark:border-slate-700" />
        <div className="flex flex-col pt-5 sm:pt-10">
          <div className="flex items-center justify-between gap-1 pb-2 pr-0 mb-2 sm:pr-0 lg:gap-3 sm:mb-0 sm:pb-4">
            <h2 className="flex items-center text-2xl font-semibold md:text-3xl">
              {translate('common.label.recentlyViewedText')}
            </h2>
            <div className="flex flex-row gap-2">
              <button onClick={() => swiperRefBasket.current.swiper.slidePrev()} className="relative flex items-center justify-center rounded arrow-container group" >
                <svg className="w-10 h-10 p-2 ml-2 transition-transform -rotate-90 border rounded-full left-full group-hover:scale-110 border-slate-200" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" >
                  <path d="M18.0701 9.57L12.0001 3.5L5.93005 9.57" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 20.4999V3.66992" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button onClick={() => swiperRefBasket.current.swiper.slideNext()} className="relative flex items-center justify-center rounded arrow-container group" >
                <svg className="w-10 h-10 p-2 ml-2 transition-transform rotate-90 border rounded-full left-full group-hover:scale-110 border-slate-200" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" >
                  <path d="M18.0701 9.57L12.0001 3.5L5.93005 9.57" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 20.4999V3.66992" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
          <div className="mt-4 default-sm mobile-slider-no-arrow m-hide-navigation sm:mb-0 vertical-prod-list-ipad">
            {isLoading ? (
              <LoadingDots />
            ) : (
              <Swiper slidesPerView={1} spaceBetween={10} ref={swiperRefBasket} navigation={false} loop={true} breakpoints={{ 640: { slidesPerView: 1.3, spaceBetween: 4 }, 768: { slidesPerView: productPerRow, spaceBetween: 10 }, 1024: { slidesPerView: productPerRow, spaceBetween: 10 }, }} className="mySwiper" >
                {recentlyViewedState?.map((product: any, pid: number) => {
                  return (
                    <SwiperSlide key={pid} className="height-equal">
                      <ProductCard data={product} deviceInfo={deviceInfo} maxBasketItemsCount={maxBasketItemsCount(config)} />
                    </SwiperSlide>
                  )
                })}
              </Swiper>
            )}
          </div>
        </div>
      </>
    )
  )
}
