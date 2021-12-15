import { INFRA_ENDPOINT } from '@components/utils/constants'
import fetcher, { setGeneralParams } from '../../fetcher'

export default function useInfra(req: any) {
  //TODO change based on location
  return async function handler(setHeader = false) {
    try {
      const response: any = await fetcher({
        url: `${INFRA_ENDPOINT}`,
        method: 'get',
        headers: {
          DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID,
        },
      })
      if (setHeader) {
        setGeneralParams(
          'Currency',
          req.cookies.Currency || response.result.currencies[0].currencyCode
        )
        setGeneralParams(
          'Language',
          req.cookies.Language || response.result.languages[0].languageCode
        )
      }
      return response.result
    } catch (error: any) {
      console.log(error)
      // throw new Error(error.message)
    }
  }
}
