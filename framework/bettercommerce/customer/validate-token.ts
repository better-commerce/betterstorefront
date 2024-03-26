import fetcher from '../fetcher'
import { CUSTOMER_BASE_API } from '@new-components/utils/constants'
export default async function validateToken(token: string, cookies?: any) {
  try {
    const endpoint = `${CUSTOMER_BASE_API}/validate-password-token?token=${token}`
    const res = await fetcher({
      url: endpoint,
      method: 'get',
      cookies,
    })
    return res
  } catch (error: any) {
    throw new Error(error)
  }
}
