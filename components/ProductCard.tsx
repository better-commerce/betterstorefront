"use client";
import cn from 'classnames'
import React, { FC, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { StarIcon } from "@heroicons/react/24/solid";
import { ArrowsPointingOutIcon, CheckCircleIcon, ClockIcon } from "@heroicons/react/24/outline";
import { useUI } from "@components/ui";
import { IMG_PLACEHOLDER } from "@components/utils/textVariables";
import { SITE_ORIGIN_URL } from "@components/utils/constants";
import cartHandler from "@components/services/cart";
import wishlistHandler from "@components/services/wishlist";
import { generateUri } from "@commerce/utils/uri-util";
import { matchStrings, stringFormat, stringToBoolean } from "@framework/utils/parse-util";
import { cartItemsValidateAddToCart, getFeaturesConfig, sanitizeRelativeUrl } from "@framework/utils/app-util";
import { useTranslation } from "@commerce/utils/use-translation";
import uniqBy from 'lodash/uniqBy';
import { isMobile } from 'react-device-detect';
import { Guid } from '@commerce/types';
import { AlertType } from '@framework/utils/enums';
import Router from 'next/router';
import { AnalyticsEventType } from './services/analytics';
import useAnalytics from './services/analytics/useAnalytics';
import ReviewBadge from './Product/ReviewBadge';
import productInterestHandler from '@components/services/product-interest'
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
const promotionMessages = [
  'Free software access worth £60',
  'Peak Design Price Drop',
  'Free Peak Design Kit worth £28',
  '3LT Price Drop',
  'Wandrd Price Drop',
  'Lens when bought with offer',
  '50% off Profoto connect with A2',
  'Exclusive Online Deal',
  'Vanguard Price Drop',
  'Save 5% on Sony lens',
];

function getRandomPromotion() {
  const index = Math.floor(Math.random() * promotionMessages.length);
  return promotionMessages[index];
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
  const [promotion] = useState(() => getRandomPromotion());
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
        if (isInWishList) {
          await deleteWishlistItem(user?.userId, data?.recordId)
          removeFromWishlist(data?.recordId)
          setIsInWishList(false)
        }
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
  const { addToProductInterest } = productInterestHandler()

  const createProductInterest = async () => {
    const objUser = localStorage.getItem('user')
    if (!objUser || isGuestUser) {
      openLoginSideBar()
      return
    }

    addToProductInterest(
      user?.userId,
      product?.recordId,
      () => {
        setAlert({
          type: 'success',
          msg: 'Product interest registered successfully'
        })
      },
      (error) => {
        setAlert({
          type: 'error',
          msg: 'Failed to register product interest'
        })
      }
    )
  }
  const renderGroupButtons = () => {
    return (
      <>
        {isMobile ? (
          <>
            <div className={`${featureToggle?.features?.enableAddToBagPlp ? ' grid-cols-2' : ' grid-cols-1'} plp-btn-section-div absolute grid justify-center px-2 transition-all sm:bottom-0 bottom-4 sm:px-2 group-hover:bottom-4 inset-x-1`}>
              {featureToggle?.features?.enableAddToBagPlp &&
                <Button size="small" className="block cart-btn-plp" title={buttonConfig.title} action={buttonConfig.action} buttonType={buttonConfig.type || 'cart'} />
              }
              {data?.condition != "pre-launch" && <ButtonSecondary className="quickview-plp ms-1.5 bg-white dark:bg-white hover:!bg-gray-100 dark:hover:!bg-gray-100 hover:text-slate-900 dark:hover:text-slate-900 transition-colors shadow-lg" fontSize="text-xs" sizeClass="py-2 px-4" onClick={() => handleQuickViewData(data)} >
                <ArrowsPointingOutIcon className="w-3.5 h-3.5" />
                <span className="ms-1">{translate('common.label.quickViewText')}</span>
              </ButtonSecondary>}
            </div>
          </>
        ) : (
          <>
            <div className={`${featureToggle?.features?.enableAddToBagPlp ? ' grid-cols-2' : ' grid-cols-1'} plp-btn-section-div absolute grid justify-center invisible px-2 transition-all opacity-0 sm:bottom-0 bottom-4 sm:px-2 group-hover:bottom-4 inset-x-1 group-hover:opacity-100 group-hover:visible`}>
              {featureToggle?.features?.enableAddToBagPlp &&
                <Button size="small" className="block cart-btn-plp" title={buttonConfig?.title} action={buttonConfig?.action} buttonType={buttonConfig?.type || 'cart'} />
              }
              {data?.condition != "pre-launch" && <ButtonSecondary className="quickview-plp ms-1.5 bg-white dark:bg-white dark:hover:!bg-gray-100 hover:!bg-gray-100 hover:text-slate-900 dark:hover:text-slate-900 transition-colors shadow-lg" fontSize="text-xs" sizeClass="py-2 px-4" onClick={() => handleQuickViewData(data)} >
                <ArrowsPointingOutIcon className="w-3.5 h-3.5" />
                <span className="ms-1">{translate('common.label.quickViewText')}</span>
              </ButtonSecondary>}
            </div>
          </>
        )}
      </>
    );
  };
  const CLASSES = "absolute top-3 start-3";
  return (
    <>
      <div key={key} className={cn(`${featureToggle?.features?.enableForPCSite ? 'border border-[#D9D9D9] p-2 rounded relative z-9' : 'border-prod-card'} nc-ProductCard product-card  hover-nc-product-card relative flex flex-col sm:group bg-transparent mb-2 ${product?.compared ? featureToggle?.features?.enableForPCSite ? '!border-2 !border-[#2D4D9C]' : '!border !border-orange-600' : ''} ${className}`, { 'height-full': isComparedEnabled, 'height-full border-amber-400 rounded-t-3xl rounded-b-2xl border-2': product?.compared, })}>
        <div className={`${featureToggle?.features?.enableForPCSite ? '' : 'bg-slate-50 dark:bg-slate-300 rounded-3xl'} relative flex-shrink-0 overflow-hidden z-1 group rounded-green product-card__image-container`}>
          <ButtonLink isComparedEnabled={isComparedEnabled} href={sanitizeRelativeUrl(`/${data?.slug || data?.link}`)} itemPrice={itemPrice} productName={data.name} onClick={handleSetCompareProduct}>
            <div className="relative flex w-full h-0 aspect-w-11 aspect-h-12 product-card__image">
              <img src={generateUri(data?.image, 'h=400&fm=webp') || IMG_PLACEHOLDER} className={`${featureToggle?.features?.enableForPCSite ? 'object-contain object-top w-full h-full' : 'object-cover object-top w-full h-full drop-shadow-xl'}`} alt={data?.name} />
            </div>
          </ButtonLink>
          {data?.condition != "pre-launch" && <div className={CLASSES}>
            <ProductTag product={data} />
          </div>}
          {data?.condition === "pre-launch" && <div className={CLASSES}>
            <div className='px-2.5 py-1.5 text-xs bg-orange-500 dark:bg-white nc-shadow-lg rounded-full flex items-center justify-center text-white dark:text-slate-900'>
              <ClockIcon className="w-3.5 h-3.5" />
              <div className="leading-none ms-1">
                Pre-Launch
              </div>
            </div>
          </div>}
          {!featureToggle?.features?.enableForPCSite && <LikeButton liked={isInWishList} className="absolute z-0 top-3 end-3" handleWishList={handleWishList} />}
          {!isComparedEnabled && renderGroupButtons()}
        </div>

        <ButtonLink isComparedEnabled={isComparedEnabled} href={sanitizeRelativeUrl(`/${data?.slug || data?.link}`)} itemPrice={itemPrice} productName={data?.name} onClick={handleSetCompareProduct}>
          <div className={`${featureToggle?.features?.enableForPCSite ? 'px-0 pt-3 ' : 'px-2.5 pt-5 pb-2.5 '} product-card__information`}>
            <div className='mt-4'>
              <h2 className="text-base text-left product-card-title font-semibold transition-colors dark:text-black min-h-[60px] nc-ProductCard__title product-card__brand">{data?.name}</h2>
              {data?.condition === "pre-launch" && <div dangerouslySetInnerHTML={{ __html: data?.description }} className="hidden mt-2 text-sm text-gray-500 sm:block product-detail-description clamp-4-lines" />}
            </div>
            <div className='flex justify-between mt-1'>
              <p className={`text-sm text-left text-slate-500 dark:text-slate-500 mt-1 product-card__name`}>{data?.classification?.category}</p>
              {data?.reviewCount > 0 &&
                <div className="flex items-center mb-0.5 w-40 justify-end">
                  <StarIcon className="w-4 h-4 pb-[1px] text-amber-400" />
                  <span className="font-12 ms-1 text-slate-500 dark:text-slate-400">
                    {data?.rating || ""} <span className='font-10'>({data?.reviewCount || 0} {translate('common.label.reviews')})</span>
                  </span>
                </div>
              }
            </div>
          </div >
        </ButtonLink>
        {data?.condition != "pre-launch" && featureToggle?.features?.enableAddButtonBottom ? (
          <>
            <div className="flex flex-col gap-2 plp-hidden-section">
              <ReviewBadge reviewCountdata={data?.reviewCount} ratingdata={data?.rating} />
            </div>
          </>
        ) : (
          <>
            {/* Content to render if false */}
          </>
        )}
        {data?.condition != "pre-launch" && <div className="flex items-center justify-between mt-2 product-card-panel">
          <Prices price={data?.price} listPrice={data?.listPrice} featureToggle={featureToggle} defaultDisplayMembership={defaultDisplayMembership} />
        </div>}
        <p className="border border-[#2D4D9C] px-2 py-1 flex items-center gap-1 text-xs font-semibold text-[#2D4D9C] text-left rounded">
          <CheckCircleIcon className='inline-block w-4 h-4' />
          {promotion}</p>
        {featureToggle.features?.enableForPCSite &&
          <>
            <div className='flex items-center justify-start gap-1 mt-2 text-xs font-semibold text-gray-600'>
              {data?.currentStock > 0 ? <span className='px-1 py-0.5 rounded text-xs text-[#009951]'>In stock</span> :
                <span className='px-1 py-0.5 rounded text-xs text-[#E5A000]'>Awaiting stock</span>
              }
            </div>
          </>
        }
        {!isComparedEnabled && featureToggle?.features?.enableAddButtonBottom && data?.condition != "pre-launch" && (
          <div className='flex justify-between my-3 ml-0 text-left add-btn-plp'>
            <Button size="small" className={`block cart-btn-plp ${featureToggle?.features?.enableForPCSite ? '!max-w-[85%]' : ''}`} title={buttonConfig?.title} action={buttonConfig?.action} buttonType={buttonConfig?.type || 'cart'} />
            {featureToggle?.features?.enableForPCSite && <LikeButton liked={isInWishList} className="justify-end text-right" handleWishList={handleWishList} />}
          </div>
        )}
        {data?.condition === "pre-launch" &&
          <div className='justify-start my-3 ml-0 text-left add-btn-plp'>
            <button className="flex items-center text-xs justify-center flex-1 font-semibold max-w-xs px-8 py-1 text-black bg-[#ABC1F8] hover:bg-[#ABC1F8] hover:text-black border border-transparent rounded-2xl" onClick={() => createProductInterest()} >
              I'm Interested
            </button>
          </div>
        }
        {isComparedEnabled && product?.compared && (
          <div className="absolute bottom-0 left-0 flex flex-col w-full gap-1 py-0 pr-0 mx-auto duration-300 bg-transparent rounded-md button-position-absolute compared-btn">
            {product?.compared && (
              <button className={`${featureToggle?.features?.enableAddButtonBottom ? 'rounded-b border-t border-[#2D4D9C]' : 'rounded-b-2xl border-t border-red-600'} w-full py-2 font-semibold text-red-600 uppercase  bg-red-50 hover:bg-red-100 font-14`}>
                Remove
              </button>
            )}
          </div>
        )}
        {isComparedEnabled && !product?.compared && featureToggle?.features?.enableForPCSite && <div className='absolute top-0 left-0 w-full h-full rounded cursor-pointer z-8 bg-black/60' onClick={handleSetCompareProduct}></div>}
        {isComparedEnabled && featureToggle?.features?.enableForPCSite && (
          <div className="absolute z-9 top-2 left-2">
            <input
              type="checkbox"
              checked={!!product?.compared}
              onChange={handleSetCompareProduct}
              className="w-4 h-4 border-gray-300 rounded bg-white text-[#2D4D9C]"
            />
          </div>
        )}
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
