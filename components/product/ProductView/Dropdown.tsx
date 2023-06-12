import { Fragment, useState, useEffect } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import cn from 'classnames'

import classNames from '@components/utils/classNames'
import { useUI } from '@components/ui/context'
import { useRouter } from 'next/router'
import { getProductFromAttributes } from '@components/utils/attributesGenerator'
import { Dialog, RadioGroup, Switch } from '@headlessui/react'
import { PRODUCTS_SLUG_PREFIX } from '@components/utils/constants'

const DEFAULT_OPTIONS_COUNT = 15

function renderRadioOptions(
  items: any,
  itemsCount: any,
  selectedValue: any,
  openRemainElems: boolean = false,
  handleToggleOpenRemainElems: any
) {
  let defaultItems = items && items.length > 0 ? items.slice(0, itemsCount) : []
  // console.log(defaultItems)
  let remainingItems =
    items && items.length > 0 ? items.slice(itemsCount, items.length) : []
  // console.log(remainingItems)

  return (
    <div className="flex items-center">
      {defaultItems.map((item: any, idx: any) => (
        <>
          <RadioGroup.Option
            key={idx}
            value={item.fieldValue}
            title={item.fieldLabel}
            style={{ backgroundColor: item.fieldValue }}
            className={cn(
              'pdp-color-swatch-item relative z-99 h-10 w-10 flex items-center justify-center cursor-pointer outline-none hover:border-gray-900',
              {
                'border border-gray-200': selectedValue !== item.fieldValue,
                'border border-gray-900': selectedValue === item.fieldValue,
              }
            )}
          >
            <RadioGroup.Label as="p" className="text-ms">
              {item.fieldValue}
            </RadioGroup.Label>
          </RadioGroup.Option>
        </>
      ))}

      {/* remaining elements as hidden at first */}
      {remainingItems.map((item: any, idx: any) => (
        <>
          <RadioGroup.Option
            key={idx}
            value={item.fieldValue}
            title={item.fieldLabel}
            style={{ backgroundColor: item.fieldValue }}
            className={cn(
              'pdp-color-swatch-item relative z-99 h-10 w-10 flex items-center justify-center cursor-pointer outline-none hover:border-gray-900',
              {
                'border border-gray-200': selectedValue !== item.fieldValue,
                'border border-gray-900': selectedValue === item.fieldValue,
                hidden: !openRemainElems,
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
          <p className="text-gray-900 text-ms">+{remainingItems.length}</p>
        </div>
      )}
    </div>
  )
}

export default function Dropdown({
  items = [],
  onChange = () => {},
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
  handleSetProductVariantInfo,
}: any) {
  const { openNotifyUser, closeNotifyUser } = useUI()

  const router = useRouter()

  const slug = `products/${router.query.slug}`

  const [sizeValue, setSizeValue] = useState<any>('')
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
    handleSetProductVariantInfo({ clothSize: currentAttribute })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    product?.customAttributes?.map((val: any) => {
      if (val.display === 'Size') {
        setSizeValue(val.valueText)
      }
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId])

  const isPreOrderEnabled = productData.isPreOrderEnabled

  const generateItemOption = (value: any, stock: number) => {
    if (stock <= 0 && !isPreOrderEnabled)
      return `${value.toUpperCase()} - NOTIFY ME`
    if (stock <= 0 && isPreOrderEnabled) {
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
      <div className="flex mt-4">
        <h3 className="text-gray-700 text-ms">{label} :</h3>
        <h3 className="pl-1 text-gray-500 text-ms">{sizeValue}</h3>
        {/* <h3 className='px-2' >{color}</h3>
      <div style={{ color: `${color}` }}></div> */}
      </div>
      <RadioGroup
        value=""
        onChange={handleOnChange}
        className="mt-2 dark:text-black"
      >
        {/* <RadioGroup.Label className="sr-only">{label}</RadioGroup.Label> */}
        <div className="dark:text-black">
          {renderRadioOptions(
            items,
            DEFAULT_OPTIONS_COUNT,
            currentAttribute,
            openRemainElems,
            handleToggleOpenRemainElems
          )}
        </div>
      </RadioGroup>
    </>
  )
}
