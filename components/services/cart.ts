import {
  NEXT_ADD_TO_CART,
  NEXT_GET_CART,
  NEXT_GET_USER_CART,
} from '@components/utils/constants'
import axios from 'axios'

interface CartItem {
  basketId?: string
  productId?: string
  qty?: number
  manualUnitPrice?: number
  displayOrder?: number
  stockCode?: string
}

interface GetCart {
  basketId?: string
}

export default function cartHandler() {
  return {
    addToCart: async ({
      basketId,
      productId,
      qty,
      manualUnitPrice,
      displayOrder,
      stockCode,
    }: CartItem) => {
      const response = await axios.post(NEXT_ADD_TO_CART, {
        data: {
          basketId,
          productId,
          qty,
          manualUnitPrice,
          displayOrder,
          stockCode,
        },
      })
      return response.data
    },
    getCart: async ({ basketId }: GetCart) => {
      const response = await axios.get(`${NEXT_GET_CART}?basketId=${basketId}`)
      return response.data
    },
    getCartByUser: async ({ userId }: any) => {
      const response = await axios.get(`${NEXT_GET_USER_CART}?userId=${userId}`)
      return response.data
    },
  }
}
