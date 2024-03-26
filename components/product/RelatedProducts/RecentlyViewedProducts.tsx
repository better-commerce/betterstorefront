// Base Imports
import { useEffect, useState, useRef } from 'react'
import dynamic from 'next/dynamic'
// Package Imports
import axios from 'axios'
import Link from 'next/link'
import { maxBasketItemsCount } from '@framework/utils/app-util'
import cartHandler from '@new-components/services/cart'
import { Swiper, SwiperSlide } from 'swiper/react'
import { decrypt } from '@framework/utils/cipher'
import 'swiper/css'
import 'swiper/css/navigation'
import { NEXT_GET_CATALOG_PRODUCTS } from '@new-components/utils/constants'

// Component Imports
import { LoadingDots } from '@new-components/ui'

// Other Imports

import { useUI } from '@new-components/ui/context'
import { LocalStorage } from '@new-components/utils/payment-constants'
import { dateFormat, tryParseJson } from '@framework/utils/parse-util'
import {
  NEXT_REFERRAL_BY_EMAIL,
  NEXT_REFERRAL_INFO,
} from '@new-components/utils/constants'
const ProductCard = dynamic(() => import('@new-components/ProductCard'))
import { useTranslation } from '@commerce/utils/use-translation'

export default function RecentlyViewedProduct({ deviceInfo, config }: any) {
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
    } catch (error) {}
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
      //rm user?.email if guest user can refer
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
    <>
      <div>
        {' '}
        {recentlyViewedState?.length > 0 && (
          <div className="flex flex-col pt-8 mt-8 border-gray-200 sm:pt-16 mx-5">
            <div className="flex flex-col w-full container-ffx">
              <div>
                <div className="flex items-center justify-between gap-1 pr-0 mb-2 sm:pr-0 lg:gap-3 sm:mb-0">
                  <h2 className="font-semibold text-gray-900 uppercase font-18 mb-5">
                    {translate('common.label.recentlyViewedText')}
                  </h2>
                </div>
                <div className="mt-4 default-sm mobile-slider-no-arrow m-hide-navigation sm:mb-0 vertical-prod-list-ipad">
                  {isLoading ? (
                    <LoadingDots />
                  ) : (
                    <Swiper
                      slidesPerView={1}
                      spaceBetween={10}
                      ref={swiperRefBasket}
                      navigation={false}
                      loop={true}
                      breakpoints={{
                        640: { slidesPerView: 1.3, spaceBetween: 4 },
                        768: { slidesPerView: 1.3, spaceBetween: 10 },
                        1024: { slidesPerView:1.3, spaceBetween: 10 },
                      }}
                      className="mySwiper"
                    >
                      {recentlyViewedState?.map((product: any, pid: number) => {
                        return (
                          <SwiperSlide key={pid} className="height-equal">
                             <ProductCard
                              data={product}
                              deviceInfo={deviceInfo}
                              maxBasketItemsCount={maxBasketItemsCount(config)}
                            />
                          </SwiperSlide>
                        )
                      })}
                    </Swiper>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
