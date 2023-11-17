import { RadioGroup } from '@headlessui/react'
import cn from 'classnames'
import classNames from '@components/utils/classNames'
// import Link from 'next/link'
import { CHOOSE_A_COLOR, GENERAL_COLOUR } from '@components/utils/textVariables'
import { useState, useEffect } from 'react'
import { PDP_SIZE_OPTIONS_COUNT } from '@components/utils/constants'

function renderRadioOptions(
  items: any,
  itemsCount: any,
  selectedValue: any,
  openRemainElems: boolean = false,
  handleToggleOpenRemainElems: any,
  sizeInit: any,
  setSizeInit: any
) {
  let defaultItems = items && items.length > 0 ? items.slice(0, itemsCount) : []
  let remainingItems =
    items && items.length > 0 ? items.slice(itemsCount, items.length) : []

  return (
    <div className="flex items-center gap-2">
      {items?.map((item: any, idx: any) => (
        <RadioGroup.Option
          key={idx}
          value={item.fieldValue}
          title={item.fieldLabel}
          onClick={() => {
            setSizeInit('false')
          }}
          style={{ backgroundColor: item.fieldValue }}
          className={cn(
            'pdp-color-swatch-item relative z-1 h-8 w-8 rounded border border-gray-200 items-center justify-center cursor-pointer outline-none ring-gray-600 ring-offset-1 hover:ring-1',
            {
              'ring-1 z-1': selectedValue === item.fieldValue,
            }
          )}
        />
      ))}
    </div>
  )
}

export default function InlineList({
  items = [],
  onChange = () => {},
  label = GENERAL_COLOUR,
  fieldCode = 'global.colour',
  currentAttribute = 'black',
  generateLink = () => {},
  handleSetProductVariantInfo = () => {},
  sizeInit,
  setSizeInit,
  product,
}: any) {
  const [color, setColor] = useState(null) // to display color in the Page
  const [colorName, setColorName] = useState<any>('')
  const [validation, setValidation] = useState<any>(false)
  const handleChange = (value: any) => {
    const fieldSet = items?.find((o: any) => o.fieldValue === value)
    setColor(value)
    return onChange(fieldCode, value, fieldSet)
  }

  useEffect(() => {
    const fieldSet = items?.find((o: any) => o.fieldValue === currentAttribute)
    handleSetProductVariantInfo({ colour: currentAttribute, fieldSet })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAttribute])

  useEffect(() => {
    product.customAttributes.map((val: any) => {
      setValidation(true)
      if (val.key === 'global.colour') {
        setColorName(val.valueText)
      }
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAttribute])

  const [openRemainElems, setOpenRemainElems] = useState(false)

  const handleToggleOpenRemainElems = () => setOpenRemainElems(!openRemainElems)

  return (
    <>
      <div className="flex items-center">
        <h4 className="mt-0 text-gray-700">{GENERAL_COLOUR} :</h4>
        {validation ? (
          <span className="pl-1 font-bold text-gray-700 text-ms dark:text-gray-700">
            {colorName}
          </span>
        ) : (
          <span className="pl-1 text-sm font-bold text-gray-400">--</span>
        )}
      </div>
      <RadioGroup onChange={handleChange} className="mt-2">
        <div>
          {renderRadioOptions(
            items,
            PDP_SIZE_OPTIONS_COUNT,
            currentAttribute,
            openRemainElems,
            handleToggleOpenRemainElems,
            sizeInit,
            setSizeInit
          )}
        </div>
      </RadioGroup>
    </>
  )
}