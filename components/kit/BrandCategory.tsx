import { Fragment, useEffect, useState } from 'react'
import sortBy from 'lodash/sortBy'
import chunk from 'lodash/chunk'
import axios from 'axios'
import cn from 'classnames'

//
import { NEXT_PRODUCT_BY_KIT_CATEGORY } from '@components/utils/constants'
import BrandProduct from '@components/kit/BrandProduct'
import { IMG_PLACEHOLDER } from '@components/utils/textVariables'
import { generateUri } from '@commerce/utils/uri-util'

function BrandCategory({
  category,
  brandId,
  platformId,
  selectedCatId,
  handleSelectCatId,
  deviceInfo,
  queryParams,
  brandInfo,
  cartLineItems,
  setCartLineItems,
}: any) {
  const { isMobile } = deviceInfo
  const { tierName, kitCategories: kitCategoriesData, tierId } = category
  const [kitCategories, setKitCategories] = useState<any>([])
  const [productsByCategory, setProductsByCategory] = useState<any>([])

  useEffect(() => {
    if (kitCategoriesData) {
      setKitCategories(chunk(kitCategoriesData, !isMobile ? 4 : 1))
    }
  }, [kitCategoriesData, isMobile])

  const handleFetchProducts = async (catId: any) => {
    handleSelectCatId('')
    const params = {
      brandId,
      platformId,
      TierId: tierId,
      kitCategoryId: catId,
      includeOutOfStockItems: queryParams?.includeOutOfStockItems,
      productApplication: queryParams?.productApplication,
    }

    try {
      const res = await axios.post(NEXT_PRODUCT_BY_KIT_CATEGORY, {
        ...params,
      })
      setProductsByCategory(res?.data || [])
      handleSelectCatId(catId)
    } catch (error) {
      // console.log(error)
    }
  }

  if (!kitCategoriesData.length) {
    return <></>
  }

  const css = { maxWidth: '100%', height: 'auto' }
  return (
    <div className="flex flex-col w-full gap-y-5">
      <div className="flex-1">
        <h3 className="mt-6 text-lg font-medium sm:text-2xl dark:text-black">{tierName}</h3>
      </div>
      <div className="flex-1">
        {kitCategories?.map((categories: any, categoryIdx: number) => (
          <Fragment key={`category-group-${categoryIdx}`}>
            <div className="grid grid-cols-1 gap-4 mb-4 sm:grid-cols-4">
              {categories?.map((cat: any, catIdx: number) => (
                <Fragment key={`cat-produc-${catIdx}`}>
                  <div
                    className={cn(
                      'relative grid grid-cols-1 bg-white cursor-pointer border rounded-md hover:border-orange-500 sm:grid-cols-1 shadow-gray-200 group prod-group overflow-hidden',
                      {
                        'border-[#016FA9] border-2 hover:border-[#016FA9] category-active':
                          cat.id === selectedCatId,
                      }
                    )}
                    onClick={() => handleFetchProducts(cat.id)}
                  >
                    {cat.productCount > 0 && (
                      <div className="absolute top-0 left-0 w-1/2 text-xs text-white bg-red-600 z-1 ribbon">
                        Deals({cat.productCount})
                      </div>
                    )}
                    <div className="relative flex-1 w-[60%] mx-auto">
                      <img
                        src={
                          cat?.image
                            ? generateUri(cat?.image, 'h=350&fm=webp') || ''
                            : IMG_PLACEHOLDER
                        }
                        height={100}
                        width={220}
                        alt={cat?.name || ''}
                        className="object-cover object-center mx-auto sm:h-full min-h-image height-img-auto"
                        style={css}
                      />
                    </div>
                    <div className="flex justify-center w-full px-0 py-3 font-medium text-center text-white uppercase rounded-b-sm -bottom-1 font-14 bg-[#212530] product-name hover:text-gray-100">
                      {cat?.name}
                    </div>
                  </div>
                </Fragment>
              ))}
            </div>
            {categories.some((o: any) => o.id === selectedCatId) && (
              <div className="grid grid-cols-1 gap-4 p-4 my-2 border border-gray-300 rounded-md sm:grid-cols-3 sm:my-4 bg-tan">
                <div className="sm:col-span-3">
                  {sortBy(productsByCategory, 'displayOrder')?.map(
                    (product: any) => (
                      <BrandProduct
                        key={product.tierId}
                        product={product}
                        hideTier
                        brandInfo={brandInfo}
                        cartLineItems={cartLineItems}
                        setCartLineItems={setCartLineItems}
                      />
                    )
                  )}
                </div>
              </div>
            )}
          </Fragment>
        ))}
      </div>
    </div>
  )
}

export default BrandCategory
