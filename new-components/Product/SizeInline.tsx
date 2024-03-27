import { RadioGroup } from '@headlessui/react'
import { useState, useEffect } from 'react'
import { isString } from 'lodash'
import { useRouter } from 'next/router'
import classNames from '@new-components/utils/classNames'
import { useUI } from '@new-components/ui/context'
import { getProductFromAttributes } from '@new-components/utils/attributesGenerator'
import { matchStrings } from '@framework/utils/parse-util'
import { useTranslation } from '@commerce/utils/use-translation'
function RenderRadioOptions({ items, itemsCount, selectedValue, selected, openRemainElems = false, handleToggleOpenRemainElems, sizeInit, setSizeInit, currentAttribute, }: any) {
   const translate = useTranslation()
   items.sort((s1: any, s2: any) => { return s1.displayOrder - s2.displayOrder })
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
         <div className="grid grid-cols-5 sm:grid-cols-7 gap-2 mt-2.5">
            {items?.map((item: any, idx: any) => (isString(item?.fieldValue) && (
               <RadioGroup.Option
                  key={`radio-panel-${idx}-${item?.fieldValue}`} value={item?.fieldValue} title={item?.fieldLabel} style={{ backgroundColor: item?.fieldValue?.includes('#') ? item?.fieldValue : '' }}
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
         <div className={classNames(sizeInit === 'error' ? '' : 'hidden', 'text-red-500 text-sm')}>{translate('label.product.selectSizeText')}</div>
      </>
   )
}

export default function SizeInline({ componentIdx, items = [], onChange = () => { }, label = '', fieldCode = '', currentAttribute = '', getStockPerAttribute, setSelectedAttrData, productId, setAttrCombination, isDisabled, product, variant, generateLink = () => { }, callToAction = null, handleSetProductVariantInfo = () => { }, sizeInit, setSizeInit, }: any) {
   const { openNotifyUser } = useUI()
   const router = useRouter()
   const [productData, setProductData] = useState(getStockPerAttribute(fieldCode, currentAttribute))
   const [validationState, SetValidationState] = useState<any>(false)
   const [selected, setSelected] = useState({ ...currentAttribute, stock: productData.currentStock, productId: productData.productId, stockCode: productData.stockCode, })

   useEffect(() => {
      SetValidationState(true)
      const getStockPerAttrData = getStockPerAttribute(fieldCode, currentAttribute)
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
      const getStockPerAttrData = getStockPerAttribute(fieldCode, currentAttribute)
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
      let slug = '';
      const selectedVariant = product?.variantProducts.find((variant: any) => {
         const matchingAttributes = variant?.attributes.filter((attr: any) => attr?.fieldCode === 'clothing.size' && attr?.fieldValue === value);
         return matchingAttributes?.length > 0;
      });
      slug = selectedVariant ? selectedVariant?.slug : `products/${router?.query?.slug}`;
      const stockPerAttrValue = getProductFromAttributes(fieldCode, value, variant, product.variantProducts, slug)
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
         
         <RadioGroup value={selected} onChange={handleOnChange} className="mt-2 dark:text-black">
            {<RenderRadioOptions items={items} itemsCount={[]} currentAttribute={currentAttribute} selected={selected} openRemainElems={openRemainElems} handleToggleOpenRemainElems={handleToggleOpenRemainElems} sizeInit={sizeInit} setSizeInit={setSizeInit} />}
         </RadioGroup>
      </>
   )
}