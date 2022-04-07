import { Fragment, useState, useEffect } from 'react'
import { Listbox, Transition, RadioGroup } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'
import classNames from '@components/utils/classNames'
import { useUI } from '@components/ui/context'
import { useRouter } from 'next/router'
import { getProductFromAttributes } from '@components/utils/attributesGenerator'

export default function Dropdown({
      items = [],
      onChange = () => { },
      label = '',
      fieldCode = '',
      currentAttribute = '',
      getStockPerAttribute,
      productId,
      setSelectedAttrData,
      setAttrCombination,
      isDisabled,
      product,
      variant,
}: any) {
      const { openNotifyUser, closeNotifyUser } = useUI()

      const router = useRouter()

      const slug = `products/${router.query.slug}`

      const [productData, setProductData] = useState(
            getStockPerAttribute(fieldCode, currentAttribute)
      )

      const [selected, setSelected] = useState({
            currentAttribute,
            stock: productData.currentStock,
            productId: productData.productId,
            stockCode: productData.stockCode,
      })

      useEffect(() => {
            const getStockPerAttrData = getStockPerAttribute(
                  fieldCode,
                  currentAttribute
            )
            setProductData(getStockPerAttrData)
            setSelected({
                  currentAttribute,
                  stock: getStockPerAttrData.currentStock,
                  productId: getStockPerAttrData.productId,
                  stockCode: getStockPerAttrData.stockCode,
            })
      }, [currentAttribute])

      useEffect(() => {
            const getStockPerAttrData = getStockPerAttribute(
                  fieldCode,
                  currentAttribute
            )
            setProductData(getStockPerAttrData)
            setSelected({
                  currentAttribute,
                  stock: getStockPerAttrData.currentStock,
                  productId: getStockPerAttrData.productId,
                  stockCode: getStockPerAttrData.stockCode,
            })
      }, [productId])

      const isPreOrderEnabled = productData.isPreOrderEnabled

      const generateItemOption = (value: any, stock: number) => {
            if (stock === 0 && !isPreOrderEnabled)
                  return `${value.toUpperCase()} - NOTIFY ME`
            if (stock === 0 && isPreOrderEnabled) {
                  return `${value.toUpperCase()} - PRE-ORDER`
            }
            if ((stock < 5 && stock > 0) || isPreOrderEnabled)
                  return `${value.toUpperCase()} - ONLY ${stock} LEFT`
            return value.toUpperCase()
      }

      const handleOnChange = (value: any) => {
            // const stockPerAttrValue = getStockPerAttribute(
            //   fieldCode,
            //   value.currentAttribute
            // )

            const stockPerAttrValue = getProductFromAttributes(
                  fieldCode,
                  value.currentAttribute,
                  variant,
                  product.variantProducts,
                  slug
            )
            setSelected({ ...value, ...stockPerAttrValue })
            setAttrCombination(fieldCode, value.currentAttribute)
            setSelectedAttrData(stockPerAttrValue)
            if (value.stock === 0 && !isPreOrderEnabled) {
                  openNotifyUser(stockPerAttrValue.productId)
            }
      }

      return (
            <>
                  <div className='flex flex-col max-w-4xl mx-auto align-center justify-center text-center item-center mt-4 sm:px-32' >
                        <label className='block font-semibold text-sm sr-only'>{label}</label>
                        <div className='flex flex-wrap justify-center justify-self-center'>
                              <RadioGroup value={selected.currentAttribute} onChange={handleOnChange} className="mt-2">
                                    <RadioGroup.Label className="sr-only">{label}</RadioGroup.Label>
                                    <div className="grid grid-cols-6 text-center gap-x-4 attribute-center justify-self-center flex item-center content-center">
                                          {items.map((item: any) => {
                                                const stockAmount = getStockPerAttribute(fieldCode, item.fieldValue).stock
                                                return (
                                                      <RadioGroup.Option
                                                            key={item.fieldValue}
                                                            value={{
                                                                  currentAttribute: item.fieldValue,
                                                                  stock: stockAmount,
                                                            }}
                                                            style={{ backgroundColor: item.fieldValue }}
                                                            className={({ active }) =>
                                                                  classNames(
                                                                        selected.currentAttribute == item.fieldValue ? 'bg-red-100' : 'text-gray-900',
                                                                        'cursor-default select-none relative h-12 w-12 align-center inline-block align-middle content-center justify-center font-semibold'
                                                                  )
                                                            }
                                                      >
                                                            {({ checked, active }) => (
                                                                  <>
                                                                        <div className="flex items-center content-center">
                                                                              <span className={classNames(checked ? 'font-semibold' : 'font-normal', 'ml-3 block truncate')}>
                                                                                    {item.fieldValue ? generateItemOption(item.fieldValue, stockAmount) : null}
                                                                              </span>
                                                                        </div>

                                                                        {checked ? (
                                                                              <span
                                                                                    className={classNames(
                                                                                          selected.currentAttribute == item.fieldValue ? 'bg-red-100' : 'text-indigo-600',
                                                                                          'absolute inset-y-0 right-0 flex items-center pr-4'
                                                                                    )}
                                                                              >
                                                                                    <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                                              </span>
                                                                        ) : null}
                                                                  </>
                                                            )}
                                                            <RadioGroup.Label className="h-12 w-12 block content-center align-center justify-center flex-col py-3">
                                                                  {item.fieldValue}
                                                            </RadioGroup.Label>
                                                      </RadioGroup.Option>
                                                )
                                          })}
                                    </div>
                              </RadioGroup>
                        </div>
                  </div>
            </>
      )
}
