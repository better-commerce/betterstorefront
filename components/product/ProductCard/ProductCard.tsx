import { FC } from 'react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import AttributeSelector from './AttributeSelector'
import Button from '@components/ui/IndigoButton'
import cartHandler from '@components/services/cart'
import { useUI } from '@components/ui/context'
import axios from 'axios'
import { NEXT_CREATE_WISHLIST } from '@components/utils/constants'
import {
  ALERT_SUCCESS_WISHLIST_MESSAGE, 
  BTN_ADD_TO_WISHLIST, 
  BTN_NOTIFY_ME, 
  BTN_PRE_ORDER, 
  GENERAL_ADD_TO_BASKET
} from '@components/utils/textVariables'

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

const ProductCard: FC<Props> = ({ product }) => {
  const [isInWishList, setItemsInWishList] = useState(false)
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
      title: {GENERAL_ADD_TO_BASKET},
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
    } else if (!product.currentStock && product.preOrder.isEnabled) {
      buttonConfig.title = BTN_PRE_ORDER
      buttonConfig.isPreOrderEnabled = true
      buttonConfig.shortMessage = product.preOrder.shortMessage
    }
    return buttonConfig
  }

  const buttonConfig = buttonTitle()

  return (
    <div className="border-r border-b border-gray-200">
      <div key={product.id} className="group relative p-4 sm:p-6">
        <Link
          passHref
          href={`/${currentProductData.link}`}
          key={'data-product' + currentProductData.link}
        >
          <a href={currentProductData.link}>
            <div className="relative rounded-lg overflow-hidden bg-gray-200 aspect-w-1 aspect-h-1 group-hover:opacity-75">
              <img
                src={currentProductData.image}
                alt={product.name}
                onMouseEnter={() => handleHover('enter')}
                onMouseLeave={() => handleHover('leave')}
                className="w-full h-64 object-center object-cover"
              />
              {buttonConfig.isPreOrderEnabled && (
                <div className="bg-yellow-400 absolute py-1 px-1 rounded-sm top-2">
                  {BTN_PRE_ORDER}
                </div>
              )}
              {buttonConfig.isNotifyMeEnabled && (
                <div className="bg-indigo-400 absolute py-1 px-1 rounded-sm top-2">
                  {BTN_NOTIFY_ME}
                </div>
              )}
            </div>
          </a>
        </Link>

        <div className="pt-10 pb-4 text-center">
          <h3 className="min-h-50px text-sm font-medium text-gray-900">
            <Link href={`/${currentProductData.link}`}>
              <a href={`/${currentProductData.link}`}>{product.name}</a>
            </Link>
          </h3>

          <p className="mt-4 font-medium text-gray-900">
            {product?.price?.formatted?.withTax}
          </p>
          {hasColorVariation ? (
            <AttributeSelector
              attributes={product.variantProductsAttributeMinimal}
              onChange={handleVariableProduct}
              link={currentProductData.link}
            />
          ) : (
            <div className="h-10 w-10 inline-block" />
          )}
          <div className="flex flex-col">
            <Button
              className="mt-5"
              title={buttonConfig.title}
              action={buttonConfig.action}
              type="button"
            />
            {isInWishList ? (
              <span className="text-gray-900">
                {ALERT_SUCCESS_WISHLIST_MESSAGE}
              </span>
            ) : (
              <Button
                className="mt-5"
                action={handleWishList}
                buttonType="wishlist"
                colorScheme={WISHLIST_BUTTON_COLOR_SCHEME}
                title={BTN_ADD_TO_WISHLIST}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
