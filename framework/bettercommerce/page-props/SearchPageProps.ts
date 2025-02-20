import { EmptyObject } from '@components/utils/constants'
import { BasePagePropsProvider } from '@framework/contracts/page-props/BasePagePropsProvider'
import { IPagePropsProvider } from '@framework/contracts/page-props/IPagePropsProvider'
import { Cookie } from '@framework/utils/constants'
import { stringToNumber } from '@framework/utils/parse-util'
import { Redis } from '@framework/utils/redis-constants'
import { containsArrayData, getDataByUID, parseDataValue, setData } from '@framework/utils/redis-util'
import commerce from '@lib/api/commerce'

/**
 * Class {SearchPageProps} inherits and implements the base behavior of {BasePagePropsProvider} and {IPagePropsProvider} respectively to return the PageProp values.
 */
export class SearchPageProps extends BasePagePropsProvider implements IPagePropsProvider {

  /**
   * Returns the common PageProp values depending on the page slug.
   * @param param0 
   * @returns 
   */
  public async getPageProps({ allProductsDefaultState, cookies }: any) {
    const currentLocale = cookies?.[Cookie.Key.LANGUAGE]
    const allProducts = await commerce.getAllProducts({ ...allProductsDefaultState, cookies })
    const cachedDataUID = { infraUID: Redis.Key.INFRA_CONFIG + '_' + currentLocale }
    const cachedData = await getDataByUID([ cachedDataUID.infraUID ])
    let infraUIDData: any = parseDataValue(cachedData, cachedDataUID.infraUID)

    if (!infraUIDData) {
        const infraPromise = commerce.getInfra(cookies)
        infraUIDData = await infraPromise
        await setData([{ key: cachedDataUID.infraUID, value: infraUIDData }])
    }
    const allMembershipsUIDData: any = await this.getMembershipPlans({ cookies })

    const defaultDisplayMembership = await this.getDefaultMembershipPlan(allMembershipsUIDData?.result, cookies)
    const pluginConfig = await this.getPluginConfig({ cookies })
    const reviewData = await this.getReviewSummary({ cookies })
    const appConfig = await this.getAppConfig(infraUIDData, cookies)
    const navTreeUIDData = await this.getNavTree({ cookies })
    const keywordsUIDData = await this.getKeywords({ cookies })
    const props = {
      // --- Common STARTS
      navTree: navTreeUIDData,
      pluginConfig,
      reviewData,
      appConfig,
      globalSnippets: infraUIDData?.snippets ?? [],
      snippets: allProducts?.snippets ?? [],
      keywords: keywordsUIDData || [],
      // --- Common ENDS

      defaultDisplayMembership,
    }
    return props
  }
}
