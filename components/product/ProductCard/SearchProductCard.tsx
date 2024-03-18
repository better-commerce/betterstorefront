import dynamic from 'next/dynamic'
import Link from 'next/link'
import { FC, useCallback, useMemo } from 'react'
import { useState, useEffect } from 'react'
import { useUI } from '@components/ui/context'
import axios from 'axios'
import { CLOTH_COLOUR_ATTRIB_NAME, CLOTH_SIZE_ATTRIB_NAME, NEXT_CREATE_WISHLIST, Messages, NEXT_GET_PROOMO_DETAILS, NEXT_REMOVE_WISHLIST } from '@components/utils/constants'
import { StarIcon } from '@heroicons/react/24/outline'
import { HeartIcon } from '@heroicons/react/24/outline'
import _, { round } from 'lodash'
import { IMG_PLACEHOLDER, WISHLIST_TITLE } from '@components/utils/textVariables'
import { generateUri } from '@commerce/utils/uri-util'
import cartHandler from '@components/services/cart'
import { IExtraProps } from '@components/common/Layout/Layout'
import { vatIncluded, cartItemsValidateAddToCart } from '@framework/utils/app-util'
import { hideElement, showElement } from '@framework/utils/ui-util'
import { matchStrings, stringFormat, stringToBoolean } from '@framework/utils/parse-util'
import cn from 'classnames'
import classNames from 'classnames'
import ProductTag from '../ProductTag'
import wishlistHandler from '@components/services/wishlist'
import { useTranslation } from '@commerce/utils/use-translation'
const SimpleButton = dynamic(() => import('@components/ui/Button'))
const Button = dynamic(() => import('@components/ui/IndigoButton'))
const PLPQuickView = dynamic(() => import('@components/product/QuickView/PLPQuickView'))

interface Props {
  product: any
  hideWishlistCTA?: any
}

interface Attribute {
  fieldName?: string
  fieldCode?: string
  fieldValues?: []
}

const SearchProductCard: FC<React.PropsWithChildren<Props & IExtraProps>> = ({
  product: productData,
  hideWishlistCTA = false,
  deviceInfo,
  maxBasketItemsCount,
}) => {
  const { isMobile, isIPadorTablet } = deviceInfo
  const [currentProductData, setCurrentProductData] = useState({
    image: productData.image,
    link: productData.slug,
  })
  const { basketId, user, addToWishlist, openWishlist, setCartItems, openNotifyUser, cartItems, wishListItems, isGuestUser, openLoginSideBar, setAlert, isCompared, compareProductList, setCompareProducts, removeFromWishlist } = useUI()
  const isIncludeVAT = vatIncluded()
  const [quickViewData, setQuickViewData] = useState(null)
  const [sizeValues, setSizeValues] = useState([])
  const [product, setProduct] = useState(productData || {})
  const [quantity, setQuantity] = useState(1)
  const [productPromotion, setProductPromo] = useState(null)
  const [isInWishList, setIsInWishList] = useState(false)
  const { deleteWishlistItem } = wishlistHandler()
  const translate = useTranslation();

  useEffect(() => {
    if (wishListItems?.some((x: any) => x?.stockCode === product?.stockCode)) {
      setIsInWishList(true)
    } else {
      setIsInWishList(false)
    }
  }, [wishListItems])

  const handleUpdateWishlistItem = useCallback(() => {
    if (wishListItems.length < 1) return
    const wishlistItemIds = wishListItems.map((o: any) => o.recordId)
    setProduct({
      ...productData,
      hasWishlisted: wishlistItemIds.includes(productData.recordId),
    })
  }, [wishListItems, productData])

  const setPromo = async () => {
    const { data: promoDetails }: any = await axios.post(
      NEXT_GET_PROOMO_DETAILS,
      { query: product?.promotions?.find((x: any) => x?.promoCode).promoCode }
    )
    setProductPromo(promoDetails)
  }

  useEffect(() => {
    handleUpdateWishlistItem()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wishListItems, productData])

  useEffect(() => {
    const compared = Boolean(
      compareProductList && compareProductList[productData.recordId]
    )
    setProduct({
      ...productData,
      compared,
    })
  }, [productData, compareProductList])

  useEffect(() => {
    if (product?.variantProductsAttributeMinimal?.length < 1) return
    let sizeAttribData = product?.variantProductsAttributeMinimal?.find(
      (o: any) => o.fieldCode === CLOTH_SIZE_ATTRIB_NAME
    )
    sizeAttribData =
      sizeAttribData?.fieldValues?.sort(
        (a: { displayOrder: number }, b: { displayOrder: number }) =>
          a.displayOrder > b.displayOrder ? 1 : -1
      ) || []
    if (sizeAttribData) setSizeValues(sizeAttribData)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.variantProductsAttributeMinimal])

  const handleQuickViewData = (data: any) => {
    setQuickViewData(data)
  }

  const handleCloseQuickView = () => {
    setQuickViewData(null)
  }

  const insertToLocalWishlist = () => {
    if (isInWishList) {
      removeFromWishlist(product?.recordId)
      setIsInWishList(false)
      openWishlist()
    }
    else {
      addToWishlist(product)
      setIsInWishList(true)
      openWishlist()
    }
  }

  const handleWishList = async () => {
    if (isInWishList) {
      deleteWishlistItem(user?.userId, product?.recordId)
      removeFromWishlist(product?.recordId)
      openWishlist()
      return
    }
    const objUser = localStorage.getItem('user')
    if (!objUser || isGuestUser) {
      //  setAlert({ type: 'success', msg:" Please Login "})
      openLoginSideBar()
      return
    }
    if (objUser) {
      const createWishlist = async () => {
        try {
          if (isInWishList) {
            await axios.post(NEXT_REMOVE_WISHLIST, {
              id: user?.userId,
              productId: product?.recordId,
              flag: true,
            })
            insertToLocalWishlist()
          }
          else {
            await axios.post(NEXT_CREATE_WISHLIST, {
              id: user?.userId,
              productId: product?.recordId,
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

  useEffect(() => {
    setCurrentProductData((prevState): any => {
      if (prevState.link !== product.slug) {
        return { ...prevState, image: product.image, link: product.slug }
      } else return { ...prevState }
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.slug])

  const productWithColors =
    product.variantProductsAttributeMinimal &&
    product.variantProductsAttributeMinimal.find(
      (item: Attribute) => item.fieldCode === CLOTH_COLOUR_ATTRIB_NAME
    )

  const hasColorVariation =
    productWithColors && productWithColors.fieldValues.length >= 1

  const handleVariableProduct = (attr: any, type: string = 'enter') => {
    if (type === 'enter') {
      const variatedProduct = product.variantProductsMinimal.find((item: any) =>
        item.variantAttributes.find(
          (variant: any) => variant.fieldValue === attr.fieldValue
        )
      )
      if (variatedProduct) {
        setCurrentProductData({
          image: variatedProduct.image,
          link: variatedProduct.slug,
        })
      }
    } else {
      setCurrentProductData({ image: product?.image, link: product?.slug })
    }
  }

  const secondImage = useMemo(() => product?.images?.[1]?.image ?? false, [product?.images]);

  const handleHover = (ev: any, type: string) => {
    if (hideWishlistCTA) return

    const parentElem = ev?.target?.parentElement
    if (parentElem) {
      if (type === 'enter' && secondImage) {
        hideElement(ev?.target?.parentElement?.childNodes[0])
        showElement(ev?.target?.parentElement?.childNodes[1])
        //setCurrentProductData({ ...currentProductData, image: secondImage })
      }

      if (type === 'leave' && secondImage) {
        hideElement(ev?.target?.parentElement?.childNodes[1])
        showElement(ev?.target?.parentElement?.childNodes[0])
        //setCurrentProductData({ ...currentProductData, image: product.image })
      }
    }
  }

  const handleNotification = () => {
    openNotifyUser(product.id)
  }

  const buttonTitle = () => {
    let buttonConfig: any = {
      title: translate('label.basket.addToBagText'),
      validateAction: async () => {
        const cartLineItem: any = cartItems?.lineItems?.find((o: any) => {
          if (matchStrings(o.productId, product?.recordId, true) || matchStrings(o.productId, product?.productId, true)) {
            return o
          }
        })
        if (product?.currentStock === cartLineItem?.qty && !product?.fulfilFromSupplier && !product?.flags?.sellWithoutInventory) {
          setAlert({ type: 'error', msg: Messages.Errors['CART_ITEM_QTY_MAX_ADDED'], })
          return false
        }
        const isValid = cartItemsValidateAddToCart(
          // product?.recordId ?? product?.productId,
          cartItems,
          maxBasketItemsCount,
          quantity > 1 && quantity
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
        )
        setCartItems(item)
      },
      shortMessage: '',
    }
    if (!product?.currentStock && product?.preOrder?.isEnabled) {
      buttonConfig.title = translate('label.product.preOrderText')
      buttonConfig.isPreOrderEnabled = true
      buttonConfig.buttonType = 'button'
      buttonConfig.shortMessage = product?.preOrder?.shortMessage
    }
    return buttonConfig
  }

  const buttonConfig = buttonTitle()
  const saving =
    (isIncludeVAT
      ? product?.listPrice?.raw?.withTax
      : product?.listPrice?.raw?.withoutTax) -
    (isIncludeVAT
      ? product?.price?.raw?.withTax
      : product?.price?.raw?.withoutTax)
  const discount = round(
    (saving /
      (isIncludeVAT
        ? product?.listPrice?.raw?.withTax
        : product?.listPrice?.raw?.withoutTax)) *
    100,
    0
  )
  const css = { maxWidth: '100%', height: 'auto' }

  const itemPrice = product?.price?.formatted?.withTax

  // const [isEligibleToCompare, setIsEligibleToCompare] = useState(false)
  const [compareAttributes, setCompareAttributes] = useState<any>([])

  useEffect(() => {
    const { attributes } = product
    if (!attributes || attributes?.length < 1) return
    // let shouldEnabled = false
    let mappedAttribs: any = []
    attributes.forEach((attrib: any) => {
      if (attrib.compareAtPLP) {
        // shouldEnabled = true
        mappedAttribs.push(attrib)
      }
    })
    setCompareAttributes(_.uniqBy(mappedAttribs, 'key'))
    // if (shouldEnabled) {
    //   setIsEligibleToCompare(shouldEnabled)
    // }
  }, [product])

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

  const isComparedEnabled = stringToBoolean(isCompared)
  const electricVoltAttrLength = product?.attributes?.filter(
    (x: any) => x?.key == 'electrical.voltage'
  )
  let productNameWithAttr: any = product?.name?.toLowerCase()
  productNameWithAttr =
    electricVoltAttrLength?.length > 0
      ? product?.attributes?.map((volt: any, vId: number) => (
        <span key={`volt-${vId}`}>
          {product.name?.toLowerCase()}{' '}
          <span className="p-0.5 text-xs font-bold text-black bg-white border border-gray-500 rounded">
            {volt?.value}
          </span>
        </span>
      ))
      : (productNameWithAttr = product?.name?.toLowerCase())
  const deliveryDateLength = product?.attributes?.filter(
    (x: any) => x?.key == 'product.estimatedelivery'
  )
  const deliveryDate = product?.attributes?.find(
    (x: any) => x?.key == 'product.estimatedelivery'
  )
  const EtaDate = new Date()
  if (product?.fulfilFromWarehouseDays != 0) {
    EtaDate.setDate(EtaDate.getDate() + product?.fulfilFromWarehouseDays)
  }
  const WarrantyYear = product?.attributes?.filter((attr: any) => attr.key === 'global.warranty');

  return (
    <>
      <div className={cn(`relative hover:border-orange-500 long-product-card-mobil grid grid-cols-12 gap-2 overflow-hidden sm:gap-0 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 shadow-gray-200 group prod-group border rounded-md px-4 pt-0 pb-4 sm:pb-0 bg-white ${product?.currentStock == 0 ? 'hover:border-gray-200 border-gray-100' : 'hover:border-orange-500 border-gray-200'}`, { 'height-full border-gray-200': isComparedEnabled, 'height-full border-orange-500': product.compared, })} key={product.id}>
        <div className={`${product?.currentStock == 0 || product?.currentStock < 0 ? 'opacity-100' : ''} relative col-span-4 col-mob-12 bg-gray-200 rounded-md sm:col-span-12 aspect-w-1 aspect-h-1 mobile-card-panel white-card bundle-card`}>
          <div className="absolute top-0 right-0 flex items-center justify-between w-full z-1 pos-inherit">
            <ProductTag product={product} />
            {isMobile || isIPadorTablet ? null : (
              product?.currentStock < 11 && product?.currentStock > 0 &&
              <div className={`${product?.currentStock > 0 ? 'bg-red-500 text-white' : 'bg-red-500 text-white'} w-18 absolute text-center right-0 px-2 py-1 text-xs font-semibold  rounded-md sm:top-2`}>
                Only {product?.currentStock} left!
              </div>
            )}
          </div>
          <ButtonLink isComparedEnabled={isComparedEnabled} href={`/${currentProductData.link}`} handleHover={handleHover} itemPrice={itemPrice} productName={product.name} onClick={handleSetCompareProduct}>
            <img id={`${product?.productId ?? product?.recordId}-1`} src={generateUri(currentProductData.image, 'h=350&fm=webp') || IMG_PLACEHOLDER} alt={product.name || 'search'} className="object-cover object-center w-full h-full sm:h-full min-h-image height-img-auto bundle-height-img-auto" style={css} width={400} height={500} />
            {product?.images?.length > 1 && (
              <img id={`${product?.productId ?? product?.recordId}-2`} src={generateUri(product?.images[1]?.image, 'h=500&fm=webp') || IMG_PLACEHOLDER} alt={product.name || 'search'} className="hidden object-cover object-center w-full h-full sm:h-full min-h-image height-img-auto bundle-height-img-auto" width={400} height={500} />
            )}
          </ButtonLink>
          {isMobile ? null : (
            <div
              className={cn( 'absolute flex-wrap z-10 hidden w-full gap-1 px-1 py-4 transition-transform duration-500 bg-white sm:translate-y-60 sm:flex group-hover:translate-y-20', { 'group-hover:opacity-0 group-hover:hidden': isComparedEnabled } )}>
              <Button title={translate('label.basket.addToBagText')} action={buttonConfig.action} buttonType={buttonConfig.type || 'cart'} />
              <SimpleButton variant="slim" className="!p-1 flex-1 !bg-transparent !text-gray-900 hover:!bg-gray-200 border-none hover:border-none disabled:!bg-gray-300" onClick={() => handleQuickViewData(product)} > {translate('label.product.quickViewText')} </SimpleButton>
            </div>
          )}
        </div>
        <div className="col-span-8 sm:col-span-12 sm:pt-4 col-mob-12 mob-left-right-padding">
          {!hideWishlistCTA && <button type="button" onClick={handleWishList} className="absolute top-0 right-0 px-1 text-gray-500 rounded-sm sm:py-4 hover:text-pink hover:border-pink" >
            {isInWishList ? (
              <HeartIcon className="flex-shrink-0 w-5 h-5 text-red-600" />
            ) : (
              <HeartIcon className="flex-shrink-0 w-5 h-5" />
            )}
          </button>}
          <div className="flex items-center justify-between w-full px-0 text-xs font-bold text-left text-black sm:mt-1 sm:text-sm p-font-size">
            <div>
              {isIncludeVAT ? product?.price?.formatted?.withTax : product?.price?.formatted?.withoutTax}
              {isIncludeVAT ? (
                product?.listPrice?.raw?.withTax > 0 && product?.listPrice?.raw?.withTax != product?.price?.raw?.withTax && (
                  <span className="px-1 font-normal text-gray-400 line-through">{product?.listPrice?.formatted?.withTax}</span>
                )
              ) : (
                product?.listPrice?.raw?.withoutTax > 0 && product?.listPrice?.raw?.withoutTax != product?.price?.raw?.withoutTax && (
                  <span className="px-1 font-normal text-gray-400 line-through">{product?.listPrice?.formatted?.withoutTax}</span>
                )
              )}
              <span className="pl-1 text-xs font-light text-right text-gray-400">{isIncludeVAT ? 'inc. VAT' : 'ex. VAT'}</span>
            </div>
            {isMobile || isIPadorTablet ? null :
              <div className={`items-end text-xs font-light text-right text-gray-400`}>
                {(!isComparedEnabled) && (
                  <div className={`z-10 bottom-1 right-1`}>
                    <SimpleButton variant="slim" aria-label="Wishlist" className="flex-1 cursor-none !bg-transparent !shadow-none justify-end items-end text-right !p-0 !border-0 hover:border-0" onClick={handleWishList}>
                      <i className={`sprite-icons sprite-wishlist${isInWishList ? '-active' : ''}`} />
                    </SimpleButton>
                  </div>
                )}
              </div>
            }
          </div>
          <ButtonLink isComparedEnabled={isComparedEnabled} href={`/${currentProductData.link}`} handleHover={() => { }} itemPrice={itemPrice} productName={product.name} onClick={handleSetCompareProduct} className="w-full px-0">
            <div className="flex justify-between w-full px-0 mb-1 font-semibold text-left text-black capitalize font-16 product-name hover:text-gray-950 min-prod-name-height light-font-weight prod-name-block">
              {productNameWithAttr}
            </div>

            {isMobile || isIPadorTablet ? null : (
              <div className="flex items-center justify-between w-full px-0 py-2 text-xs font-medium text-black border-t border-gray-200 sm:font-bold">
                <div className="flex items-center gap-0">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <StarIcon
                      key={rating}
                      className={classNames(
                        'w-5 h-5 flex-shrink-0 relative -top-0.5',
                        product?.rating > rating ? 'text-orange-500' : 'text-gray-500'
                      )}
                    />
                  ))}
                  <p className="relative pl-1 my-auto text-xl font-light -top-0.5">{product?.rating}</p>
                </div>
              </div>
            )}
            {isComparedEnabled && product?.compared && (
              <div className="absolute bottom-0 left-0 flex flex-col w-full gap-1 py-0 pr-0 mx-auto duration-300 bg-transparent rounded-md button-position-absolute compared-btn">
                {product?.compared ? (
                  <button className="w-full font-semibold uppercase border border-transparent btn-primary-white font-14">
                    Remove
                  </button>
                ) : null}
              </div>
            )}
          </ButtonLink>
        </div>
        {isMobile || isIPadorTablet && (
          <>
            <div className="grid grid-cols-2 col-span-12 gap-1 sm:mb-4 justify-evenly">
              {!hideWishlistCTA && (
                <SimpleButton
                  variant="slim"
                  className="!p-1 flex-1 !bg-transparent !text-gray-900 hover:!bg-gray-200 border-none hover:border-none disabled:!bg-gray-300"
                  onClick={handleWishList}
                  disabled={product.hasWishlisted}
                >
                  {product.hasWishlisted ? translate('label.product.wishlistedText') : WISHLIST_TITLE}
                </SimpleButton>
              )}
              <button type="button" onClick={() => handleQuickViewData(product)} className="w-full text-primary bg-orange-600 text-white uppercase rounded dark:text-primary font-semibold text-[14px] sm:text-sm p-1.5 outline-none">
                {translate('label.product.quickViewText')}
              </button>
            </div>
          </>
        )}
      </div>
      <PLPQuickView isQuickview={Boolean(quickViewData)} setQuickview={() => { }} productData={quickViewData} isQuickviewOpen={Boolean(quickViewData)} setQuickviewOpen={handleCloseQuickView} deviceInfo={deviceInfo} maxBasketItemsCount={maxBasketItemsCount} />
    </>
  )
}

const ButtonLink = (props: any) => {
  const { isComparedEnabled, children, href, handleHover, itemPrice, productName, onClick, } = props
  if (isComparedEnabled) {
    return (
      <div className="flex flex-col w-full" onClick={onClick}>{children}</div>
    )
  }
  return (
    <Link passHref href={href} className="img-link-display" onMouseEnter={(ev: any) => handleHover(ev, 'enter')} onMouseLeave={(ev: any) => handleHover(ev, 'leave')} title={`${productName} \t ${itemPrice}`}>
      {children}
    </Link>
  )
}

export default SearchProductCard
