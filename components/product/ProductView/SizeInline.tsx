import { RadioGroup } from '@headlessui/react'
import { useState, useEffect } from 'react'
import classNames from '@components/utils/classNames'
import { useUI } from '@components/ui/context'
import { useRouter } from 'next/router'
import { getProductFromAttributes } from '@components/utils/attributesGenerator'
import { groupBy, isString, round } from 'lodash'
import { matchStrings } from '@framework/utils/parse-util'
import SizeAttribute from '@components/product/ProductView/sizeAttribute.json'
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
}: any) {
   const [showMoreSize, setShowMoreSize] = useState(true)
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

   useEffect(() => {
      if (items.length == 0) {
         setShowMoreSize(false)
      }
   }, [items])

   return (
      <>
         <div className="grid grid-cols-5 sm:grid-cols-7 gap-2 mt-2.5">
            {items?.map((item: any, idx: any) => (isString(item?.fieldValue) && (
               <RadioGroup.Option
                  key={`radio-panel-${idx}-${item?.fieldValue}`}
                  value={item?.fieldValue}
                  title={item?.fieldLabel}
                  style={{ backgroundColor: item?.fieldValue?.includes('#') ? item?.fieldValue : '' }}
                  onClick={() => { setSizeInit('true') }}
                  className={`${(selected?.attributes ? selected?.attributes[1]?.fieldValue : currentAttribute) == item?.fieldValue ?
                     'bg-primary-500 text-white dark:text-white' :
                     'bg-white border-gray-300'} 
                     relative h-10 sm:h-11 rounded-2xl border flex items-center justify-center text-sm uppercase font-semibold select-none overflow-hidden z-0 cursor-pointer border-slate-300 dark:border-slate-600 hover:bg-primary-700 hover:text-black dark:hover:bg-neutral-700`}>
                  <RadioGroup.Label as="p" className="m-auto font-semibold uppercase font-12">
                     {item?.fieldValue?.includes('#') ? '' : item?.fieldValue}
                  </RadioGroup.Label>
               </RadioGroup.Option>
            )
            ))}
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

   const [isSizeChart, setSizeChart] = useState(false)
   const [enabled, setEnabled] = useState(false)
   const [isSizeChange, setSizeChange] = useState(false)
   const [validationState, SetvalidationState] = useState<any>(false)
   const [selected, setSelected] = useState({
      ...currentAttribute,
      stock: productData.currentStock,
      productId: productData.productId,
      stockCode: productData.stockCode,
   })

   useEffect(() => {
      SetvalidationState(true)
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

      // eslint-disable-next-line react-hooks/exhaustive-deps
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
      let slug = '';
      const selectedVariant = product?.variantProducts.find((variant: any) => {
         const matchingAttributes = variant?.attributes.filter((attr: any) => attr?.fieldCode === 'clothing.size' && attr?.fieldValue === value);
         return matchingAttributes?.length > 0;
      });

      slug = selectedVariant ? selectedVariant?.slug : `products/${router?.query?.slug}`;

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
      if (componentIdx === 0) {
         let data = stockPerAttrValue?.variantAttributes?.find((attribute: any) => attribute?.fieldCode === fieldCode)
         data = data?.fieldValues?.find((field: any) => field.fieldValue = value && field.slug !== slug)
         return onChange(fieldCode, value, { slug: data?.slug || slug })
      }
      return onChange(fieldCode, value)
   }

   const [openRemainElems, setOpenRemainElems] = useState(false)
   const handleToggleOpenRemainElems = () => { setOpenRemainElems(!openRemainElems) }

   return (
      <>
         <div className="flex items-center justify-between my-2" id="productSize">
            <h4 className="text-gray-700 font-14">
               {label}:
               {selected?.attributes ? (
                  <span className="pl-1 font-light text-gray-700 text-ms dark:text-gray-700">
                     {selected?.attributes[1]?.fieldValue}
                  </span>
               ) : (
                  <span className="pl-1 text-sm font-bold text-gray-400"></span>
               )}
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
         <RadioGroup value={selected} onChange={handleOnChange} className="mt-2 dark:text-black">
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
                  />
               }
            </div>
         </RadioGroup>
      </>
   )
}
