import fetcher from '../../fetcher'
import { MEMBERSHIP_ENDPOINT } from '@components/utils/constants'

export default function getMembershipPlansOperation() {
  async function getMembershipPlans({ data, cookies }: any) {
    try {
      const response: any = await fetcher({
        url: `${MEMBERSHIP_ENDPOINT}/plans`,
        data,
        method: 'post',
        cookies,
      })
      return { result: response?.result, snippets: response?.snippets ?? [] }
    } catch (error) {
      console.log(error)
      return null
    }
  }
  return getMembershipPlans
}
