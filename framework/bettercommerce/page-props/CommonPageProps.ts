import { BasePagePropsProvider } from '@framework/contracts/page-props/BasePagePropsProvider'
import { IPagePropsProvider } from '@framework/contracts/page-props/IPagePropsProvider'
import { Cookie } from '@framework/utils/constants'
import { Redis } from '@framework/utils/redis-constants'
import { getDataByUID, parseDataValue, setData } from '@framework/utils/redis-util'
import commerce from '@lib/api/commerce'

/**
 * Class {CommonPageProps} inherits and implements the base behavior of {BasePagePropsProvider} and {IPagePropsProvider} respectively to return the common PageProp values.
 */
export class CommonPageProps extends BasePagePropsProvider implements IPagePropsProvider {

  /**
   * Returns the common PageProp values depending on the page slug.
   * @param param0 
   * @returns 
   */
  public async getPageProps({ slug, cookies }: any) {
    const locale = cookies?.[Cookie.Key.LANGUAGE]
    const cachedDataUID = {
      infraUID: Redis.Key.INFRA_CONFIG + '_' + locale,
    }
    const cachedData = await getDataByUID([
      cachedDataUID.infraUID,
    ])
    let infraUIDData: any = parseDataValue(cachedData, cachedDataUID.infraUID)
    if (!infraUIDData) {
      const infraPromise = commerce.getInfra(cookies)
      infraUIDData = await infraPromise
      await setData([{ key: cachedDataUID.infraUID, value: infraUIDData }])
    }

    const pluginConfig = await this.getPluginConfig({ cookies })
    const appConfig = await this.getAppConfig(infraUIDData, cookies)

    let slugs
    if (slug) {
        const slugsPromise = commerce.getSlugs({ slug, cookies })
        slugs = await slugsPromise
    }
    const navTreeUIDData = await this.getNavTree({ cookies })
    const keywordsUIDData = await this.getKeywords({ cookies })
    
    const props = {
      // --- Common STARTS
      navTree: navTreeUIDData,
      pluginConfig,
      appConfig,
      globalSnippets: infraUIDData?.snippets ?? [],
      snippets: slugs?.snippets ?? [],
      keywords: keywordsUIDData || [],
      // --- Common ENDS
    }
    return props
  }
}
