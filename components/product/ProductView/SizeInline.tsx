import { Dialog, RadioGroup, Switch } from '@headlessui/react'
import { Fragment, useState, useEffect } from 'react'
import { Transition } from '@headlessui/react'
import { useUI } from '@components/ui/context'
import { useRouter } from 'next/router'
import { getProductFromAttributes } from '@components/utils/attributesGenerator'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { groupBy, round } from 'lodash'
import { SIZE_CHART } from '@components/utils/textVariables'
import { PDP_SIZE_OPTIONS_COUNT } from '@components/utils/constants'
import { matchStrings } from '@framework/utils/parse-util'
import * as SizeAttribute from '@components/product/ProductView/sizeAttribute.json'
import classNames from '@components/utils/classNames'
import cn from 'classnames'
function RenderRadioOptions({ items, itemsCount, selectedValue, selected, openRemainElems = false, handleToggleOpenRemainElems, sizeInit, setSizeInit, }: any) {
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
         <div className="flex flex-wrap items-center gap-2">
            {items?.map((item: any, idx: any) => (
               <RadioGroup.Option key={idx} value={item.fieldValue} title={item.fieldLabel} style={{ backgroundColor: item.fieldValue }}
                  onClick={() => { setSizeInit('true') }} className={cn('/pdp-color-swatch-item /relative z-99 h-10 w-10 rounded border border-gray-300 flex text-black items-center justify-center cursor-pointer outline-none dark:text-black hover:border-gray-900',
                     { 'border border-gray-200': selectedVal !== item.fieldValue, 'border border-gray-900': selectedVal === item.fieldValue, }
                  )}>
                  <RadioGroup.Label as="p" className="m-auto uppercase text-ms">{item.fieldValue}</RadioGroup.Label>
               </RadioGroup.Option>
            ))}
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
   const [productData, setProductData] = useState(getStockPerAttribute(fieldCode, currentAttribute))
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
   function setEnable() {
      setSizeChange(true)
      setEnabled(true)
   }
   function setDisabled() {
      setSizeChange(false)
      setEnabled(false)
   }

   const sanitizeSize = (value: string) => {
      if (value) {
         return value?.toUpperCase().replaceAll('T', '').replaceAll('V', '')
      }
      return value
   }

   const saving = product?.listPrice?.raw?.withTax - product?.price?.raw?.withTax
   const discount = round((saving / product?.listPrice?.raw?.withTax) * 100, 0)
   let imageTagGroup: any = ''
   if (product?.images.length > 0) {
      imageTagGroup = groupBy(product?.images, 'tag')
   }

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

   const handleToggleOpenRemainElems = () => {
      setOpenRemainElems(!openRemainElems)
   }

   return (
      <>
         <div className="flex items-center justify-between my-3" id="productSize">
            <div>
               <h4 className="text-gray-700">
                  {label} :
                  {selected.attributes ? (
                     <span className="pl-1 font-light text-gray-700 text-ms dark:text-gray-700">
                        {selected.attributes[1].fieldValue}
                     </span>
                  ) : (
                     <span className="pl-1 text-sm font-bold text-gray-400"></span>
                  )}
                  <span className="pl-1 text-xs font-bold text-black sm:text-sm">
                     {product?.mappedCategories?.length > 0 &&
                        SizeAttribute?.sizes?.map((attr: any, aid: number) => (
                           <>
                              {matchStrings(
                                 attr.name,
                                 product?.mappedCategories[0].categoryName,
                                 true
                              ) && (
                                    <div className="inline-block" key={aid}>
                                       {attr?.values?.map((fields: any, idx: number) => (
                                          <div key={idx}>
                                             {matchStrings(
                                                fields.FieldText,
                                                currentAttribute,
                                                true
                                             ) && (
                                                   <p>
                                                      {fields.FieldText}
                                                      {' ('}
                                                      {fields.FieldValue}
                                                      {')'}
                                                   </p>
                                                )}
                                          </div>
                                       ))}
                                    </div>
                                 )}
                           </>
                        ))}
                  </span>
               </h4>
            </div>
            <div>
               <p
                  className="text-sm text-gray-700 cursor-pointer sm:text-ms"
                  onClick={() => setSizeChart(true)}
               >
                  {SIZE_CHART}
               </p>
            </div>
         </div>
         <RadioGroup onChange={handleOnChange} className="mt-2 dark:text-black">
            {/* <RadioGroup.Label className="sr-only">{label}</RadioGroup.Label> */}
            <div>
               {
                  <RenderRadioOptions
                     items={items}
                     itemsCount={PDP_SIZE_OPTIONS_COUNT}
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

         {/* QUICK VIEW PANEL FROM BOTTOM */}
         <Transition.Root show={isSizeChart} as={Fragment}>
            <Dialog
               as="div"
               open={isSizeChart}
               className="relative z-9999"
               onClose={() => setSizeChart(false)}
            >
               <div
                  id="overlay"
                  className="fixed inset-0 left-0 bg-black opacity-75"
               />
               <div className="fixed inset-0 overflow-hidden">
                  <div className="absolute inset-0 overflow-hidden">
                     <div className="fixed inset-y-0 right-0 flex max-w-full pointer-events-none">
                        <Transition.Child
                           as={Fragment}
                           enter="transform transition ease-in-out duration-500 sm:duration-400"
                           enterFrom="translate-x-full"
                           enterTo="translate-x-0"
                           leave="transform transition ease-in-out duration-500 sm:duration-400"
                           leaveFrom="translate-x-0"
                           leaveTo="translate-x-full"
                        >
                           <Dialog.Panel className="w-screen max-w-lg pointer-events-auto side-panel-lg">
                              <div className="relative z-50 flex flex-col h-full bg-white shadow-xl">
                                 <div className="px-0 py-3 sm:px-0">
                                    <div className="flex pb-2 border-b border-gray-200">
                                       <button
                                          type="button"
                                          className="mr-2 text-black bg-white rounded-md outline-none hover:text-gray-500"
                                          onClick={() => setSizeChart(false)}
                                       >
                                          <div className="inline-block px-6">
                                             <span className="sr-only">Close panel</span>
                                             <XMarkIcon
                                                className="relative w-6 h-6 text-zinc-600 -top-1"
                                                aria-hidden="true"
                                             />
                                          </div>
                                          <div className="inline-block p-1 text-left">
                                             <span className="flex-1 text-lg font-bold text-black">
                                                Size Chart
                                             </span>
                                             <span className="flex-1 block text-sm text-gray-500">
                                                {product.name}
                                             </span>
                                          </div>
                                       </button>
                                    </div>
                                 </div>
                                 {/* Main */}
                                 <div className="pt-4 overflow-y-auto sizeChart">
                                    {' '}
                                    <div className="inline-block p-2 text-sm text-left">
                                       <h2 className="mt-5 text-left text-black dark:text-black">
                                          Unisex Size Guide
                                       </h2>
                                       <p className="mt-2 text-left text-gray-700 dark:text-gray-700">
                                          WOMEN: This style has been designed for a REGULAR
                                          FIT aesthetic, however for a more fitted look we
                                          recommend to size down
                                       </p>
                                       <table className="w-full text-xs table-fixed">
                                          <thead className="mt-2">
                                             <tr>
                                                <th></th>
                                                <th></th>
                                                <th></th>
                                                <th></th>
                                                <th className="pt-8 pb-5 text-gray-700 dark:text-gray-700 ">
                                                   Women
                                                </th>
                                                <th></th>
                                                <th></th>
                                                <th></th>
                                             </tr>
                                          </thead>
                                          <tbody>
                                             <tr className="text-black dark:text-black">
                                                <td className="pl-2 text-white bg-black border-1"></td>
                                                <td>UK</td>
                                                <td>US</td>
                                                <td>EU</td>
                                                <td>IT</td>
                                                <td>
                                                   <p>Chest</p>
                                                   <p>(in cm)</p>
                                                </td>
                                                <td>
                                                   <p>Waist</p>
                                                   <p>(in cm)</p>
                                                </td>
                                                <td>
                                                   <p>Hip</p>
                                                   <p>(in cm)</p>
                                                </td>
                                             </tr>
                                             <tr className="text-black dark:text-black">
                                                <td className="pl-2 text-white bg-black border-1">
                                                   XXS
                                                </td>
                                                <td>4-6</td>
                                                <td>0-2</td>
                                                <td>32-34</td>
                                                <td>36-38</td>
                                                <td>76-80 </td>
                                                <td>59-63 </td>
                                                <td>84-88 </td>
                                             </tr>
                                             <tr className="text-black dark:text-black">
                                                <td className="pl-2 text-white bg-black border-1">
                                                   XS
                                                </td>
                                                <td>6-8</td>
                                                <td>2-4</td>
                                                <td>34-36</td>
                                                <td>38-40</td>
                                                <td>81-85 </td>
                                                <td>64-68 </td>
                                                <td>89-93 </td>
                                             </tr>
                                             <tr className="text-black dark:text-black">
                                                <td className="pl-2 text-white bg-black border-1">
                                                   S
                                                </td>
                                                <td>8-10</td>
                                                <td>4-6</td>
                                                <td>36-38</td>
                                                <td>40-42</td>
                                                <td>86-90 </td>
                                                <td>69-73 </td>
                                                <td>94-98 </td>
                                             </tr>
                                             <tr className="text-black dark:text-black">
                                                <td className="pl-2 text-white bg-black border-1">
                                                   M
                                                </td>
                                                <td>10-12</td>
                                                <td>6-8</td>
                                                <td>38-40</td>
                                                <td>42-44</td>
                                                <td>91-95 </td>
                                                <td>74-78 </td>
                                                <td>99-103 </td>
                                             </tr>
                                             <tr className="text-black dark:text-black">
                                                <td className="pl-2 text-white bg-black border-1">
                                                   L
                                                </td>
                                                <td>12-14</td>
                                                <td>8-10</td>
                                                <td>40-42</td>
                                                <td>44-46</td>
                                                <td>96-100 </td>
                                                <td>79-83 </td>
                                                <td>104-108 </td>
                                             </tr>
                                             <tr className="text-black dark:text-black">
                                                <td className="pl-2 text-white bg-black border-1">
                                                   XL
                                                </td>
                                                <td>14-16</td>
                                                <td>10-12</td>
                                                <td>42-44</td>
                                                <td>46-48</td>
                                                <td>101-105 </td>
                                                <td>84-88 </td>
                                                <td>109-113 </td>
                                             </tr>
                                             <tr className="text-black dark:text-black">
                                                <td className="pl-2 text-white bg-black border-1">
                                                   XXL
                                                </td>
                                                <td>16-18</td>
                                                <td>12-14</td>
                                                <td>44-46</td>
                                                <td>48-50</td>
                                                <td>106-110 </td>
                                                <td>89-93 </td>
                                                <td>114-118 </td>
                                             </tr>
                                          </tbody>
                                       </table>
                                       <table className="w-full text-xs table-fixed">
                                          <thead className="mt-2">
                                             <tr>
                                                <th></th>
                                                <th></th>
                                                <th></th>
                                                <th></th>
                                                <th className="pt-8 pb-5 text-gray-700 dark:text-gray-700">
                                                   Men
                                                </th>
                                                <th></th>
                                                <th></th>
                                                <th></th>
                                             </tr>
                                          </thead>
                                          <tbody>
                                             <tr className="text-black dark:text-black">
                                                <td className="pl-2 text-white bg-black border-1"></td>
                                                <td>UK</td>
                                                <td>US</td>
                                                <td>EU</td>
                                                <td>IT</td>
                                                <td>
                                                   <p>Chest</p>
                                                   <p>(in cm)</p>
                                                </td>
                                                <td>
                                                   <p>Waist</p>
                                                   <p>(in cm)</p>
                                                </td>
                                                <td>
                                                   <p>Hip</p>
                                                   <p>(in cm)</p>
                                                </td>
                                             </tr>
                                             <tr className="text-black dark:text-black">
                                                <td className="pl-2 text-white bg-black border-1">
                                                   XXS
                                                </td>
                                                <td>4-6</td>
                                                <td>0-2</td>
                                                <td>32-34</td>
                                                <td>36-38</td>
                                                <td>76-80 </td>
                                                <td>59-63 </td>
                                                <td>84-88 </td>
                                             </tr>
                                             <tr className="text-black dark:text-black">
                                                <td className="pl-2 text-white bg-black border-1">
                                                   XS
                                                </td>
                                                <td>6-8</td>
                                                <td>2-4</td>
                                                <td>34-36</td>
                                                <td>38-40</td>
                                                <td>81-85 </td>
                                                <td>64-68 </td>
                                                <td>89-93 </td>
                                             </tr>
                                             <tr className="text-black dark:text-black">
                                                <td className="pl-2 text-white bg-black border-1">
                                                   S
                                                </td>
                                                <td>8-10</td>
                                                <td>4-6</td>
                                                <td>36-38</td>
                                                <td>40-42</td>
                                                <td>86-90 </td>
                                                <td>69-73 </td>
                                                <td>94-98 </td>
                                             </tr>
                                             <tr className="text-black dark:text-black">
                                                <td className="pl-2 text-white bg-black border-1">
                                                   M
                                                </td>
                                                <td>10-12</td>
                                                <td>6-8</td>
                                                <td>38-40</td>
                                                <td>42-44</td>
                                                <td>91-95 </td>
                                                <td>74-78 </td>
                                                <td>99-103 </td>
                                             </tr>
                                             <tr className="text-black dark:text-black">
                                                <td className="pl-2 text-white bg-black border-1">
                                                   L
                                                </td>
                                                <td>12-14</td>
                                                <td>8-10</td>
                                                <td>40-42</td>
                                                <td>44-46</td>
                                                <td>96-100 </td>
                                                <td>79-83 </td>
                                                <td>104-108 </td>
                                             </tr>
                                             <tr className="text-black dark:text-black">
                                                <td className="pl-2 text-white bg-black border-1">
                                                   XL
                                                </td>
                                                <td>14-16</td>
                                                <td>10-12</td>
                                                <td>42-44</td>
                                                <td>46-48</td>
                                                <td>101-105 </td>
                                                <td>84-88 </td>
                                                <td>109-113 </td>
                                             </tr>
                                             <tr className="text-black dark:text-black">
                                                <td className="pl-2 text-white bg-black border-1">
                                                   XXL
                                                </td>
                                                <td>16-18</td>
                                                <td>12-14</td>
                                                <td>44-46</td>
                                                <td>48-50</td>
                                                <td>106-110 </td>
                                                <td>89-93 </td>
                                                <td>114-118 </td>
                                             </tr>
                                          </tbody>
                                       </table>
                                    </div>
                                 </div>
                              </div>
                           </Dialog.Panel>
                        </Transition.Child>
                     </div>
                  </div>
               </div>
            </Dialog>
         </Transition.Root>
      </>
   )
}
