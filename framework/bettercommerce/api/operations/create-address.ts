import fetcher from '../../fetcher'
import { CREATE_ADDRESS_ENDPOINT } from '@components/utils/constants'
export default function useAddress() {
  async function getAdressAsync({ query }: any) {
    try {
      const response: any = await fetcher({
        url: `${CREATE_ADDRESS_ENDPOINT}`,
        method: 'post',
        data: query,
      })
      return response.result
    } catch (error: any) {
      throw new Error(error)
    }
  }
  return getAdressAsync
}
