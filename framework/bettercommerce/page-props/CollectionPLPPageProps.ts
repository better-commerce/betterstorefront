import { BasePagePropsProvider } from '@framework/contracts/page-props/BasePagePropsProvider'
import { IPagePropsProvider } from '@framework/contracts/page-props/IPagePropsProvider'
import { logError } from '@framework/utils/app-util'
import { Redis } from '@framework/utils/redis-constants'
import { getDataByUID, parseDataValue, setData } from '@framework/utils/redis-util'
import commerce from '@lib/api/commerce'
import getCollectionBySlug from '@framework/api/content/getCollectionBySlug'
import { PHASE_PRODUCTION_BUILD } from 'next/constants'
import { Cookie } from '@framework/utils/constants'

/**
 * Class {CollectionPLPPageProps} inherits and implements the base behavior of {BasePagePropsProvider} and {IPagePropsProvider} respectively to return the PageProp values.
 */
export class CollectionPLPPageProps extends BasePagePropsProvider implements IPagePropsProvider {

  /**
   * Returns the common PageProp values depending on the page slug.
   * @param param0 
   * @returns 
   */
  public async getPageProps({ slug, cookies }: any) {
      const currentLocale = cookies?.[Cookie.Key.LANGUAGE]
    const cachedDataUID = {
        infraUID: Redis.Key.INFRA_CONFIG + '_' + currentLocale,
        collectionUID: Redis.Key.Collection + '_' + slug + '_' + currentLocale,
      }
      const cachedData = await getDataByUID([
        cachedDataUID.infraUID,
        cachedDataUID.collectionUID
      ])
    
      let infraUIDData: any = parseDataValue(cachedData, cachedDataUID.infraUID)
      let collectionUIDData: any = parseDataValue(cachedData, cachedDataUID.collectionUID)
      
    
      try {
        if (!collectionUIDData) {
          collectionUIDData = await getCollectionBySlug(slug, cookies)
          await setData([{ key: cachedDataUID.collectionUID, value: collectionUIDData }])
        }
        if (!infraUIDData) {
          const infraPromise = commerce.getInfra(cookies)
          infraUIDData = await infraPromise
          await setData([{ key: cachedDataUID.infraUID, value: infraUIDData }])
        }
    
      } catch (error: any) {
        logError(error)
    
        if (process.env.NEXT_PHASE !== PHASE_PRODUCTION_BUILD) {
          let errorUrl = '/500'
          const errorData = error?.response?.data
          if (errorData?.errorId) {
            errorUrl = `${errorUrl}?errorId=${errorData.errorId}`
          }
          return { isRedirect: true, redirect: errorUrl }
        }
      }
    
      if (process.env.NEXT_PHASE !== PHASE_PRODUCTION_BUILD) {
        if (collectionUIDData?.status === "NotFound") {
          return { notFound: true }
        }
      }

    const allMembershipsUIDData: any = await this.getMembershipPlans({ cookies })
    const defaultDisplayMembership = await this.getDefaultMembershipPlan(allMembershipsUIDData?.result, cookies)
    const pluginConfig = await this.getPluginConfig({ cookies })
    const reviewData = await this.getReviewSummary({ cookies })
    const appConfig = await this.getAppConfig(infraUIDData, cookies)
    const navTreeUIDData = await this.getNavTree({ cookies })
    const keywordsUIDData = await this.getKeywords({ cookies })
    const props = {
      ...collectionUIDData,

      // --- Common STARTS
      navTree: navTreeUIDData,
      pluginConfig,
      reviewData,
      appConfig,
      globalSnippets: infraUIDData?.snippets ?? [],
      snippets: collectionUIDData?.snippets ?? [],
      keywords: keywordsUIDData || [],
      // --- Common ENDS

      slug,
      defaultDisplayMembership,
    }
    return props
  }
}
