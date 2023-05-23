import dynamic from 'next/dynamic'
import { FC } from 'react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
const AttributeSelector = dynamic(() => import('./AttributeSelector'))
const Button = dynamic(() => import('@components/ui/IndigoButton'))
import cartHandler from '@components/services/cart'
import { useUI } from '@components/ui/context'
import axios from 'axios'
import { NEXT_CREATE_WISHLIST } from '@components/utils/constants'
import {
  ArrowsPointingOutIcon,
  CursorArrowRaysIcon,
  EyeIcon,
  HeartIcon,
  PlusSmallIcon,
  StarIcon,
} from '@heroicons/react/24/outline'
import { round } from 'lodash'
import {
  ALERT_SUCCESS_WISHLIST_MESSAGE,
  BTN_ADD_TO_WISHLIST,
  BTN_NOTIFY_ME,
  BTN_PRE_ORDER,
  GENERAL_ADD_TO_BASKET,
  GENERAL_PRICE_LABEL_RRP,
  IMG_PLACEHOLDER,
  QUICK_VIEW,
} from '@components/utils/textVariables'
import { generateUri } from '@commerce/utils/uri-util'
import QuickViewModal from '@components/product/QuickView/ProductQuickView'
interface Props {
  product: any
}

const colorKey = 'global.colour'

const WISHLIST_BUTTON_COLOR_SCHEME = {
  bgColor: 'bg-gray-500',
  hoverBgColor: 'bg-gray-400',
  focusRingColor: 'focus-gray-400',
}

interface Attribute {
  fieldName?: string
  fieldCode?: string
  fieldValues?: []
}

const SearchProductCard: FC<React.PropsWithChildren<Props>> = ({ product }) => {
  const [isInWishList, setItemsInWishList] = useState(false)
  const [isQuickview, setQuickview] = useState(undefined)
  const [isQuickviewOpen, setQuickviewOpen] = useState(false)
  const [currentProductData, setCurrentProductData] = useState({
    image: product.image,
    link: product.slug,
  })
  const {
    basketId,
    user,
    addToWishlist,
    openWishlist,
    setCartItems,
    openNotifyUser,
  } = useUI()

  const insertToLocalWishlist = () => {
    addToWishlist(product)
    setItemsInWishList(true)
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
      (item: Attribute) => item.fieldCode === colorKey
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

  const handleHover = (type: string) => {
    if (type === 'enter' && secondImage)
      setCurrentProductData({ ...currentProductData, image: secondImage })
    if (type === 'leave' && secondImage)
      setCurrentProductData({ ...currentProductData, image: product.image })
  }

  const handleNotification = () => {
    openNotifyUser(product.id)
  }

  const buttonTitle = () => {
    let buttonConfig: any = {
      title: GENERAL_ADD_TO_BASKET,
      action: async () => {
        const item = await cartHandler().addToCart(
          {
            basketId,
            productId: product.recordId,
            qty: 1,
            manualUnitPrice: product.price.raw.withTax,
            stockCode: product.stockCode,
            userId: user.userId,
            isAssociated: user.isAssociated,
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
    } else if (!product.currentStock && product.preOrder.isEnabled) {
      buttonConfig.title = BTN_PRE_ORDER
      buttonConfig.isPreOrderEnabled = true
      buttonConfig.buttonType = 'button'
      buttonConfig.shortMessage = product.preOrder.shortMessage
    }
    return buttonConfig
  }

  const buttonConfig = buttonTitle()
  const saving = product?.listPrice?.raw?.withTax - product?.price?.raw?.withTax
  const discount = round((saving / product?.listPrice?.raw?.withTax) * 100, 0)
  const css = { maxWidth: '100%', height: 'auto' }
  const onViewApiKey = (isQuickview: any) => {
    setQuickview(isQuickview)
    setQuickviewOpen(true)
  }

  return (
    <>
      <div className="bg-white hover:outline hover:outline-1 outline-gray-200 group" key={product.id}>
        <div className="relative py-3 sm:py-3">
          <div className="relative overflow-hidden group aspect-w-1 aspect-h-1 hover:opacity-75">
            <Link
              passHref
              href={`/${currentProductData.link}`}
              key={'data-product' + currentProductData.link}
            >
              <Image
                priority
                src={
                  generateUri(currentProductData.image, 'h=500&fm=webp') ||
                  IMG_PLACEHOLDER
                }
                alt={product.name}
                onMouseEnter={() => handleHover('enter')}
                onMouseLeave={() => handleHover('leave')}
                className="object-cover object-center w-full h-full rounded sm:h-full min-h-image"
                style={css}
                width={400}
                height={600}
                quality="100"
              ></Image>
            </Link>
            {buttonConfig.isPreOrderEnabled && (
              <div className="absolute px-1 py-1 bg-yellow-400 rounded-sm top-2">
                {BTN_PRE_ORDER}
              </div>
            )}
            {buttonConfig.isNotifyMeEnabled && (
              <div className="absolute px-1 py-1 text-white bg-red-400 rounded-sm top-2">
                {BTN_NOTIFY_ME}
              </div>
            )}
            {isInWishList ? (
              <span className="text-gray-900">
                {ALERT_SUCCESS_WISHLIST_MESSAGE}
              </span>
            ) : (
              <button
                className="absolute top-2 right-2 z-99"
                onClick={handleWishList}
              >
                <HeartIcon
                  className="z-50 flex-shrink-0 w-8 h-8 p-1 text-gray-800 hover:text-gray-500 rounded-3xl opacity-80"
                  aria-hidden="true"
                />
                <span className="ml-2 text-sm font-medium text-gray-700 hover:text-red-800"></span>
                <span className="sr-only">f</span>
              </button>
            )}
            <button
              type="button"
              className="absolute z-10 w-11/12 px-4 py-2 mx-2 text-sm text-white bg-black rounded-md opacity-0 bg-opacity-60 focus:opacity-0 group-hover:opacity-100 bottom-2"
              onClick={() => onViewApiKey(product)}
            >
              Quick View
            </button>
          </div>

          <div className="pt-0 text-left">
            {hasColorVariation ? (
              <AttributeSelector
                attributes={product.variantProductsAttributeMinimal}
                onChange={handleVariableProduct}
                link={currentProductData.link}
              />
            ) : (
              <div className="inline-block w-1 h-1 mt-2 mr-1 sm:h-6 sm:w-6 sm:mr-2" />
            )}
            <div className='grid grid-cols-3'>
              <div className='col-span-2'>
                <h3 className="font-normal text-gray-700 truncate sm:text-sm">
                  <Link href={`/${currentProductData.link}`}>{product.name}</Link>
                </h3>
              </div>
              <div className='justify-end col-span-1 pr-2 mt-1 text-right'>
                <h4 className='text-sm font-bold text-gray-600'><StarIcon className='relative inline-block w-4 h-4 text-gray-600 -top-0.5' /> {product?.rating}</h4>
              </div>
            </div>

            <div className="grid grid-cols-12">
              <div className="col-span-9">
                <p className="mt-1 font-bold text-gray-900 sm:mt-1 text-md">
                  {product?.price?.formatted?.withTax}
                  {product?.listPrice?.raw?.withTax > 0 &&
                    product?.listPrice?.raw?.withTax !=
                    product?.price?.raw?.withTax && (
                      <>
                        <span className="px-2 text-sm font-normal text-gray-400 line-through">
                          {product?.listPrice?.formatted?.withTax}
                        </span>
                        <span className="text-sm font-semibold text-red-600">
                          {discount}% Off
                        </span>
                      </>
                    )}
                </p>
              </div>
            </div>

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
        </div>
      </div>
      <QuickViewModal
        isQuickview={isQuickview}
        setQuickview={setQuickview}
        productData={isQuickview}
        isQuickviewOpen={isQuickviewOpen}
        setQuickviewOpen={setQuickviewOpen}
      />
    </>
  )
}

export default SearchProductCard
