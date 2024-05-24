import fetcher from '../../fetcher'
import { MEMBERSHIP_ENDPOINT } from '@components/utils/constants'

async function getMembershipBenefits(data : any) {
  try {
    const response: any = await fetcher({
      url: `${MEMBERSHIP_ENDPOINT}/benefits`,
      data,
      method: 'post',
    })
    return { result: response?.result, snippets: response?.snippets ?? [] }
  } catch (error) {
    console.log(error)
    return null
  }
}
export default getMembershipBenefits
