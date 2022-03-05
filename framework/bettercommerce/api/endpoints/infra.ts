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

      const languageCookie =
        req.cookies.Language === 'undefined' ? '' : req.cookies.Language

      const currencyCookie =
        req.cookies.Currency === 'undefined' ? '' : req.cookies.Currency

      const defaultCurrency =
        currencyCookie ||
        response.result.configSettings
          .find((setting: any) => setting.configType === 'RegionalSettings')
          .configKeys.find(
            (item: any) => item.key === 'RegionalSettings.DefaultCurrencyCode'
          ).value ||
        'GBP'

      const defaultLanguage =
        languageCookie ||
        response.result.configSettings
          .find((setting: any) => setting.configType === 'RegionalSettings')
          .configKeys.find(
            (item: any) => item.key === 'RegionalSettings.DefaultLanguageCode'
          ).value ||
        'en-GB'

      console.log(defaultCurrency)
      console.log(defaultLanguage)
      if (setHeader) {
        setGeneralParams('Currency', defaultCurrency)
        setGeneralParams('Language', defaultLanguage)
      }

      return {
        result: response.result,
        defaultCurrency,
        defaultLanguage,
      }
    } catch (error: any) {
      console.log(error)
      // throw new Error(error.message)
    }
  }
}
