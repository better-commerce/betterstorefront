import dynamic from 'next/dynamic'
import { useUI } from '@components/ui'
import { useRef, useState } from 'react'
import { getCurrentPage } from '@framework/utils/app-util'
import cartHandler from '@components/services/cart'
import AddonCard from './AddonCard'
import { AnalyticsEventType } from '@components/services/analytics'
import { SITE_ORIGIN_URL } from '@components/utils/constants'
import Router from 'next/router'
import useAnalytics from '@components/services/analytics/useAnalytics'
const QuickViewModal = dynamic(() => import('@components/Product/QuickView/ProductQuickView'))

export default function CartAddonProducts({ products, deviceInfo, maxBasketItemsCount }: any) {
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
          manualUnitPrice: product.price.raw.withoutTax,
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
        recordAnalytics(AnalyticsEventType.PDP_QUICK_VIEW, { ...product, ...{ ...extras }, position: pid + 1, })
      }
    }

    if (currentPage) {
      if (typeof window !== 'undefined') {
        //debugger
        recordAnalytics(AnalyticsEventType.PDP_QUICK_VIEW_CLICK, { ...product, position: pid + 1, currentPage, header: 'Related Products', })
      }
    }
  }

  const swiperRefBasket: any = useRef(null)
  return (
    <>
      {products?.map((product: any, pId: number) => (
        <div
          key={product?.stockCode}
          className="relative inline-flex flex-col cursor-pointer height-auto-slide group lg:w-auto h-100 vertical-prod-list-ipad"
        >
          <AddonCard
            product={product}
            hideWishlistCTA={true}
            deviceInfo={deviceInfo}
            maxBasketItemsCount={maxBasketItemsCount}
          />
        </div>
      ))}
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
