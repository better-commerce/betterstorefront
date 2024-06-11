import { logError } from '@framework/utils/app-util'
import { AddressFinder } from '@framework/utils/constants'
import axios from 'axios'

export default function loqateAddress() {
  return async function handler({ postCode, country }: any) {
    const findAddressUrl =
      AddressFinder.LoqateUrl.FIND +
      `?Key=${process.env.FIND_ADDRESS_KEY}&Text=${postCode}&Countries=${country}`
    try {
      const response: any = await axios.post(findAddressUrl)
      // console.log(response.data.Items)
      if (
        response?.data?.Items.length == 1 &&
        typeof response?.data?.Items[0]?.Error != 'undefined'
      ) {
        // Show the error message
        return { response: { message: response?.data?.Items[0]?.Description , data: [] } }
      } else {
        if (response?.data?.Items.length == 0) {
          return { response: { message: 'No items found', data: [] } }
        } else {
          return {
            response: {
              message: '',
              data: response?.data?.Items?.filter(
                (i: any) => i?.Type === 'Address'
              ),
            },
          }
        }
      }
    } catch (error: any) {
      logError(error)
      // throw new Error(error.message)
    }
  }
}

export const retrieveAddress = () => {
  return async function handler(id: string, cookies?: any) {
    try {
      const retrieveAddress =
      AddressFinder.LoqateUrl.RETRIEVE +
        `?Key=${process.env.FIND_ADDRESS_KEY}&Id=${encodeURIComponent(id)}`
      const address: any = await axios.post(retrieveAddress)
      return { response: { message: '', data: address?.data?.Items } }
    } catch (error: any) {
      throw new Error(error.message)
    }
  }
}
