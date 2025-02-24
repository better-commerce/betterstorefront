import { BasePagePropsProvider } from '@framework/contracts/page-props/BasePagePropsProvider'
import { IPagePropsProvider } from '@framework/contracts/page-props/IPagePropsProvider'
import { Cookie } from '@framework/utils/constants'
import { Redis } from '@framework/utils/redis-constants'
import { containsArrayData, getDataByUID, parseDataValue, setData } from '@framework/utils/redis-util'
import commerce from '@lib/api/commerce'

/**
 * Class {TermsAndConditionsPageProps} inherits and implements the base behavior of {BasePagePropsProvider} and {IPagePropsProvider} respectively to return the PageProp values.
 */
export class TermsAndConditionsPageProps extends BasePagePropsProvider implements IPagePropsProvider {

  /**
   * Returns the common PageProp values depending on the page slug.
   * @param param0 
   * @returns 
   */
  public async getPageProps({ slug, defaultSlug, cookies }: any) {
    const locale = cookies?.[Cookie.Key.LANGUAGE]
    const cachedDataUID ={
        infraUID: Redis.Key.INFRA_CONFIG + '_' + locale,
        termsPageWebUID: Redis.Key.TermspageWeb + '_' + locale,
        termsPageMobileWebUID: Redis.Key.TermspageMobileWeb + '_' + locale
    }
    const cachedData = await getDataByUID([cachedDataUID.infraUID, cachedDataUID.termsPageWebUID, cachedDataUID.termsPageMobileWebUID,])
    let infraUIDData: any = parseDataValue(cachedData, cachedDataUID.infraUID)
    const pageContentWebUIDData: Array<any> = parseDataValue(cachedData, cachedDataUID.termsPageWebUID) || []
    const pageContentMobileWebUIDData: Array<any> = parseDataValue(cachedData, cachedDataUID.termsPageMobileWebUID) || []

    if (!infraUIDData) {
        const infraPromise = commerce.getInfra(cookies)
        infraUIDData = await infraPromise
        await setData([{ key: cachedDataUID.infraUID, value: infraUIDData }])
    }

    const promises = new Array<Promise<any>>()

    const fetchData = async (pageContentUIDData: any[], pageContentUIDKey: string, channel: 'Web' | 'MobileWeb') => {
        if (!containsArrayData(pageContentUIDData)) {
            infraUIDData?.currencies
            ?.map((x: any) => x?.currencyCode)
            ?.forEach((currencyCode: string, index: number) => {
                promises.push(
                    new Promise(async (resolve: any, reject: any) => {
                        try {
                            const pageContentsPromise = commerce.getPagePreviewContent({
                                id: '',
                                slug,
                                workingVersion:
                                process.env.NODE_ENV === 'production' ? true : true, // TRUE for preview, FALSE for prod.
                                channel: channel,
                                currency: currencyCode,
                                cachedCopy: true,
                                language: cookies?.Language,
                                cookies,
                            })
                            const pageContent = await pageContentsPromise
                            pageContentUIDData.push({
                                key: currencyCode,
                                value: pageContent,
                            })
                            await setData([{ key: pageContentUIDKey, value: pageContentUIDData }, ])
                            resolve()
                        } 
                        catch (error: any) {
                            resolve()
                        }
                    })
                )
            })
        }
    }
    fetchData(pageContentWebUIDData, cachedDataUID.termsPageWebUID, 'Web')
    fetchData(pageContentMobileWebUIDData, cachedDataUID.termsPageMobileWebUID, 'MobileWeb')

    await Promise.all(promises)
    const slugsPromise = commerce.getSlugs({ slug, cookies });
    const slugs = await slugsPromise;
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
    }
    return props
  }
}
