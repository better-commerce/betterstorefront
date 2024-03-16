"use client";

import React, { FC, useEffect, useState } from "react";
import axios from "axios";
import dynamic from "next/dynamic";
import Link from "next/link";
import { StarIcon } from "@heroicons/react/24/solid";
import { ArrowsPointingOutIcon } from "@heroicons/react/24/outline";
import { useUI } from "@components/ui";
import { BTN_PRE_ORDER,  IMG_PLACEHOLDER } from "@components/utils/textVariables";
import { Messages, NEXT_CREATE_WISHLIST, NEXT_REMOVE_WISHLIST } from "@components/utils/constants";
import cartHandler from "@components/services/cart";
import wishlistHandler from "@components/services/wishlist";
import { generateUri } from "@commerce/utils/uri-util";
import { matchStrings } from "@framework/utils/parse-util";
import { cartItemsValidateAddToCart } from "@framework/utils/app-util";
import { useTranslation } from "@commerce/utils/use-translation";
const ProductTag = dynamic(() => import('@components/product/ProductTag'))
const LikeButton = dynamic(() => import('@new-components/LikeButton'))
const Prices = dynamic(() => import('@new-components/Prices'))
const ModalQuickView = dynamic(() => import('@new-components/ModalQuickView'))
const NcImage = dynamic(() => import('@new-components/shared/NcImage/NcImage'))
const ButtonSecondary = dynamic(() => import('@new-components/shared/Button/ButtonSecondary'))
const Button = dynamic(() => import('@components/ui/IndigoButton'))
export interface ProductCardProps {
  className?: string;
  data?: any;
  isLiked?: boolean;
  deviceInfo?: any;
  maxBasketItemsCount?: any;
}

const ProductCard: FC<ProductCardProps> = ({ className = "", data, isLiked, deviceInfo, maxBasketItemsCount }) => {
  const translate = useTranslation()
  const [showModalQuickView, setShowModalQuickView] = useState(false);
  const [quickViewData, setQuickViewData] = useState(null)
  const { basketId, cartItems, isGuestUser, setCartItems, user, setAlert, removeFromWishlist, addToWishlist, openWishlist, wishListItems, openLoginSideBar } = useUI()
  const [isInWishList, setIsInWishList] = useState(false)
  const { deleteWishlistItem } = wishlistHandler()
  const [quantity, setQuantity] = useState(1)
  const translate = useTranslation();
  const handleQuickViewData = (data: any) => {
    setShowModalQuickView(true);
    setQuickViewData(data)
  }

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
          if (matchStrings(o.productId, data?.recordId, true) || matchStrings(o.productId, data?.productId, true)) {
            return o
          }
        })
        if (data?.currentStock === cartLineItem?.qty && !data?.fulfilFromSupplier && !data?.flags?.sellWithoutInventory) {
          setAlert({ type: 'error', msg: Messages.Errors['CART_ITEM_QTY_MAX_ADDED'], })
          return false
        }
        const isValid = cartItemsValidateAddToCart(cartItems, maxBasketItemsCount, quantity > 1 && quantity)
        if (!isValid) {
          setAlert({ type: 'error', msg: Messages.Errors['CART_ITEM_QTY_LIMIT_EXCEEDED'], })
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
      buttonConfig.title = BTN_PRE_ORDER
      buttonConfig.isPreOrderEnabled = true
      buttonConfig.buttonType = 'button'
      buttonConfig.shortMessage = data?.preOrder?.shortMessage
    }
    return buttonConfig
  }

  const buttonConfig = buttonTitle()

  const renderGroupButtons = () => {
    return (
      <div className="absolute bottom-0 grid justify-center invisible grid-cols-2 transition-all opacity-0 sm:px-4 group-hover:bottom-4 inset-x-1 group-hover:opacity-100 group-hover:visible">
        <Button size="small" className="hidden sm:block" title={buttonConfig.title} action={buttonConfig.action} buttonType={buttonConfig.type || 'cart'} />
        <ButtonSecondary className="ms-1.5 bg-white hover:!bg-gray-100 hover:text-slate-900 transition-colors shadow-lg" fontSize="text-xs" sizeClass="py-2 px-4" onClick={() => handleQuickViewData(data)} >
          <ArrowsPointingOutIcon className="w-3.5 h-3.5" />
          <span className="ms-1">{translate('common.label.quickViewText')}</span>
        </ButtonSecondary>
      </div>
    );
  };
  const CLASSES = "absolute top-3 start-3";
  return (
    <>
      <div className={`nc-ProductCard relative flex flex-col group bg-transparent mb-6 ${className}`} >
        <div className="relative flex-shrink-0 overflow-hidden bg-slate-50 dark:bg-slate-300 rounded-3xl z-1 group">
          <Link href={`/${data?.slug}`} className="block">
            <NcImage containerClassName="flex aspect-w-11 aspect-h-12 w-full h-0" src={generateUri(data?.image, 'h=600&fm=webp') || IMG_PLACEHOLDER} className="object-cover object-top w-full h-full drop-shadow-xl" fill sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 40vw" alt="product" />
          </Link>
          <div className={CLASSES}>
            <ProductTag product={data} />
          </div>
          <LikeButton liked={isInWishList} className="absolute z-0 top-3 end-3" handleWishList={handleWishList} />
          {renderGroupButtons()}
        </div>

        <div className="space-y-4 px-2.5 pt-5 pb-2.5">
          <div>
            <h2 className="text-base font-semibold transition-colors min-h-[60px] nc-ProductCard__title">{data?.name}</h2>
            <p className={`text-sm text-slate-500 dark:text-slate-400 mt-1`}>{data?.classification?.mainCategoryName}</p>
          </div>
          <div className="flex items-end justify-between ">
            <Prices price={data?.price} listPrice={data?.listPrice} />
            <div className="flex items-center mb-0.5">
              <StarIcon className="w-5 h-5 pb-[1px] text-amber-400" />
              <span className="text-sm ms-1 text-slate-500 dark:text-slate-400">
                {data?.rating || ""} ({data?.reviewCount || 0} {translate('common.label.reviews')})
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* QUICKVIEW */}
      <ModalQuickView show={showModalQuickView} onCloseModalQuickView={() => setShowModalQuickView(false)} productData={quickViewData} deviceInfo={deviceInfo} maxBasketItemsCount={maxBasketItemsCount} />
    </>
  );
};
export default ProductCard;