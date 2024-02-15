import { RadioGroup } from '@headlessui/react'
import cn from 'classnames'
import { GENERAL_COLOUR } from '@components/utils/textVariables'
import { useState, useEffect } from 'react'
import { PDP_SIZE_OPTIONS_COUNT } from '@components/utils/constants'

function renderRadioOptions(
  items: any,
  itemsCount: any,
  selectedValue: any,
  sizeInit: any,
  setSizeInit: any
) {
  let defaultItems = items && items.length > 0 ? items.slice(0, itemsCount) : []
  let remainingItems = items && items.length > 0 ? items.slice(itemsCount, items.length) : []

  return (
    <div className="flex items-center gap-1">
      {defaultItems.map((item: any, idx: any) => (
        <RadioGroup.Option key={idx} value={item.fieldValue} title={item.fieldLabel} onClick={() => { setSizeInit('false') }} style={{ backgroundColor: item.fieldValue }}
          className={cn('pdp-color-swatch-item relative z-1 h-8 w-8 rounded-sm border border-gray-200 items-center justify-center cursor-pointer outline-none ring-gray-600 ring-inset-1 hover:ring-1', { 'ring-1 z-1': selectedValue === item.fieldValue, })} />
      ))}

      {remainingItems.map((item: any, idx: any) => (
        <RadioGroup.Option
          key={idx}
          value={item.fieldValue}
          title={item.fieldLabel}
          style={{ backgroundColor: item.fieldValue }}
          className={cn(
            'pdp-color-swatch-item relative z-1 h-10 w-10  border border-gray-200 items-center justify-center cursor-pointer outline-none ring-gray-600 ring-inset-1 hover:ring-1',
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
  onChange = () => { },
  label = GENERAL_COLOUR,
  fieldCode = 'global.colour',
  currentAttribute = 'black',
  generateLink = () => { },
  handleSetProductVariantInfo = () => { },
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
        setColorName(val.value)
      }
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAttribute])

  return (
    <>
      <div className="flex flex-col justify-start gap-1 mt-2">
        <h4 className="text-gray-700 font-14">{label} :
          {validation ? (
            <span className='relative inline-block w-5 h-5 ml-1 rounded-full top-1' style={{ background: colorName }}></span>
          ) : (
            <></>
          )}
        </h4>
      </div>
      <RadioGroup onChange={handleChange} className="mt-2">
        <div>
          {renderRadioOptions(items, PDP_SIZE_OPTIONS_COUNT, currentAttribute,sizeInit, setSizeInit)}
        </div>
      </RadioGroup>
    </>
  )
}