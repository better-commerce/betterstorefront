import { RadioGroup } from '@headlessui/react'
import cn from 'classnames'
import { useState, useEffect } from 'react'
import { PDP_SIZE_OPTIONS_COUNT } from '@components//utils/constants'
function renderRadioOptions(items: any, itemsCount: any, selectedValue: any, sizeInit: any, setSizeInit: any) {
  let defaultItems = items && items.length > 0 ? items.slice(0, itemsCount) : []
  let remainingItems = items && items.length > 0 ? items.slice(itemsCount, items.length) : []
  return (
    <div className="grid grid-cols-5 sm:grid-cols-7 gap-2 mt-2.5">
      {defaultItems.map((item: any, idx: any) => (
        <RadioGroup.Option key={idx} value={item.fieldValue} title={item.fieldLabel} onClick={() => { setSizeInit('false') }} style={{ backgroundColor: item.fieldValue }}
          className={cn(' pdp-color-swatch-item relative z-1 rounded-xl h-10 border border-gray-200 items-center justify-center cursor-pointer outline-none ring-gray-600 ring-inset-1 hover:ring-1', { 'ring-1 z-1': selectedValue === item.fieldValue, })} />
      ))}
      {remainingItems.map((item: any, idx: any) => (
        <RadioGroup.Option
          key={idx} value={item.fieldValue} title={item.fieldLabel} style={{ backgroundColor: item.fieldValue }}
          className={cn('relative rounded-2xl border flex items-center justify-center text-sm uppercase font-semibold select-none overflow-hidden z-0 cursor-pointer border-slate-300 dark:border-slate-600 hover:bg-primary-700 hover:text-black dark:hover:bg-neutral-700 pdp-color-swatch-item z-1 h-10 outline-none ring-gray-600 ring-inset-1 hover:ring-1', { 'ring-1 z-1': selectedValue === item.fieldValue, })}
        />
      ))}
    </div>
  )
}

export default function InlineList({ items = [], onChange = () => { }, label = "Color", fieldCode = 'global.colour', currentAttribute = 'black', generateLink = () => { }, handleSetProductVariantInfo = () => { }, sizeInit, setSizeInit, product, }: any) {
  const [colorName, setColorName] = useState<any>('')
  const [validation, setValidation] = useState<any>(false)
  const handleChange = (value: any) => {
    const fieldSet = items?.find((o: any) => o.fieldValue === value)
    return onChange(fieldCode, value, fieldSet)
  }

  useEffect(() => {
    const fieldSet = items?.find((o: any) => o.fieldValue === currentAttribute)
    handleSetProductVariantInfo({ colour: currentAttribute, fieldSet })
  }, [currentAttribute])

  useEffect(() => {
    product.customAttributes.map((val: any) => {
      setValidation(true)
      if (val.key === 'global.colour') {
        setColorName(val.value)
      }
    })
  }, [currentAttribute])

  return (
    <>
      <div className="flex flex-col justify-start gap-1 mt-2">
        <h4 className="text-gray-700 font-14">{label} :
          {validation && <span className='relative inline-block w-5 h-5 ml-1 rounded-full top-1' style={{ background: colorName }}></span>}
        </h4>
      </div>
      <RadioGroup onChange={handleChange} className="mt-2">
        {renderRadioOptions(items, PDP_SIZE_OPTIONS_COUNT, currentAttribute, sizeInit, setSizeInit)}
      </RadioGroup>
    </>
  )
}