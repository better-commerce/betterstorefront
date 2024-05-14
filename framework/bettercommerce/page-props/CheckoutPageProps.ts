import { BasePagePropsProvider } from '@framework/contracts/page-props/BasePagePropsProvider'
import { IPagePropsProvider } from '@framework/contracts/page-props/IPagePropsProvider'
import { Redis } from '@framework/utils/redis-constants'
import { getDataByUID, parseDataValue, setData } from '@framework/utils/redis-util'
import commerce from '@lib/api/commerce'

/**
 * Class {CheckoutPageProps} inherits and implements the base behavior of {BasePagePropsProvider} and {IPagePropsProvider} respectively to return the cart PageProp values.
 */
export class CheckoutPageProps extends BasePagePropsProvider implements IPagePropsProvider {

  /**
   * Returns the common PageProp values depending on the page slug.
   * @param param0 
   * @returns 
   */
  public async getPageProps({ cookies }: any) {

    const cachedData = await getDataByUID([Redis.Key.INFRA_CONFIG,])
    let infraUIDData: any = parseDataValue(cachedData, Redis.Key.INFRA_CONFIG)
    if (!infraUIDData) {
      const infraPromise = commerce.getInfra()
      infraUIDData = await infraPromise
      await setData([{ key: Redis.Key.INFRA_CONFIG, value: infraUIDData }])
    }
    const allMembershipsUIDData: any = await this.getMembershipPlans({ cookies })
    const defaultDisplayMembership = await this.getDefaultMembershipPlan(allMembershipsUIDData?.result)
    const pluginConfig = await this.getPluginConfig({ cookies })
    const reviewData = await this.getReviewSummary()
    const appConfig = await this.getAppConfig(infraUIDData)
    const navTreeUIDData = await this.getNavTree({ cookies })
    const props = {
      // --- Common STARTS
      navTree: navTreeUIDData,
      pluginConfig,
      reviewData,
      appConfig,
      globalSnippets: infraUIDData?.snippets ?? [],
      // --- Common ENDS

      allMembershipPlans: allMembershipsUIDData?.result,
      defaultDisplayMembership,
    }
    return props
  }
}
