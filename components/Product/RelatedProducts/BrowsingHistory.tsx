// Base Imports
import React, { useEffect, useState, useRef } from 'react'
import dynamic from 'next/dynamic'

// Package Imports
import axios from 'axios'
import { maxBasketItemsCount } from '@framework/utils/app-util'
import { Swiper, SwiperSlide } from 'swiper/react'
import { decrypt } from '@framework/utils/cipher'
import 'swiper/css'
import 'swiper/css/navigation'

// Component Imports
const ProductCard = dynamic(() => import('@components/ProductCard'))
import { LoadingDots } from '@components/ui'

// Other Imports
import { NEXT_GET_CATALOG_PRODUCTS, NEXT_GET_RECENTLY_VIEWED_PRODUCTS } from '@components/utils/constants'
import { LocalStorage } from '@components/utils/payment-constants'
import { tryParseJson } from '@framework/utils/parse-util'
import { useTranslation } from '@commerce/utils/use-translation'

const BrowsingHistoryProducts = ({ deviceInfo, config, productPerRow, featureToggle, defaultDisplayMembership, }: any) => {
  const translate = useTranslation()
  const [recentlyViewedState, setRecentlyViewedState] = useState<any>([])
  const swiperRefBasket: any = useRef(null)
  const [isLoading, setIsLoading] = useState(true)

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
            pageSize: 20,
            filters: [],
            stockCodes: prodStockCodes,
            excludeOOSProduct: false,
            IgnoreDisplayInSerach: true
          }
          setIsLoading(true)
          const res: any = await axios
            .post(NEXT_GET_RECENTLY_VIEWED_PRODUCTS, data)
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

  useEffect(() => {
    recentlyViewedProds()
  }, [])

  if (recentlyViewedState?.length == 0) {
    return null
  }

  return (
    <>
      {recentlyViewedState?.length > 0 && (
        <div className="flex flex-col pt-5 sm:pt-10">
          <div className="flex items-center justify-between gap-1 pb-2 pr-0 mb-2 sm:pr-0 lg:gap-3 sm:mb-0 sm:pb-4">
            <h2 className="flex items-center text-2xl font-semibold md:text-3xl">
              {translate('common.label.topViewed')}
            </h2>            
          </div>
          <div className="mt-4 default-sm mobile-slider-no-arrow m-hide-navigation sm:mb-0 vertical-prod-list-ipad">
            {isLoading ? (<LoadingDots />) : (
              <div className='grid grid-cols-5 gap-6'>
                {recentlyViewedState?.map((product: any, pid: number) => (
                  <div key={`product-${pid}`}>
                    <ProductCard data={product} deviceInfo={deviceInfo} maxBasketItemsCount={maxBasketItemsCount(config)} featureToggle={featureToggle} defaultDisplayMembership={defaultDisplayMembership} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default BrowsingHistoryProducts