import fetcher from '../../fetcher'
import { EmptyObject, MEMBERSHIP_ENDPOINT } from '@components/utils/constants'

async function getMembershipBenefits(data : any, cookies = EmptyObject) {
  try {
    const response: any = await fetcher({
      url: `${MEMBERSHIP_ENDPOINT}/benefits`,
      data,
      method: 'post',
      cookies
    })
    return { result: response?.result, snippets: response?.snippets ?? [] }
  } catch (error) {
    console.log(error)
    return null
  }
}
export default getMembershipBenefits
