import fetcher from '../../fetcher'
import { B2B_COMPANY_USERS } from '@components/utils/constants'
export default function downloadDataPack() {
  async function downloadDataPackAsync({ query, cookies }: any) {
    try {
      const response: any = await fetcher({
        url: `${B2B_COMPANY_USERS}${query.companyId}/data-pack-file/${query.id}`,
        method: 'get',
        data: query,
        cookies,
      })
      return response
    } catch (error: any) {
      console.log(error, 'error')
      throw new Error(error)
    }
  }
  return downloadDataPackAsync
}
