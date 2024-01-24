import dynamic from 'next/dynamic'
import Link from 'next/link'
import Image from 'next/image'
import { FC, useCallback } from 'react'
import { useState, useEffect } from 'react'
import { useUI } from '@components/ui/context'
import axios from 'axios'
import {
  CLOTH_COLOUR_ATTRIB_NAME,
  CLOTH_SIZE_ATTRIB_NAME,
  NEXT_CREATE_WISHLIST,
  Messages,
  MAX_ADD_TO_CART_LIMIT,
  NEXT_GET_PROOMO_DETAILS,
  NEXT_REMOVE_WISHLIST,
} from '@components/utils/constants'
import {
  HeartIcon,
  CheckCircleIcon,
  StarIcon,
} from '@heroicons/react/24/outline'
import { CheckCircleIcon as CheckSolidCircleIcon } from '@heroicons/react/24/solid'
import _, { round } from 'lodash'
import {
  BTN_NOTIFY_ME,
  BTN_PRE_ORDER,
  GENERAL_ADD_TO_BASKET,
  IMG_PLACEHOLDER,
  ITEM_WISHLISTED,
  QUICK_VIEW,
  WISHLIST_TITLE,
} from '@components/utils/textVariables'
import { generateUri } from '@commerce/utils/uri-util'
import cartHandler from '@components/services/cart'
import { IExtraProps } from '@components/common/Layout/Layout'
import {
  vatIncluded,
  validateAddToCart,
  cartItemsValidateAddToCart,
} from '@framework/utils/app-util'
import { hideElement, showElement } from '@framework/utils/ui-util'
import {
  deliveryDateFormat,
  stringToBoolean,
  tryParseJson,
} from '@framework/utils/parse-util'
import cn from 'classnames'
import classNames from 'classnames'
import { Listbox } from '@headlessui/react'
import { Select } from '@components/common/Select'
import commerce from '@lib/api/commerce'
import { ArrowRight } from '@components/icons'
import ProductTag from '../ProductTag'
import ButtonNotifyMe from '../ButtonNotifyMe'
const SimpleButton = dynamic(() => import('@components/ui/Button'))
const Button = dynamic(() => import('@components/ui/IndigoButton'))
const PLPQuickView = dynamic(
  () => import('@components/product/QuickView/PLPQuickView')
)

interface Props {
  product: any
  hideWishlistCTA?: any
  attributeNames?: any
  compareProductsAttributes?: any
  active?: boolean
}

interface Attribute {
  fieldName?: string
  fieldCode?: string
  fieldValues?: []
}
const EMPTY_COMPARE_SET = {
  key: '-',
  value: '-',
  display: '-',
  compareAtPLP: false,
}
const CompareProductCard: FC<React.PropsWithChildren<Props & IExtraProps>> = ({
  product: productData,
  hideWishlistCTA = false,
  deviceInfo,
  maxBasketItemsCount,
  attributeNames,
  compareProductsAttributes,
  active
}) => {
  const attributesMap = attributeNames?.map((attrib: any) => {
    let currentProduct = compareProductsAttributes?.find((x: any) => x.stockCode == productData?.stockCode)
    if (active) {
      return {
        name: attrib,
        value: productData?.customAttributes?.find((x: any) => x.display === attrib)?.value,
      }
    } else {
      return {
        name: attrib,
        value: currentProduct?.customAttributes?.find((x: any) => x.fieldName === attrib)?.fieldValue,
      }
    }
  })
  const { isMobile, isIPadorTablet } = deviceInfo
  const [currentProductData, setCurrentProductData] = useState({
    image: productData?.image,
    link: productData?.slug,
  })
  const {
    basketId,
    user,
    addToWishlist,
    openWishlist,
    setCartItems,
    openNotifyUser,
    cartItems,
    wishListItems,
    isGuestUser,
    openLoginSideBar,
    setAlert,
    isCompared,
    compareProductList,
    setCompareProducts,
    removeFromWishlist,
  } = useUI()
  const isIncludeVAT = vatIncluded()
  const [quickViewData, setQuickViewData] = useState(null)
  const [sizeValues, setSizeValues] = useState([])
  const [product, setProduct] = useState(productData || {})
  const [quantity, setQuantity] = useState(1)
  const [productPromotion, setProductPromo] = useState(null)
  const [isInWishList, setIsInWishList] = useState(false)
  const [attribs, setAttribs] = useState<any>([])

  useEffect(() => {
    if (compareProductsAttributes?.length > 0) {
      if (compareProductsAttributes?.length !== attributeNames?.length) {
        const emptySetCount = attributeNames?.length - compareProductsAttributes?.length
        const emptyCompareSet = Array(Math.abs(emptySetCount)).fill(EMPTY_COMPARE_SET)
        setAttribs([...emptyCompareSet])
        return
      }
      setAttribs([...product.attributes])
    } else {
      setAttribs(Array(attributeNames?.length).fill(EMPTY_COMPARE_SET))
    }
  }, [product])

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
      compareProductList && compareProductList[productData?.recordId]
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
    } else {
      addToWishlist(product)
      setIsInWishList(true)
      openWishlist()
    }
  }

  const handleWishList = async () => {
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
          } else {
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

  const secondImage = product?.images?.length > 0 ? product?.images[1]?.image : null
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
      title: GENERAL_ADD_TO_BASKET,
      validateAction: async () => {
        const isValid = cartItemsValidateAddToCart(
          // product?.recordId ?? product?.productId,
          cartItems,
          maxBasketItemsCount,
          quantity > 1 ? quantity : null
        )
        if (!isValid) {
          setAlert({
            type: 'error',
            msg: Messages.Errors['CART_ITEM_QTY_LIMIT_EXCEEDED'],
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
      buttonConfig.title = BTN_PRE_ORDER
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
  const WarrantyYear = product?.attributes?.filter(
    (attr: any) => attr.key === 'global.warranty'
  )
  const getAttribValue = (val: any) => {
    const parsed = tryParseJson(val)
    switch (parsed) {
      case true:
        return (
          <img
            alt="check_circle"
            width="15px"
            src="/assets/images/check_circle.svg"
          />
        )
      case false:
        return (
          <img
            alt="cross_icon"
            className="w-5"
            src="/assets/images/cross_icon.svg"
          />
        )
      default:
        return val
    }
  }
  return (
    <>
      <div className={cn('relative height-full border-gray-200 hover:border-gray-500 long-product-card-mobil grid grid-cols-12 gap-2 sm:gap-0 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 shadow-gray-200 group prod-group border rounded-md px-4 pt-4 pb-4 sm:pb-0 bg-white',)} key={product.id}>
        <div className={`${product?.currentStock == 0 ? 'opacity-40' : ''} relative col-span-4 col-mob-12 bg-gray-200 rounded-md sm:col-span-12 aspect-w-1 aspect-h-1 mobile-card-panel white-card bundle-card`}>
          <div className="absolute top-0 right-0 z-10 flex items-center justify-between w-full pos-inherit">
            <ProductTag product={product} />
            {isMobile || isIPadorTablet ? null : (
              product?.currentStock < 11 && product?.currentStock > 0 &&
              <div className={`${product?.currentStock > 0 ? 'bg-red-500 text-white' : 'bg-red-500 text-white'} w-18 absolute text-center right-0 px-2 py-1 text-xs font-semibold  rounded-md sm:top-2`}>
                Only {product?.currentStock} left!
              </div>
            )}
          </div>
          <ButtonLink isComparedEnabled={isComparedEnabled} href={`/${currentProductData.link}`} handleHover={handleHover} itemPrice={itemPrice} productName={product.name} onClick={handleSetCompareProduct}>
            <img id={`${product?.productId ?? product?.recordId}-1`} src={generateUri(currentProductData.image, 'h=350&fm=webp') || IMG_PLACEHOLDER} alt={product.name ||'compare'} className="object-cover object-center w-full h-full sm:h-full min-h-image height-img-auto bundle-height-img-auto" style={css} width={400} height={500} />
            {product?.images?.length > 1 && (
              <img id={`${product?.productId ?? product?.recordId}-2`} src={generateUri(product?.images[1]?.image, 'h=500&fm=webp') || IMG_PLACEHOLDER} alt={product.name ||'compare'} className="hidden object-cover object-center w-full h-full sm:h-full min-h-image height-img-auto bundle-height-img-auto" width={400} height={500} />
            )}
          </ButtonLink>
        </div>

        <div className="col-span-8 sm:col-span-12 sm:pt-4 col-mob-12 mob-left-right-padding">
          <div className="flex items-center justify-between w-full px-0 text-xs font-bold text-left text-black sm:mt-1 sm:text-sm p-font-size">
            <div>
              {isIncludeVAT ? product?.price?.formatted?.withTax : product?.price?.formatted?.withoutTax}
              {isIncludeVAT ? (<>
                {product?.listPrice?.raw?.withTax > 0 && product?.listPrice?.raw?.withTax > product?.price?.raw?.withTax && (
                  <span className="px-1 font-normal text-gray-400 line-through">
                    {product?.listPrice?.formatted?.withTax}
                  </span>
                )}
              </>) : (<>
                {product?.listPrice?.raw?.withoutTax > 0 && product?.listPrice?.raw?.withoutTax > product?.price?.raw?.withoutTax && (
                  <span className="px-1 font-normal text-gray-400 line-through">
                    {product?.listPrice?.formatted?.withoutTax}
                  </span>
                )}
              </>)}
              <span className="pl-1 text-xs font-light text-right text-gray-400">
                {isIncludeVAT ? 'inc. VAT' : 'ex. VAT'}
              </span>
            </div>
            <div className="items-end text-xs font-light text-right text-gray-400">
              {isMobile || isIPadorTablet
                ? null
                : !isComparedEnabled && (
                  <div className={`z-10 bottom-1 right-1`}>
                    {isInWishList ? (
                      <SimpleButton
                        variant="slim" aria-label="Warranty"
                        onClick={handleWishList}
                        className="flex-1 cursor-none !bg-transparent !shadow-none justify-end items-end text-right !p-0 !border-0 hover:border-0"
                      >
                        <i className="sprite-icons sprite-wishlist-active" />
                      </SimpleButton>
                    ) : (
                      <SimpleButton
                        variant="slim" aria-label="Warranty"
                        className="flex-1 cursor-none !bg-transparent !shadow-none justify-end items-end text-right !p-0 !border-0 hover:border-0"
                        onClick={handleWishList}
                      >
                        <i className="sprite-icons sprite-wishlist" />
                      </SimpleButton>
                    )}
                  </div>
                )}
            </div>
          </div>
          <ButtonLink
            isComparedEnabled={false}
            href={`/${product.link || product?.slug}`}
            handleHover={() => { }}
            itemPrice={itemPrice}
            productName={product.name}
            onClick={handleSetCompareProduct}
            className="w-full px-0"
          >
            {product?.promotions?.length > 0 && (
              <div className="flex w-auto gap-1 px-2 py-1 text-xs font-semibold text-black rounded-md bg-tan">
                <i className="sprite-star-black sprite-icons" />
                {product?.promotions?.map((promo: any, promoIdx: number) => {
                  return (
                    <span key={`promo-${promoIdx}`}>{promo?.promoCode}</span>
                  )
                })}
              </div>
            )}
            <div className="flex justify-between w-full px-0 mb-1 font-semibold text-left text-black capitalize font-18 product-name hover:text-gray-950 min-prod-name-height light-font-weight prod-name-block">
              {productNameWithAttr}
            </div>

            {isMobile || isIPadorTablet ? null :
              <div className="flex flex-col w-full gap-0 py-3 mt-3 border-t border-gray-200">
                 {attributesMap?.map((attrib: any, attribIdx: any) => (
                  <span key={`compare-attributes-${attribIdx}`} className="flex items-center justify-start w-full pb-1 font-semibold text-left text-black uppercase font-12">
                    <ArrowRight className="inline-block w-3 h-3 pr-1 text-black" />{' '}
                    {attrib?.name}{' '}:{' '}{attrib?.value ? attrib?.value == "False" || attrib?.value == "No" ?
                      <><img alt={attrib?.value||'icon-cross'} src="/assets/images/cross_icon.svg"  width={2} height={2} className='icon-small' /></>
                      : attrib?.value == "True" || attrib?.value == "Yes" ?
                        <><img alt={attrib?.value || 'icon-check'} src="/assets/images/check_circle.svg" width={2} height={2} className='icon-small-green' /></>
                        : attrib?.value?.includes('#') ? <span className={`w-4 h-4 ml-1 rounded-full`} style={{ background: attrib?.value }}></span> : attrib?.value :
                      <span className='pl-1 font-bold text-gray-900 capitalize'>{'-'}</span>}
                  </span>
                ))}
              </div>
            }

            {isMobile || isIPadorTablet ? null : (
              <div className="flex items-center justify-between w-full px-0 py-2 text-xs font-medium text-black border-t border-gray-200 sm:font-bold">
                <div className="flex items-center gap-0">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <StarIcon
                      key={rating}
                      className={classNames(
                        product?.rating > rating
                          ? 'text-orange-500'
                          : 'text-gray-500',
                        'flex-shrink-0 w-5 h-5 relative -top-0.5'
                      )}
                    />
                  ))}
                  <p className="pl-1 my-auto text-xl font-light">
                    {product?.rating}
                  </p>
                </div>                
              </div>
            )}
          </ButtonLink>
          {isMobile || isIPadorTablet ? null : (
            <div className={cn('absolute flex flex-col left-0 w-full z-10 bg-white opacity-0 group-hover:opacity-100 gap-1 pr-0 mx-auto py-2 group-hover:flex bottom-0 duration-300 bg-transparent rounded-md',)}>
              <div className="flex justify-between gap-4 px-4">
                <SimpleButton
                  variant="slim"
                  className="!p-1 flex-1 !bg-white !text-gray-900 hover:!bg-gray-200 border-none hover:border-none disabled:!bg-gray-300"
                  onClick={() => handleQuickViewData(product)}>
                  <span className="uppercase">{QUICK_VIEW}</span>
                </SimpleButton>
                {product?.currentStock < 1 && !product?.preOrder?.isEnabled ? (
                  <ButtonNotifyMe product={product} />
                ) : (
                  <Button
                    title={buttonConfig.title}
                    action={buttonConfig.action}
                    validateAction={buttonConfig.validateAction}
                    type="button" aria-label={buttonConfig.title}
                    buttonType={buttonConfig.buttonType || 'cart'}
                  />
                )}
              </div>
            </div>
          )}
        </div>
        {isMobile || isIPadorTablet ? (
          <>
            <div className="flex flex-col w-full col-span-12 gap-0 mob-left-right-padding">
             {attributesMap?.map((attrib: any, attribIdx: any) => (
                <span key={`compare-attributes-${attribIdx}`} className="flex items-center justify-start w-full pb-1 font-semibold text-left text-black uppercase font-12">
                  <ArrowRight className="inline-block w-3 h-3 pr-1 text-black" />{' '}
                  {attrib?.name}{' '}:{' '}{attrib?.value ? attrib?.value == "False" || attrib?.value == "No" ?
                    <><img alt={attrib?.value || 'icon-cross'} src="/assets/images/cross_icon.svg" width={2} height={2} className='icon-small' /></>
                    : attrib?.value == "True" || attrib?.value == "Yes" ?
                      <><img alt={attrib?.value || 'icon-check'} src="/assets/images/check_circle.svg" width={2} height={2} className='icon-small-green' /></>
                      : attrib?.value?.includes('#') ? <span className={`w-4 h-4 ml-1 rounded-full`} style={{ background: attrib?.value }}></span> : attrib?.value :
                    <span className='pl-1 font-bold text-gray-900 capitalize'>{'-'}</span>}
                </span>
              ))}
            </div>
            <div className='flex items-center justify-between w-full col-span-12 gap-2 py-2 border-gray-200 border-y mob-left-right-padding'>
              <div className="relative items-end justify-end w-full text-sm font-semibold text-right text-black top-1 product-name hover:text-gray-950">
                {isInWishList ? (
                  <SimpleButton
                    variant="slim"
                    aria-label="Warranty"
                    className="!p-0 flex-1 !bg-white cursor-none text-right hover:!bg-white"
                  >
                    <i className="sprite-icons sprite-wishlist-active" />
                  </SimpleButton>
                ) : (
                  <SimpleButton
                    variant="slim"
                    aria-label="No Warranty"
                    className="!p-0 flex-1 !bg-white text-right hover:!bg-white"
                    onClick={handleWishList}
                  >
                    <i className="sprite-icons sprite-wishlist" />
                  </SimpleButton>
                )}
              </div>
            </div>
            <div className="col-span-12">
              <div className="grid grid-cols-2 gap-1 sm:mb-4 justify-evenly">
                {product?.currentStock < 1 && !product?.preOrder?.isEnabled ? (
                  <ButtonNotifyMe product={product} />
                ) : (
                  <Button
                    title={buttonConfig.title}
                    action={buttonConfig.action}
                    validateAction={buttonConfig.validateAction}
                    type="button"
                    aria-label="Cart"
                    buttonType={buttonConfig.buttonType || 'cart'}
                  />
                )}
                <button
                  type="button"
                  onClick={() => handleQuickViewData(product)}
                  className="w-full text-primary btn-secondary text-white uppercase rounded dark:text-primary font-semibold text-[14px] sm:text-sm p-1.5 outline-none"
                >
                  {QUICK_VIEW}
                </button>
              </div>
            </div>
          </>
        ) : null}
      </div>
      <PLPQuickView
        isQuickview={Boolean(quickViewData)}
        setQuickview={() => { }}
        productData={quickViewData}
        isQuickviewOpen={Boolean(quickViewData)}
        setQuickviewOpen={handleCloseQuickView}
        deviceInfo={deviceInfo}
        maxBasketItemsCount={maxBasketItemsCount}
      />
    </>
  )
}

const ButtonLink = (props: any) => {
  const {
    isComparedEnabled,
    children,
    href,
    handleHover,
    itemPrice,
    productName,
    onClick,
  } = props

  if (isComparedEnabled) {
    return (
      <div className="flex flex-col w-full" onClick={onClick}>
        {children}
      </div>
    )
  }

  return (
    <Link
      passHref
      href={href}
      onMouseEnter={(ev: any) => handleHover(ev, 'enter')}
      onMouseLeave={(ev: any) => handleHover(ev, 'leave')}
      title={`${productName} \t ${itemPrice}`}
    >
      {children}
    </Link>
  )
}

export default CompareProductCard
