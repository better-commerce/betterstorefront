import { RadioGroup } from '@headlessui/react'
import { useState, useEffect, useMemo } from 'react'
import classNames from '@components/utils/classNames'
import { useUI } from '@components/ui/context'
import { useRouter } from 'next/router'
import { getProductFromAttributes } from '@components/utils/attributesGenerator'
import isString from 'lodash/isString'

import { matchStrings } from '@framework/utils/parse-util'
import SizeAttribute from '@old-components/product/ProductView/sizeAttribute.json'
import { EmptyObject } from '@components/utils/constants'

function RenderRadioOptions({
   items,
   itemsCount,
   selectedValue,
   selected,
   openRemainElems = false,
   handleToggleOpenRemainElems,
   sizeInit,
   setSizeInit,
   currentAttribute,
   getStockPerAttribute = () => {},
   fieldCode,
   product,
}: any) {
   const [showMoreSize, setShowMoreSize] = useState(true)
   items.sort((s1: any, s2: any) => {
      return s1.displayOrder - s2.displayOrder
   })
   // let defaultItems = items && items.length > 0 ? items.slice(0, itemsCount) : []
   // let remainingItems = items && items.length > 0 ? items.slice(itemsCount, items.length) : []
   let selectedVal: any = ''

   if (selected[1] && sizeInit === 'true') {
      selectedVal = selected[0] + selected[1]
   } else {
      if (sizeInit === 'true') {
         selectedVal = selected[0]
      }
   }

   useEffect(() => {
      if (items.length == 0) {
         setShowMoreSize(false)
      }
   }, [items])

   const isOutOfStock = useMemo(() => {
      return (product: any) => {
         return product?.currentStock < 1 && !product?.isPreOrderEnabled && !product?.sellWithoutInventory
      }
   }, [])

   return (
      <>
         <div className="flex flex-wrap items-center gap-1">
            {items?.map((item: any, idx: any) => {
               const stockPerAttribute = getStockPerAttribute(fieldCode, item?.fieldValue)
               return isString(item?.fieldValue) && (
                  <RadioGroup.Option
                     key={`radio-panel-${idx}-${item?.fieldValue}`}
                     value={item?.fieldValue}
                     title={item?.fieldLabel}
                     style={{ backgroundColor: item?.fieldValue?.includes('#') ? item?.fieldValue : '' }}
                     onClick={() => { setSizeInit('true') }}
                     className={({ active, checked }) => 
                        `
                           ${checked ? 'bg-white border-black border-2 text-black' : 'bg-white border-gray-300 text-gray-600'}
                           relative h-10 sm:h-11 attr-box rounded-2xl px-3 min-w-16 border flex items-center justify-center text-sm font-semibold select-none overflow-hidden z-0 cursor-pointer dark:border-slate-600 hover:bg-primary-700  dark:hover:bg-primary-700
                        `
                     }
                  >
                     {isOutOfStock(stockPerAttribute) && <div className="w-[1px] h-[55px] bg-[#0000004d] absolute -top-[9px] rotate-45" />}
                     <RadioGroup.Label as="p" className="m-auto font-semibold uppercase font-12">
                        {item?.fieldValue?.includes('#') ? '' : item?.fieldValue}
                     </RadioGroup.Label>
                  </RadioGroup.Option>
               )
            })}
         </div>
         <div className={classNames(sizeInit === 'error' ? '' : 'hidden', 'text-red-500 text-sm')}>Please select a Size</div>
      </>
   )
}

export default function SizeInline({
   componentIdx,
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
   isLastComponentIdx,
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

   const [productData, setProductData] = useState(
      getStockPerAttribute(fieldCode, currentAttribute)
   )

   const [isSizeChart, setSizeChart] = useState(false)
   const [enabled, setEnabled] = useState(false)
   const [isSizeChange, setSizeChange] = useState(false)
   const [validationState, SetvalidationState] = useState<any>(false)
   const [selected, setSelected] = useState({
      fieldValue: currentAttribute,
      stock: productData.currentStock,
      productId: productData.productId,
      stockCode: productData.stockCode,
   })

   useEffect(() => {
      SetvalidationState(true)
      const getStockPerAttrData = getStockPerAttribute(fieldCode, currentAttribute, product?.slug ?? product?.link)
      setProductData(getStockPerAttrData)
      setSelected({
         fieldValue: currentAttribute,
         stock: getStockPerAttrData.currentStock,
         productId: getStockPerAttrData.productId,
         stockCode: getStockPerAttrData.stockCode,
      })
      handleSetProductVariantInfo({ clothSize: currentAttribute })
      setSelectedAttrData({ ...(variant || EmptyObject), ...getStockPerAttrData });

      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [currentAttribute, product])

   useEffect(() => {
      const getStockPerAttrData = getStockPerAttribute(
         fieldCode,
         currentAttribute
      )
      setProductData(getStockPerAttrData)
      setSelected({
         fieldValue: currentAttribute,
         stock: getStockPerAttrData.currentStock,
         productId: getStockPerAttrData.productId,
         stockCode: getStockPerAttrData.stockCode,
      })

      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [productId])

   const isPreOrderEnabled = productData.isPreOrderEnabled

   const generateItemOption = (value: any, stock: number) => {
      if (stock <= 0 && !isPreOrderEnabled)
         return `${value.toUpperCase()} - Sold Out`
      if (stock <= 0 && isPreOrderEnabled) {
         return `${value.toUpperCase()} - PRE-ORDER`
      }
      if ((stock < 5 && stock > 0) || isPreOrderEnabled) {
         return `${value?.toUpperCase()} - ${stock} LEFT`
      } else {
         return `${value?.toUpperCase()} - ${stock} LEFT`
      }
      return value?.toUpperCase()
   }
   const handleChange = (item: any) => {
      return onChange(fieldCode, item?.fieldValue)
   }
   const handleChangeFromSizeChart = (size: any) => {
      return items.filter((i: any) => i.fieldValue === size)[0]
   }
   // const [selectedAttrData, setSelectedAttrData] = useState({
   //    productId: product.recordId,
   //    stockCode: product.stockCode,
   //    ...product,
   // });

   function setEnable() {
      setSizeChange(true)
      setEnabled(true)
   }
   function setDisabled() {
      setSizeChange(false)
      setEnabled(false)
   }

   const handleOnChange = (value: any) => {
      let selectedVariant = items?.find((o: any) => o?.fieldValue === value);
      const slug = selectedVariant?.slug || `products/${router.query?.slug}`;
      selectedVariant = getStockPerAttribute(fieldCode, value, slug)
      setSelected({ fieldValue: value, ...selectedVariant });
      setAttrCombination(fieldCode, value);
      // Don't remove other field values  
      setSelectedAttrData({ ...(variant || EmptyObject), ...selectedVariant });
      if (value?.stock === 0 && !isPreOrderEnabled) {
         openNotifyUser(selectedVariant.productId);
      }
      if (componentIdx === 0 || !isLastComponentIdx) {
         const data = selectedVariant?.variantAttributes?.find((attribute: any) => attribute.fieldCode === fieldCode);
         const selectedField = data?.fieldValues.find((field: any) => field.fieldValue === value && field.slug !== slug);
         return onChange(fieldCode, value, { slug: selectedField?.slug || slug });
      }
      return onChange(fieldCode, value);
   }

   const [openRemainElems, setOpenRemainElems] = useState(false)
   const handleToggleOpenRemainElems = () => { setOpenRemainElems(!openRemainElems) }

   return (
      <>
         <div className="flex items-center justify-between my-2" id="productSize">
            <h4 className="text-gray-700 capitalize font-14">
               {label}:
               <span className="pl-1 font-light text-gray-700 text-ms dark:text-gray-700"> {selected?.fieldValue} </span>
               <span className="pl-1 text-xs font-bold text-black sm:text-sm">
                  {product?.mappedCategories?.length > 0 && SizeAttribute?.sizes?.map((attr: any, aid: number) => (matchStrings(attr.name, product?.mappedCategories[0].categoryName, true) && (
                     <div className="inline-block" key={aid}>
                        {attr?.values?.map((fields: any, idx: number) => (
                           <div key={`size-attribute-${idx}`}>
                              {matchStrings(fields.FieldText, currentAttribute, true) && (
                                 <p>{fields.FieldText}{' ('}{fields.FieldValue}{')'}</p>
                              )}
                           </div>
                        ))}
                     </div>
                  )
                  ))}
               </span>
            </h4>
         </div>
         <RadioGroup value={selected?.fieldValue} onChange={handleOnChange} className="mt-2 dark:text-black">
            <div>
               {
                  <RenderRadioOptions
                     items={items}
                     itemsCount={[]}
                     currentAttribute={currentAttribute}
                     selected={selected}
                     openRemainElems={openRemainElems}
                     handleToggleOpenRemainElems={handleToggleOpenRemainElems}
                     sizeInit={sizeInit}
                     setSizeInit={setSizeInit}
                     getStockPerAttribute={getStockPerAttribute}
                     fieldCode={fieldCode}
                     product={product}
                  />
               }
            </div>
         </RadioGroup>
      </>
   )
}
