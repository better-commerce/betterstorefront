import { Dialog, RadioGroup } from '@headlessui/react'
import { Fragment, useState, useEffect } from 'react'
import { Transition } from '@headlessui/react'
import classNames from '@components/utils/classNames'
import { useUI } from '@components/ui/context'
import { useRouter } from 'next/router'
import { getProductFromAttributes } from '@components/utils/attributesGenerator'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { groupBy, round } from 'lodash'
import { SIZE_CHART } from '@components/utils/textVariables'
import { matchStrings } from '@framework/utils/parse-util'
import * as SizeAttribute from '@components/product/ProductView/sizeAttribute.json'
import cn from 'classnames'
const DEFAULT_OPTIONS_COUNT = 20

function renderRadioOptions(
   items: any,
   itemsCount: any,
   selectedValue: any,
   selected: any,
   openRemainElems: boolean = false,
   handleToggleOpenRemainElems: any,
   sizeInit: any,
   setSizeInit: any,
) {
   items.sort((s1: any, s2: any) => {
      return s1.displayOrder - s2.displayOrder
   })
   let defaultItems = items && items.length > 0 ? items.slice(0, itemsCount) : []
   let remainingItems =
      items && items.length > 0 ? items.slice(itemsCount, items.length) : []
   let selectedVal: any = ''

   if (selected[1] && sizeInit === 'true') {
      selectedVal = selected[0] + selected[1]
   } else {
      if (sizeInit === 'true') {
         selectedVal = selected[0]
      }
   }
   return (
      <>
         <div className="flex items-center">
            {defaultItems.map((item: any, idx: any) => (
               <RadioGroup.Option
                  key={idx}
                  value={item.fieldValue}
                  title={item.fieldLabel}
                  style={{ backgroundColor: item.fieldValue }}
                  onClick={() => { setSizeInit('true') }}
                  className={cn(
                     'pdp-color-swatch-item relative z-99 h-10 w-10 border border-gray-200 flex text-black items-center justify-center cursor-pointer outline-none dark:text-black hover:border-gray-900',
                     {
                        'border border-gray-200': selectedVal !== item.fieldValue,
                        'border border-gray-900': selectedVal === item.fieldValue,
                     }
                  )}
               >
                  <RadioGroup.Label as="p" className="text-ms">{item.fieldValue}</RadioGroup.Label>
               </RadioGroup.Option>
            ))}

            {openRemainElems && (
               <button onClick={() => handleToggleOpenRemainElems()} className="relative flex items-center justify-center h-10 px-1 bg-gray-300 z-99 hover:opacity-75 bg-nav">
                  <p className="text-gray-900 text-ms">{'<'}</p>
               </button>
            )}

            {remainingItems && remainingItems.length > 0 && !openRemainElems && (
               <div onClick={() => handleToggleOpenRemainElems()} className="relative flex items-center justify-center w-10 h-10 transition duration-100 bg-gray-300 outline-none cursor-pointer z-99 hover:opacity-75 bg-nav">
                  <p className="text-xs text-gray-900">More</p>
               </div>
            )}
         </div>
         <div className={classNames(sizeInit === 'error' ? '' : 'hidden', 'text-red-500 text-sm')}>Please select a Size</div>
      </>
   )
}

export default function SizeInline({
   items = [],
   onChange = () => { },
   label = '',
   fieldCode = '',
   currentAttribute = '',
   getStockPerAttribute,
   setSelectedAttrData,
   productId,
   setAttrCombination,
   isDisabled,
   product,
   variant,
   generateLink = () => { },
   callToAction = null,
   handleSetProductVariantInfo = () => { },
   sizeInit,
   setSizeInit,
}: any) {
   const {
      openNotifyUser,
      closeNotifyUser,
      basketId,
      setCartItems,
      user,
      setSidebarView,
      openWishlist,
      addToWishlist,
      wishListItems,
      setAlert,
   } = useUI()

   const router = useRouter()

   const slug = `products/${router.query.slug}`

   const [productData, setProductData] = useState(
      getStockPerAttribute(fieldCode, currentAttribute)
   )

   const [validationState, SetvalidationState] = useState<any>(false)
   const [selected, setSelected] = useState({
      ...currentAttribute,
      stock: productData.currentStock,
      productId: productData.productId,
      stockCode: productData.stockCode,
   })

   useEffect(() => {
      SetvalidationState(true);
      const getStockPerAttrData = getStockPerAttribute(
         fieldCode,
         currentAttribute
      )
      setProductData(getStockPerAttrData)
      setSelected({
         ...currentAttribute,
         stock: getStockPerAttrData.currentStock,
         productId: getStockPerAttrData.productId,
         stockCode: getStockPerAttrData.stockCode,
      })
      handleSetProductVariantInfo({ clothSize: currentAttribute })
   }, [currentAttribute])

   useEffect(() => {
      const getStockPerAttrData = getStockPerAttribute(
         fieldCode,
         currentAttribute
      )
      setProductData(getStockPerAttrData)
      setSelected({
         ...currentAttribute,
         stock: getStockPerAttrData.currentStock,
         productId: getStockPerAttrData.productId,
         stockCode: getStockPerAttrData.stockCode,
      })
   }, [productId])

   const isPreOrderEnabled = productData.isPreOrderEnabled

   const handleOnChange = (value: any) => {
      const stockPerAttrValue = getProductFromAttributes(
         fieldCode,
         value,
         variant,
         product.variantProducts,
         slug
      )

      setSelected({ ...value, ...stockPerAttrValue })
      setAttrCombination(fieldCode, value)
      setSelectedAttrData(stockPerAttrValue)
      if (value.stock === 0 && !isPreOrderEnabled) {
         openNotifyUser(stockPerAttrValue.productId)
      }
      return onChange(fieldCode, value)
   }

   const [openRemainElems, setOpenRemainElems] = useState(false)
   const handleToggleOpenRemainElems = () => setOpenRemainElems(!openRemainElems)

   return (
      <>
         <div className="flex items-center justify-between my-3" id="productSize">
            <h3 className="text-lg text-gray-700">
               <span className='font-mono font-bold'>{label}</span> : {selected.attributes ? <span className='pl-1 font-light text-gray-700 text-ms dark:text-gray-700'>{selected.attributes[1].fieldValue}</span> : <></>}
               <span className="pl-1 text-xs font-bold text-black sm:text-sm">
                  {product?.mappedCategories?.length > 0 &&
                     SizeAttribute?.sizes?.map((attr: any, aid: number) => (
                        matchStrings(attr.name, product?.mappedCategories[0].categoryName, true) && (
                           <div className="inline-block" key={aid}>
                              {attr?.values?.map((fields: any, idx: number) => (
                                 <div key={idx}>
                                    {matchStrings(fields.FieldText, currentAttribute, true) &&
                                       (<p>{fields.FieldText}{' ('}{fields.FieldValue}{')'}</p>)}
                                 </div>
                              ))}
                           </div>
                        )
                     ))
                  }
               </span>
            </h3>
         </div>
         <RadioGroup value='' onChange={handleOnChange} className="mt-2 dark:text-black">
            <div>
               {renderRadioOptions(
                  items,
                  DEFAULT_OPTIONS_COUNT,
                  currentAttribute,
                  selected,
                  openRemainElems,
                  handleToggleOpenRemainElems,
                  sizeInit,
                  setSizeInit,
               )}
            </div>
         </RadioGroup>
      </>
   )
}
