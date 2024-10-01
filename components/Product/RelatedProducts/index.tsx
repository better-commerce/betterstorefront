import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { groupBy, sortBy } from 'lodash'
import SwiperCore, { Navigation } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import cartHandler from '@components/services/cart'
import { useUI } from '@components/ui/context'
import { getCurrentPage, removePrecedingSlash } from '@framework/utils/app-util'
import { useTranslation } from '@commerce/utils/use-translation'
import { AnalyticsEventType } from '@components/services/analytics'
import { SITE_ORIGIN_URL } from '@components/utils/constants'
import Router from 'next/router'
import useAnalytics from '@components/services/analytics/useAnalytics'
const PLPQuickView = dynamic(() => import('@components/Product/QuickView/PLPQuickView'))
const ProductCard = dynamic(() => import('@components/ProductCard'))

declare const window: any
interface Attribute {
  fieldName?: string
  fieldCode?: string
  fieldValues?: []
}

// swiper setup
SwiperCore.use([Navigation])

export default function RelatedProducts({
  relatedProducts,
  productPerColumn,
  checkout_refrence,
  title,
  handleQuickAddToBag,
  deviceInfo,
  maxBasketItemsCount,
  featureToggle,
  defaultDisplayMembership
}: any) {
  const { recordAnalytics } = useAnalytics()
  const translate = useTranslation()
  const { basketId, setCartItems, user } = useUI()
  const [quickViewProduct, setQuickViewProduct] = useState<any>(undefined)
  const [relatedProductsData, setRelatedProductsData] = useState<any>(null)
  let currentPage = getCurrentPage()

  useEffect(() => {
    if (relatedProducts?.length) {
      // sort the data by 'displayOrder'
      const sortedData = sortBy(relatedProducts, 'displayOrder')

      // group the data by specific group name
      const groupLength = sortedData?.find(
        (x: any) => x.groupNameList
      )?.groupNameList
      let relatedProductGroup: any
      if (groupLength?.length === 2) {
        relatedProductGroup = groupBy(sortedData, 'groupNameList[1].name')
      } else {
        relatedProductGroup = groupBy(sortedData, 'groupNameList[0].name')
      }
      setRelatedProductsData(relatedProductGroup)
    }
  }, [relatedProducts])

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

  const css = { maxWidth: '100%', height: 'auto' }

  // record analytics
  function viewProductDetail(product: any, pid: number) {
    if (typeof window !== 'undefined') {
      debugger
      recordAnalytics(AnalyticsEventType.PDP_VIEW_DETAILS, { ...product, position: pid + 1, currentPage, sectionTitle: 'Frequently Bought Together', })
      let color = ''
      if (product?.variantGroupCode) {
        color = product?.variantGroupCode?.split('-')[1]
      }
      const extras = { originalLocation: SITE_ORIGIN_URL + Router.asPath }
      recordAnalytics(AnalyticsEventType.PDP_VIEW, { ...product, ...{ ...extras }, color, itemIsBundleItem: false, })
      recordAnalytics(AnalyticsEventType.VIEW_PRODUCT_DETAILS, { ...product, header: title, currentPage: 'Cart', })

      if (checkout_refrence == true) {
        recordAnalytics(AnalyticsEventType.REFERRER_BANNERS, { ...product, categoryPosition: 'Checkout', header: title, position: pid + 1, currentPage: 'Cart', })
      }
    }
  }

  const onProductQuickView = (product: any, pid: any) => {
    setQuickViewProduct(product)
    if (typeof window !== 'undefined') {
      debugger
      const extras = { originalLocation: SITE_ORIGIN_URL + Router.asPath }
      recordAnalytics(AnalyticsEventType.PDP_QUICK_VIEW, { ...product, ...{ ...extras }, position: pid + 1, })
      recordAnalytics(AnalyticsEventType.PDP_QUICK_VIEW_CLICK, { ...product, position: pid + 1, currentPage: 'Cart', header: title, })
    }
  }

  const handleCloseQuickView = () => {
    setQuickViewProduct(undefined)
  }

  if (!relatedProductsData) {
    return <></>
  }

  return (
    <>
      <section aria-labelledby="related-heading" className="px-0 pr-0 sm:px-0">
        {Object.entries(relatedProductsData)?.map(
          ([key, values]: any, idx: number) => {
            return (
              key != 'You May Also Like' && (
                <div key={idx}>
                  <div>
                    <div className="flex flex-col mb-3">
                      <h2 className="text-lg font-medium text-gray-900">
                        {key == 'You May Also Like'
                          ? translate('label.product.frequentlyBoughtTogetherText')
                          : key == 'undefined'
                            ? translate('label.product.frequentlyBoughtTogetherText')
                            : key == 'Upgrade'
                              ? translate('label.product.quickAddText')
                              : key == 'Basket Group'
                                ? translate('label.product.frequentlyBoughtTogetherText')
                                : translate(`key.${key}`)}
                      </h2>
                    </div>
                  </div>
                  <div className="mb-8 default-sm mobile-slider-no-arrow m-hide-navigation sm:mb-8">
                    <Swiper
                      slidesPerView={2.3}
                      spaceBetween={8}
                      navigation={true}
                      loop={false}
                      breakpoints={{
                        640: { slidesPerView: 2.3, spaceBetween: 4 },
                        768: { slidesPerView: 2.3, spaceBetween: 15 },
                        1024: { slidesPerView: 2.3, spaceBetween: 15 },
                      }}
                      className="mySwiper"
                    >
                      {values?.map((product: any, pid: number) => {
                        return (
                          <SwiperSlide key={pid}>
                            <ProductCard
                              data={product}
                              deviceInfo={deviceInfo}
                              maxBasketItemsCount={maxBasketItemsCount} featureToggle={featureToggle} defaultDisplayMembership={defaultDisplayMembership} />
                          </SwiperSlide>
                        )
                      })}
                    </Swiper>
                  </div>
                </div>
              )
            )
          }
        )}
      </section>
      <PLPQuickView
        isQuickview={Boolean(quickViewProduct)}
        setQuickview={() => { }}
        productData={quickViewProduct}
        isQuickviewOpen={Boolean(quickViewProduct)}
        setQuickviewOpen={handleCloseQuickView}
        maxBasketItemsCount={maxBasketItemsCount}
      />
    </>
  )
}
