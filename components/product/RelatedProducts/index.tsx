import { useEffect, useState } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import cn from 'classnames'
import { groupBy, round, sortBy } from 'lodash'
import SwiperCore, { Navigation } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'

// @components
import cartHandler from '@components/services/cart'
import { useUI } from '@components/ui/context'
const Engraving = dynamic(() => import('@components/product/Engraving'))
import {
  GENERAL_ADD_TO_BASKET,
  GENERAL_ENGRAVING,
  GENERAL_QUICK_VIEW,
  IMG_PLACEHOLDER,
  ITEM_TYPE_ADDON,
} from '@components/utils/textVariables'
const PLPQuickView = dynamic(
  () => import('@components/product/QuickView/PLPQuickView')
)

// @others
import { getCurrentPage, removePrecedingSlash } from '@framework/utils/app-util'
import { recordGA4Event } from '@components/services/analytics/ga4'
import { priceFormat } from '@framework/utils/parse-util'
import { generateUri } from '@commerce/utils/uri-util'

// constants
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
}: any) {
  const {
    basketId,
    setCartItems,
    user,
  } = useUI()
  const [quickViewProduct, setQuickViewProduct] = useState<any>(undefined)
  const [isEngravingOpen, showEngravingModal] = useState(false)
  const [relatedProductsData, setRelatedProductsData] = useState<any>(null);
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
                        {key == "You May Also Like" ? "Frequent Bought Together" : key == "undefined" ? "Frequent Bought Together" : key == "Upgrade" ? "Quick Add" : key == "Basket Group" ? "Frequent Bought Together" : key}
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
                        640: {
                          slidesPerView: 2.3,
                          spaceBetween: 4,
                        },
                        768: {
                          slidesPerView: 2.3,
                          spaceBetween: 15,
                        },
                        1024: {
                          slidesPerView: 2.3,
                          spaceBetween: 15,
                        },
                      }}
                      className="mySwiper"
                    >
                      {values?.map((product: any, pid: number) => {
                        const isEngravingAvailable =
                          product.stockCode === ITEM_TYPE_ADDON
                        const saving =
                          product?.price?.maxPrice -
                          product?.price?.minPrice
                        const discount = round(
                          (saving / product?.price?.maxPrice) * 100,
                          0
                        )
                        return (
                          <SwiperSlide key={pid}>
                            <div className="grid w-full grid-cols-1 text-left">
                              <div className="relative">
                                <div className="overflow-hidden border border-gray-200 rounded-md">
                                  <Link
                                    href={`/${removePrecedingSlash(
                                      product?.slug
                                    )}`}
                                    passHref
                                    legacyBehavior
                                  >
                                    <a
                                      onClick={() =>
                                        viewProductDetail(product, pid)
                                      }
                                    >
                                      <Image
                                        src={
                                          generateUri(
                                            product?.image,
                                            'h=300&fm=webp'
                                          ) || IMG_PLACEHOLDER
                                        }
                                        className="object-cover object-center w-full h-full radius-xs sm:h-full"
                                        alt={product?.name}
                                        priority
                                        width={284}
                                        height={505}
                                        style={css}
                                      />
                                    </a>
                                  </Link>
                                </div>
                                {/* <div className="grid grid-cols-12 px-2 sm:grid-cols-12 sm:gap-x-2">
                                <div className="col-span-8 text-left sm:col-span-8 hf-28px">
                                  <h5 className="w-11/12 py-1 mt-1 overflow-hidden font-normal truncate text-10 text-brown-light dark:text-brown-light sm:text-10 sm:group-hover:hidden fh-24">
                                    {product?.classification?.category}
                                  </h5>
                                </div>
                                {product?.rating > 0 && (
                                  <div className="col-span-4 text-right sm:col-span-4">
                                    <i className="sprite-icon sprite-star"></i>
                                    <span className="ml-2 font-semibold text-12 text-primary dark:text-primary">
                                      {product?.rating}
                                    </span>
                                  </div>
                                )}
                              </div> */}
                                <div className="relative px-0 text-left">
                                  <h3 className="px-0 py-1 font-normal leading-4 text-primary dark:text-primary sm:group-hover:hidden text-sm">
                                    <Link
                                      href={`/${removePrecedingSlash(
                                        product?.slug
                                      )}`}
                                      passHref
                                      legacyBehavior
                                    >
                                      <a
                                        href={`/${removePrecedingSlash(
                                          product?.slug
                                        )}`}
                                        onClick={() =>
                                          viewProductDetail(product, pid)
                                        }
                                      >
                                        {product?.name}
                                      </a>
                                    </Link>
                                  </h3>
                                </div>

                                <div className="flex px-0">
                                  <p className="mt-2 mb-2 font-medium text-left text-primary xs-text-10 text-12 sm:mt-1 sm:group-hover:hidden sm:mb-0">
                                    {priceFormat(product?.price?.minPrice)}
                                    {discount > 0 ? (
                                      <>
                                        <span className="px-1 font-normal text-gray-400 line-through sm:px-2 xs-text-10 text-12">
                                          {priceFormat(
                                            product?.price?.maxPrice
                                          )}
                                        </span>
                                        <span className="inline-block xs-text-10 text-12 text-green">
                                          {discount}% off
                                        </span>
                                      </>
                                    ) : null}
                                  </p>
                                </div>
                              </div>
                              <div className="flex justify-around mt-2">
                                <button
                                  onClick={() => {
                                    if (key === 'Upgrade') {
                                      handleQuickAddToBag(product, key)
                                    } else {
                                      onProductQuickView(product, pid)
                                    }
                                  }}
                                  type="button"
                                  className={cn(
                                    'relative flex items-center justify-center w-full px-1 py-1 text-xs font-semibold sm:text-sm btn-basic-property-sm cart-btn',
                                    {
                                      'border-black bg-black hover:bg-gray-900 text-white':
                                        key === 'Upgrade',
                                      'text-black bg-white border border-gray-300':
                                        key !== 'Upgrade',
                                    }
                                  )}
                                >
                                  {key === 'Upgrade'
                                    ? GENERAL_ADD_TO_BASKET
                                    : GENERAL_QUICK_VIEW}
                                </button>
                                <Link
                                  href={`/${removePrecedingSlash(
                                    product?.slug
                                  )}`}
                                  passHref
                                >
                                  <span className="sr-only">
                                    , {product.name}
                                  </span>
                                </Link>
                                {isEngravingAvailable && (
                                  <>
                                    <button
                                      className="relative flex items-center justify-center w-full py-2 mt-2 text-sm font-semibold text-white bg-gray-400 border border-transparent rounded-md btn-basic-property cart-btn hover:bg-gray-500"
                                      onClick={() => showEngravingModal(true)}
                                    >
                                      <span className="font-bold">
                                        {GENERAL_ENGRAVING}
                                      </span>
                                    </button>
                                    <Engraving
                                      show={isEngravingOpen}
                                      submitForm={() => addToCart(product)}
                                      onClose={() => showEngravingModal(false)}
                                    />
                                  </>
                                )}
                              </div>
                            </div>
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
