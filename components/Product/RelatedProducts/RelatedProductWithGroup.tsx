import dynamic from 'next/dynamic'
import { useUI } from '@components/ui'
import { useRef, useState } from 'react'
import { getCurrentPage } from '@framework/utils/app-util'
import { Swiper, SwiperSlide } from 'swiper/react'
import cartHandler from '@components/services/cart'
import 'swiper/css'
import 'swiper/css/navigation'
import { SITE_ORIGIN_URL } from '@components/utils/constants'
import Router from 'next/router'
import { AnalyticsEventType } from '@components/services/analytics'
import useAnalytics from '@components/services/analytics/useAnalytics'
const ProductCard = dynamic(() => import('@components/ProductCard'))
const QuickViewModal = dynamic(() => import('@components/Product/QuickView/ProductQuickView'))
import Prev from '@components/shared/NextPrevIcon/Prev'
import Next from '@components/shared/NextPrevIcon/Next'
export default function RelatedProductWithGroup({ products, productPerColumn, deviceInfo, maxBasketItemsCount, defaultDisplayMembership, featureToggle }: any) {
  const { recordAnalytics } = useAnalytics()
  const [isQuickview, setQuickview] = useState(undefined)
  const [isQuickviewOpen, setQuickviewOpen] = useState(false)
  let currentPage = getCurrentPage()
  const { basketId, setCartItems, user } = useUI()
  const computeRelatedItems = () => {
    const relatedProductsClone = [...products]
    const tempArr: any = {}

    products.reduce((acc: any, obj: any) => {
      acc.forEach((item: any) => {
        if (item.stockCode === obj.stockCode) {
          if (!tempArr[item.relatedTypeCode]) {
            tempArr[item.relatedTypeCode] = { relatedProducts: [] }
            tempArr[item.relatedTypeCode] = {
              ...tempArr[item.relatedTypeCode],
              ...item,
            }
          }
          tempArr[item.relatedTypeCode]['relatedProducts'] = [
            ...tempArr[item.relatedTypeCode].relatedProducts,
            obj,
          ]
        }
      })
      return acc
    }, relatedProductsClone)

    return tempArr
  }

  const computedItems = computeRelatedItems()

  const addToCart = (product: any) => {
    const asyncAddToCart = async () => {
      const item = await cartHandler().addToCart(
        {
          basketId: basketId,
          productId: product.recordId,
          qty: 1,
          manualUnitPrice: product.price.raw.withTax,
          stockCode: product.stockCode,
          userId: user.userId,
          isAssociated: user.isAssociated,
        },
        'ADD',
        { product }
      )
      setCartItems(item)
    }
    asyncAddToCart()
  }
  const onViewApiKey = (product: any, pid: number) => {
    setQuickview(product)
    setQuickviewOpen(true)

    if (currentPage) {
      if (typeof window !== 'undefined') {
        //debugger
        const extras = { originalLocation: SITE_ORIGIN_URL + Router.asPath }
        recordAnalytics(AnalyticsEventType.PDP_QUICK_VIEW, { ...product, ...{ ...extras }, position: pid + 1, currentPage, })
      }
    }

    if (currentPage) {
      if (typeof window !== 'undefined') {
        //debugger
        recordAnalytics(AnalyticsEventType.PDP_QUICK_VIEW_CLICK, { ...product, position: pid + 1, currentPage, header: 'Related Products', })
      }
    }
  }
    const swiperGroup = useRef<any>(null);
  return (
    <>
    <div className='relative'>
       <div className="flex justify-between mb-2 slider-out-btn">
        <Prev onClickPrev={() => swiperGroup.current?.swiper?.slidePrev()} />
        <Next onClickNext={() => swiperGroup.current?.swiper?.slideNext()} />
        </div>
      <Swiper
        slidesPerView={1}
        spaceBetween={20}
        ref={swiperGroup}
        navigation={false}
        loop={true}
        breakpoints={{
          640: { slidesPerView: 1.5 },
          768: { slidesPerView: productPerColumn },
          1024: { slidesPerView: productPerColumn },
        }}
      >
        {products?.map((product: any, pId: number) => (
          <SwiperSlide key={pId} className="relative inline-flex flex-col w-64 text-left cursor-pointer height-auto-slide group lg:w-auto h-auto">
            <ProductCard data={product} deviceInfo={deviceInfo} maxBasketItemsCount={maxBasketItemsCount} featureToggle={featureToggle} defaultDisplayMembership={defaultDisplayMembership}            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
      <QuickViewModal
        isQuikview={isQuickview}
        setQuickview={setQuickview}
        productData={isQuickview}
        isQuickviewOpen={isQuickviewOpen}
        setQuickviewOpen={setQuickviewOpen}
        maxBasketItemsCount={maxBasketItemsCount}
      />
    </>
  )
}
