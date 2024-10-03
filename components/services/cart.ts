import {
  NEXT_ADD_TO_CART,
  NEXT_BULK_ADD_TO_CART,
  NEXT_GET_CART,
  NEXT_GET_USER_CART,
  NEXT_ASSOCIATE_CART,
  NEXT_MERGE_CART,
  NEXT_DELETE_CART,
  NEXT_GET_CART_COUNT,
} from '@components/utils/constants'
import axios from 'axios'
import { BundleType } from '@framework/utils/enums'
import { Guid } from '@commerce/types'
import { logError } from '@framework/utils/app-util'
import { AnalyticsEventType } from './analytics'
import useAnalytics from './analytics/useAnalytics'

interface CartItem {
  basketId?: string
  productId?: string
  qty: number
  manualUnitPrice?: number
  displayOrder?: number
  stockCode?: string
  userId?: string
  isAssociated?: boolean
  isMembership?: boolean
  CustomInfo4?: string
  CustomInfo5?: string
  CustomInfo4Formatted?: string
  CustomInfo5Formatted?: string
}

interface GetCart {
  basketId?: string
}

export default function cartHandler() {
  const { recordAnalytics } = useAnalytics()
  return {
    addToCart: async (
      {
        basketId,
        productId,
        qty,
        manualUnitPrice,
        displayOrder,
        stockCode,
        userId,
        isAssociated = true,
        isMembership = false,
      }: CartItem,
      type = 'ADD',
      data: any = {}
    ) => {
      let url = NEXT_ADD_TO_CART // Set default url
      let postData: any = {
        basketId,
        productId,
        qty,
        manualUnitPrice,
        displayOrder,
        stockCode,
        isMembership,
      } // Set default post data

      const isBundledProduct =
        data.product?.componentProducts &&
        data.product?.componentProducts.length > 0

      // If the selected product is a bundle.
      if (isBundledProduct) {
        url = NEXT_BULK_ADD_TO_CART // Modify url
        const mainProduct = [
          {
            productId: data.product.productId ?? data.product.recordId,
            stockCode: data.product.stockCode,
            productName: data.product.name,
            qty: 1,
          },
        ]
        const findComplementaryStatus = data.product.componentProducts.filter(
          (x: any) => x.bundleType === BundleType.COMPLEMENTARY
        )
        const isComplementary =
          findComplementaryStatus && findComplementaryStatus.length
        const bundledProducts = data.product.componentProducts.map((x: any) => {
          return {
            productId: x.productId ?? x.recordId,
            stockCode: x.stockCode,
            productName: x.name,
            parentProductId: isComplementary ? Guid.empty : productId,
            qty: 1,
            customInfo2: x.image 
          }
        })
        const products = isComplementary
          ? bundledProducts
          : [...mainProduct, ...bundledProducts]

        postData = {
          basketId,
          products,
        } // Modify post data
      }

      const response: any = await axios.post(url, {
        data: postData,
      })
      if (userId && !isAssociated) {
        await cartHandler().associateCart(userId, basketId)
      }

      // ---------------------------------------------------------------
      // Omnilytics Event is already integrated with Analytics Injector.
      /*const eventData = { ...data?.product, entityType: 'product', cartItems: response?.data, }
      if (qty && qty > 0) {
        recordAnalytics(AnalyticsEventType.ADD_TO_BASKET, { ...eventData })
      } else {
        recordAnalytics(AnalyticsEventType.REMOVE_FROM_CART, { ...eventData, })
      }*/
     // ----------------------------------------------------------------

      return response.data
    },
    bulkAddToCart: async (
      userId: string,
      basketId: string,
      isAssociated: boolean = true,
      type = 'ADD',
      data: Array<any> = []
    ) => {
      const url = NEXT_BULK_ADD_TO_CART
      const postData = {
        basketId,
        products: data,
      }
      const response: any = await axios.post(url, {
        data: postData,
      })
      if (userId && !isAssociated) {
        await cartHandler().associateCart(userId, basketId)
      }

      // ---------------------------------------------------------------
      // Omnilytics Event is already integrated with Analytics Injector.
      /*const eventData = {
        entity: JSON.stringify({
          basketId,
          //id: productId,
          //name: data?.product?.name,
          //price: data?.product?.price?.raw?.withTax,
          quantity: data.map((x: any) => x.quantity),
          stockCode: data.map((x: any) => x.stockCode),
        }),
        basketItems: JSON.stringify(
          response?.data?.lineItems?.map((obj: any) => {
            return {
              basketId,
              id: obj?.id,
              img: obj?.image,
              name: obj?.name,
              price: obj?.price?.raw?.withTax,
              qty: obj?.qty,
              stockCode: obj?.stockCode,
              tax: obj?.price?.raw?.tax,
            }
          })
        ),
        basketItemCount: response?.data?.lineItems?.length || 0,
        basketTotal: response?.data?.grandTotal?.raw?.withTax,
        entityId: null,
        entityType: 'product',
        eventType: AnalyticsEventType.ADD_TO_BASKET,
        entityName: null,
      }

      recordAnalytics(AnalyticsEventType.ADD_TO_BASKET, eventData)*/
      // ---------------------------------------------------------------
      
      return response.data
    },
    getCartItemsCount: async ({ basketId }: GetCart) => {
      const response = await axios.get(`${NEXT_GET_CART_COUNT}?basketId=${basketId}`)
      return response?.data
    },
    getCart: async ({ basketId }: GetCart) => {
      const response = await axios.get(`${NEXT_GET_CART}?basketId=${basketId}`)
      return response.data
    },
    associateCart: async (userId: string, basketId?: string) => {
      const response = await axios.post(NEXT_ASSOCIATE_CART, {
        data: { userId: userId, basketId: basketId },
      })
      return response
    },
    getCartByUser: async ({ userId, basketId }: any) => {
      if (userId && userId !== Guid.empty) {
        try {
          const { data: userCart }: any = await axios.get(NEXT_GET_USER_CART, {
            params: {
              userId: userId,
            },
          })

          if (userCart?.length) {
            return userCart?.sort((cart1: any, cart2: any) => {
              return (
                new Date(cart2?.lastUpdated).getTime() -
                new Date(cart1?.lastUpdated).getTime()
              )
            })[0]
          }
        } catch (error) {
          logError(error)
        }
      }
      return null
    },
    getCartByUserOld: async ({ userId, basketId }: any) => {
      const userCart: any = await axios.get(
        `${NEXT_GET_USER_CART}?userId=${userId}`
      )
      const recentCart = userCart?.data?.at(-1) || null
      try {
        if (!recentCart) throw new Error('no cart was found..')
        if (userId) {
          const response = await axios.post(NEXT_MERGE_CART, {
            data: {
              userBasketId: recentCart.id,
              currentBasketId: basketId,
            },
          })
          return response.data
        } else {
          return recentCart
        }
      } catch (error) {
        console.log(error, 'err')
      }
    },
    getUserCarts: async ({ userId, basketId }: any) => {
      if (userId && userId !== Guid.empty) {
        try {
          const { data: userCarts }: any = await axios.get(NEXT_GET_USER_CART, {
            params: {
              userId: userId,
            },
          })

          if (userCarts?.length) {
            return userCarts?.sort((cart1: any, cart2: any) => {
              return (
                new Date(cart2?.lastUpdated).getTime() -
                new Date(cart1?.lastUpdated).getTime()
              )
            })
          }
        } catch (error) {
          logError(error)
        }
      }
      return null
    },
    deleteCart: async ({ basketId }: any) => {
      if (basketId && basketId !== Guid.empty) {
        try {
          const { data: deleteCartResult }: any = await axios.post(NEXT_DELETE_CART, {
            basketId,
          })
          return deleteCartResult
        } catch (error) {
          logError(error)
        }
      }
      return null
    },
  }
}
