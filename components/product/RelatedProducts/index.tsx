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
import { recordGA4Event } from '@components/services/analytics/ga4'
const PLPQuickView = dynamic(
  () => import('@components/product/QuickView/PLPQuickView')
)
const ProductCard = dynamic(
  () => import('@components/product/ProductCard/ProductCard')
)
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
}: any) {
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
      recordGA4Event(window, 'select_item', {
        ecommerce: {
          items: [
            {
              item_id: product?.sku,
              item_name: product?.name,
              price: product?.price?.raw?.withTax,
              item_brand: product?.brand,
              item_category: product?.classification?.mainCategoryName,
              item_category2: product?.classification?.category,
              item_variant: product?.variantGroupCode,
              item_list_name: product?.classification?.category,
              item_list_id: product?.classification?.categoryId,
              index: pid + 1,
            },
          ],
          color: product?.variantGroupCode,
          position: pid + 1,
          item_var_id: product?.stockCode,
          current_page: currentPage,
          section_title: 'Frequently Bought Together',
        },
      })
      recordGA4Event(window, 'view_item', {
        ecommerce: {
          items: [
            {
              item_name: product?.name,
              item_brand: product?.brand,
              item_category: product?.classification?.mainCategoryName,
              item_category2: product?.classification?.category,
              item_variant: product?.variantGroupCode,
              quantity: 1,
              item_id: product?.sku,
              item_var_id: product?.stockCode,
              price: product?.price?.raw?.withTax,
            },
          ],
          section_title: title,
          value: product?.price?.raw?.withTax,
        },
      })
      recordGA4Event(window, 'view_prod_details', {
        category_selected: product?.name,
        header: title,
        current_page: 'Cart',
      })
      if (checkout_refrence == true) {
        recordGA4Event(window, 'referrer_banners', {
          cross_sell_category_position: 'Checkout',
          section_title: title,
          product_name: product?.name,
          product_clicked_position: pid + 1,
          current_page: 'Cart',
        })
      }
    }
  }

  const onProductQuickView = (product: any, pid: any) => {
    setQuickViewProduct(product)
    if (typeof window !== 'undefined') {
      recordGA4Event(window, 'popup_view', {
        product_name: product?.name,
        category: product?.classification?.mainCategoryName,
        page: window.location.href,
        position: pid + 1,
        color: product?.variantGroupCode,
        price: product?.price?.raw?.withTax,
        current_page: 'Cart',
      })
      recordGA4Event(window, 'quick_view_click', {
        ecommerce: {
          items: {
            product_name: product?.name,
            position: pid + 1,
            product_price: product?.price?.raw?.withTax,
            color: product?.variantGroupCode,
            category: product?.classification?.mainCategoryName,
            current_page: 'Cart',
            header: title,
          },
        },
      })
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
                          ? 'Frequent Bought Together'
                          : key == 'undefined'
                          ? 'Frequent Bought Together'
                          : key == 'Upgrade'
                          ? 'Quick Add'
                          : key == 'Basket Group'
                          ? 'Frequent Bought Together'
                          : key}
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
                              product={product}
                              hideWishlistCTA={true}
                              deviceInfo={deviceInfo}
                              maxBasketItemsCount={maxBasketItemsCount}
                            />
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
        setQuickview={() => {}}
        productData={quickViewProduct}
        isQuickviewOpen={Boolean(quickViewProduct)}
        setQuickviewOpen={handleCloseQuickView}
      />
    </>
  )
}
