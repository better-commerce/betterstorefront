import fetcher from '../../../fetcher'
import { CATALOG_ENDPOINT } from '@components/utils/constants'
import { mapObject } from '@framework/utils/translate-util'
import { getProductListTransform } from 'pages/api/catalog/products'

export default async function getBrandBySlug(slug: string, cookies?: any) {
  try {
    const response: any = await fetcher({
      url: `${CATALOG_ENDPOINT}/slug?slug=${slug}`,
      method: 'post',
      cookies,
    })
    //return { ...response, ...{ snippets: response?.snippets ?? [] }, ...{ status: response?.status }, }
    return { ...response, ...{ snippets: response?.snippets ?? [] }, ...{ status: response?.status }, result: { ...mapObject(response?.result, getBrandBySlugTransformMap)?.data, productList: null, /*{ ...response?.result?.productList, results: mapObject(response, getCollectionBySlugTransformMap)?.data, },*/ }, }
  } catch (error) {
    return { hasError: true, error }
  }
}

const getBrandBySlugTransformMap = {
  data: (result: any) => ({
    ...getBrandTransform(result),
  }),
}

const getCollectionBySlugTransformMap = {

  data: (response: any) => ([
    ...response?.result?.productList?.results?.length ? getProductListTransform(response?.result?.productList?.results) : new Array<any>(),
  ]),
}

export const getBrandTransform = (result: any) => ({
  description: result?.description,
  id: result?.id,
  link: result?.link,
  logoImageName: result?.logoImageName,
  metaDescription: result?.metaDescription,
  metaKeywords: result?.metaKeywords,
  metaTitle: result?.metaTitle,
  name: result?.name,
  premiumBrandLogo: result?.premiumBrandLogo,
  productList: result?.productList,
  recordId: result?.recordId,
  shortDescription: result?.shortDescription,
  showLandingPage: result?.showLandingPage,
  widgetsConfig: result?.widgetsConfig,
  // canonicalTags
  // categoryCode
  // customURL
  // displayTemplate
  // enableMoreAbout
  // excludeFromSearch
  // hideBrandVisibility
  // hideSubbrandVisibility
  // images
  // isActive
  // isCustomUrl
  // isHighlighted
  // langCulture
  // manufacturerSettings
  // parentId
  // parentIid
  // parentManufSlug
  // parentManufacturerName
  // privateBrandImage
  // productImage
  // showSiteStrip
  // subBrands
})