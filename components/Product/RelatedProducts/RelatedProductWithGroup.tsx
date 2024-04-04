import dynamic from 'next/dynamic'
import { useUI } from '@components/ui'
import { useState } from 'react'
import { getCurrentPage } from '@framework/utils/app-util'
import { recordGA4Event } from '@components/services/analytics/ga4'
import { Swiper, SwiperSlide } from 'swiper/react'
import cartHandler from '@components/services/cart'
import 'swiper/css'
import 'swiper/css/navigation'
const ProductCard = dynamic(() => import('@components/ProductCard'))
export default function RelatedProductWithGroup({ products, productPerColumn, deviceInfo, maxBasketItemsCount }: any) {
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
        recordGA4Event(window, 'popup_view', {
          product_name: product?.name,
          category: product?.classification?.mainCategoryName,
          page: window.location.href,
          position: pid + 1,
          color: product?.variantGroupCode,
          price: product?.price?.raw?.withTax,
          current_page: currentPage,
        })
      }
    }

    if (currentPage) {
      if (typeof window !== 'undefined') {
        recordGA4Event(window, 'quick_view_click', {
          ecommerce: {
            items: {
              product_name: product?.name,
              position: pid + 1,
              product_price: product?.price?.raw?.withTax,
              color: product?.variantGroupCode,
              category: product?.classification?.mainCategoryName,
              current_page: currentPage,
              header: 'You May Also Like',
            },
          },
        })
      }
    }
  }
  return (
    <>
      <Swiper slidesPerView={1} spaceBetween={20} navigation={true} loop={true} breakpoints={{ 640: { slidesPerView: 1.5 }, 768: { slidesPerView: productPerColumn }, 1024: { slidesPerView: productPerColumn }, }} >
        {products?.map((product: any, pId: number) => (
          <SwiperSlide key={pId} className="relative inline-flex flex-col w-64 text-left border border-gray-200 rounded shadow cursor-pointer height-auto-slide group lg:w-auto h-100">
            <ProductCard data={product} deviceInfo={deviceInfo} maxBasketItemsCount={maxBasketItemsCount} />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  )
}
