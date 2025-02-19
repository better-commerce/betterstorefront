import { EmptyObject } from '@components/utils/constants'
import { BasePagePropsProvider } from '@framework/contracts/page-props/BasePagePropsProvider'
import { IPagePropsProvider } from '@framework/contracts/page-props/IPagePropsProvider'
import { logError } from '@framework/utils/app-util'
import { Cookie } from '@framework/utils/constants'
import { tryParseJson } from '@framework/utils/parse-util'
import { Redis } from '@framework/utils/redis-constants'
import { getDataByUID, parseDataValue, setData } from '@framework/utils/redis-util'
import commerce from '@lib/api/commerce'
import { PHASE_PRODUCTION_BUILD } from 'next/constants'

/**
 * Class {PDPPreviewPageProps} inherits and implements the base behavior of {BasePagePropsProvider} and {IPagePropsProvider} respectively to return the PageProp values.
 */
export class PDPPreviewPageProps extends BasePagePropsProvider implements IPagePropsProvider {

  /**
   * Returns the common PageProp values depending on the page slug.
   * @param param0 
   * @returns 
   */
  public async getPageProps({ slug, cookies }: any) {
    const currentLocale = cookies?.[Cookie.Key.LANGUAGE]
    const cachedDataUID = {
        infraUID: Redis.Key.INFRA_CONFIG + '_' + currentLocale,
        productPreviewSlugUID: Redis.Key.PDP.ProductsPreview + '_' + slug + '_' + currentLocale,
        productImagesUID: Redis.Key.PDP.ProductImages + '_' + slug + '_' + currentLocale,
    }
    const cachedData = await getDataByUID([
        cachedDataUID.infraUID,
        cachedDataUID.productPreviewSlugUID,
        cachedDataUID.productImagesUID,
    ])
    let infraUIDData: any = parseDataValue(cachedData, cachedDataUID.infraUID)
    if (!infraUIDData) {
      const infraPromise = commerce.getInfra(cookies)
      infraUIDData = await infraPromise
      await setData([{ key: cachedDataUID.infraUID, value: infraUIDData }])
    }

    let productPreviewSlugUID: any = parseDataValue(cachedData, cachedDataUID.productPreviewSlugUID)
    if (!productPreviewSlugUID) {
        const productPromise = commerce.getProductPreview({ query: slug, cookies })
        productPreviewSlugUID = await productPromise
        await setData([{ key: cachedDataUID.productPreviewSlugUID, value: productPreviewSlugUID }])
    }

    let productImagesUID: any = parseDataValue(cachedData, cachedDataUID.productImagesUID)
    if (!productImagesUID) {
        try {
            if (productPreviewSlugUID?.product?.productCode) {
              // GET SELECTED PRODUCT ALL REVIEWS
              const pdpCachedImagesPromise = commerce.getPdpCachedImage({
                query: productPreviewSlugUID?.product?.productCode,
                cookies
              })
        
              productImagesUID = await pdpCachedImagesPromise
              await setData([{ key: cachedDataUID.productImagesUID, value: productImagesUID }])
            }
        } catch (error: any) {}
    }
    
    const pdpCachedImages = productImagesUID?.images ? tryParseJson(productImagesUID?.images) : []
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
      keywords: keywordsUIDData || [],
      // --- Common ENDS

      data: productPreviewSlugUID,
      slug: slug,
      snippets: productPreviewSlugUID?.snippets ?? [],
      pdpCachedImages,
    }
    return props
  }
}
