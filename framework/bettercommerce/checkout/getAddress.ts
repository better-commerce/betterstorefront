import { AddressFinder } from '@framework/utils/constants'
import axios from 'axios'

export default function getUserAddress() {
  return async function handler({ postCode }: any) {
    const findAddressUrl =
     AddressFinder.AddressIOUrl.FIND + `/${postCode}?api-key=${process.env.FIND_ADDRESS_KEY}&all=true`
    try {
      const response: any = await axios.get(findAddressUrl)
      if (response.data.suggestions.length == 0) {
        return { response: { message: 'No items found', data: [] } }
      } else {
        return {
          response: {
            message: '',
            data: response?.data?.suggestions,
          },
        }
      }
    } catch (error: any) {
      return {
        response: {
          message: error.message,
          data: []
        }
      };
    }
  }
}

export const retrieveGetAddressIO = () => {
  return async function handler(id: string, cookies?: any) {
    try {
      const retrieveGetAddressIo =
       AddressFinder.AddressIOUrl.RETRIEVE + `/${id}?api-key=${process.env.FIND_ADDRESS_KEY}`
      const address: any = await axios.get(retrieveGetAddressIo)
      return { response: { message: '', data: address.data } }
    } catch (error: any) {
      return {
        response: {
          message: error.message,
          data: null
        }
      };
    }
  }
}
