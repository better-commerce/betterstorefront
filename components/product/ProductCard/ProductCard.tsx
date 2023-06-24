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
} from '@components/utils/constants'
import { HeartIcon } from '@heroicons/react/24/outline'
import { round } from 'lodash'
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
import { validateAddToCart } from '@framework/utils/app-util'
import { hideElement, showElement } from '@framework/utils/ui-util'
import { stringFormat, stringToBoolean, } from '@framework/utils/parse-util'
const SimpleButton = dynamic(() => import('@components/ui/Button'))
const Button = dynamic(() => import('@components/ui/IndigoButton'))
const PLPQuickView = dynamic(
  () => import('@components/product/QuickView/PLPQuickView')
)

interface Props {
  product: any
  hideWishlistCTA?: any
}

interface Attribute {
  fieldName?: string
  fieldCode?: string
  fieldValues?: []
}

const ProductCard: FC<React.PropsWithChildren<Props & IExtraProps>> = ({
  product: productData,
  hideWishlistCTA = false,
  deviceInfo,
  maxBasketItemsCount,
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
    includeVAT,
  } = useUI()
  const isIncludeVAT = stringToBoolean(includeVAT);
  const [quickViewData, setQuickViewData] = useState(null)
  const [sizeValues, setSizeValues] = useState([])
  const [product, setProduct] = useState(productData || {})

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

  useEffect(()=>{
    setProduct(productData)
  },[productData])

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

  const secondImage = product.images[1]?.image

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
    if (!product.currentStock && !product.preOrder.isEnabled) {
      buttonConfig.title = BTN_NOTIFY_ME
      buttonConfig.isNotifyMeEnabled = true
      buttonConfig.action = async () => handleNotification()
      buttonConfig.buttonType = 'button'
    } else if (!product?.currentStock && product?.preOrder?.isEnabled) {
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

  return (
    <>
      <div
        className="relative hover:outline hover:outline-1 outline-gray-200 group prod-group"
        key={product.id}
      >
        <div className="relative overflow-hidden bg-gray-200 aspect-w-1 aspect-h-1 mobile-card-panel white-card">
          <Link
            passHref
            href={`/${currentProductData.link}`}
            onMouseEnter={(ev: any) => handleHover(ev, 'enter')}
            onMouseLeave={(ev: any) => handleHover(ev, 'leave')}
            title={`${product.name} \t ${itemPrice}`}
          >
            <Image
              id={`${product?.productId ?? product?.recordId}-1`}
              priority
              src={
                generateUri(currentProductData.image, 'h=350&fm=webp') ||
                IMG_PLACEHOLDER
              }
              alt={product.name}
              className="object-cover object-center w-full h-full sm:h-full min-h-image height-img-auto"
              style={css}
              width={400}
              height={600}
            />
            {product?.images?.length > 1 && (
              <Image
                id={`${product?.productId ?? product?.recordId}-2`}
                priority
                src={
                  generateUri(product?.images[1]?.image, 'h=500&fm=webp') ||
                  IMG_PLACEHOLDER
                }
                alt={product.name}
                className="object-cover object-center w-full h-full sm:h-full min-h-image hidden height-img-auto"
                style={css}
                width={400}
                height={600}
              />
            )}
          </Link>
          {buttonConfig.isPreOrderEnabled && (
            <div className="absolute px-1 py-1 bg-yellow-400 rounded-sm top-2">
              {BTN_PRE_ORDER}
            </div>
          )}
          {buttonConfig.isNotifyMeEnabled && (
            <div className="absolute px-2 py-1 text-xs font-semibold text-white bg-red-800 rounded-sm top-2">
              {BTN_NOTIFY_ME}
            </div>
          )}

          <div className="absolute bottom-1 left-1 text-gray-900 bg-gray-100 px-[0.4rem] py-0 text-xs font-semibold sm:font-bold">
            <div className="flex items-center gap-1 star-rating">
              {product?.rating}
            </div>
          </div>

          {isMobile ? null : (
            <>
              <div className="absolute flex-wrap hidden w-full gap-1 px-1 py-2 transition-transform duration-500 bg-white sm:translate-y-0 sm:flex group-hover:-translate-y-full">
                {!hideWishlistCTA && (
                  <SimpleButton
                    variant="slim"
                    className="!p-1 flex-1 !bg-transparent !text-gray-900 hover:!bg-gray-200 border-none hover:border-none disabled:!bg-gray-300"
                    onClick={handleWishList}
                    disabled={product.hasWishlisted}
                  >
                    {product.hasWishlisted ? ITEM_WISHLISTED : WISHLIST_TITLE}
                  </SimpleButton>
                )}
                <SimpleButton
                  variant="slim"
                  className="!p-1 flex-1 !bg-transparent btn-c btn-secondary font-14"
                  onClick={() => handleQuickViewData(product)}
                >
                  {QUICK_VIEW}
                </SimpleButton>
              </div>
            </>
          )}
        </div>

        <Link
          passHref
          href={`/${currentProductData.link}`}
          title={`${product.name} \t ${itemPrice}`}
        >
          <h4 className="flex items-center justify-between w-full px-2 my-1 font-semibold text-black capitalize group-hover:hidden product-name hover:text-gray-950 min-prod-name-height light-font-weight prod-name-block">
            {product?.name?.toLowerCase()}
          </h4>

          <ul className="hidden h-10 px-2 my-1 text-xs text-gray-700 group-hover:flex sm:px-2 sizes-ul sm:text-sm prod-ul-size">
            <li className="mr-1">Sizes:</li>
            {sizeValues.map((size: any, idx: number) => (
              <li className="inline-block uppercase" key={idx}>
                {size?.fieldValue}{' '}
                {sizeValues.length !== idx + 1 && (
                  <span className="mr-1 c-sperator">,</span>
                )}
              </li>
            ))}
          </ul>

          <div className="px-2 text-xs text-left text-black sm:mt-1 sm:text-sm p-font-size">
            <span className="font-bold">
              {isIncludeVAT ? product?.price?.formatted?.withTax : product?.price?.formatted?.withoutTax}
            </span>
            {product?.listPrice?.raw?.withTax > 0 &&
              product?.listPrice?.raw?.withTax !=
                product?.price?.raw?.withTax && (
                <>
                  <span className="px-1 text-xs font-medium text-black line-through">
                    {isIncludeVAT ? product?.listPrice?.formatted?.withTax : product?.listPrice?.formatted?.withoutTax}
                  </span>
                  <span className="text-xs font-semibold text-red-600">
                    ({discount}% Off)
                  </span>
                </>
              )}
          </div>
        </Link>

        {isMobile && (
          <div className="flex flex-wrap mt-2 border">
            <div className="w-4/12">
              <button
                className="w-full text-center bg-white p-1.5"
                onClick={handleWishList}
                title="Wishlist"
                disabled={product.hasWishlisted}
              >
                <HeartIcon
                  className={`inline-block w-4 h-4 ${
                    product.hasWishlisted && 'fill-red-600 text-red-800'
                  }`}
                  aria-hidden="true"
                />
              </button>
            </div>
            <div className="w-8/12 text-center border-l sm:col-span-8">
              <button
                type="button"
                onClick={() => handleQuickViewData(product)}
                className="w-full text-primary dark:text-primary font-semibold text-[14px] sm:text-sm p-1.5 outline-none"
              >
                {QUICK_VIEW}
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-col">
          <Button
            className="hidden mt-2"
            title={buttonConfig.title}
            action={buttonConfig.action}
            type="button"
            buttonType={buttonConfig.buttonType || 'cart'}
          />
        </div>
      </div>
      <PLPQuickView
        isQuickview={Boolean(quickViewData)}
        setQuickview={() => {}}
        productData={quickViewData}
        isQuickviewOpen={Boolean(quickViewData)}
        setQuickviewOpen={handleCloseQuickView}
      />
    </>
  )
}

export default ProductCard
