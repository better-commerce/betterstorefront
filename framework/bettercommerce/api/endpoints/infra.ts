import { INFRA_ENDPOINT } from '@components/utils/constants'
import fetcher, { setGeneralParams } from '../../fetcher'

export default function useInfra(req: any) {
  setGeneralParams('Currency', req.cookies.Currency)

  return async function handler() {
    try {
      const response: any = await fetcher({
        url: `${INFRA_ENDPOINT}`,
        method: 'get',
        headers: {
          DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID,
        },
      })
      return response.result
    } catch (error: any) {
      console.log(error)
      // throw new Error(error.message)
    }
  }
}
