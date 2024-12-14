import { Guid } from '@commerce/types'
import { EmptyObject } from '@components/utils/constants'
import { BasePagePropsProvider } from '@framework/contracts/page-props/BasePagePropsProvider'
import { IPagePropsProvider } from '@framework/contracts/page-props/IPagePropsProvider'
import { stringToNumber } from '@framework/utils/parse-util'
import { Redis } from '@framework/utils/redis-constants'
import { containsArrayData, getDataByUID, parseDataValue, setData } from '@framework/utils/redis-util'
import commerce from '@lib/api/commerce'

/**
 * Class {HomePageProps} inherits and implements the base behavior of {BasePagePropsProvider} and {IPagePropsProvider} respectively to return the home PageProp values.
 */
export class HomePageProps extends BasePagePropsProvider implements IPagePropsProvider {

  /**
   * Returns the common PageProp values depending on the page slug.
   * @param param0 
   * @returns 
   */
  public async getPageProps({ slug, cookies }: any) {
    console.log({cookies})
    const cachedData = await getDataByUID([Redis.Key.INFRA_CONFIG, Redis.Key.HomepageWeb, Redis.Key.HomepageMobileWeb,])
    let infraUIDData: any = parseDataValue(cachedData, Redis.Key.INFRA_CONFIG)
    const pageContentWebUIDData: Array<any> = parseDataValue(cachedData, Redis.Key.HomepageWeb) || []
    const pageContentMobileWebUIDData: Array<any> = parseDataValue(cachedData, Redis.Key.HomepageMobileWeb) || []

    if (!infraUIDData) {
      const infraPromise = commerce.getInfra(cookies)
      infraUIDData = await infraPromise
      await setData([{ key: Redis.Key.INFRA_CONFIG, value: infraUIDData }])
    }

    const promises = new Array<Promise<any>>()
    
    const fetchData = async (pageContentUIDData: any[], pageContentUIDKey: string, channel: 'Web' | 'MobileWeb') => {
        if (!containsArrayData(pageContentUIDData)) {
            infraUIDData?.currencies?.map((x: any) => x?.currencyCode)?.forEach((currencyCode: string, index: number) => {
                promises.push(new Promise(async (resolve: any, reject: any) => {
                    try {
                        const pageContentsPromise = commerce.getPagePreviewContent({
                          id: '',
                          slug,
                          workingVersion: process.env.NODE_ENV === 'production' ? true : true, // TRUE for preview, FALSE for prod.
                          channel: channel,
                          currency: currencyCode,
                          cachedCopy: true,
                          language: cookies?.Language,
                          cookies,
                        })
                        const pageContent = await pageContentsPromise || null
                        pageContentUIDData.push({ key: currencyCode, value: pageContent })
                        await setData([{ key: pageContentUIDKey, value: pageContentUIDData }])
                        resolve()
                    } catch (error: any) {
                        resolve()
                    }
                }))
            })
        }
    };
    fetchData(pageContentWebUIDData, Redis.Key.HomepageWeb, 'Web');
    fetchData(pageContentMobileWebUIDData, Redis.Key.HomepageMobileWeb, 'MobileWeb');

    await Promise.all(promises)
    const slugsPromise = commerce.getSlugs({ slug, cookies });
    const slugs = await slugsPromise;
    const allMembershipsUIDData: any = await this.getMembershipPlans({ cookies })
    const defaultDisplayMembership = await this.getDefaultMembershipPlan(allMembershipsUIDData?.result)
    const pluginConfig = await this.getPluginConfig({ cookies })
    const reviewData = await this.getReviewSummary()
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
      snippets: slugs?.snippets ?? [],
      keywords: keywordsUIDData || [],
      // --- Common ENDS

      pageContentsWeb: pageContentWebUIDData,
      pageContentsMobileWeb: pageContentMobileWebUIDData,
      defaultDisplayMembership,
    }
    return props
  }
}
