import fetcher from '../../fetcher'
import { LOOKBOOK_SLUG_ENDPOINT } from '@components//utils/constants'
export default function useGetPdpLookbookProducts() {
  async function useGetPdpLookbookProductsAsync({ query, cookies }: any) {
    try {
      const response: any = await fetcher({
        url: `${LOOKBOOK_SLUG_ENDPOINT}?slug=${query}`,
        method: 'get',
        cookies,
      })
      return {
        products: response.result,
      }
    } catch (error: any) {
      throw new Error(error)
    }
  }
  return useGetPdpLookbookProductsAsync
}
