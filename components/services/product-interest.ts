import { NEXT_CUSTOMER_PRODUCT_INTEREST, NEXT_DELETE_CUSTOMER_PRODUCT_INTEREST } from '@components/utils/constants'
import axios from 'axios'
import { useUI } from '@components/ui/context'

export default function productInterestHandler() {
  let accessToken: boolean | any = false
  if (typeof window !== 'undefined') {
    accessToken = localStorage.getItem('user')
  }

  return {
    addToProductInterest: async (
      userId: string,
      productId: string,
      onSuccess?: () => void,
      onError?: (error: any) => void
    ) => {
      try {
        const response = await axios.post(NEXT_CUSTOMER_PRODUCT_INTEREST, {
          id: userId,
          productId,
        })
        if (response?.data && onSuccess) {
          onSuccess()
        }
      } catch (error) {
        console.log(error, 'error')
        if (onError) {
          onError(error)
        }
      }
    },
    removeFromProductInterest: async (
      userId: string,
      productId: string,
      onSuccess?: () => void,
      onError?: (error: any) => void
    ) => {
      try {
        const response = await axios.post(NEXT_DELETE_CUSTOMER_PRODUCT_INTEREST, {
          id: userId,
          productId,
        })
        if (response?.data && onSuccess) {
          onSuccess()
        }
      } catch (error) {
        console.log(error, 'error')
        if (onError) {
          onError(error)
        }
      }
    }
  }
}