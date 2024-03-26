import dynamic from 'next/dynamic'
import Link from 'next/link'
import Image from 'next/image'
import { FC, useCallback, useMemo } from 'react'
import { useState, useEffect } from 'react'
import { useUI } from '@components/ui/context'
import axios from 'axios'
import {
  CLOTH_COLOUR_ATTRIB_NAME,
  CLOTH_SIZE_ATTRIB_NAME,
  NEXT_CREATE_WISHLIST,
  Messages,
  NEXT_REMOVE_WISHLIST,
} from '@components/utils/constants'
import _, { round } from 'lodash'
import { IMG_PLACEHOLDER, } from '@components/utils/textVariables'
import { generateUri } from '@commerce/utils/uri-util'
import cartHandler from '@components/services/cart'
import { IExtraProps } from '@components/common/Layout/Layout'
import { vatIncluded, validateAddToCart, cartItemsValidateAddToCart } from '@framework/utils/app-util'
import { hideElement, showElement } from '@framework/utils/ui-util'
import { matchStrings, stringFormat, stringToBoolean } from '@framework/utils/parse-util'
import cn from 'classnames'
import ButtonNotifyMe from '@components/product/ButtonNotifyMe'
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

const AddonCard: FC<React.PropsWithChildren<Props & IExtraProps>> = ({
  product: productData,
  hideWishlistCTA = false,
  deviceInfo,
  maxBasketItemsCount,
}) => {
  const [currentProductData, setCurrentProductData] = useState({
    image: productData.image,
    link: productData.slug,
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
  const translate = useTranslation()
  const isIncludeVAT = vatIncluded()
  const [quickViewData, setQuickViewData] = useState(null)
  const [sizeValues, setSizeValues] = useState([])
  const [product, setProduct] = useState(productData || {})
  const [quantity, setQuantity] = useState(1)
  const [isInWishList, setIsInWishList] = useState(false)

  const handleUpdateWishlistItem = useCallback(() => {
    if (wishListItems.length < 1) return
    const wishlistItemIds = wishListItems.map((o: any) => o.recordId)
    setProduct({
      ...productData,
      hasWishlisted: wishlistItemIds.includes(productData.recordId),
    })
  }, [wishListItems, productData])

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

  useEffect(() => {
    if (wishListItems?.some((x: any) => x?.stockCode === product?.stockCode)) {
      setIsInWishList(true)
    } else {
      setIsInWishList(false)
    }
  }, [wishListItems])

  const insertToLocalWishlist = () => {
    if (isInWishList) {
      removeFromWishlist(product?.recordId)
      setIsInWishList(false)
    }
    else {
      addToWishlist(product)
      setIsInWishList(true)
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
      if (prevState?.link !== product?.slug) {
        return { ...prevState, image: product?.image, link: product?.slug }
      } else return { ...prevState }
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.slug])

  const productWithColors =
    product?.variantProductsAttributeMinimal &&
    product?.variantProductsAttributeMinimal.find(
      (item: Attribute) => item?.fieldCode === CLOTH_COLOUR_ATTRIB_NAME
    )

  const hasColorVariation =
    productWithColors && productWithColors?.fieldValues?.length >= 1

  const handleVariableProduct = (attr: any, type: string = 'enter') => {
    if (type === 'enter') {
      const variatedProduct = product?.variantProductsMinimal.find(
        (item: any) =>
          item.variantAttributes.find(
            (variant: any) => variant?.fieldValue === attr?.fieldValue
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
    openNotifyUser(product?.id)
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
          setAlert({
            type: 'error',
            msg: translate('common.message.cartItemMaxAddedErrorMsg'),
          })
          return false
        }
        const isValid = cartItemsValidateAddToCart(
          // product?.recordId ?? product?.productId,
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
  const saving = product?.listPrice?.raw?.withTax - product?.price?.raw?.withTax
  const discount = round((saving / product?.listPrice?.raw?.withTax) * 100, 0)
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
    if (product?.compared) {
      setCompareProducts({
        id: product?.recordId,
        type: 'remove',
      })
    } else {
      setCompareProducts({
        id: product?.recordId,
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
  let productNameWithAttr = product?.name?.toLowerCase()
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
  if (product?.fulfilFromWarehouseDays != false) {
    EtaDate.setDate(
      EtaDate.getDate() + Number(product?.fulfilFromWarehouseDays)
    )
  }
  return (
    <>
      <div
        className={cn(
          'relative hover:border-orange-500 mb-2 grid gap-x-4 grid-cols-12 sm:grid-cols-12 shadow-gray-200 group prod-group border rounded-md px-4 bg-white'
        )}
        key={product?.id}
      >
        <div className="relative col-span-4 bg-gray-200 rounded-md grid-full aspect-w-1 aspect-h-1 mobile-card-panel white-card addon-card">
          <ButtonLink
            href={`/${currentProductData?.link}`}
            handleHover={handleHover}
            itemPrice={itemPrice}
            productName={product?.name}
            onClick={handleSetCompareProduct}
          >
            <img
              id={`${product?.productId ?? product?.recordId}-1`}
              src={
                generateUri(currentProductData?.image, 'h=350&fm=webp') ||
                IMG_PLACEHOLDER
              }
              alt={product.name}
              className="object-cover object-center w-full h-full sm:h-full"
              style={css}
              width={120}
              height={120}
            />
            {product?.images?.length > 1 && (
              <img
                id={`${product?.productId ?? product?.recordId}-2`}
                src={
                  generateUri(product?.images[1]?.image, 'h=500&fm=webp') ||
                  IMG_PLACEHOLDER
                }
                alt={product?.name ||'product-image'}
                className="hidden object-cover object-center w-full h-full sm:h-full"
                style={css}
                width={120}
                height={120}
              />
            )}
          </ButtonLink>
        </div>

        <div className="col-span-8 pt-4 grid-full">
          <div className="flex gap-2">
            <div>
              <ButtonLink
                href={`/${currentProductData.link}`}
                handleHover={() => { }}
                itemPrice={itemPrice}
                productName={product.name}
                onClick={handleSetCompareProduct}
                className="w-full px-0"
              >
                {product?.promotions?.length > 0 && (
                  <div className="flex w-auto gap-1 px-2 py-1 text-xs font-semibold text-black rounded-md bg-tan">
                    <i className="sprite-star-black sprite-icons" />
                    {product?.promotions?.map(
                      (promo: any, promoIdx: number) => {
                        return (
                          <span key={`promo-${promoIdx}`}>
                            {promo?.promoCode}
                          </span>
                        )
                      }
                    )}
                  </div>
                )}
                <div className="flex justify-between w-full px-0 mt-0 mb-1 font-semibold text-left text-black capitalize font-14 product-name hover:text-gray-950 prod-name-block">
                  {productNameWithAttr}
                </div>
              </ButtonLink>
            </div>
            <div className="w-full px-0 text-xs font-bold text-right text-black sm:mt-1 sm:text-sm p-font-size">
              <div>
                {isIncludeVAT
                  ? product?.price?.formatted?.withTax
                  : product?.price?.formatted?.withoutTax}
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
              </div>
              <div className="items-end text-xs font-light text-right text-gray-400">
                {isIncludeVAT ? translate('label.orderSummary.incVATText') : translate('label.orderSummary.excVATText') }
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-12 mt-4">
          <div className="grid items-center justify-center grid-cols-12 gap-1 mb-4 text-center">
            <div className="w-full col-span-9 sm:col-span-10">
                 {product?.currentStock < 1 && !product?.preOrder?.isEnabled ? (
                    <ButtonNotifyMe product={product} className="btn-primary-teal" />
                  ) : (
                    <Button
                      title={buttonConfig.title}
                      action={buttonConfig.action}
                      validateAction={buttonConfig.validateAction}
                      type="button"
                      className="btn-primary-teal"
                      buttonType={buttonConfig.buttonType || 'cart'}
                    />
                  )}
            </div>
            <div className="col-span-3 sm:col-span-2">
              {isInWishList ? (
                <SimpleButton
                  variant="slim"
                  onClick={handleWishList}
                  className="!p-3 rounded-md w-full flex-1 !bg-white cursor-none hover:!bg-white !border !border-orange-500"
                >
                  <i className="sprite-icons sprite-wishlist-active" />
                </SimpleButton>
              ) : (
                <SimpleButton
                  variant="slim"
                  className="!p-3 rounded-md w-full flex-1 !bg-white cursor-none hover:!bg-white !border !border-gray-700"
                  onClick={handleWishList}
                >
                  <i className="sprite-icons sprite-wishlist" />
                </SimpleButton>
              )}
            </div>
          </div>
        </div>
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
  const { children, href, handleHover, itemPrice, productName, onClick } = props

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

export default AddonCard
