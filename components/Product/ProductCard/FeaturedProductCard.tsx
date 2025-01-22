import { FC, useCallback, useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import ImageGallery from 'react-image-gallery'
import axios from 'axios'
import { HeartIcon } from '@heroicons/react/24/outline'
import classNames from 'classnames'
import { useRouter } from 'next/router'
import { useUI } from '@components/ui/context'
import { CLOTH_SIZE_ATTRIB_NAME, NEXT_CREATE_WISHLIST, Messages, EmptyObject, NEXT_REMOVE_WISHLIST } from '@components/utils/constants'
import { BTN_NOTIFY_ME, BTN_PRE_ORDER, GENERAL_ADD_TO_BASKET, IMAGE_CDN_URL, IMG_PLACEHOLDER, } from '@components/utils/textVariables'
import { generateUri } from '@commerce/utils/uri-util'
import { IExtraProps } from '@components/common/Layout/Layout'
import { vatIncluded, cartItemsValidateAddToCart, getCurrency, isIncludeVATInPriceDisplay, isFreeShippingOverXValue, getFreeShippingOverXValue } from '@framework/utils/app-util'
import cartHandler from '@components/services/cart'
import { matchStrings, stringFormat } from '@framework/utils/parse-util'
import DeliveryMessage from '../DeliveryMessage'
const SimpleButton = dynamic(() => import('@components/ui/Button'))

interface Props {
  readonly product: any
  hideWishlistCTA?: any
  readonly productPromoDetails: any
}

const FeatureProductCard: FC<React.PropsWithChildren<Props & IExtraProps>> = ({ product: productData, config, hideWishlistCTA = false, deviceInfo, maxBasketItemsCount, productPromoDetails = {}, }) => {
  const { isMobile } = deviceInfo
  const isIncludeVAT = vatIncluded()
  const [currentProductData, setCurrentProductData] = useState({ image: productData.image, link: productData.slug, })
  const { basketId, user, addToWishlist, removeFromWishlist, openWishlist, setCartItems, openNotifyUser, cartItems, wishListItems, isGuestUser, openLoginSideBar, setAlert, isCompared, compareProductList, setCompareProducts, } = useUI()
  const [quickViewData, setQuickViewData] = useState(null)
  const [product, setProduct] = useState(productData || {})
  const [quantity, setQuantity] = useState(1)
  const [bestAvailablePromotion, setBestAvailablePromotion] = useState<any>(productPromoDetails?.promotions?.bestAvailablePromotion || EmptyObject)
  const [showProductSaleCountdown, setShowProductSaleCountdown] = useState<any>(false)

  const handleUpdateWishlistItem = useCallback(() => {
    if (wishListItems?.length < 1) return
    const wishlistItemIds = wishListItems?.map((o: any) => o.recordId)
    setProduct({ ...productData, hasWishlisted: wishlistItemIds?.includes(productData.recordId), })
  }, [wishListItems, productData])

  useEffect(() => {
    const compared = Boolean(compareProductList && compareProductList[productData.recordId])
    handleUpdateWishlistItem()
    setProduct({ ...productData, compared, })
  }, [wishListItems, productData, compareProductList])

  useEffect(() => {
    if (product?.variantProductsAttributeMinimal?.length < 1) return
    let sizeAttribData = product?.variantProductsAttributeMinimal?.find((o: any) => o.fieldCode === CLOTH_SIZE_ATTRIB_NAME)
    sizeAttribData = sizeAttribData?.fieldValues?.sort((a: { displayOrder: number }, b: { displayOrder: number }) => a.displayOrder > b.displayOrder ? 1 : -1) || []
  }, [product?.variantProductsAttributeMinimal])

  useEffect(() => {
    if (!bestAvailablePromotion?.toDate) return
    const currentDate = new Date()
    const promotionEndDate = new Date(bestAvailablePromotion?.toDate)
    if (promotionEndDate > currentDate) {
      setShowProductSaleCountdown(promotionEndDate > currentDate);
    }
  }, [bestAvailablePromotion])

  const handleQuickViewData = (data: any) => { setQuickViewData(data) }
  const handleCloseQuickView = () => { setQuickViewData(null) }

  const insertToLocalWishlist = () => {
    addToWishlist(product)
    openWishlist()
  }

  const isInWishList = wishListItems?.map((wi: any) => wi?.stockCode)?.includes(product?.stockCode)
  const handleWishList = async () => {
    const objUser = localStorage.getItem('user')
    if (!objUser || isGuestUser) {
      openLoginSideBar()
      return
    }
    if (isInWishList) {
      await axios.post(NEXT_REMOVE_WISHLIST, { id: user.userId, productId: product.recordId, flag: true, })
      removeFromWishlist(product)
      openWishlist()
    } else {
      if (objUser) {
        const createWishlist = async () => {
          try {
            await axios.post(NEXT_CREATE_WISHLIST, { id: user.userId, productId: product.recordId, flag: true, })
            insertToLocalWishlist()
          } catch (error) {
            console.log(error, 'error')
          }
        }
        createWishlist()
      } else insertToLocalWishlist()
    }
  }

  useEffect(() => {
    setCurrentProductData((prevState): any => {
      if (prevState.link !== product.slug) {
        return { ...prevState, image: product.image, link: product.slug }
      } else return { ...prevState }
    })
  }, [product.slug])

  const handleNotification = () => { openNotifyUser(product.id) }
  const buttonTitle = () => {
    let buttonConfig: any = {
      title: productData?.currentStock ? GENERAL_ADD_TO_BASKET : BTN_NOTIFY_ME,
      validateAction: async () => {
        if (!product?.currentStock) return true;
        const isValid = cartItemsValidateAddToCart(cartItems, maxBasketItemsCount);
        if (!isValid) {
          setAlert({ type: 'error', msg: Messages.Errors['CART_ITEM_QTY_LIMIT_EXCEEDED'] });
        }
        return isValid;
      },
      action: async () => {
        if (!product?.currentStock) {
          handleNotification();
          return;
        }
        const item = await cartHandler()?.addToCart(
          {
            basketId,
            productId: product?.recordId,
            qty: quantity,
            manualUnitPrice: product?.price?.raw?.withoutTax,
            stockCode: product?.stockCode,
            userId: user?.userId,
            isAssociated: user?.isAssociated,
          },
          'ADD',
          { product }
        );
        setCartItems(item);
      },
      shortMessage: productData?.currentStock ? '' : (productData?.preOrder?.shortMessage || ''),
      isNotifyMeEnabled: !productData?.currentStock /*&& !productData?.preOrder?.isEnabled*/,
      isPreOrderEnabled: !productData?.currentStock /*&& productData?.preOrder?.isEnabled*/,
    };

    if (!productData?.currentStock && productData?.preOrder?.isEnabled) {
      buttonConfig.buttonType = 'button'
    }

    if (productData?.currentStock <= 0 && /*!productData?.preOrder?.isEnabled &&*/ !productData?.flags?.sellWithoutInventory) {
      buttonConfig.title = BTN_NOTIFY_ME
      buttonConfig.action = async () => handleNotification()
      buttonConfig.type = 'button'
      buttonConfig.buttonType = 'button'
    } else if (productData?.currentStock <= 0 /*&& productData?.preOrder?.isEnabled*/) {
      if (/*productData?.preOrder?.currentStock < productData?.preOrder?.maxStock &&*/ (!productData?.flags?.sellWithoutInventory || productData?.sellWithoutInventory)) {
        buttonConfig.title = BTN_PRE_ORDER
        buttonConfig.shortMessage = productData?.preOrder?.shortMessage || ''
        return buttonConfig
      } else if (productData?.flags?.sellWithoutInventory || productData?.sellWithoutInventory) {
        buttonConfig = {
          title: GENERAL_ADD_TO_BASKET,
          validateAction: async () => {
            const cartLineItem: any = cartItems?.lineItems?.find((o: any) => o.productId === productData?.productId?.toUpperCase())
            if (productData?.currentStock === cartLineItem?.qty) {
              setAlert({
                type: 'error',
                msg: Messages.Errors['CART_ITEM_QTY_MAX_ADDED'],
              })
              return false
            }
            const isValid = cartItemsValidateAddToCart(
              // selectedAttrData?.productId ?? selectedAttrData?.recordId,
              cartItems,
              maxBasketItemsCount
            )
            if (!isValid) {
              setAlert({
                type: 'error',
                msg: stringFormat(
                  Messages.Errors['CART_ITEM_QTY_LIMIT_EXCEEDED'],
                  { maxBasketCount: maxBasketItemsCount }
                ),
              })
            }
            return isValid
          },
          action: async () => {
            const item = await cartHandler().addToCart(
              {
                basketId: basketId,
                productId: productData?.productId,
                qty: quantity,
                manualUnitPrice: productData?.price?.raw?.withoutTax,
                stockCode: productData?.stockCode,
                userId: user?.userId,
                isAssociated: user?.isAssociated,
              },
              'ADD',
              { product: productData }
            )
            setCartItems(item)
          },
          shortMessage: '',
        }
      } else {
        buttonConfig.title = BTN_NOTIFY_ME
        buttonConfig.action = async () => handleNotification()
        buttonConfig.type = 'button'
        buttonConfig.buttonType = 'button'
        return buttonConfig
      }
    }
    return buttonConfig;
  };

  const buttonConfig = buttonTitle();

  let isFreeShippingOverXEnabled = isFreeShippingOverXValue(config)
  const freeShippingOverXValue = getFreeShippingOverXValue(config)
  const overlayImages = product?.images?.filter((x: any) => matchStrings(x?.tag, "overlay", true));
  const overlayImage = product?.images?.find((x: any) => matchStrings(x?.tag, "overlay", true));
  const galleryImage = product?.images?.filter((x: any) => !matchStrings(x?.tag, "downloads", true) && !matchStrings(x?.tag, "overlay", true));
  const images = galleryImage?.map((image: any) => {
    return {
      original: generateUri(image?.image, 'fm=webp&h=500'),
      thumbnail: generateUri(image?.image, 'fm=webp&h=140'),
      thumbnailAlt: product?.name,
      originalAlt: product?.name,
      thumbnailTitle: product?.name,
    }
  })
  let height = '500'
  let thumbHeight = '150'
  if (isMobile) {
    height = '280'
    thumbHeight = '80'
  }
  const customRenderItem = (item: any) => {
    return (
      <div className="image-gallery-image">
        <img src={generateUri(item?.original, `h=${height}&fm=webp`) || IMG_PLACEHOLDER} alt={product?.name} height={height} width={height} />
        {overlayImages?.length > 0 &&
          <div className='absolute z-10 top-1 right-1'>
            <img src={generateUri(overlayImage?.image, 'h=130&fm=webp') || `${IMAGE_CDN_URL}//banners/18v-redemption-jan-mar-2024-offer-icon-500x500px.png`} className='overlayImage mob-overlay-img-width' width="130" height="130" alt={product?.name} />
          </div>
        }
      </div>
    );
  };
  const customRenderThumbInner = (item: any) => {
    return (
      <div className='relative image-gallery-thumbnail-inner'>
        <img src={generateUri(item?.thumbnail, `h=${thumbHeight}&fm=webp`) || IMG_PLACEHOLDER} alt={product?.name} height={thumbHeight} width={thumbHeight} />
        {overlayImages?.length > 0 && !matchStrings(item?.tag, "overlay", true) &&
          <div className='absolute z-10 top-1 right-1'>
            <img src={generateUri(overlayImage?.image, 'h=30&fm=webp') || `${IMAGE_CDN_URL}/banners/18v-redemption-jan-mar-2024-offer-icon-500x500px.png`} className='overlayImage' width="20" height="20" alt={product?.name} />
          </div>
        }
      </div>
    );
  };
  return (
    <div className="grid gap-8 pt-4 pb-0 sm:gap-24 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-2 lg:pt-20 lg:pb-20 grid-sm-1 feature-grid-sec">
      <Link href={product?.slug} passHref legacyBehavior>
        <div className="product-image product-image-border">
          <ImageGallery thumbnailAlt={product?.name} thumbnailTitle={product?.name} renderItem={customRenderItem} originalAlt={product?.name} items={images ?? []} thumbnailPosition="bottom" showPlayButton={false} showBullets={false} showNav={true} additionalClass="app-image-gallery" showFullscreenButton={false} renderThumbInner={customRenderThumbInner} />
        </div>
      </Link>
      <div className="right-product-info">
        <div className="flex justify-between mb-2">
          <h2 className="hidden mt-0 font-semibold uppercase text-brand-red sm:block">Deal of the week</h2>
          <div className="flex items-center gap-0">
            {[0, 1, 2, 3, 4].map((rating) => (
              <i key={rating} className={classNames(product?.rating > rating ? 'sprite-red-star-filled' : 'sprite-red-star', 'flex-shrink-0 sprite-icons')}></i>
            ))}
            <p className="pl-1 my-auto text-2xl font-light dark:text-black">{product?.rating}</p>
            <span className="text-xs font-normal text-gray-500">({product?.reviewCount})</span>
          </div>
        </div>
        <h3 className="font-semibold font-32 mob-font-24 dark:text-black">{product?.name}</h3>
        <div className="flex items-center w-full px-0 mb-6 font-bold text-left text-black font-24 sm:mt-6 sm:text-sm">
          {isIncludeVATInPriceDisplay(isIncludeVAT, product) ? product?.price?.formatted?.withTax : product?.price?.formatted?.withoutTax}
          {isIncludeVATInPriceDisplay(isIncludeVAT, product) ? (
            product?.listPrice?.raw?.withTax > 0 && product?.listPrice?.raw?.withTax > product?.price?.raw?.withTax && (
              <span className="px-1 font-normal text-gray-400 line-through">{product?.listPrice?.formatted?.withTax}</span>
            )
          ) : (
            product?.listPrice?.raw?.withoutTax > 0 && product?.listPrice?.raw?.withoutTax > product?.price?.raw?.withoutTax && (
              <span className="px-1 font-normal text-gray-400 line-through">{product?.listPrice?.formatted?.withoutTax}</span>
            )
          )}
          <div className="items-end ml-2 text-xs font-light text-right text-gray-400">{isIncludeVATInPriceDisplay(isIncludeVAT, product) ? 'inc. VAT' : 'ex. VAT'}</div>
        </div>
        <div className="block mb-5">
          <div dangerouslySetInnerHTML={{ __html: product?.shortDescription, }} className="inline font-light font-18 mob-font-14 dark:text-gray-700" />
          <Link className="inline" href={`/${currentProductData.link}`} passHref>
            <span className="ml-2 font-semibold underline font-18 dark:text-black">View more</span>
          </Link>
        </div>
        {isFreeShippingOverXEnabled && (
          <div className='pb-5'> <DeliveryMessage product={product} freeShippingOverXValue={freeShippingOverXValue} /> </div>
        )}
        {showProductSaleCountdown && <div className="flex flex-col gap-3 py-8 mb-5">
          <h4 className="mb-2 font-semibold dark:text-black">Deal ends in...</h4>
        </div>}
        <div className="col-span-12">
          <div className="flex w-full gap-1 mb-4 sm:grid sm:grid-cols-2">
            <button type="button" onClick={() => handleQuickViewData(product)} className="flex items-center justify-center flex-1 w-full px-1 py-3 font-medium text-white uppercase bg-black border border-transparent rounded-sm xs:max-w-xs lg:py-2 sm:px-4 btn-primary-green hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-black btn-c btn-primary disabled:cursor-not-allowed disabled:opacity-50">
              {GENERAL_ADD_TO_BASKET}
            </button>
            <div className="wish-btn w-14">
              {isInWishList ? (
                <SimpleButton aria-label="Warranty" variant="slim" className="!p-3 !rounded flex-1 !bg-white cursor-none hover:!bg-white !border !border-gray-600 shadow-none !hover:border-orange-600 flex text-center justify-center disabled:!bg-transparent" onClick={handleWishList}>
                  <HeartIcon className="items-center w-5 h-5 mx-auto text-center text-orange-600" />
                </SimpleButton>
              ) : (
                <SimpleButton aria-label="No Warranty" variant="slim" className="!p-3 !rounded flex-1 !bg-white hover:!bg-white !border !border-gray-600 shadow-none !hover:border-orange-600 flex text-center justify-center disabled:!bg-transparent" onClick={handleWishList} >
                  <HeartIcon className="items-center w-6 h-6 mx-auto text-center text-black" />
                </SimpleButton>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default FeatureProductCard