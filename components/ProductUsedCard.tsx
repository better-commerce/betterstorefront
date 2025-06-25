"use client";

import React, { FC, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { HeartIcon } from "@heroicons/react/24/outline";
import { useUI } from "@components/ui";
import { SITE_ORIGIN_URL } from "@components/utils/constants";
import cartHandler from "@components/services/cart";
import wishlistHandler from "@components/services/wishlist";
import { matchStrings, stringFormat, stringToBoolean } from "@framework/utils/parse-util";
import { cartItemsValidateAddToCart, getFeaturesConfig } from "@framework/utils/app-util";
import { useTranslation } from "@commerce/utils/use-translation";
import uniqBy from 'lodash/uniqBy';
import { isMobile } from 'react-device-detect';
import { Guid } from '@commerce/types';
import { AlertType } from '@framework/utils/enums';
import Router from 'next/router';
import { AnalyticsEventType } from './services/analytics';
import useAnalytics from './services/analytics/useAnalytics';
const BuyNowButton = dynamic(() => import('@components/ui/BuyNowButton'))
const LongDescription = dynamic(() => import('@components/Product/LongDescription'))
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
  const { recordAnalytics } = useAnalytics()
  const { deleteWishlistItem, isInWishList: isInWishlistItem, addToWishlist: addToWishlistItem } = wishlistHandler()
  const [showModalQuickView, setShowModalQuickView] = useState(false);
  const [quickViewData, setQuickViewData] = useState(null)
  const { basketId, cartItems, isGuestUser, setCartItems, user, setAlert, removeFromWishlist, addToWishlist, openWishlist, wishListItems, compareProductList, openLoginSideBar, isCompared, setCompareProducts } = useUI()
  const [isInWishList, setIsInWishList] = useState(false)
  const [product, setProduct] = useState(data || {})
  const [compareAttributes, setCompareAttributes] = useState<any>([])
  const translate = useTranslation()
  const [quantity, setQuantity] = useState(1)
  const handleQuickViewData = (data: any) => {
    //debugger
    const extras = { originalLocation: SITE_ORIGIN_URL + Router.asPath }
    recordAnalytics(AnalyticsEventType.PDP_QUICK_VIEW_CLICK, { ...product, position: 0/*pid + 1,*/, currentPage: 'PLP', header: '', })
    recordAnalytics(AnalyticsEventType.PDP_QUICK_VIEW, { ...data, ...{ ...extras }, position: 0/*pid + 1,*/ })
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
    if (isInWishlistItem(data?.recordId)) {
      setIsInWishList(true)
    } else {
      setIsInWishList(false)
    }
  }, [wishListItems])

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
    if (!isGuestUser && user?.userId && user?.id != Guid.empty) {
      const createWishlist = async () => {
        try {
          if (isInWishList) {
            await deleteWishlistItem(user?.userId, data?.recordId, insertToLocalWishlist)
          }
          else {
            await addToWishlistItem(user?.userId, data?.recordId, insertToLocalWishlist)
          }
        } catch (error) {
          setAlert({ type: AlertType.ERROR, msg: translate('common.message.requestCouldNotProcessErrorMsg') })
        }
      }
      createWishlist()
    } else {
      openLoginSideBar()
    }
  }

  const buttonTitle = () => {
    let buttonConfig: any = {
      title: featureToggle?.features?.enableForPCSite ? 'Add to basket' : translate('label.basket.addToBagText'),
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

  const CLASSES = "absolute top-3 start-3";
  return (
    <>
      <div key={key} className="w-full blue-add-btn">
        <div className={`${featureToggle?.features?.enableForPCSite ? 'px-0 pt-3 pb-2.5 ' : 'px-2.5 pt-3 pb-2.5 '} product-card__information`}>
          <div className='flex short-descriptionc'>
            <LongDescription data={data?.description} heading="" />
          </div>
        </div >
        {featureToggle?.features?.enableAddButtonBottom && (
          <div className='my-3 add-green-btn'>
            <Button className="w-full bg-black hover:bg-gray-900 focus:ring-black  `ttnc-ButtonPrimary` text-sm font-medium py-3 px-4 sm:py-3.5 sm:px-6 nc-Button sm:text-white gap-2 relative h-auto inline-flex items-center justify-center rounded-full transition-colors disabled:bg-opacity-90  dark:bg-slate-100  text-slate-50 dark:text-white shadow-xl flex-1 flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-6000 dark:focus:ring-offset-0" title={buttonConfig?.title} action={buttonConfig?.action} buttonType={buttonConfig?.type || 'cart'} />
          </div>
        )}
        {!isGuestUser && user?.userId &&
          <>
            <div className="flex mt-6 mb-3 sm:mt-4 !text-sm w-full buy-btn">
              <BuyNowButton title="Buy Now" action={buttonConfig?.action} buttonType={buttonConfig.type || 'cart'} />
            </div>
          </>
        }
        {/* <div className='w-full pt-3 mb-6'>
          <div className='flex flex-row gap-2 sm:grid sm:grid-cols-2'>
            <h4 className='text-xs'>Dispatches from</h4>
            <p className='text-xs text-black'>London Store</p>
          </div>
          <div className='flex flex-row gap-2 sm:grid sm:grid-cols-2'>
            <h4 className='text-xs'>Warranty</h4>
            <p className='text-xs text-color-primary-blue'>6 Months</p>
          </div>
        </div> */}
        <div className='w-full'>
          <button type="button" onClick={handleWishList} className="flex rounded-md items-center justify-center group w-full h-auto px-4 py-2 text-[#767676] bg-white hover:text-pink sm:px-2 hover:border-pink" >
            {isInWishList ? (
              <HeartIcon className="flex-shrink-0 w-4 h-4 mr-2 font-semibold text-red-700" />
            ) : (
              <HeartIcon className="flex-shrink-0 w-3 h-3 mr-2 font-semibold text-black group-hover:text-red-700" />)}
            <span className='text-xs text-black font-semibold'> Add to Wishlist </span>
          </button>
        </div>
      </div>
    </>
  );
};

export default ProductCard;