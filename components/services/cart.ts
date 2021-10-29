import { NEXT_ADD_TO_CART } from '@components/utils/constants'
import axios from 'axios'

interface CartItem {
  basketId?: string
  productId?: string
  qty?: number
  manualUnitPrice?: number
  displayOrder?: number
  stockCode?: string
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
  }
}
