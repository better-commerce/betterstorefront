
import fetcher from '../../fetcher'
import { LOOKBOOK_ENDPOINT } from '@components/utils/constants'
export default function useGetPdpLookbooks() {
    async function useGetPdpLookbooksAsync({ query }: any) {
    try {
      const response: any = await fetcher({
        url: `${LOOKBOOK_ENDPOINT}?stockcode=${query}`,
        method: 'get',
      })
      return {
        lookbooks: response.result
      }
    } catch (error: any) {
      throw new Error(error)
    }
  }
  return useGetPdpLookbooksAsync
}
