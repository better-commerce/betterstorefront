import Cookies from 'js-cookie'
import { encrypt } from '@framework/utils/cipher'
import { Cookie, REVIEW_BASE_URL } from '@framework/utils/constants'
import { Redis } from '@framework/utils/redis-constants'
import fetcher from '@framework/fetcher'
import { logError } from '@framework/utils/app-util'
import useNavTree from '@framework/api/endpoints/nav-tree'
import { getDataByUID, parseDataValue, setData } from '@framework/utils/redis-util'
import { BETTERCOMMERCE_DEFAULT_COUNTRY, BETTERCOMMERCE_DEFAULT_CURRENCY, BETTERCOMMERCE_DEFAULT_LANGUAGE, EmptyObject, INFRA_PLUGIN_CATEGORY_ENDPOINT, PluginCategory, REVIEW_SERVICE_BASE_API, } from '@components/utils/constants'
import commerce from '@lib/api/commerce'
import { Guid } from '@commerce/types'
import { stringToNumber } from '@framework/utils/parse-util'

/**
 * Class {BasePagePropsProvider} encapsulates the abstract behavior of PageProps rendering module.
 */
export abstract class BasePagePropsProvider {

  /**
   * Returns the prop values of appConfig from Redis cache.
   * @param infraConfig 
   * @param cookies 
   * @returns 
   */
  protected getAppConfig(infraConfig: any, cookies?: any): any {
    let appConfig = null
    let defaultCurrency = BETTERCOMMERCE_DEFAULT_CURRENCY
    let defaultCountry = BETTERCOMMERCE_DEFAULT_COUNTRY
    let defaultLanguage = BETTERCOMMERCE_DEFAULT_LANGUAGE

    const language = cookies?.[Cookie.Key.LANGUAGE] || Cookies.get(Cookie.Key.LANGUAGE)
    const languageCookie = cookies?.[Cookie.Key.LANGUAGE] || language

    const currency = cookies?.[Cookie.Key.CURRENCY] || Cookies.get(Cookie.Key.CURRENCY)
    const currencyCookie =  cookies?.[Cookie.Key.CURRENCY] || currency

    const country = cookies?.[Cookie.Key.COUNTRY] || Cookies.get(Cookie.Key.COUNTRY)
    const countryCookie = cookies?.[Cookie.Key.COUNTRY] || country
    defaultCurrency = currencyCookie ||
        infraConfig?.configSettings
            .find((setting: any) => setting.configType === 'RegionalSettings')
            .configKeys.find(
            (item: any) => item.key === 'RegionalSettings.DefaultCurrencyCode'
            ).value || BETTERCOMMERCE_DEFAULT_CURRENCY

    defaultCountry = countryCookie ||
        infraConfig?.configSettings
        .find((setting: any) => setting.configType === 'RegionalSettings')
        .configKeys.find(
            (item: any) => item.key === 'RegionalSettings.DefaultCountry'
        ).value || BETTERCOMMERCE_DEFAULT_COUNTRY

    defaultLanguage = languageCookie ||
        infraConfig?.configSettings
        .find((setting: any) => setting.configType === 'RegionalSettings')
        .configKeys.find(
            (item: any) => item.key === 'RegionalSettings.DefaultLanguageCode'
        ).value || BETTERCOMMERCE_DEFAULT_LANGUAGE

    const { configSettings, shippingCountries, billingCountries, currencies, languages, snippets, } = infraConfig
    const appConfigObj = {
        ...{
          configSettings:
            configSettings?.filter((x: any) =>
              ['B2BSettings', 'BasketSettings', 'ShippingSettings', 'DomainSettings', 'PasswordProtectionSettings'].includes(
                x?.configType
              )
            ) || [],
          shippingCountries,
          billingCountries,
          currencies,
          languages,
          snippets,
        },
        ...{
          defaultCurrency,
          defaultLanguage,
          defaultCountry,
        },
      }
      appConfig = encrypt(JSON.stringify(appConfigObj))
      return appConfig
  }

  /**
   * Returns the prop values of review summary from Redis cache.
   * @returns 
   */
  protected async getReviewSummary() {
    const key = Redis.Key.REVIEW_SUMMARY
    const cachedData = await getDataByUID([
        key,
    ])
    let reviewSummaryUIDData: any = parseDataValue(cachedData, key)
    if (!reviewSummaryUIDData) {

        try {
            const res: any = await fetcher({
                baseUrl: REVIEW_BASE_URL,
                url: `${REVIEW_SERVICE_BASE_API}/summary`,
                method: 'post',
                cookies: {},
            })
            reviewSummaryUIDData = res?.Result
            await setData([{ key, value: reviewSummaryUIDData }])
        } catch (error: any) {
            logError(error)
            return EmptyObject
        }
    }
    return reviewSummaryUIDData
  }

  /**
   * Returns the prop values of pluginConfig from Redis cache.
   * @param param0 
   * @returns 
   */
  protected async getPluginConfig({ cookies }: any) {
    let pluginConfig = new Array<any>()
    const key = Redis.Key.PLUGIN_CONFIG
    const cachedData = await getDataByUID([
        key,
    ])
    let pluginConfigUIDData: any = parseDataValue(cachedData, key)
    if (!pluginConfigUIDData) {
        const headers = {
            DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID,
        }
        const socialLoginConfigUrl = `${INFRA_PLUGIN_CATEGORY_ENDPOINT}?categoryCode=${PluginCategory.SOCIAL_LOGIN}`
        try {
            const { result: socialLoginConfig } = await fetcher({
                url: socialLoginConfigUrl,
                method: 'get',
                cookies,
                headers: headers,
            })

            if (socialLoginConfig) {
                pluginConfig = pluginConfig?.concat(socialLoginConfig)
            }
        } catch (error: any) {
            logError(error)
        }

        /*const marketingConfigUrl = `${INFRA_PLUGIN_CATEGORY_ENDPOINT}?categoryCode=${PluginCategory.MARKETING}`
        try {
            const { result: marketingConfig } = await fetcher({
                url: marketingConfigUrl,
                method: 'get',
                cookies: cookies,
                headers: headers,
            })
            if (marketingConfig) {
                pluginConfig = pluginConfig?.concat(marketingConfig?.filter((x: any) => [PluginCategory.SHOPBOX_API].includes(x?.pluginCode)))
            }
        } catch (error: any) {
            logError(error)
        }*/
        pluginConfigUIDData = pluginConfig
        await setData([{ key, value: pluginConfig }])
    }
    return encrypt(JSON.stringify(pluginConfigUIDData))
  }

  protected async getMembershipPlans({ cookies }: any) {
    const key = Redis.Key.MEMBERSHIP_PLANS
    const cachedData = await getDataByUID([key,])
    let allMembershipsUIDData: any = parseDataValue(cachedData, key)
    if (!allMembershipsUIDData) {

        try {
            const data = {
                "SearchText": null,
                "PricingType": 0,
                "Name": null,
                "TermType": 0,
                "IsActive": 1,
                "ProductId": Guid.empty,
                "CategoryId": Guid.empty,
                "ManufacturerId": Guid.empty,
                "SubManufacturerId": Guid.empty,
                "PlanType": 0,
                "CurrentPage": 0,
                "PageSize": 0
              }
            const membershipPlansPromise = commerce.getMembershipPlans({ data, cookies })
            allMembershipsUIDData = await membershipPlansPromise
            await setData([{ key, value: allMembershipsUIDData }])
        } catch (error: any) {
            logError(error)
            return EmptyObject
        }
    }
    return allMembershipsUIDData
  }

  protected async getDefaultMembershipPlan(plans: Array<any>) {
    let defaultDisplayMembership: any = EmptyObject
    if (plans?.length) {
        const membershipPlan = plans?.sort((a: any, b: any) => (a?.price?.raw?.withTax || 0) - (b?.price?.raw?.withTax || 0))[0]
        if (membershipPlan) {
            const promoCode = membershipPlan?.membershipBenefits?.[0]?.code
            if (promoCode) {
                const promotion = await commerce.getPromotion(promoCode)
                defaultDisplayMembership = { membershipPromoDiscountPerc: stringToNumber(promotion?.result?.additionalInfo1), membershipPrice: membershipPlan?.price?.raw?.withTax }
            }
        }
    }
    return defaultDisplayMembership
  }

  protected async getNavTree({ cookies }: any) {
    const key = Redis.Key.NavTree
    const cachedData = await getDataByUID([
        key,
    ])
    let navTreeUIDData: any = parseDataValue(cachedData, key)
    if (!navTreeUIDData) {
      const { result: response } = await useNavTree(cookies)
      const { header = [], footer = [] } = response
      if (header?.length || footer?.length) {
        navTreeUIDData = { nav: header, footer }
        await setData([{ key, value: navTreeUIDData }])
      }
    }
    return navTreeUIDData
  }
}
