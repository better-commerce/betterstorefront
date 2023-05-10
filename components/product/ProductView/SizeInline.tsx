import { Dialog, RadioGroup, Switch } from '@headlessui/react'
import { Fragment, useState, useEffect } from 'react'
import { Listbox, Transition } from '@headlessui/react'
// import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'
import classNames from '@components/utils/classNames'
import { useUI } from '@components/ui/context'
import { useRouter } from 'next/router'
import { getProductFromAttributes } from '@components/utils/attributesGenerator'
import Link from 'next/link'
import { HeartIcon, XMarkIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import axios from 'axios'
import { groupBy, round } from 'lodash'
import Button from '@components/ui/AddButton'
import {
  BTN_ADD_TO_FAVORITES,
  ADDED_TO_WISH,
  SIZE_CHART,
} from '@components/utils/textVariables'
import {
  NEXT_CREATE_WISHLIST,
  PRODUCTS_SLUG_PREFIX,
} from '@components/utils/constants'
import { matchStrings } from '@framework/utils/parse-util'
import SizeAttribute from '@components/product/ProductView/sizeAttribute.json'
import SIZECHART from '@components/product/ProductView/SizeChart.json'
//
import cn from 'classnames'

declare const window: any

const DEFAULT_OPTIONS_COUNT = 20

function renderRadioOptions(
  items: any,
  itemsCount: any,
  selectedValue: any,
  selected: any,
  openRemainElems: boolean = false,
  handleToggleOpenRemainElems: any,
  sizeInit: any,
  setSizeInit: any
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
          <>
            <RadioGroup.Option
              key={idx}
              value={item.fieldValue}
              title={item.fieldLabel}
              style={{ backgroundColor: item.fieldValue }}
              onClick={() => {
                setSizeInit('true')
              }}
              className={cn(
                'pdp-color-swatch-item relative z-99 h-10 w-10 border border-gray-200 flex text-black items-center justify-center cursor-pointer outline-none dark:text-black hover:border-gray-900',
                {
                  'border border-gray-200': selectedVal !== item.fieldValue,
                  'border border-gray-900': selectedVal === item.fieldValue,
                }
              )}
            >
              <RadioGroup.Label as="p" className="text-ms">
                {item.fieldValue}
              </RadioGroup.Label>
            </RadioGroup.Option>
          </>
        ))}

        {/* show less button */}
        {openRemainElems && (
          <button
            className="relative flex items-center justify-center h-10 px-1 bg-gray-300 z-99 hover:opacity-75 bg-nav"
            onClick={() => handleToggleOpenRemainElems()}
          >
            <p className="text-gray-900 text-ms">{'<'}</p>
          </button>
        )}

        {/* show more button */}
        {remainingItems && remainingItems.length > 0 && !openRemainElems && (
          <div
            className="relative flex items-center justify-center w-10 h-10 transition duration-100 bg-gray-300 outline-none cursor-pointer z-99 hover:opacity-75 bg-nav"
            onClick={() => handleToggleOpenRemainElems()}
          >
            <p className="text-xs text-gray-900">More</p>
          </div>
        )}
      </div>
      <div
        className={classNames(
          sizeInit === 'error' ? '' : 'hidden',
          'text-red-500 text-sm'
        )}
      >
        Please select a Size
      </div>
    </>
  )
}

export default function SizeInline({
  items = [],
  onChange = () => {},
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
  generateLink = () => {},
  callToAction = null,
  handleSetProductVariantInfo = () => {},
  sizeInit,
  setSizeInit,
}: any) {
  //   currentAttribute = product?.customAttributes?.find((x: any) =>
  //     matchStrings(x?.key, 'clothing.size', true)
  //   )?.valueText
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

  const sanitizeSize = (value: string) => {
    if (value) {
      return value?.toUpperCase().replaceAll('T', '').replaceAll('V', '')
    }
    return value
  }

  const addProdWithSize = async () => {
    // const item = await cartHandler().addToCart(
    //          {
    //             basketId: basketId,
    //             productId: selectedAttrData?.productId,
    //             qty: 1,
    //             manualUnitPrice: product?.price?.raw?.withTax,
    //             stockCode: selectedAttrData?.stockCode,
    //             userId: user?.userId,
    //             isAssociated: user?.isAssociated,
    //          },
    //          'ADD',
    //          { product: selectedAttrData }
    //       )
    //       setCartItems(item)
  }

  const saving = product?.listPrice?.raw?.withTax - product?.price?.raw?.withTax
  const discount = round((saving / product?.listPrice?.raw?.withTax) * 100, 0)
  let imageTagGroup: any = ''
  if (product?.images.length > 0) {
    imageTagGroup = groupBy(product?.images, 'tag')
  }

  let outerWearCategory = product?.mappedCategories?.find((x: any) =>
    matchStrings(x.categoryName, 'Outerwear', true)
  )
  let innerWearCategory = product?.mappedCategories?.find((x: any) =>
    matchStrings(x.categoryName, 'Innerwear', true)
  )

  const attrGroup = groupBy(product?.customAttributes, 'key')

  const handleOnChange = (value: any) => {
    // const stockPerAttrValue = getStockPerAttribute(
    //   fieldCode,
    //   value.currentAttribute
    // )

    const stockPerAttrValue = getProductFromAttributes(
      fieldCode,
      value,
      variant,
      product.variantProducts,
      slug
    )

    // const stockPerAttrValue = getProductFromAttributes(
    //   fieldCode,
    //   value.currentAttribute,
    //   variant,
    //   product.variantProducts,
    //   slug
    // )
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
        <div>
          <h3 className="text-gray-700 text-ms">
            {label} :
            {selected.attributes ? (
              <span className="text-gray-700 text-ms font-light dark:text-gray-700 pl-1">
                {selected.attributes[1].fieldValue}
              </span>
            ) : (
              <span className="text-gray-400 font-bold text-sm pl-1"> -- </span>
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
                      <>
                        <div className="inline-block" key={aid}>
                          {attr?.values?.map((fields: any, idx: number) => (
                            <>
                              <div key={idx}>
                                {matchStrings(
                                  fields.FieldText,
                                  currentAttribute,
                                  true
                                ) && (
                                  <>
                                    <p>
                                      {fields.FieldText}
                                      {' ('}
                                      {fields.FieldValue}
                                      {')'}
                                    </p>
                                  </>
                                )}
                              </div>
                            </>
                          ))}
                        </div>
                      </>
                    )}
                  </>
                ))}
            </span>
          </h3>
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
          {renderRadioOptions(
            items,
            DEFAULT_OPTIONS_COUNT,
            currentAttribute,
            selected,
            openRemainElems,
            handleToggleOpenRemainElems,
            sizeInit,
            setSizeInit
          )}
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
                                <td className='border border-slate-300 text-center'></td>
                                <td className='border border-slate-300 text-center'>UK</td>
                                <td className='border border-slate-300 text-center'>US</td>
                                <td className='border border-slate-300 text-center'>EU</td>
                                <td className='border border-slate-300 text-center'>IT</td>
                                <td className='border border-slate-300 text-center'>Chest (in cm)</td>
                                <td className='border border-slate-300 text-center'>Waist (in cm)</td>
                                <td className='border border-slate-300 text-center'>Hip (in cm)</td>
                              </tr>
                              {SIZECHART.women.map((data, index) => (
                                  <tr className="dark:text-black" key={index}>
                                  <td className="border border-slate-300 text-center text-white bg-black">{data.size}</td>
                                  <td className="border border-slate-300 text-center">{data.uk}</td>
                                  <td className="border border-slate-300 text-center">{data.us}</td>
                                  <td className="border border-slate-300 text-center">{data.eu}</td>
                                  <td className="border border-slate-300 text-center">{data.it}</td>
                                  <td className="border border-slate-300 text-center">{data.chest}</td>
                                  <td className="border border-slate-300 text-center">{data.waist}</td>
                                  <td className="border border-slate-300 text-center">{data.hip}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          <table className="w-full text-xs table-fixed">
                            <thead className="mt-2">
                              <tr>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th className="pt-8 pb-5 text-gray-700 dark:text-gray-700 ">
                                  Men
                                </th>
                                <th></th>
                                <th></th>
                                <th></th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="text-black dark:text-black">
                                <td className='border border-slate-300 text-center'></td>
                                <td className='border border-slate-300 text-center'>UK</td>
                                <td className='border border-slate-300 text-center'>US</td>
                                <td className='border border-slate-300 text-center'>EU</td>
                                <td className='border border-slate-300 text-center'>IT</td>
                                <td className='border border-slate-300 text-center'>Chest (in cm)</td>
                                <td className='border border-slate-300 text-center'>Waist (in cm)</td>
                                <td className='border border-slate-300 text-center'>Hip (in cm)</td>
                              </tr>
                              {SIZECHART.men.map((data, indexmen) => (
                                  <tr className="dark:text-black" key={indexmen}>
                                  <td className="border border-slate-300 text-center text-white bg-black">{data.size}</td>
                                  <td className="border border-slate-300 text-center">{data.uk}</td>
                                  <td className="border border-slate-300 text-center">{data.us}</td>
                                  <td className="border border-slate-300 text-center">{data.eu}</td>
                                  <td className="border border-slate-300 text-center">{data.it}</td>
                                  <td className="border border-slate-300 text-center">{data.chest}</td>
                                  <td className="border border-slate-300 text-center">{data.waist}</td>
                                  <td className="border border-slate-300 text-center">{data.hip}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                      {/*              {outerWearCategory?.categoryName == 'Outerwear' &&
                                       <>
                                          {SizeChart?.Outerwear.map((chart: any, chid: number) => (
                                             chart?.Images.map((image: any, iid: number) => (
                                                matchStrings(image?.name, product?.mappedCategories[0]?.categoryName, true) &&
                                                <>
                                                   <div className="flex flex-col px-4 sm:px-12 image-container" key={iid}>
                                                      <Image src={image?.imageURL} className="image" layout="fill" />
                                                   </div>
                                                </>
                                             ))
                                          ))}

                                          <div className="flex justify-between px-4 pb-3 mt-3 border-b border-gray-200 sm:px-12">
                                             <div className="mt-1 item-left">
                                                <h3 className="text-sm font-semibold text-black">Select a size to add to bag</h3>
                                             </div>
                                             {isSizeChange ? (<>
                                                <div className="item-right">
                                                   <Switch
                                                      checked={enabled}
                                                      onChange={() => setDisabled()}
                                                      className={`${enabled ? 'bg-white' : 'bg-white'} relative inline-flex switch-panel-parent transition-colors duration-200 dark:text-black ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75 switch-in-before`}
                                                   >
                                                      <span className="sr-only">Use setting</span>
                                                      <span
                                                         aria-hidden="true"
                                                         className={`${enabled ? 'translate-x-10' : 'translate-x-0'} switch-panel inline-block ring-0 transition duration-200 dark:text-black ease-in-out`}
                                                      > </span>
                                                   </Switch>
                                                </div>
                                             </>) : (<>
                                                <div className="item-right">
                                                   <Switch
                                                      checked={enabled}
                                                      onChange={() => setEnable()}
                                                      className={`${enabled ? 'bg-white' : 'bg-white'} relative inline-flex switch-panel-parent transition-colors duration-200 dark:text-black ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75 switch- -before`}
                                                   >
                                                      <span className="sr-only">Use setting</span>
                                                      <span
                                                         aria-hidden="true"
                                                         className={`${enabled ? 'translate-x-5 border-black' : 'translate-x-0'} switch-panel inline-block ring-0 transition dark:text-black duration-200 ease-in-out`}
                                                      >in</span>
                                                   </Switch>
                                                </div>
                                             </>)}

                                          </div>
                                          <div className="flex flex-col">
                                             <table className="w-full bg-white border-b border-gray-200">
                                                {(product?.mappedCategories[0]?.categoryName == 'Constant 500 Day Tshirts' ||
                                                   product?.mappedCategories[0]?.categoryName == 'Constant 500 Day All Degree Polo' ||
                                                   product?.mappedCategories[0]?.categoryName == 'Fluid Tees' ||
                                                   product?.mappedCategories[0]?.categoryName == 'Statement Popcorn Textured Casual Tees') &&
                                                   <thead>
                                                      <tr>
                                                         <th className="w-40 py-2 pl-10 text-sm font-medium text-left text-black border-b border-r border-gray-200 ">
                                                            <span>Size</span>
                                                         </th>
                                                         {!isSizeChange &&
                                                            <th className="py-2 text-sm font-medium text-black border-b border-gray-200">
                                                               <span className='block'>Chest</span>
                                                               <span className='block text-xs text-gray-400'>(inches)</span>
                                                            </th>
                                                         }
                                                         {isSizeChange &&
                                                            <th className="py-2 text-sm font-medium text-black border-b border-gray-200">
                                                               <span className='block'>Chest</span>
                                                               <span className='block text-xs text-gray-400'>(centimetres)</span>
                                                            </th>}
                                                         {!isSizeChange &&
                                                            <th className="py-2 text-sm font-medium text-black border-b border-gray-200">
                                                               <span className='block'>Front Length</span>
                                                               <span className='block text-xs text-gray-400'>(inches)</span>
                                                            </th>
                                                         }
                                                         {!isSizeChange &&
                                                            <th className="py-2 text-sm font-medium text-black border-b border-gray-200">
                                                               <span className='block'>Across Shoulder</span>
                                                               <span className='block text-xs text-gray-400'>(inches)</span>
                                                            </th>
                                                         }
                                                      </tr>
                                                   </thead>
                                                }
                                                {(product?.mappedCategories[0]?.categoryName == 'Constant 500 Day Chino Shorts' ||
                                                   product?.mappedCategories[0]?.categoryName == 'Better Basics French Terry Sweatshorts' ||
                                                   product?.mappedCategories[0]?.categoryName == 'Breeeze Ultra-Light Casual Lounge Shorts' ||
                                                   product?.mappedCategories[0]?.categoryName == 'Constant 500 Day Casual Shorts' ||
                                                   product?.mappedCategories[0]?.categoryName == 'Statement All-Day Joggers') &&
                                                   <thead>
                                                      <tr>
                                                         <th className="w-40 py-2 pl-10 text-sm font-medium text-left text-black border-b border-r border-gray-200">
                                                            <span>Size</span>
                                                         </th>
                                                         {!isSizeChange &&
                                                            <th className="py-2 text-sm font-medium text-black border-b border-gray-200">
                                                               <span className='block'>Waist</span>
                                                               <span className='block text-xs text-gray-400'>(inches)</span>
                                                            </th>}
                                                         {!isSizeChange &&
                                                            <th className="py-2 text-sm font-medium text-black border-b border-gray-200">
                                                               <span className='block'>Front Length</span>
                                                               <span className='block text-xs text-gray-400'>(inches)</span>
                                                            </th>}
                                                      </tr>
                                                   </thead>
                                                }
                                                {(product?.mappedCategories[0]?.categoryName == 'Constant 500 Day Ottoman Joggers' ||
                                                   product?.mappedCategories[0]?.categoryName == 'The Stretch Pyjama Pants' ||
                                                   product?.mappedCategories[0]?.categoryName == 'Shorts') &&
                                                   <thead>
                                                      <tr>
                                                         <th className="w-40 py-2 pl-10 text-sm font-medium text-left text-black border-b border-r border-gray-200">
                                                            <span>Size</span>
                                                         </th>
                                                         {!isSizeChange &&
                                                            <th className="py-2 text-sm font-medium text-black border-b border-gray-200">
                                                               <span className='block'>Waist</span>
                                                               <span className='block text-xs text-gray-400'>(inches)</span>
                                                            </th>
                                                         }
                                                         {isSizeChange &&
                                                            <th className="py-2 text-sm font-medium text-black border-b border-gray-200">
                                                               <span className='block'>Waist</span>
                                                               <span className='block text-xs text-gray-400'>(centimetres)</span>
                                                            </th>
                                                         }
                                                         {!isSizeChange &&
                                                            <th className="py-2 text-sm font-medium text-black border-b border-gray-200">
                                                               <span className='block'>Front Length</span>
                                                               <span className='block text-xs text-gray-400'>(inches)</span>
                                                            </th>
                                                         }
                                                      </tr>
                                                   </thead>
                                                }
                                                {(product?.mappedCategories[0]?.categoryName == 'Sweatshirts' ||
                                                   product?.mappedCategories[0]?.categoryName == 'Constant 500 Day Pullover Hoodies' ||
                                                   product?.mappedCategories[0]?.categoryName == 'Better Basics Regular Fit Sweatshirt' ||
                                                   product?.mappedCategories[0]?.categoryName == 'Statement All-Day Midweight Sweatshirts' ||
                                                   product?.mappedCategories[0]?.categoryName == 'Statement Printed Crew Tees' ||
                                                   product?.mappedCategories[0]?.categoryName == 'Better Basics Crew T Shirt') &&
                                                   <thead>
                                                      <tr>
                                                         <th className="w-40 py-2 pl-10 text-sm font-medium text-left text-black border-b border-r border-gray-200">
                                                            <span>Size</span>
                                                         </th>
                                                         {!isSizeChange &&
                                                            <th className="py-2 text-sm font-medium text-black border-b border-gray-200">
                                                               <span className='block'>Chest</span>
                                                               <span className='block text-xs text-gray-400'>(inches)</span>
                                                            </th>
                                                         }
                                                         {isSizeChange &&
                                                            <th className="py-2 text-sm font-medium text-black border-b border-gray-200">
                                                               <span className='block'>Chest</span>
                                                               <span className='block text-xs text-gray-400'>(centimetres)</span>
                                                            </th>
                                                         }
                                                         {!isSizeChange &&
                                                            <th className="py-2 text-sm font-medium text-black border-b border-gray-200">
                                                               <span className='block'>Front Length</span>
                                                               <span className='block text-xs text-gray-400'>(inches)</span>
                                                            </th>
                                                         }
                                                         {!isSizeChange &&
                                                            <th className="py-2 text-sm font-medium text-black border-b border-gray-200">
                                                               <span className='block'>Across Shoulder</span>
                                                               <span className='block text-xs text-gray-400'>(inches)</span>
                                                            </th>
                                                         }
                                                      </tr>
                                                   </thead>
                                                }
                                                <tbody>
                                                   {SizeChart?.Outerwear.map((chart: any, chid: number) => (
                                                      chart.Sizes.map((data: any, did: number) => {
                                                         return (
                                                            matchStrings(data.CategoryName, product?.mappedCategories[0].categoryName, true) &&
                                                               <>
                                                                  {(product?.mappedCategories[0]?.categoryName == 'Constant 500 Day Tshirts' ||
                                                                     product?.mappedCategories[0]?.categoryName == 'Constant 500 Day All Degree Polo' ||
                                                                     product?.mappedCategories[0]?.categoryName == 'Fluid Tees' ||
                                                                     product?.mappedCategories[0]?.categoryName == 'Statement Popcorn Textured Casual Tees') &&
                                                                     <tr key={did}>
                                                                        <td  align='left' className="py-3 pl-10 font-medium text-left text-black border-b border-r border-gray-200 text-md">
                                                                           <input onClick={() => handleChange(handleChangeFromSizeChart(data.Size))} type="radio" id={`size_${data.Size}`} className="bg-gray-100 border border-gray-200" value="S" name="size" />
                                                                           <label htmlFor={`size_${data.Size}`} className="relative pl-4 text-md">{data.Size}</label>
                                                                        </td>
                                                                        {!isSizeChange &&
                                                                           <td className="py-3 text-sm font-medium text-center text-black">
                                                                              <span>{data?.ChestInches}</span>
                                                                           </td>
                                                                        }
                                                                        {isSizeChange &&
                                                                           <td className="py-3 text-sm font-medium text-center text-black">
                                                                              <span>{data?.ChestCms}</span>
                                                                           </td>
                                                                        }
                                                                        {!isSizeChange &&
                                                                           <td className="py-3 text-sm font-medium text-center text-black">
                                                                              <span>{data?.FrontLengthInches}</span>
                                                                           </td>
                                                                        }
                                                                        {!isSizeChange &&
                                                                           <td className="py-3 text-sm font-medium text-center text-black">
                                                                              <span>{data?.AcrossShoulderInches}</span>
                                                                           </td>
                                                                        }
                                                                     </tr>
                                                                  }
                                                                  {(product?.mappedCategories[0]?.categoryName == 'Constant 500 Day Chino Shorts' ||
                                                                     product?.mappedCategories[0]?.categoryName == 'Better Basics French Terry Sweatshorts' ||
                                                                     product?.mappedCategories[0]?.categoryName == 'Breeeze Ultra-Light Casual Lounge Shorts' ||
                                                                     product?.mappedCategories[0]?.categoryName == 'Constant 500 Day Casual Shorts' ||
                                                                     product?.mappedCategories[0]?.categoryName == 'Statement All-Day Joggers') &&
                                                                     <tr key={did}>
                                                                        <td  align='left' className="py-3 pl-10 font-medium text-left text-black border-b border-r border-gray-200 text-md">
                                                                           <input onClick={() => handleChange(handleChangeFromSizeChart(data.Size))} type="radio" id={`size_${data.Size}`} className="bg-gray-100" value="S" name="size" />
                                                                           <label htmlFor={`size_${data.Size}`} className="relative pl-4 text-md">{data.Size}</label>
                                                                        </td>
                                                                        {!isSizeChange &&
                                                                           <td className="py-3 text-sm font-medium text-center text-black">
                                                                              <span>{data?.WaistInches}</span>
                                                                           </td>
                                                                        }
                                                                        {!isSizeChange &&
                                                                           <td className="py-3 text-sm font-medium text-center text-black">
                                                                              <span>{data?.FrontLengthInches}</span>
                                                                           </td>
                                                                        }
                                                                     </tr>
                                                                  }
                                                                  {(product?.mappedCategories[0]?.categoryName == 'Constant 500 Day Ottoman Joggers' ||
                                                                     product?.mappedCategories[0]?.categoryName == 'The Stretch Pyjama Pants' ||
                                                                     product?.mappedCategories[0]?.categoryName == 'Shorts') &&
                                                                     <tr key={did}>
                                                                        <td  align='left' className="py-3 pl-10 font-medium text-left text-black border-b border-r border-gray-200 text-md">
                                                                           <input onClick={() => handleChange(handleChangeFromSizeChart(data.Size))} type="radio" id={`size_${data.Size}`} className="bg-gray-100" value="S" name="size" />
                                                                           <label htmlFor={`size_${data.Size}`} className="relative pl-4 text-md">{data.Size}</label>
                                                                        </td>
                                                                        {!isSizeChange &&
                                                                           <td className="py-3 text-sm font-medium text-center text-black">
                                                                              <span>{data?.WaistInches}</span>
                                                                           </td>
                                                                        }
                                                                        {isSizeChange &&
                                                                           <td className="py-3 text-sm font-medium text-center text-black">
                                                                              <span>{data?.WaistCms}</span>
                                                                           </td>
                                                                        }
                                                                        {!isSizeChange &&
                                                                           <td className="py-3 text-sm font-medium text-center text-black">
                                                                              <span>{data?.FrontLengthInches}</span>
                                                                           </td>
                                                                        }
                                                                     </tr>
                                                                  }
                                                                  {(product?.mappedCategories[0]?.categoryName == 'Sweatshirts' ||
                                                                     product?.mappedCategories[0]?.categoryName == 'Constant 500 Day Pullover Hoodies' ||
                                                                     product?.mappedCategories[0]?.categoryName == 'Better Basics Regular Fit Sweatshirt' ||
                                                                     product?.mappedCategories[0]?.categoryName == 'Statement All-Day Midweight Sweatshirts' ||
                                                                     product?.mappedCategories[0]?.categoryName == 'Statement Printed Crew Tees' ||
                                                                     product?.mappedCategories[0]?.categoryName == 'Better Basics Crew T Shirt') &&
                                                                     <tr key={did}>
                                                                        <td  align='left' className="py-3 pl-10 font-medium text-left text-black border-b border-r border-gray-200 text-md">
                                                                           <input onClick={() => handleChange(handleChangeFromSizeChart(data.Size))} type="radio" id={`size_${data.Size}`} className="bg-gray-100" value="S" name="size" />
                                                                           <label htmlFor={`size_${data.Size}`} className="relative pl-4 text-md">{data.Size}</label>
                                                                        </td>
                                                                        {!isSizeChange &&
                                                                           <td className="py-3 text-sm font-medium text-center text-black">
                                                                              <span>{data?.ChestInches}</span>
                                                                           </td>}
                                                                        {isSizeChange &&
                                                                           <td className="py-3 text-sm font-medium text-center text-black">
                                                                              <span>{data?.ChestCms}</span>
                                                                           </td>}
                                                                        {!isSizeChange &&
                                                                           <td className="py-3 text-sm font-medium text-center text-black">
                                                                              <span>{data?.FrontLengthInches}</span>
                                                                           </td>}
                                                                        {!isSizeChange &&
                                                                           <td className="py-3 text-sm font-medium text-center text-black">
                                                                              <span>{data?.AcrossShoulderInches}</span>
                                                                           </td>
                                                                        }
                                                                     </tr>
                                                                  }
                                                               </>
                                                         )
                                                   })
                                                   ))}
                                                </tbody>
                                             </table>
                                          </div>
                                       </>
                                    }
                                    {innerWearCategory?.categoryName == 'Innerwear' &&
                                       <>
                                          {SizeChart?.Innerwear.map((chart: any, chid: number) => (
                                             chart?.Images.map((image: any, iid: number) => (
                                                matchStrings(image?.name, product?.mappedCategories[0]?.categoryName, true) &&
                                                <>
                                                   <div className="flex flex-col px-4 sm:px-12 image-container" key={iid}>
                                                      <Image src={image?.imageURL} className="image" layout="fill" />
                                                   </div>
                                                </>
                                             ))
                                          ))}
                                          <div className="flex justify-between px-4 pb-3 mt-3 border-b border-gray-200 sm:px-12">
                                             <div className="mt-1 item-left">
                                                <h3 className="text-sm font-semibold text-black">Select a size to add to bag</h3>
                                             </div>
                                             {isSizeChange ? (<>
                                                <div className="item-right">
                                                   <Switch
                                                      checked={enabled}
                                                      onChange={() => setDisabled()}
                                                      className={`${enabled ? 'bg-white' : 'bg-white'} relative dark:text-black inline-flex switch-panel-parent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75 switch-in-before`}
                                                   >
                                                      <span className="sr-only">Use setting</span>
                                                      <span
                                                         aria-hidden="true"
                                                         className={`${enabled ? 'translate-x-10' : 'translate-x-0'} switch-panel dark:text-black inline-block ring-0 transition duration-200 ease-in-out`}
                                                      > </span>
                                                   </Switch>
                                                </div>
                                             </>) : (<>
                                                <div className="item-right">
                                                   <Switch
                                                      checked={enabled}
                                                      onChange={() => setEnable()}
                                                      className={`${enabled ? 'bg-white' : 'bg-white'} relative inline-flex dark:text-black switch-panel-parent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75 switch- -before`}
                                                   >
                                                      <span className="sr-only">Use setting</span>
                                                      <span
                                                         aria-hidden="true"
                                                         className={`${enabled ? 'translate-x-5 border-black' : 'translate-x-0'} switch-panel dark:text-black inline-block ring-0 transition duration-200 ease-in-out`}
                                                      >in</span>
                                                   </Switch>
                                                </div>
                                             </>)}
                                          </div>
                                          <div className="flex flex-col">
                                             <table className="w-full bg-white border-b border-gray-200">
                                                {(product?.mappedCategories[0]?.categoryName == 'Boxer Brief' ||
                                                   product?.mappedCategories[0]?.categoryName == 'Deo Soft Trunk' ||
                                                   product?.mappedCategories[0]?.categoryName == 'Deo Soft Boxer Brief' ||
                                                   product?.mappedCategories[0]?.categoryName == 'Deo Soft Brief' ||
                                                   product?.mappedCategories[0]?.categoryName == 'Brief') &&
                                                   <thead>
                                                      <tr>
                                                         <th className="w-40 py-2 pl-10 text-sm font-medium text-left text-black border-b border-r border-gray-200">
                                                            <span>Size</span>
                                                         </th>
                                                         {!isSizeChange &&
                                                            <th className="py-2 text-sm font-medium text-black border-b border-gray-200">
                                                               <span className='block'>Waist</span>
                                                               <span className='block text-xs text-gray-400'>(inches)</span>
                                                            </th>}
                                                         {isSizeChange &&
                                                            <th className="py-2 text-sm font-medium text-black border-b border-gray-200">
                                                               <span className='block'>Waist</span>
                                                               <span className='block text-xs text-gray-400'>(centimetres)</span>
                                                            </th>
                                                         }
                                                      </tr>
                                                   </thead>
                                                }
                                                {(product?.mappedCategories[0]?.categoryName == "Breeeze Ultra-light Inner Boxers" ||
                                                   product?.mappedCategories[0]?.categoryName == "Breeeze Ultra-light Boxer Shorts") &&
                                                   <thead>
                                                      <tr>
                                                         <th className="w-40 py-2 pl-10 text-sm font-medium text-left text-black border-b border-r border-gray-200">
                                                            <span>Size</span>
                                                         </th>
                                                         {!isSizeChange &&
                                                            <th className="py-2 text-sm font-medium text-black border-b border-gray-200">
                                                               <span className='block'>Waist</span>
                                                               <span className='block text-xs text-gray-400'>(inches)</span>
                                                            </th>
                                                         }
                                                         {isSizeChange &&
                                                            <th className="py-2 text-sm font-medium text-black border-b border-gray-200">
                                                               <span className='block'>Waist</span>
                                                               <span className='block text-xs text-gray-400'>(centimetres)</span>
                                                            </th>
                                                         }
                                                         {!isSizeChange &&
                                                            <th className="py-2 text-sm font-medium text-black border-b border-gray-200">
                                                               <span className='block'>Length</span>
                                                               <span className='block text-xs text-gray-400'>(inches)</span>
                                                            </th>
                                                         }
                                                         {isSizeChange &&
                                                            <th className="py-2 text-sm font-medium text-black border-b border-gray-200">
                                                               <span className='block'>Length</span>
                                                               <span className='block text-xs text-gray-400'>(centimetres)</span>
                                                            </th>
                                                         }
                                                      </tr>
                                                   </thead>
                                                }
                                                {(product?.mappedCategories[0]?.categoryName == 'Neo Skin Bamboo Vest' ||
                                                   product?.mappedCategories[0]?.categoryName == 'Neo-Cotton Ribbed Vest') &&
                                                   <thead>
                                                      <tr>
                                                         <th className="w-40 py-2 pl-10 text-sm font-medium text-left text-black border-b border-r border-gray-200">
                                                            <span>Size</span>
                                                         </th>
                                                         {!isSizeChange &&
                                                            <th className="py-2 text-sm font-medium text-black border-b border-gray-200">
                                                               <span className='block'>Chest</span>
                                                               <span className='block text-xs text-gray-400'>(inches)</span>
                                                            </th>
                                                         }
                                                         {isSizeChange &&
                                                            <th className="py-2 text-sm font-medium text-black border-b border-gray-200">
                                                               <span className='block'>Chest</span>
                                                               <span className='block text-xs text-gray-400'>(centimetres)</span>
                                                            </th>
                                                         }
                                                         {!isSizeChange &&
                                                            <th className="py-2 text-sm font-medium text-black border-b border-gray-200">
                                                               <span className='block'>Length</span>
                                                               <span className='block text-xs text-gray-400'>(inches)</span>
                                                            </th>
                                                         }
                                                         {isSizeChange &&
                                                            <th className="py-2 text-sm font-medium text-black border-b border-gray-200">
                                                               <span className='block'>Length</span>
                                                               <span className='block text-xs text-gray-400'>(centimetres)</span>
                                                            </th>
                                                         }
                                                      </tr>
                                                   </thead>
                                                }
                                                {product?.mappedCategories[0]?.categoryName == 'Fluid Casual Tank Tops' &&
                                                   <thead>
                                                      <tr>
                                                         <th className="w-40 py-2 pl-10 text-sm font-medium text-left text-black border-b border-r border-gray-200">
                                                            <span>Size</span>
                                                         </th>
                                                         {!isSizeChange &&
                                                            <th className="py-2 text-sm font-medium text-black border-b border-gray-200">
                                                               <span className='block'>Chest</span>
                                                               <span className='block text-xs text-gray-400'>(inches)</span>
                                                            </th>
                                                         }
                                                         {isSizeChange &&
                                                            <th className="py-2 text-sm font-medium text-black border-b border-gray-200">
                                                               <span className='block'>Chest</span>
                                                               <span className='block text-xs text-gray-400'>(centimetres)</span>
                                                            </th>
                                                         }
                                                         {!isSizeChange &&
                                                            <th className="py-2 text-sm font-medium text-black border-b border-gray-200">
                                                               <span className='block'>Length</span>
                                                               <span className='block text-xs text-gray-400'>(inches)</span>
                                                            </th>
                                                         }
                                                         {!isSizeChange &&
                                                            <th className="py-2 text-sm font-medium text-black border-b border-gray-200">
                                                               <span className='block'>Across Shoulder</span>
                                                               <span className='block text-xs text-gray-400'>(inches)</span>
                                                            </th>
                                                         }
                                                      </tr>
                                                   </thead>
                                                }
                                                <tbody>
                                                   {SizeChart?.Innerwear.map((chart: any, chid: number) => (
                                                      chart.Sizes.map((data: any, did: number) => (
                                                         matchStrings(data.CategoryName, product?.mappedCategories[0].categoryName, true) &&
                                                         <>
                                                            {(product?.mappedCategories[0]?.categoryName == 'Boxer Brief' ||
                                                               product?.mappedCategories[0]?.categoryName == 'Deo Soft Trunk' ||
                                                               product?.mappedCategories[0]?.categoryName == 'Deo Soft Boxer Brief' ||
                                                               product?.mappedCategories[0]?.categoryName == 'Deo Soft Brief' ||
                                                               product?.mappedCategories[0]?.categoryName == 'Brief') &&
                                                               <tr key={did}>
                                                                  <td  align='left' className="py-3 pl-10 font-medium text-left text-black border-b border-r border-gray-200 text-md">
                                                                     <input onClick={() => handleChange(handleChangeFromSizeChart(data.Size))} type="radio" id={`size_${data.Size}`} className="bg-gray-100" value="S" name="size" />
                                                                     <label htmlFor={`size_${data.Size}`} className="relative pl-4 text-md">{data.Size}</label>
                                                                  </td>
                                                                  {!isSizeChange &&
                                                                     <td className="py-3 text-sm font-medium text-center text-black">
                                                                        <span>{data?.WaistInches}</span>
                                                                     </td>
                                                                  }
                                                                  {isSizeChange &&
                                                                     <td className="py-3 text-sm font-medium text-center text-black">
                                                                        <span>{data?.WaistCms}</span>
                                                                     </td>
                                                                  }
                                                               </tr>
                                                            }
                                                            {(product?.mappedCategories[0]?.categoryName == "Breeeze Ultra-light Inner Boxers" ||
                                                               product?.mappedCategories[0]?.categoryName == "Breeeze Ultra-light Boxer Shorts") &&
                                                               <tr key={did}>
                                                                  <td  align='left' className="py-3 pl-10 font-medium text-left text-black border-b border-r border-gray-200 text-md">
                                                                     <input onClick={() => handleChange(handleChangeFromSizeChart(data.Size))} type="radio" id={`size_${data.Size}`} className="bg-gray-100" value="S" name="size" />
                                                                     <label htmlFor={`size_${data.Size}`} className="relative pl-4 text-md">{data.Size}</label>
                                                                  </td>
                                                                  {!isSizeChange &&
                                                                     <td className="py-3 text-sm font-medium text-center text-black">
                                                                        <span>{data?.WaistInches}</span>
                                                                     </td>
                                                                  }
                                                                  {isSizeChange &&
                                                                     <td className="py-3 text-sm font-medium text-center text-black">
                                                                        <span>{data?.WaistCms}</span>
                                                                     </td>
                                                                  }
                                                                  {!isSizeChange &&
                                                                     <td className="py-3 text-sm font-medium text-center text-black">
                                                                        <span>{data?.LengthInches}</span>
                                                                     </td>
                                                                  }
                                                                  {isSizeChange &&
                                                                     <td className="py-3 text-sm font-medium text-center text-black">
                                                                        <span>{data?.LengthCms}</span>
                                                                     </td>
                                                                  }
                                                               </tr>
                                                            }
                                                            {(product?.mappedCategories[0]?.categoryName == 'Neo Skin Bamboo Vest' ||
                                                               product?.mappedCategories[0]?.categoryName == 'Neo-Cotton Ribbed Vest') &&
                                                               <tr key={did}>
                                                                  <td  align='left' className="py-3 pl-10 font-medium text-left text-black border-b border-r border-gray-200 text-md">
                                                                     <input onClick={() => handleChange(handleChangeFromSizeChart(data.Size))} type="radio" id={`size_${data.Size}`} className="bg-gray-100" value="S" name="size" />
                                                                     <label htmlFor={`size_${data.Size}`} className="relative pl-4 text-md">{data.Size}</label>
                                                                  </td>
                                                                  {!isSizeChange &&
                                                                     <td className="py-3 text-sm font-medium text-center text-black">
                                                                        <span>{data?.ChestInches}</span>
                                                                     </td>
                                                                  }
                                                                  {isSizeChange &&
                                                                     <td className="py-3 text-sm font-medium text-center text-black">
                                                                        <span>{data?.ChestCms}</span>
                                                                     </td>
                                                                  }
                                                                  {!isSizeChange &&
                                                                     <td className="py-3 text-sm font-medium text-center text-black">
                                                                        <span>{data?.LengthInches}</span>
                                                                     </td>
                                                                  }
                                                                  {isSizeChange &&
                                                                     <td className="py-3 text-sm font-medium text-center text-black">
                                                                        <span>{data?.LengthCms}</span>
                                                                     </td>
                                                                  }
                                                               </tr>
                                                            }
                                                            {product?.mappedCategories[0]?.categoryName == 'Fluid Casual Tank Tops' &&
                                                               <tr key={did}>
                                                                  <td  align='left' className="py-3 pl-10 font-medium text-left text-black border-b border-r border-gray-200 text-md">
                                                                     <input onClick={() => handleChange(handleChangeFromSizeChart(data.Size))} type="radio" id={`size_${data.Size}`} className="bg-gray-100" value="S" name="size" />
                                                                     <label htmlFor={`size_${data.Size}`} className="relative pl-4 text-md">{data.Size}</label>
                                                                  </td>
                                                                  {!isSizeChange &&
                                                                     <td className="py-3 text-sm font-medium text-center text-black">
                                                                        <span>{data?.ChestInches}</span>
                                                                     </td>
                                                                  }
                                                                  {isSizeChange &&
                                                                     <td className="py-3 text-sm font-medium text-center text-black">
                                                                        <span>{data?.ChestCms}</span>
                                                                     </td>
                                                                  }
                                                                  {!isSizeChange &&
                                                                     <td className="py-3 text-sm font-medium text-center text-black">
                                                                        <span>{data?.LengthInches}</span>
                                                                     </td>
                                                                  }
                                                                  {!isSizeChange &&
                                                                     <td className="py-3 text-sm font-medium text-center text-black">
                                                                        <span>{data?.AcrossShoulderInches}</span>
                                                                     </td>
                                                                  }
                                                               </tr>
                                                            }
                                                         </>
                                                      ))
                                                   ))}
                                                </tbody>
                                             </table>
                                          </div>
                                       </>
                                    }
                                    <div className='sticky bottom-0 z-10 flex flex-col w-full pt-2 pb-4 bg-white border-t border-gray-200'>
                                       <div className="flex justify-between px-4 pt-2 sm:pt-6 sm:px-12">
                                          <div className="item-left">
                                              <h3 className="text-xs font-medium text-black uppercase">{product.stockCode}</h3> 
                                             <div className="flex item-left">
                                                {attrGroup["clothing.size"]?.map((size: any, ldx: number) => (
                                                   <div key={ldx} className="flex justify-around text-brown-light text-12">
                                                      <span className="font-semibold uppercase">{size?.value}</span>
                                                   </div>
                                                ))}
                                                <span className="flex justify-around mx-1 text-brown-light text-12">{' '} • {' '}</span>
                                                {attrGroup["global.colour"]?.map((color: any, ldx: number) => (
                                                   <div key={ldx} className="flex justify-around w-32 truncate text-ellipsis sm:w-20 text-brown-light text-12">
                                                      {color?.fieldText}
                                                   </div>
                                                ))}
                                             </div>
                                          </div>
                                          <div className="item-right">
                                             <p className="font-semibold text-black text-14 sm:text-md">
                                                {selected.price?.formatted?.withTax}
                                                {selected.listPrice?.raw.tax > 0 ? (
                                                   <>
                                                      <span className="px-2 font-normal text-gray-500 line-through text-14">
                                                         {product.listPrice.formatted.withTax}

                                                      </span>
                                                      <span className='font-normal text-emerald-500 text-14'>{discount}% off</span>
                                                   </>
                                                ) : null}
                                             </p>
                                          </div>
                                       </div>
                                       {/* <div className="flex px-4 mt-2 sm:px-12">
                                          <button
                                             type="button"
                                             className="flex items-center justify-center px-4 py-3 -mr-0.5 text-black bg-white border-2 border-black rounded-sm hover:bg-gray-800 hover:text-whitesm:px-6 hover:border-gray-900"
                                          >
                                             <HeartIcon className="flex-shrink-0 w-6 h-6" />
                                             <span className="sr-only">{BTN_ADD_TO_FAVORITES}</span>
                                          </button>
                                          <Button
                                             title={"callToAction.title"}
                                             action={"callToAction.action"}
                                             buttonType={"callToAction.type" || 'cart'}
                                          />
                                       </div> 
                                    </div>
                                 </div> */}
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
