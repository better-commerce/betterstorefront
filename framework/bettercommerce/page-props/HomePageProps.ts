import { Guid } from '@commerce/types'
import { EmptyObject } from '@components/utils/constants'
import { BasePagePropsProvider } from '@framework/contracts/page-props/BasePagePropsProvider'
import { IPagePropsProvider } from '@framework/contracts/page-props/IPagePropsProvider'
import { Cookie } from '@framework/utils/constants'
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
    const locale = cookies?.[Cookie.Key.LANGUAGE]
    const cachedDataUID = {
      infraUID: Redis.Key.INFRA_CONFIG + '_' + locale,
      homepageWeb: Redis.Key.HomepageWeb + '_' + locale,
      homepageMobileWeb: Redis.Key.HomepageMobileWeb + '_' + locale,
    }
    const cachedData = await getDataByUID([cachedDataUID.infraUID, cachedDataUID.homepageWeb, cachedDataUID.homepageMobileWeb])
    let infraUIDData: any = parseDataValue(cachedData, cachedDataUID.infraUID)
    const pageContentWebUIDData: Array<any> = parseDataValue(cachedData, cachedDataUID.homepageWeb) || []
    const pageContentMobileWebUIDData: Array<any> = parseDataValue(cachedData, cachedDataUID.homepageMobileWeb) || []

    if (!infraUIDData) {
      const infraPromise = commerce.getInfra(cookies)
      infraUIDData = await infraPromise
      await setData([{ key: cachedDataUID.infraUID, value: infraUIDData }])
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
    fetchData(pageContentWebUIDData, cachedDataUID.homepageWeb, 'Web');
    fetchData(pageContentMobileWebUIDData, cachedDataUID.homepageMobileWeb, 'MobileWeb');

    await Promise.all(promises)
    const slugsPromise = commerce.getSlugs({ slug, cookies });
    const slugs = await slugsPromise;
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
