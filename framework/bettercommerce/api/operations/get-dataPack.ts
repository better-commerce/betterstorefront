import fetcher from '../../fetcher'
import { B2B_COMPANY_USERS } from '@components/utils/constants'
export default function getDataPacks() {
  async function getDataPackAsync({ query, cookies }: any) {
    try {
      const response: any = await fetcher({
        url: `${B2B_COMPANY_USERS}${query.companyId}/data-packs`,
        method: 'get',
        data: query,
        cookies,
      })
      return response.result
    } catch (error: any) {
      console.log(error, 'error')
      throw new Error(error)
    }
  }
  return getDataPackAsync
}
