"use client";
import cn from 'classnames'
import React, { FC, useEffect, useMemo, useState } from "react";
import axios from "axios";
import dynamic from "next/dynamic";
import Link from "next/link";
import { StarIcon } from "@heroicons/react/24/solid";
import { ArrowsPointingOutIcon } from "@heroicons/react/24/outline";
import { useUI } from "@components/ui";
import { IMG_PLACEHOLDER } from "@components/utils/textVariables";
import { NEXT_CREATE_WISHLIST, NEXT_REMOVE_WISHLIST } from "@components/utils/constants";
import cartHandler from "@components/services/cart";
import wishlistHandler from "@components/services/wishlist";
import { generateUri } from "@commerce/utils/uri-util";
import { matchStrings, stringFormat, stringToBoolean } from "@framework/utils/parse-util";
import { cartItemsValidateAddToCart, getFeaturesConfig, sanitizeRelativeUrl } from "@framework/utils/app-util";
import { useTranslation } from "@commerce/utils/use-translation";
import uniqBy from 'lodash/uniqBy';
import { isMobile } from 'react-device-detect';
const ProductTag = dynamic(() => import('@components/Product/ProductTag'))
const LikeButton = dynamic(() => import('@components/LikeButton'))
const Prices = dynamic(() => import('@components/Prices'))
const ModalQuickView = dynamic(() => import('@components/ModalQuickView'))
const ButtonSecondary = dynamic(() => import('@components/shared/Button/ButtonSecondary'))
const Button = dynamic(() => import('@components/ui/IndigoButton'))

export interface ProductCardProps {
  readonly className?: string;
  readonly data?: any;
  readonly isLiked?: boolean;
  readonly deviceInfo?: any;
  readonly maxBasketItemsCount?: any;
  readonly key?: any;
  readonly featureToggle: any;
  readonly defaultDisplayMembership: any;
}

const ProductCard: FC<ProductCardProps> = ({ className = "", data, isLiked, deviceInfo, maxBasketItemsCount, key, featureToggle, defaultDisplayMembership }) => {

  const [showModalQuickView, setShowModalQuickView] = useState(false);
  const [quickViewData, setQuickViewData] = useState(null)
  const { basketId, cartItems, isGuestUser, setCartItems, user, setAlert, removeFromWishlist, addToWishlist, openWishlist, wishListItems, compareProductList, openLoginSideBar, isCompared, setCompareProducts } = useUI()
  const [isInWishList, setIsInWishList] = useState(false)
  const [product, setProduct] = useState(data || {})
  const [compareAttributes, setCompareAttributes] = useState<any>([])
  const translate = useTranslation()
  const { deleteWishlistItem } = wishlistHandler()
  const [quantity, setQuantity] = useState(1)
  const handleQuickViewData = (data: any) => {
    setShowModalQuickView(true);
    setQuickViewData(data)
  }
  useEffect(() => {
    const { attributes } = data
    if (!attributes || attributes?.length < 1) return
    // let shouldEnabled = false
    let mappedAttribs: any = []
    attributes.forEach((attrib: any) => {
      if (attrib?.compareAtPLP) {
        // shouldEnabled = true
        mappedAttribs.push(attrib)
      }
    })
    setCompareAttributes(uniqBy(mappedAttribs, 'key'))
    // if (shouldEnabled) {
    //   setIsEligibleToCompare(shouldEnabled)
    // }
  }, [data])
  useEffect(() => {
    const compared = Boolean(
      compareProductList && compareProductList[data?.recordId]
    )
    setProduct({
      ...data,
      compared,
    })
  }, [data, compareProductList])
  useEffect(() => {
    if (wishListItems?.some((x: any) => x?.stockCode === data?.stockCode)) {
      setIsInWishList(true)
    } else {
      setIsInWishList(false)
    }
  }, [])

  const insertToLocalWishlist = () => {
    if (isInWishList) {
      removeFromWishlist(data?.recordId)
      setIsInWishList(false)
      openWishlist()
    }
    else {
      addToWishlist(data)
      setIsInWishList(true)
      openWishlist()
    }
  }

  const handleWishList = async () => {
    if (isInWishList) {
      deleteWishlistItem(user?.userId, data?.recordId)
      removeFromWishlist(data?.recordId)
      openWishlist()
      return
    }
    const objUser = localStorage.getItem('user')
    if (!objUser || isGuestUser) {
      openLoginSideBar()
      return
    }
    if (objUser) {
      const createWishlist = async () => {
        try {
          if (isInWishList) {
            await axios.post(NEXT_REMOVE_WISHLIST, {
              id: user?.userId,
              productId: data?.recordId,
              flag: true,
            })
            insertToLocalWishlist()
          }
          else {
            await axios.post(NEXT_CREATE_WISHLIST, {
              id: user?.userId,
              productId: data?.recordId,
              flag: true,
            })
            insertToLocalWishlist()
          }
        } catch (error) {
          console.log(error, 'error')
        }
      }
      createWishlist()
    } else insertToLocalWishlist()
  }

  const buttonTitle = () => {
    let buttonConfig: any = {
      title: translate('label.basket.addToBagText'),
      validateAction: async () => {
        const cartLineItem: any = cartItems?.lineItems?.find((o: any) => {
          if (matchStrings(o?.productId, data?.recordId, true) || matchStrings(o?.productId, data?.productId, true)) {
            return o
          }
        })
        if (data?.currentStock === cartLineItem?.qty && !data?.fulfilFromSupplier && !data?.flags?.sellWithoutInventory) {
          setAlert({ type: 'error', msg: translate('common.message.cartItemMaxAddedErrorMsg'), })
          return false
        }
        const isValid = cartItemsValidateAddToCart(cartItems, maxBasketItemsCount, quantity > 1 && quantity)
        if (!isValid) {
          setAlert({ type: 'error', msg: stringFormat(translate('common.message.basket.maxBasketItemsCountErrorMsg'), { maxBasketItemsCount }), })
        }
        return isValid
      },
      action: async () => {
        const item = await cartHandler()?.addToCart(
          {
            basketId,
            productId: data?.recordId,
            qty: quantity,
            manualUnitPrice: data?.price?.raw?.withoutTax,
            stockCode: data?.stockCode,
            userId: user?.userId,
            isAssociated: user?.isAssociated,
          },
          'ADD',
          { data }
        )
        setCartItems(item)
      },
      shortMessage: '',
    }
    if (!data?.currentStock && data?.preOrder?.isEnabled) {
      buttonConfig.title = translate('label.product.preOrderText')
      buttonConfig.isPreOrderEnabled = true
      buttonConfig.buttonType = 'button'
      buttonConfig.shortMessage = data?.preOrder?.shortMessage
    }
    return buttonConfig
  }

  const handleSetCompareProduct = () => {
    if (product.compared) {
      setCompareProducts({
        id: product.recordId,
        type: 'remove',
      })
    } else {
      setCompareProducts({
        id: product.recordId,
        data: {
          ...product,
          attributes: compareAttributes,
        },
        type: 'add',
      })
    }
    setProduct((v: any) => ({
      ...v,
      compared: !v.compared,
    }))
  }
  const itemPrice = data?.price?.formatted?.withTax
  const buttonConfig = buttonTitle()
  const isComparedEnabled = useMemo(() => {
    return getFeaturesConfig()?.features?.enableCompare && stringToBoolean(isCompared)
  }, [isCompared])
  const renderGroupButtons = () => {
    return (
      <>
        {isMobile ? (
          <>
            <div className={`${featureToggle?.features?.enableAddToBagPlp ? ' grid-cols-2' : ' grid-cols-1'} absolute grid justify-center invisible px-2 transition-all opacity-0 sm:bottom-0 bottom-4 sm:px-2 group-hover:bottom-4 inset-x-1 group-hover:opacity-100 group-hover:visible`}>
              {featureToggle?.features?.enableAddToBagPlp &&
                <Button size="small" className="block" title={buttonConfig.title} action={buttonConfig.action} buttonType={buttonConfig.type || 'cart'} />
              }
              <ButtonSecondary className="ms-1.5 bg-white dark:bg-white hover:!bg-gray-100 dark:hover:!bg-gray-100 hover:text-slate-900 dark:hover:text-slate-900 transition-colors shadow-lg" fontSize="text-xs" sizeClass="py-2 px-4" onClick={() => handleQuickViewData(data)} >
                <ArrowsPointingOutIcon className="w-3.5 h-3.5" />
                <span className="ms-1">{translate('common.label.quickViewText')}</span>
              </ButtonSecondary>
            </div>
          </>
        ) : (
          <>
            <div className={`${featureToggle?.features?.enableAddToBagPlp ? ' grid-cols-2' : ' grid-cols-1'} absolute grid justify-center invisible px-2 transition-all opacity-0 sm:bottom-0 bottom-4 sm:px-2 group-hover:bottom-4 inset-x-1 group-hover:opacity-100 group-hover:visible`}>
              {featureToggle?.features?.enableAddToBagPlp &&
                <Button size="small" className="block" title={buttonConfig?.title} action={buttonConfig?.action} buttonType={buttonConfig?.type || 'cart'} />
              }
              <ButtonSecondary className="ms-1.5 bg-white dark:bg-white dark:hover:!bg-gray-100 hover:!bg-gray-100 hover:text-slate-900 dark:hover:text-slate-900 transition-colors shadow-lg" fontSize="text-xs" sizeClass="py-2 px-4" onClick={() => handleQuickViewData(data)} >
                <ArrowsPointingOutIcon className="w-3.5 h-3.5" />
                <span className="ms-1">{translate('common.label.quickViewText')}</span>
              </ButtonSecondary>
            </div>
          </>
        )}
      </>
    );
  };
  const CLASSES = "absolute top-3 start-3";
  return (
    <>
      <div key={key} className={cn(`nc-ProductCard product-card relative flex flex-col sm:group bg-transparent mb-6 ${className}`, { 'height-full': isComparedEnabled, 'height-full border-amber-400 rounded-t-3xl rounded-b-2xl border-2': product?.compared, })}>
        <div className="relative flex-shrink-0 overflow-hidden bg-slate-50 dark:bg-slate-300 rounded-3xl z-1 group rounded-green product-card__image-container">
          <ButtonLink isComparedEnabled={isComparedEnabled} href={sanitizeRelativeUrl(`/${data?.slug}` || `/${data?.link}`)} itemPrice={itemPrice} productName={data.name} onClick={handleSetCompareProduct}>
            <div className="flex w-full h-0 aspect-w-11 aspect-h-12 product-card__image">
              <img src={generateUri(data?.image, 'h=400&fm=webp') || IMG_PLACEHOLDER} className="object-cover object-top w-full h-full drop-shadow-xl" alt={data?.name} />
            </div>
          </ButtonLink>
          <div className={CLASSES}>
            <ProductTag product={data} />
          </div>
          <LikeButton liked={isInWishList} className="absolute z-0 top-3 end-3" handleWishList={handleWishList} />
          {!isComparedEnabled && renderGroupButtons()}
        </div>

        <ButtonLink isComparedEnabled={isComparedEnabled} href={sanitizeRelativeUrl(`/${data?.slug}` || `/${data?.link}`)} itemPrice={itemPrice} productName={data?.name} onClick={handleSetCompareProduct}>
          <div className="px-2.5 pt-5 pb-2.5 product-card__information">
            <div className='mt-4'>
              <h2 className="text-base text-left font-semibold transition-colors dark:text-black min-h-[60px] nc-ProductCard__title product-card__brand">{data?.name}</h2>
            </div>
            <div className='flex justify-between mt-1'>
              <p className={`text-sm text-left text-slate-500 dark:text-slate-500 mt-1 product-card__name`}>{data?.classification?.mainCategoryName}</p>
              {data?.reviewCount > 0 &&
                <div className="flex items-center mb-0.5 w-40 justify-end">
                  <StarIcon className="w-4 h-4 pb-[1px] text-amber-400" />
                  <span className="font-12 ms-1 text-slate-500 dark:text-slate-400">
                    {data?.rating || ""} <span className='font-10'>({data?.reviewCount || 0} {translate('common.label.reviews')})</span>
                  </span>
                </div>
              }
            </div>
            <div className="flex items-center justify-between mt-2 product-card-panel">
              <Prices price={data?.price} listPrice={data?.listPrice} featureToggle={featureToggle} defaultDisplayMembership={defaultDisplayMembership} />
            </div>
            {isComparedEnabled && product?.compared && (
              <div className="absolute bottom-0 left-0 flex flex-col w-full gap-1 py-0 pr-0 mx-auto duration-300 bg-transparent rounded-md button-position-absolute compared-btn">
                {product?.compared && (
                  <button className="w-full py-2 font-semibold text-red-600 uppercase border-t border-red-600 bg-red-50 rounded-b-2xl hover:bg-red-100 font-14">
                    Remove
                  </button>
                )}
              </div>
            )}
          </div>
        </ButtonLink>
      </div>
      {/* QUICKVIEW */}
      <ModalQuickView show={showModalQuickView} onCloseModalQuickView={() => setShowModalQuickView(false)} productData={quickViewData} deviceInfo={deviceInfo} maxBasketItemsCount={maxBasketItemsCount} featureToggle={featureToggle} defaultDisplayMembership={defaultDisplayMembership} />
    </>
  );
};

const ButtonLink = (props: any) => {
  const { isComparedEnabled, children, href, handleHover, itemPrice, productName, onClick, } = props
  if (isComparedEnabled) {
    return (
      <div className="flex flex-col w-full" onClick={onClick}>{children}</div>
    )
  }
  return (
    <Link passHref href={href} className="img-link-display" title={`${productName} \t ${itemPrice}`}>
      {children}
    </Link>
  )
}

export default ProductCard;