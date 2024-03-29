import dynamic from 'next/dynamic'
import Link from 'next/link'
import { FC, useCallback, useMemo } from 'react'
import { useState, useEffect } from 'react'
import { useUI } from '@components/ui/context'
import axios from 'axios'
import {
  CLOTH_COLOUR_ATTRIB_NAME,
  CLOTH_SIZE_ATTRIB_NAME,
  NEXT_CREATE_WISHLIST,
  Messages,
} from '@components/utils/constants'
import { round } from 'lodash'
import {
  BTN_PRE_ORDER,
  GENERAL_ADD_TO_BASKET,
  IMG_PLACEHOLDER,
} from '@components/utils/textVariables'
import { generateUri } from '@commerce/utils/uri-util'
import cartHandler from '@components/services/cart'
import { IExtraProps } from '@components/common/Layout/Layout'
import { vatIncluded, validateAddToCart } from '@framework/utils/app-util'
import { hideElement, showElement } from '@framework/utils/ui-util'
import { matchStrings, stringFormat, tryParseJson } from '@framework/utils/parse-util'
import { StarIcon } from '@heroicons/react/24/solid'
import classNames from 'classnames'
import ButtonNotifyMe from '../ButtonNotifyMe'
const SimpleButton = dynamic(() => import('@components/ui/Button'))
const Button = dynamic(() => import('@components/ui/IndigoButton'))
const PLPQuickView = dynamic(() => import('@components/product/QuickView/PLPQuickView')
)

interface Props {
  product: any
  hideWishlistCTA?: any
  attributesCount?: number
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

const Products: FC<React.PropsWithChildren<Props & IExtraProps>> = ({
  product: productData,
  hideWishlistCTA = false,
  deviceInfo,
  maxBasketItemsCount,
  attributesCount = 0,
}) => {
  const { isMobile, isIPadorTablet, isOnlyMobile } = deviceInfo
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
    setAlert,
    //includeVAT,
  } = useUI()
  const isIncludeVAT = vatIncluded()
  const [quickViewData, setQuickViewData] = useState(null)
  const [sizeValues, setSizeValues] = useState([])
  const [product, setProduct] = useState(productData || {})
  const [attribs, setAttribs] = useState<any>([])

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
    setProduct(productData)
    if (productData.attributes?.length > 0) {
      if (productData.attributes?.length !== attributesCount) {
        const emptySetCount = attributesCount - productData.attributes?.length
        const emptyCompareSet = Array(emptySetCount).fill(EMPTY_COMPARE_SET)
        setAttribs([...productData.attributes, ...emptyCompareSet])
        return
      }
      setAttribs([...productData.attributes])
    } else {
      setAttribs(Array(attributesCount).fill(EMPTY_COMPARE_SET))
    }
  }, [productData])

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
    addToWishlist(product)
    openWishlist()
  }

  const handleWishList = async () => {
    const accessToken = localStorage.getItem('user')
    if (accessToken) {
      const createWishlist = async () => {
        try {
          await axios.post(NEXT_CREATE_WISHLIST, {
            id: user.userId,
            productId: product.recordId,
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
      setCurrentProductData({ image: product.image, link: product.slug })
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
      title: GENERAL_ADD_TO_BASKET,
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
        const isValid = validateAddToCart(
          product?.recordId ?? product?.productId,
          cartItems,
          maxBasketItemsCount
        )
        if (!isValid) {
          setAlert({
            type: 'error',
            msg: stringFormat(Messages.Errors['CART_ITEM_QTY_LIMIT_EXCEEDED'], {
              maxBasketItemsCount,
            }),
          })
        }
        return isValid
      },
      action: async () => {
        const item = await cartHandler()?.addToCart(
          {
            basketId,
            productId: product?.recordId,
            qty: 1,
            manualUnitPrice: product?.price?.raw?.withTax,
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
  const saving = product?.listPrice?.raw?.withTax - product?.price?.raw?.withTax
  const discount = round((saving / product?.listPrice?.raw?.withTax) * 100, 0)
  const css = { maxWidth: '100%', height: 'auto' }

  const itemPrice = product?.price?.formatted?.withTax

  const getAttribValue = (val: any) => {
    const parsed = tryParseJson(val)
    switch (parsed) {
      case true:
        return (
          <img
            alt="check_circle"
            width={36}
            height={36}
            src="/assets/images/check_circle.svg"
          />
        )
      case false:
        return (
          <img
            alt="cross_icon"
            width={36}
            height={36}
            src="/assets/images/cross_icon.svg"
          />
        )
      default:
        return val
    }
  }

  const isOutOfStock = (product: any) => {
    if (
      product?.hasOwnProperty('preOrder') &&
      product?.hasOwnProperty('flags')
    ) {
      return (
        product?.currentStock < 1 &&
        !product?.preOrder?.isEnabled &&
        !product?.flags?.sellWithoutInventory
      )
    }
    if (product?.hasOwnProperty('preOrder')) {
      return product?.currentStock < 1 && !product?.preOrder?.isEnabled
    }
    if (product?.hasOwnProperty('flags')) {
      return product?.currentStock < 1 && !product?.flags?.sellWithoutInventory
    }
    return product?.currentStock < 1
  }

  return (
    <>
      <div
        className="sticky top-0 z-10 flex flex-col bg-white prod-group md:pb-0 pb-14 lg:pb-14 min-height-com"
        key={product.id}
      >
        <div className="relative mb-4 overflow-hidden bg-gray-200 border aspect-w-1 aspect-h-1 mobile-card-panel white-card-sm">
          <Link
            passHref
            href={`/${currentProductData.link}`}
            onMouseEnter={(ev: any) => handleHover(ev, 'enter')}
            onMouseLeave={(ev: any) => handleHover(ev, 'leave')}
            title={`${product.name} \t ${itemPrice}`}
          >
            <img
              id={`${product?.productId ?? product?.recordId}-1`}
              src={
                generateUri(currentProductData.image, 'h=250&fm=webp') ||
                IMG_PLACEHOLDER
              }
              alt={product.name || 'product'}
              className="object-cover object-center w-full h-full mx-auto sm:h-full min-h-image height-img-auto-sm"
              style={css}
              width={400}
              height={500}
            />
            {product?.images?.length > 1 && (
              <img
                id={`${product?.productId ?? product?.recordId}-2`}
                src={
                  generateUri(product?.images[1]?.image, 'h=500&fm=webp') ||
                  IMG_PLACEHOLDER
                }
                alt={product.name || 'product'}
                className="hidden object-cover object-center w-full h-full mx-auto sm:h-full min-h-image height-img-auto-sm"
                style={css}
                width={400}
                height={500}
              />
            )}
          </Link>
        </div>

        <Link
          passHref
          href={`/${currentProductData.link}`}
          title={`${product.name} \t ${itemPrice}`}
        >
          <div className="px-0 text-xs font-bold text-left text-black sm:mt-1 sm:text-xs">
            {isIncludeVAT
              ? product?.price?.formatted?.withTax
              : product?.price?.formatted?.withoutTax}
            {product?.listPrice?.raw?.withTax > 0 &&
              product?.listPrice?.raw?.withTax !=
                product?.price?.raw?.withTax && (
                <>
                  <span className="px-1 text-xs font-medium text-black line-through">
                    {isIncludeVAT
                      ? product?.listPrice?.formatted?.withTax
                      : product?.listPrice?.formatted?.withoutTax}
                  </span>
                  <span className="text-xs font-semibold text-red-600">
                    {discount > 0 && (
                      <span className="text-xs font-semibold text-red-600">
                        ({discount}% Off)
                      </span>
                    )}
                  </span>
                </>
              )}
          </div>
          <div className="flex justify-between w-full px-0 mt-3 mb-1 font-semibold text-left text-black capitalize product-name hover:text-gray-950 light-font-weight prod-name-block">
            {product?.name?.toLowerCase()}
          </div>
        </Link>
        <div className="absolute bottom-0 left-0 right-0 flex flex-col p-2">
          {isOutOfStock(product) ? (
            <ButtonNotifyMe
              product={product}
              className="mt-2 text-sm font-medium rounded-md"
            />
          ) : (
            <Button
              className="mt-2 text-sm font-medium rounded-md"
              title={buttonConfig.title}
              action={buttonConfig.action}
              type="button"
              buttonType={buttonConfig.buttonType || 'cart'}
            />
          )}
        </div>
      </div>
      <div className="mt-5 bg-white border-t border-gray-200 lg:mt-10">
        <div className="flex items-center justify-center w-full pb-4 my-4 text-center border-b border-gray-200">
          {[0, 1, 2, 3, 4].map((rating) => (
            <StarIcon
              key={rating}
              aria-hidden="true"
              className={classNames(
                product?.rating > rating
                  ? 'text-yellow-400 h-3 w-3'
                  : 'text-gray-300 h-4 w-4',
                'flex-shrink-0'
              )}
            />
          ))}
          <label className="pl-1 text-xs font-semibold text-black">
            {product?.rating}
          </label>
        </div>
        <div className="flex items-center justify-center w-full pb-3 my-3 text-center border-b border-gray-200">
          <span className="font-semibold text-black">{product?.brand}</span>
        </div>
        {attribs?.map((attrib: any, idx: number) => (
          <div
            key={idx}
            className="flex items-center justify-center w-full h-[48px] text-center  border-b border-gray-200 font-14"
          >
            <span>{getAttribValue(attrib.value)}</span>
          </div>
        ))}
      </div>
    </>
  )
}
export default Products
