// Base Imports
import { useEffect, useState, useRef } from 'react'
import dynamic from 'next/dynamic'
// Package Imports
import axios from 'axios'
import { maxBasketItemsCount } from '@framework/utils/app-util'
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
import HomeProductCardMin from '@components/HomeProductCardMin'
import Prev from '@components/shared/NextPrevIcon/Prev'
import Next from '@components/shared/NextPrevIcon/Next'
export default function RecentlyViewedProduct({ isHome = false, deviceInfo, config, featureToggle, defaultDisplayMembership, productPerRow }: any) {
  const translate = useTranslation()
  const [recentlyViewedProducts, setRecentlyViewedProducts] = useState<any>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user, isGuestUser, } = useUI()
  const [referralObj, setReferralObj] = useState({ id: '', userId: '', name: '', slug: '', invitesSent: 0, clickOnInvites: 0, successfulInvites: 0, })
  const [referralOffers, setReferralOffers] = useState<any>(null)
  const [showNavigation, setShowNavigation] = useState(false)
  const [isReferralSlugLoading, setIsReferralSlugLoading] = useState(false)
  const { isMobile } = deviceInfo || { isMobile: false };
  useEffect(() => {
    const updateNavigationVisibility = () => {
      let slidesPerView = 1
      const width = window?.innerWidth

      if (width >= 1800) {
        slidesPerView = productPerRow
      } else if (width >= 1024) {
        slidesPerView = 4
      } else if (width >= 768) {
        slidesPerView = 3
      } else if (width >= 640) {
        slidesPerView = 2.3
      } else {
        slidesPerView = 1.4
      }

      setShowNavigation(recentlyViewedProducts?.length > slidesPerView)
    }

    updateNavigationVisibility()
    window.addEventListener('resize', updateNavigationVisibility)

    return () => {
      window.removeEventListener('resize', updateNavigationVisibility)
    }
  }, [recentlyViewedProducts.length, productPerRow])

  const recentlyViewedProds = () => {
    let prodStockCodes: any = []
    try {
      if (localStorage.getItem(LocalStorage.Key.RECENTLY_VIEWED)) {
        const recentProductsJson: any = decrypt(
          localStorage.getItem(LocalStorage.Key.RECENTLY_VIEWED)!
        )
        prodStockCodes = tryParseJson(recentProductsJson) || []
        console.log("---prodStockCodes---", prodStockCodes)
        async function fetchProductsByStockCodes() {
          const data = { sortBy: '', sortOrder: '', currentPage: 1, pageSize: 10, filters: [], stockCodes: prodStockCodes, }
          setIsLoading(true)
          const res: any = await axios.post(NEXT_GET_CATALOG_PRODUCTS, data)
            .then((results: any) => {
              setRecentlyViewedProducts(results?.data?.products?.results)
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
      //rm user?.email if guest user can refer
      setReferralOffers(data?.referralDetails)
      handleReferralByEmail()
    }
  }

  useEffect(() => {
    recentlyViewedProds()
  }, [])

  useEffect(() => {
    handleReferralInfo()
  }, [])
  const swiperRecently = useRef<any>(null);
  return (
    recentlyViewedProducts?.length > 0 && (
      <div className={`flex flex-col w-full container-ffx py-6 border-t border-gray-200 sm:pt-10 slider-btn-css ${isHome ? '' : ' mx-0'}`}>
        <div className="flex items-center justify-between gap-1 pr-0 mb-2 sm:pr-0 lg:gap-3 sm:mb-0">
          {featureToggle?.features?.enableForPCSite ? (
            <h2 className="mb-6 font-semibold text-black title-page">Customers who viewed items in your browsing history also viewed</h2>
          ) : (
            <h2 className="mb-5 font-semibold text-gray-900 uppercase font-18"> {translate('common.label.recentlyViewedText')} </h2>
          )}
        </div>
        <div className="mt-4 default-sm mobile-slider-no-arrow relative m-hide-navigation sm:mb-0 vertical-prod-list-ipad slider-equal-height">
          {isLoading ? (<LoadingDots />) : (
            <>
              {showNavigation && (
                <div className="flex justify-between mb-2 slider-out-btn">
                  <Prev onClickPrev={() => swiperRecently.current?.swiper?.slidePrev()} />
                  <Next onClickNext={() => swiperRecently.current?.swiper?.slideNext()} />
                </div>
              )}
              <Swiper slidesPerView={1.4} spaceBetween={10} ref={swiperRecently} navigation={false} loop={true} breakpoints={{ 640: { slidesPerView: 2.3, spaceBetween: 4 }, 768: { slidesPerView: 3, spaceBetween: 16 }, 1024: { slidesPerView: 4, spaceBetween: 16 }, 1800: { slidesPerView: productPerRow, spaceBetween: 16 }, }} className={`${isMobile ? 'mob-navigation-hide' : ''} mySwiper`}>
                {recentlyViewedProducts?.map((product: any, pid: number) => {
                  return (
                    <SwiperSlide key={pid} className="height-equal">
                      {isHome ? (
                        <HomeProductCardMin onlyImage={true} deviceInfo={deviceInfo} data={product} featureToggle={featureToggle} defaultDisplayMembership={defaultDisplayMembership} />
                      ) : (
                        <ProductCard data={product} deviceInfo={deviceInfo} maxBasketItemsCount={maxBasketItemsCount(config)} featureToggle={featureToggle} defaultDisplayMembership={defaultDisplayMembership} />
                      )}
                    </SwiperSlide>
                  )
                })}
              </Swiper>
            </>
          )}
        </div>
      </div>
    )
  )
}
