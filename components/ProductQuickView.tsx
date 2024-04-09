"use client";
import React, { FC, useEffect, useState } from "react";
import LikeButton from "@components/LikeButton";
import { StarIcon } from "@heroicons/react/24/solid";
import { HeartIcon } from "@heroicons/react/24/outline";
import Prices from "@components/Prices";
import detail1JPG from "images/products/detail1.jpg";
import detail2JPG from "images/products/detail2.jpg";
import detail3JPG from "images/products/detail3.jpg";
import AccordionInfo from "@components/AccordionInfo";
import Link from "next/link";
import { generateUri } from "@commerce/utils/uri-util";
import { IMG_PLACEHOLDER, ITEM_TYPE_ADDON } from "@components/utils/textVariables";
import AttributesHandler from "@components/Product/AttributesHandler";
import axios from "axios";
import { Messages, NEXT_CREATE_WISHLIST, NEXT_GET_PRODUCT_QUICK_VIEW, NEXT_GET_PRODUCT_REVIEW } from "@components/utils/constants";
import ProductTag from "@components/Product/ProductTag";
import { useUI } from "@components/ui";
const Button = dynamic(() => import('@components/ui/IndigoButton'))
import { cartItemsValidateAddToCart, getCurrentPage } from "@framework/utils/app-util";
import { matchStrings, stringFormat } from "@framework/utils/parse-util";
import cartHandler from "@components/services/cart";
import { recordGA4Event } from "@components/services/analytics/ga4";
import wishlistHandler from "@components/services/wishlist";
import dynamic from "next/dynamic";
import { useTranslation } from "@commerce/utils/use-translation";
import { PRODUCTS } from "./Product/data";

export interface ProductQuickViewProps {
  className?: string;
  product?: any;
  maxBasketItemsCount?: any
  onCloseModalQuickView?: any
}

const ProductQuickView: FC<ProductQuickViewProps> = ({ className = "", product, maxBasketItemsCount, onCloseModalQuickView }) => {
  const { sizes, variants, status, allOfSizes } = PRODUCTS[0];
  const LIST_IMAGES_DEMO = [detail1JPG, detail2JPG, detail3JPG];
  const { openNotifyUser, basketId, cartItems, setCartItems, user, setAlert, removeFromWishlist, addToWishlist, openWishlist } = useUI()
  const { isInWishList, deleteWishlistItem } = wishlistHandler()
  const [selectedAttrData, setSelectedAttrData] = useState({ productId: product?.recordId, stockCode: product?.stockCode, ...product, })
  const [variantInfo, setVariantInfo] = useState<any>({ variantColour: '', variantSize: '', })
  const [quickViewData, setQuickViewData] = useState<any>(undefined)
  const [reviewData, setReviewData] = useState<any>(undefined)
  const [isEngravingOpen, showEngravingModal] = useState(false)
  const [sizeInit, setSizeInit] = useState('')
  let currentPage = getCurrentPage()
  const translate = useTranslation();
  const handleSetProductVariantInfo = ({ colour, clothSize }: any) => {
    if (colour) {
      setVariantInfo((v: any) => ({
        ...v,
        variantColour: colour,
      }))
    }
    if (clothSize) {
      setVariantInfo((v: any) => ({
        ...v,
        variantSize: clothSize,
      }))
    }
  }
  const productSlug: any = product?.slug;
  const handleFetchProductQuickView = (productSlug: any) => {
    const loadView = async (productSlug: string) => {
      const { data: productQuickViewData }: any = await axios.post(NEXT_GET_PRODUCT_QUICK_VIEW, { slug: productSlug })
      const data = productQuickViewData?.product
      const { data: reviewData }: any = await axios.post(NEXT_GET_PRODUCT_REVIEW, { recordId: data?.recordId })
      setQuickViewData(data)
      setReviewData(reviewData?.review)
      if (data) {
        setSelectedAttrData({ productId: data?.recordId, stockCode: data?.stockCode, ...data, })
      }
    }
    if (productSlug) loadView(productSlug)
    return []
  }
  const fetchIsQuickView = () => {
    if (product) {
      const loadView = async (slug: string) => {
        const { data: productQuickViewData }: any = await axios.post(
          NEXT_GET_PRODUCT_QUICK_VIEW,
          { slug: slug }
        )

        const { data: reviewData }: any = await axios.post(
          NEXT_GET_PRODUCT_REVIEW,
          { recordId: productQuickViewData?.product?.recordId }
        )

        const data = productQuickViewData?.product
        setQuickViewData(productQuickViewData?.product)
        setReviewData(reviewData?.review)
        if (data) {
          setSelectedAttrData({ productId: data?.recordId, stockCode: data?.stockCode, ...data, })
        }
        // console.log('QUICKVIEW_PRODUCTDATA:',productQuickViewData?.product)
      }

      if (product?.slug) loadView(product?.slug)
    } else {
      setQuickViewData(undefined)
    }
    return [product]
  }
  useEffect(() => {

    fetchIsQuickView()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const handleNotification = () => {
    openNotifyUser(product.recordId)
  }

  const buttonTitle = () => {
    let buttonConfig: any = {
      title: translate('label.basket.addToBagText'),
      validateAction: async () => {
        const cartLineItem: any = cartItems?.lineItems?.find((o: any) => {
          if (matchStrings(o.productId, selectedAttrData?.recordId, true) || matchStrings(o.productId, selectedAttrData?.productId, true)) {
            return o
          }
        })
        if (selectedAttrData?.currentStock === cartLineItem?.qty && !selectedAttrData?.fulfilFromSupplier && !selectedAttrData?.flags?.sellWithoutInventory) {
          setAlert({ type: 'error', msg: translate('common.message.cartItemMaxAddedErrorMsg'), })
          return false
        }
        const isValid = cartItemsValidateAddToCart(cartItems, maxBasketItemsCount,)
        if (!isValid) {
          setAlert({
            type: 'error', msg: stringFormat(stringFormat(translate('common.message.basket.maxBasketItemsCountErrorMsg'), { maxBasketItemsCount }), { maxBasketItemsCount, }),
          })
        }
        return isValid
      },
      action: async () => {
        const item = await cartHandler().addToCart(
          {
            basketId: basketId,
            productId: selectedAttrData.productId,
            qty: 1,
            manualUnitPrice: product.price.raw.withTax,
            stockCode: selectedAttrData.stockCode,
            userId: user.userId,
            isAssociated: user.isAssociated,
          },
          'ADD',
          { product: selectedAttrData }
        )
        setCartItems(item)
        setModalClose()
        if (typeof window !== 'undefined') {
          recordGA4Event(window, 'add_to_cart', {
            ecommerce: {
              items: [
                {
                  item_name: product?.name,
                  item_brand: product?.brand,
                  item_variant: product?.variantGroupCode,
                  quantity: 1,
                  item_id: product?.productCode,
                  price: product?.price?.raw?.withTax,
                  item_var_id: product?.stockCode,
                  // index: position,
                },
              ],
              cart_quantity: 1,
              total_value: product?.price?.raw?.withTax,
              current_page: 'PLP ',
              section_title: 'Quick View',
            },
          })

          if (currentPage) {
            recordGA4Event(window, 'view_cart', {
              ecommerce: {
                items: cartItems?.lineItems?.map(
                  (items: any, itemId: number) => ({
                    item_name: items?.name,
                    item_id: items?.sku,
                    price: items?.price?.raw?.withTax,
                    item_brand: items?.brand,
                    item_variant: items?.colorName,
                    item_list_id: '',
                    index: itemId,
                    quantity: items?.qty,
                    item_var_id: items?.stockCode,
                  })
                ),
                // device: deviceCheck,
                current_page: currentPage,
              },
            })
          }
        }
      },
      shortMessage: '',
    }
    if (selectedAttrData?.currentStock <= 0 && !product?.preOrder?.isEnabled && !product?.flags?.sellWithoutInventory) {
      buttonConfig.title = translate('label.product.notifyMeText')
      buttonConfig.action = async () => handleNotification()
      buttonConfig.type = 'button'
    } else if (
      product?.preOrder?.isEnabled &&
      selectedAttrData?.currentStock <= 0
    ) {
      if (
        product.preOrder.currentStock < product.preOrder.maxStock &&
        (!product.flags.sellWithoutInventory ||
          selectedAttrData.sellWithoutInventory)
      ) {
        buttonConfig.title = translate('label.product.preOrderText')
        buttonConfig.shortMessage = product.preOrder.shortMessage
        return buttonConfig
      } else if (
        product.flags.sellWithoutInventory ||
        selectedAttrData.sellWithoutInventory
      ) {
        buttonConfig = {
          title: translate('label.basket.addToBagText'),
          validateAction: async () => {
            const cartLineItem: any = cartItems?.lineItems?.find((o: any) => o.productId === selectedAttrData?.productId?.toUpperCase())
            if (selectedAttrData?.currentStock === cartLineItem?.qty && !selectedAttrData?.fulfilFromSupplier && !selectedAttrData?.flags?.sellWithoutInventory) {
              setAlert({
                type: 'error',
                msg: translate('common.message.cartItemMaxAddedErrorMsg'),
              })
              return false
            }
            const isValid = cartItemsValidateAddToCart(
              cartItems,
              maxBasketItemsCount
            )
            if (!isValid) {
              setAlert({
                type: 'error',
                msg: stringFormat(translate('common.message.basket.maxBasketItemsCountErrorMsg'), { maxBasketItemsCount }),

              })
            }
            return isValid
          },
          action: async () => {
            const item = await cartHandler().addToCart(
              {
                basketId: basketId,
                productId: selectedAttrData.productId,
                qty: 1,
                manualUnitPrice: product.price.raw.withTax,
                stockCode: selectedAttrData.stockCode,
                userId: user.userId,
                isAssociated: user.isAssociated,
              },
              'ADD',
              { product: selectedAttrData }
            )
            setCartItems(item)
            if (typeof window !== 'undefined') {
              recordGA4Event(window, 'add_to_cart', {
                ecommerce: {
                  items: [
                    {
                      item_name: product?.name,
                      item_brand: product?.brand,
                      item_category2:
                        product?.mappedCategories[1]?.categoryName,
                      item_variant: product?.variantGroupCode,
                      quantity: 1,
                      item_id: product?.productCode,
                      price: product?.price?.raw?.withTax,
                      item_var_id: product?.stockCode,
                      item_list_name:
                        product?.mappedCategories[2]?.categoryName,
                      // index: position,
                    },
                  ],
                  cart_quantity: 1,
                  total_value: product?.price?.raw?.withTax,
                  current_page: 'PLP ',
                  section_title: 'Quick View',
                },
              })

              if (currentPage) {
                recordGA4Event(window, 'view_cart', {
                  ecommerce: {
                    items: cartItems?.lineItems?.map(
                      (items: any, itemId: number) => ({
                        item_name: items?.name,
                        item_id: items?.sku,
                        price: items?.price?.raw?.withTax,
                        item_brand: items?.brand,
                        item_category2: items?.categoryItems?.length
                          ? items?.categoryItems[1]?.categoryName
                          : '',
                        item_variant: items?.colorName,
                        item_list_name: items?.categoryItems?.length
                          ? items?.categoryItems[0]?.categoryName
                          : '',
                        item_list_id: '',
                        index: itemId,
                        quantity: items?.qty,
                        item_var_id: items?.stockCode,
                      })
                    ),
                    // device: deviceCheck,
                    current_page: currentPage,
                  },
                })
              }
            }
          },
          shortMessage: '',
        }
      } else {
        buttonConfig.title = translate('label.product.notifyMeText')
        buttonConfig.action = async () => handleNotification()
        buttonConfig.type = 'button'
        return buttonConfig
      }
    }
    return buttonConfig
  }
  const setModalClose = () => {
    setSelectedAttrData(undefined)
    setQuickViewData(undefined)
    onCloseModalQuickView()
  }
  const isEngravingAvailable = !!product?.relatedProducts?.filter(
    (item: any) => item?.stockCode === ITEM_TYPE_ADDON
  ).length
  const buttonConfig = buttonTitle()

  const insertToLocalWishlist = () => {
    addToWishlist(product)
    openWishlist()
  }
  const handleWishList = () => {
    const product = { ...quickViewData, productId: selectedAttrData.productId, stockCode: selectedAttrData.stockCode, }
    if (isInWishList(product?.productId)) {
      deleteWishlistItem(user?.userId, product?.productId)
      removeFromWishlist(product?.productId)
      openWishlist()
      return
    }
    let productAvailability = 'Yes'
    if (product?.currentStock > 0) {
      productAvailability = 'Yes'
    } else {
      productAvailability = 'No'
    }

    if (typeof window !== 'undefined') {
      recordGA4Event(window, 'wishlist', {
        ecommerce: {
          header: 'PLP',
          current_page: 'Quick view ',
        },
      })
      recordGA4Event(window, 'add_to_wishlist', {
        ecommerce: {
          items: [
            {
              item_name: product?.name,
              item_brand: product?.brand,
              item_variant: product?.variantGroupCode,
              quantity: 1,
              stockCode: product?.stockCode,
              price: product?.price?.raw?.withTax,
              item_list_name: product?.mappedCategories[0]?.categoryName,
              item_id: product?.productCode,
              item_var_id: product?.stockCode,
            },
          ],
          item_var_id: product?.stockCode,
          header: 'Quick View',
          current_page: 'Quick View',
          availability: productAvailability,
        },
      })
    }

    if (currentPage) {
      if (typeof window !== 'undefined') {
        recordGA4Event(window, 'wishlist', {
          ecommerce: {
            header: 'Quick View',
            current_page: currentPage,
          },
        })
      }
    }

    const accessToken = localStorage.getItem('user')
    if (accessToken) {
      const createWishlist = async () => {
        try {
          await axios.post(NEXT_CREATE_WISHLIST, {
            id: user.userId,
            productId: product?.productId,
            flag: true,
          })
          insertToLocalWishlist()
        } catch (error) {
          console.log(error, 'error')
        }
      }
      createWishlist()
    } else insertToLocalWishlist()
  }
  const renderVariants = () => {
    return (
      <div>
        {quickViewData &&
          <AttributesHandler
            product={quickViewData}
            variant={selectedAttrData}
            setSelectedAttrData={setSelectedAttrData}
            variantInfo={variantInfo}
            handleSetProductVariantInfo={handleSetProductVariantInfo}
            handleFetchProductQuickView={handleFetchProductQuickView}
            isQuickView={true}
            sizeInit={sizeInit}
            setSizeInit={setSizeInit} />
        }
      </div>
    );
  };


  const renderStatus = () => {
    if (!status) {
      return null;
    }
    const CLASSES = "absolute top-3 start-3";
    return (
      <div className={CLASSES}>
        <ProductTag product={product} />
      </div>
    )
  };

  const renderSectionContent = () => {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-semibold transition-colors hover:text-primary-6000">
            <Link href={`/${product?.slug}`} onClick={onCloseModalQuickView}>{product?.name}</Link>
          </h2>
          <div className="flex items-center justify-start mt-5 space-x-4 rtl:justify-end sm:space-x-5 rtl:space-x-reverse">
            <Prices contentClass="py-1 px-2 md:py-1.5 md:px-3 text-lg font-semibold" price={product?.price} listPrice={product?.listPrice} />
            {product?.reviewCount > 0 &&
              <>
                <div className="h-6 border-s border-slate-300 dark:border-slate-700"></div>
                <div className="flex items-center">
                  <Link href={`/${product?.slug}`} onClick={onCloseModalQuickView} className="flex items-center text-sm font-medium" >
                    <StarIcon className="w-5 h-5 pb-[1px] text-yellow-400" />
                    <div className="ms-1.5 flex">
                      <span>{product?.rating}</span>
                      <span className="block mx-2">·</span>
                      <span className="underline text-slate-600 dark:text-slate-400">
                        {product?.reviewCount} {translate('common.label.reviews')}
                      </span>
                    </div>
                  </Link>
                </div>
              </>
            }
          </div>
        </div>
        <div className="">{renderVariants()}</div>

        <div className="flex rtl:space-x-reverse">
          {!isEngravingAvailable && (
            <div className="flex mt-6 sm:mt-4 !text-sm w-full">
              <Button title={buttonConfig.title} action={buttonConfig.action} buttonType={buttonConfig.type || 'cart'} />
              <button type="button" onClick={handleWishList} className="flex items-center justify-center ml-4 border border-gray-300 rounded-full hover:bg-red-50 hover:text-pink hover:border-pink btn">
                {isInWishList(selectedAttrData?.productId) ? (
                  <HeartIcon className="flex-shrink-0 w-6 h-6 text-pink" />
                ) : (
                  <HeartIcon className="flex-shrink-0 w-6 h-6" />
                )}
                <span className="sr-only"> {translate('label.product.addTofavouriteText')} </span>
              </button>
            </div>
          )}

          {isEngravingAvailable && (
            <>
              <div className="flex mt-6 sm:mt-8 sm:flex-col1">
                <Button className="block py-3 sm:hidden" title={buttonConfig.title} action={buttonConfig.action} buttonType={buttonConfig.type || 'cart'} />
              </div>
              <div className="flex mt-6 sm:mt-8 sm:flex-col1">
                <Button className="hidden sm:block " title={buttonConfig.title} action={buttonConfig.action} buttonType={buttonConfig.type || 'cart'} />
                <button className="flex items-center justify-center flex-1 max-w-xs px-8 py-3 font-medium text-white uppercase bg-gray-400 border border-transparent rounded-sm sm:ml-4 hover:bg-pink focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-gray-500 sm:w-full" onClick={() => showEngravingModal(true)} >
                  <span className="font-bold"> {translate('label.product.engravingText')} </span>
                </button>
                <button type="button" onClick={handleWishList} className="flex items-center justify-center px-4 py-2 ml-4 text-gray-500 bg-white border border-gray-300 rounded-full hover:bg-red-50 hover:text-pink sm:px-10 hover:border-pink" >
                  {isInWishList(selectedAttrData?.productId) ? (
                    <HeartIcon className="flex-shrink-0 w-6 h-6 text-pink" />
                  ) : (
                    <HeartIcon className="flex-shrink-0 w-6 h-6" />
                  )}
                  <span className="sr-only"> {translate('label.product.addTofavouriteText')} </span>
                </button>
              </div>
            </>
          )}
        </div>
        <hr className=" border-slate-200 dark:border-slate-700"></hr>
        {quickViewData && <AccordionInfo data={[{ name: translate('label.product.bundles.descriptionText'), content: quickViewData?.description }]} />}
      </div>
    );
  };

  return (
    <div className={`nc-ProductQuickView ${className}`}>
      <div className="lg:flex">
        <div className="w-full lg:w-[50%] ">
          <div className="relative">
            <div className="aspect-w-16 aspect-h-16">
              <img src={generateUri(product?.image, 'h=1000&fm=webp') || IMG_PLACEHOLDER} className="object-cover object-top w-full rounded-xl" alt={product?.name} />
            </div>
            {renderStatus()}            
          </div>
          <div className="hidden grid-cols-2 gap-3 mt-3 lg:grid sm:gap-6 sm:mt-6 xl:gap-5 xl:mt-5">
            {product?.images?.slice(0, 2).map((item: any, index: number) => {
              return (
                <div key={index} className="aspect-w-3 aspect-h-4">
                  <img src={generateUri(item?.url, 'h=400&fm=webp') || IMG_PLACEHOLDER} className="object-cover object-top w-full rounded-xl" alt={product?.name} />
                </div>
              );
            })}
          </div>
        </div>
        <div className="w-full lg:w-[50%] pt-6 lg:pt-0 lg:ps-7 xl:ps-8">
          {renderSectionContent()}
        </div>
      </div>
    </div>
  );
};

export default ProductQuickView;
