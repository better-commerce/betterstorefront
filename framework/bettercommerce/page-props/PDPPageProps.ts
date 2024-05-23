import { EmptyObject } from '@components/utils/constants'
import { BasePagePropsProvider } from '@framework/contracts/page-props/BasePagePropsProvider'
import { IPagePropsProvider } from '@framework/contracts/page-props/IPagePropsProvider'
import { logError } from '@framework/utils/app-util'
import { Redis } from '@framework/utils/redis-constants'
import { getDataByUID, parseDataValue, setData } from '@framework/utils/redis-util'
import commerce from '@lib/api/commerce'
import { PHASE_PRODUCTION_BUILD } from 'next/constants'

/**
 * Class {PDPPageProps} inherits and implements the base behavior of {BasePagePropsProvider} and {IPagePropsProvider} respectively to return the PageProp values.
 */
export class PDPPageProps extends BasePagePropsProvider implements IPagePropsProvider {

  /**
   * Returns the common PageProp values depending on the page slug.
   * @param param0 
   * @returns 
   */
  public async getPageProps({ slug, cookies }: any) {

    const cachedDataUID = {
        infraUID: Redis.Key.INFRA_CONFIG,
        productSlugUID: Redis.Key.PDP.Products + '_' + slug,
        productReviewUID: Redis.Key.PDP.ProductReviewData + '_' + slug,
        relatedProductUID: Redis.Key.PDP.RelatedProduct + '_' + slug,
        pdpLookBookUID: Redis.Key.PDP.PDPLookBook + '_' + slug,
        pdpCacheImageUID: Redis.Key.PDP.PDPCacheImage + '_' + slug,
        availablePromoUID: Redis.Key.PDP.AvailablePromo + '_' + slug,
        productCategoryUID: Redis.Key.PDP.ProductsByCat + '_' + slug,
    }
    const cachedData = await getDataByUID([
        cachedDataUID.infraUID,
        cachedDataUID.productSlugUID,
        cachedDataUID.productReviewUID,
        cachedDataUID.relatedProductUID,
        cachedDataUID.pdpLookBookUID,
        cachedDataUID.pdpCacheImageUID,
        cachedDataUID.availablePromoUID,
        cachedDataUID.productCategoryUID,
    ])
    let infraUIDData: any = parseDataValue(cachedData, cachedDataUID.infraUID)
    if (!infraUIDData) {
      const infraPromise = commerce.getInfra()
      infraUIDData = await infraPromise
      await setData([{ key: cachedDataUID.infraUID, value: infraUIDData }])
    }

    let productSlugUIDData: any = parseDataValue(cachedData, cachedDataUID.productSlugUID)
    let productReviewUIDData: any = parseDataValue(cachedData, cachedDataUID.productReviewUID)
    let relatedProductUIDData: any = parseDataValue(cachedData, cachedDataUID.relatedProductUID)
    let pdpLookBookUIDData: any = parseDataValue(cachedData, cachedDataUID.pdpLookBookUID)
    let pdpCacheImageUIDData: any = parseDataValue(cachedData, cachedDataUID.pdpCacheImageUID)
    let availablePromoUIDData: any = parseDataValue(cachedData, cachedDataUID.availablePromoUID)
    let productCategoryUIDData: any = parseDataValue(cachedData, cachedDataUID.productCategoryUID)

    try {

        if (!productSlugUIDData) {
            const productPromise = commerce.getProduct({ query: slug })
            productSlugUIDData = await productPromise
            await setData([{ key: cachedDataUID.productSlugUID, value: productSlugUIDData }])
        }

        if (productSlugUIDData?.status === "NotFound") {
            return { notFound: true }
        }
        if(!productCategoryUIDData){
            const allProductsByCategoryRes = await commerce.getAllProducts({ query: { categoryId: productSlugUIDData?.product?.classification?.categoryCode, pageSize: 50, }, })
            if (allProductsByCategoryRes?.products?.results?.length > 0) {
                productCategoryUIDData = allProductsByCategoryRes?.products?.results
            }
            await setData([{ key: cachedDataUID.productCategoryUID, value: productCategoryUIDData }])
        }

        if(!availablePromoUIDData){
            const availablePromotionsPromise = commerce.getProductPromos({ query: productSlugUIDData?.product?.recordId, })
            availablePromoUIDData = await availablePromotionsPromise
            await setData([{ key: cachedDataUID.availablePromoUID, value: availablePromoUIDData }])
        }
        if(!relatedProductUIDData){
            const relatedProductsPromise = commerce.getRelatedProducts({ query: productSlugUIDData?.product?.recordId, })
            relatedProductUIDData = await relatedProductsPromise
            await setData([{ key: cachedDataUID.relatedProductUID, value: relatedProductUIDData }])
        }

        
        
        if(!productReviewUIDData){
            const reviewPromise = commerce.getProductReview({ query: productSlugUIDData?.product?.recordId, })
            productReviewUIDData = await reviewPromise
            await setData([{ key: cachedDataUID.productReviewUID, value: productReviewUIDData }])
        }

        // GET SELECTED PRODUCT ALL REVIEWS
        if(!pdpLookBookUIDData){
            const pdpLookbookPromise = commerce.getPdpLookbook({ query: productSlugUIDData?.product?.stockCode, })
            const pdpLookbook = await pdpLookbookPromise
            if (pdpLookbook?.lookbooks?.length > 0) {
                const pdpLookbookProductsPromise = commerce.getPdpLookbookProduct({ query: pdpLookbook?.lookbooks[0]?.slug, })
                pdpLookBookUIDData = await pdpLookbookProductsPromise
                await setData([{ key: cachedDataUID.pdpLookBookUID, value: pdpLookBookUIDData }])
            }
        }

        try {
            if (productSlugUIDData?.product?.productCode) {
                // GET SELECTED PRODUCT ALL REVIEWS
                const pdpCachedImagesPromise = commerce.getPdpCachedImage({
                    query: productSlugUIDData?.product?.productCode,
                })

                pdpCacheImageUIDData = await pdpCachedImagesPromise
            }
        } catch (imgError) {
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

    const allMembershipsUIDData: any = await this.getMembershipPlans({ cookies })
    const defaultDisplayMembership = await this.getDefaultMembershipPlan(allMembershipsUIDData?.result)
    const pluginConfig = await this.getPluginConfig({ cookies })
    const reviewData = await this.getReviewSummary()
    const appConfig = await this.getAppConfig(infraUIDData)
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

      data: productSlugUIDData || EmptyObject,
      slug: slug,
      snippets: productSlugUIDData?.snippets ?? [],
      relatedProducts: relatedProductUIDData || EmptyObject,
      availabelPromotions: availablePromoUIDData || EmptyObject,
      allProductsByCategory: productCategoryUIDData ?? [],
      reviews: productReviewUIDData || EmptyObject,
      pdpCachedImages: pdpCacheImageUIDData?.images
        ? JSON.parse(pdpCacheImageUIDData?.images)
        : [],
      defaultDisplayMembership,
    }
    return props
  }
}
