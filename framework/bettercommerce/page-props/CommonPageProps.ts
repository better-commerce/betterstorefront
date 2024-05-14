import { BasePagePropsProvider } from '@framework/contracts/page-props/BasePagePropsProvider'
import { IPagePropsProvider } from '@framework/contracts/page-props/IPagePropsProvider'
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
    const cachedData = await getDataByUID([
      Redis.Key.INFRA_CONFIG,
    ])
    let infraUIDData: any = parseDataValue(cachedData, Redis.Key.INFRA_CONFIG)
    if (!infraUIDData) {
      const infraPromise = commerce.getInfra()
      infraUIDData = await infraPromise
      await setData([{ key: Redis.Key.INFRA_CONFIG, value: infraUIDData }])
    }

    const pluginConfig = await this.getPluginConfig({ cookies })
    const appConfig = await this.getAppConfig(infraUIDData)

    let slugs
    if (slug) {
        const slugsPromise = commerce.getSlugs({ slug: slug })
        slugs = await slugsPromise
    }
    const navTreeUIDData = await this.getNavTree({ cookies })
    
    const props = {
      // --- Common STARTS
      navTree: navTreeUIDData,
      pluginConfig,
      appConfig,
      globalSnippets: infraUIDData?.snippets ?? [],
      snippets: slugs?.snippets ?? [],
      // --- Common ENDS
    }
    return props
  }
}
