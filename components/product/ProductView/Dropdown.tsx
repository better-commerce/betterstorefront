import { Fragment, useState, useEffect } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'
import classNames from '@components/utils/classNames'
import { useUI } from '@components/ui/context'

export default function Dropdown({
  items = [],
  onChange = () => {},
  label = 'Choose a color',
  fieldCode = 'global.colour',
  currentAttribute = 'S',
  getStockPerAttribute,
  productId,
  setSelectedAttrData,
}: any) {
  const { openNotifyUser, closeNotifyUser } = useUI()

  const [productData, setProductData] = useState(
    getStockPerAttribute(fieldCode, currentAttribute)
  )

  const [selected, setSelected] = useState({
    currentAttribute,
    stock: productData.stock,
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
      stock: getStockPerAttrData.stock,
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
    const stockPerAttrValue = getStockPerAttribute(
      fieldCode,
      value.currentAttribute
    )
    setSelected({ ...value, ...stockPerAttrValue })
    setSelectedAttrData({
      productId: stockPerAttrValue.productId,
      stockCode: stockPerAttrValue.stockCode,
    })
    if (value.stock === 0 && !isPreOrderEnabled) {
      openNotifyUser(stockPerAttrValue.productId)
    }
  }

  return (
    <Listbox value={selected} onChange={handleOnChange}>
      <Listbox.Label className="block text-sm font-medium text-gray-700">
        {label}
      </Listbox.Label>
      <div className="mt-1 relative">
        <Listbox.Button className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
          <span className="flex items-center">
            <span className="text-gray-700 ml-3 block truncate">
              {generateItemOption(selected.currentAttribute, selected.stock)}
            </span>
          </span>
          <span className="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <SelectorIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </span>
        </Listbox.Button>

        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-56 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
            {items.map((item: any) => {
              const stockAmount = getStockPerAttribute(
                fieldCode,
                item.fieldValue
              ).stock
              return (
                <Listbox.Option
                  key={item.fieldValue}
                  className={({ active }) =>
                    classNames(
                      active ? 'text-white bg-indigo-600' : 'text-gray-900',
                      'cursor-default select-none relative py-2 pl-3 pr-9'
                    )
                  }
                  value={{
                    currentAttribute: item.fieldValue,
                    stock: stockAmount,
                  }}
                >
                  {({ selected, active }) => (
                    <>
                      <div className="flex items-center">
                        <span
                          className={classNames(
                            selected ? 'font-semibold' : 'font-normal',
                            'ml-3 block truncate'
                          )}
                        >
                          {generateItemOption(item.fieldValue, stockAmount)}
                        </span>
                      </div>

                      {selected ? (
                        <span
                          className={classNames(
                            active ? 'text-white' : 'text-indigo-600',
                            'absolute inset-y-0 right-0 flex items-center pr-4'
                          )}
                        >
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              )
            })}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  )
}
