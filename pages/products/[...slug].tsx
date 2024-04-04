import type { GetStaticPathsContext, GetStaticPropsContext } from 'next'
import { useRouter } from 'next/router'
import commerce from '@lib/api/commerce'
import ProductLayout from '@components/Layout/ProductLayout'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import { STATIC_PAGE_CACHE_INVALIDATION_IN_MINS } from '@framework/utils/constants'
import { logError, notFoundRedirect } from '@framework/utils/app-util'
import { getDataByUID, parseDataValue, setData } from '@framework/utils/redis-util'
import { Redis } from '@framework/utils/redis-constants'
import { getSecondsInMinutes } from '@framework/utils/parse-util'
import { useTranslation } from '@commerce/utils/use-translation'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { BETTERCOMMERCE_DEFAULT_LANGUAGE } from '@components/utils/constants'
import ProductView from '@components/Product/ProductView'
import { PHASE_PRODUCTION_BUILD } from 'next/constants'

export async function getStaticProps({ params, locale, locales, preview }: GetStaticPropsContext<{ slug: string; recordId: string }>) {
  const slug = params!?.slug[0]
  const cachedDataUID = {
    infraUID : Redis.Key.INFRA_CONFIG,
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
      return notFoundRedirect();
    }
    if(!productCategoryUIDData){
      const allProductsByCategoryRes = await commerce.getAllProducts({
        query: {
          categoryId: productSlugUIDData?.product?.classification?.categoryCode,
          pageSize: 50,
        },
      })
      if (allProductsByCategoryRes?.products?.results?.length > 0) {
        productCategoryUIDData = allProductsByCategoryRes?.products?.results
      }
      await setData([{ key: cachedDataUID.productCategoryUID, value: productCategoryUIDData }])
    }

    if(!availablePromoUIDData){
      const availablePromotionsPromise = commerce.getProductPromos({
        query: productSlugUIDData?.product?.recordId,
      })
      availablePromoUIDData = await availablePromotionsPromise
      await setData([{ key: cachedDataUID.availablePromoUID, value: availablePromoUIDData }])
    }
    if(!relatedProductUIDData){
      const relatedProductsPromise = commerce.getRelatedProducts({
        query: productSlugUIDData?.product?.recordId,
      })
      relatedProductUIDData = await relatedProductsPromise
      await setData([{ key: cachedDataUID.relatedProductUID, value: relatedProductUIDData }])
    }

 
    
    if(!productReviewUIDData){
      const reviewPromise = commerce.getProductReview({
        query: productSlugUIDData?.product?.recordId,
      })
      productReviewUIDData = await reviewPromise
      await setData([{ key: cachedDataUID.productReviewUID, value: productReviewUIDData }])
    }

    // GET SELECTED PRODUCT ALL REVIEWS
    if(!pdpLookBookUIDData){
      const pdpLookbookPromise = commerce.getPdpLookbook({
        query: productSlugUIDData?.product?.stockCode,
      })
      const pdpLookbook = await pdpLookbookPromise
      if (pdpLookbook?.lookbooks?.length > 0) {
        const pdpLookbookProductsPromise = commerce.getPdpLookbookProduct({
          query: pdpLookbook?.lookbooks[0]?.slug,
        })
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
    } catch (imgError) {}
  } catch (error: any) {
    logError(error)
    if (process.env.NEXT_PHASE !== PHASE_PRODUCTION_BUILD) {
      let errorUrl = '/500'
      const errorData = error?.response?.data
      if (errorData?.errorId) {
        errorUrl = `${errorUrl}?errorId=${errorData.errorId}`
      }
      return {
        redirect: {
          destination: errorUrl,
          permanent: false,
        },
      }
    }  
  }

  if(!infraUIDData){
    const infraPromise = commerce.getInfra()
    infraUIDData = await infraPromise
    await setData([{ key: cachedDataUID.infraUID, value: infraUIDData }])
  }
  return {
    props: {
      ...(await serverSideTranslations(locale ?? BETTERCOMMERCE_DEFAULT_LANGUAGE!)),
      data: productSlugUIDData,
      slug: slug,
      globalSnippets: infraUIDData?.snippets ?? [],
      snippets: productSlugUIDData?.snippets ?? [],
      relatedProducts: relatedProductUIDData,
      availabelPromotions: availablePromoUIDData,
      allProductsByCategory: productCategoryUIDData ?? [],
      reviews: productReviewUIDData,
      pdpCachedImages: pdpCacheImageUIDData?.images
        ? JSON.parse(pdpCacheImageUIDData?.images)
        : [],
    },
    revalidate: getSecondsInMinutes(STATIC_PAGE_CACHE_INVALIDATION_IN_MINS)
  }
}

export async function getStaticPaths({ locales }: GetStaticPathsContext) {
  const { products } = await commerce.getAllProductPaths()
  let paths = products?.map((product: any) => {
    if (!product?.slug?.includes('products/')) {
      return `/products/${product?.slug}`
    } else return `/${product?.slug}`
  })
  return {
    paths: paths,
    fallback: 'blocking',
  }
}
function Slug({
  data,
  setEntities,
  recordEvent,
  slug,
  relatedProducts,
  availabelPromotions,
  allProductsByCategory,
  pdpLookbookProducts,
  pdpCachedImages,
  reviews,
  deviceInfo,
  config,
}: any) {
  const router = useRouter()
  const translate = useTranslation()
  return router.isFallback ? (
    <h1>{translate('common.message.loaderLoadingText')}</h1>
  ) : (
    data && (
      <ProductView
        recordEvent={recordEvent}
        setEntities={setEntities}
        data={data.product}
        slug={slug}
        snippets={data.snippets}
        relatedProducts={relatedProducts}
        promotions={availabelPromotions}
        allProductsByCategory={allProductsByCategory}
        pdpLookbookProducts={pdpLookbookProducts}
        pdpCachedImages={pdpCachedImages}
        reviews={reviews}
        deviceInfo={deviceInfo}
        config={config}
      />
    )
  )
}

Slug.ProductLayout = ProductLayout

export default withDataLayer(Slug, PAGE_TYPES.Product, true, ProductLayout)
