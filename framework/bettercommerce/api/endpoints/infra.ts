import { INFRA_ENDPOINT } from '@components/utils/constants'
import fetcher from '../../fetcherV2'
import { setGeneralParams } from '../../fetcherV2'

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
        cookies: req.cookies,
      })

      const languageCookie =
        req.cookies.Language === 'undefined' ? '' : req.cookies.Language

      const currencyCookie =
        req.cookies.Currency === 'undefined' ? '' : req.cookies.Currency

      const countryCookie =
        req.cookies.Country === 'undefined' ? '' : req.cookies.Country

      const defaultCurrency =
        currencyCookie ||
        response.result.configSettings
          .find((setting: any) => setting.configType === 'RegionalSettings')
          .configKeys.find(
            (item: any) => item.key === 'RegionalSettings.DefaultCurrencyCode'
          ).value ||
        'GBP'

      const defaultCountry =
        countryCookie ||
        response.result.configSettings
          .find((setting: any) => setting.configType === 'RegionalSettings')
          .configKeys.find(
            (item: any) => item.key === 'RegionalSettings.DefaultCountry'
          ).value ||
        'US'

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
      console.log(defaultCountry)
      if (setHeader) {
        setGeneralParams('Currency', defaultCurrency)
        setGeneralParams('Language', defaultLanguage)
        setGeneralParams('Country', defaultCountry)
      }

      return {
        result: response.result,
        defaultCurrency,
        defaultLanguage,
        defaultCountry,
      }
    } catch (error: any) {
      console.log(error)
      // throw new Error(error.message)
    }
  }
}
