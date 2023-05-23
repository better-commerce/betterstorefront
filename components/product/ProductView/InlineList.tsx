import { RadioGroup } from '@headlessui/react'
import cn from 'classnames'
import { GENERAL_COLOUR } from '@components/utils/textVariables'
import { useState, useEffect } from 'react'

const DEFAULT_OPTIONS_COUNT = 15
function renderRadioOptions(
  items: any,
  itemsCount: any,
  selectedValue: any,
  openRemainElems: boolean = false,
  handleToggleOpenRemainElems: any,
  sizeInit: any,
  setSizeInit: any,
) {

  let defaultItems = items && items.length > 0 ? items.slice(0, itemsCount) : []
  let remainingItems = items && items.length > 0 ? items.slice(itemsCount, items.length) : []

  return (
    <div className="flex items-center">
      {defaultItems.map((item: any, idx: any) => (
        <RadioGroup.Option
          key={idx}
          value={item.fieldValue}
          title={item.fieldLabel}
          onClick={() => { setSizeInit('false') }}
          style={{ backgroundColor: item.fieldValue }}
          className={cn(
            'pdp-color-swatch-item relative h-10 w-10 border border-gray-200 items-center justify-center cursor-pointer outline-none ring-gray-600 ring-offset-1 hover:ring-1',
            {
              'ring-1 z-9': selectedValue === item.fieldValue,
            }
          )}
        />
      ))}

      {remainingItems.map((item: any, idx: any) => (
        <RadioGroup.Option
          key={idx}
          value={item.fieldValue}
          title={item.fieldLabel}
          style={{ backgroundColor: item.fieldValue }}
          className={cn(
            'pdp-color-swatch-item relative h-10 w-10  border border-gray-200 items-center justify-center cursor-pointer outline-none ring-gray-600 ring-offset-1 hover:ring-1',
            { 'ring-1 z-9': selectedValue === item.fieldValue, hidden: !openRemainElems, }
          )}
        />
      ))}

      {openRemainElems && (
        <button className="relative flex items-center justify-center h-10 px-1 bg-gray-300 z-9 hover:opacity-75 bg-nav" onClick={() => handleToggleOpenRemainElems()}>
          <p className="text-gray-900 text-ms">{'<'}</p>
        </button>
      )}

      {remainingItems && remainingItems.length > 0 && !openRemainElems && (
        <div className="relative flex items-center justify-center w-10 h-10 transition duration-100 bg-gray-300 outline-none cursor-pointer z-99 hover:opacity-75 bg-nav" onClick={() => handleToggleOpenRemainElems()}>
          <p className="text-xs text-gray-900">More</p>
        </div>
      )}
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
  const [validation, setValidation] = useState<any>(false);
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
      setValidation(true);
      if (val.display === "Color") {
        setColorName(val.valueText)
      }
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAttribute])

  const [openRemainElems, setOpenRemainElems] = useState(false)

  const handleToggleOpenRemainElems = () => setOpenRemainElems(!openRemainElems)

  return (
    <>
      <div className="flex">
        <h3 className="text-lg font-semibold text-black">{GENERAL_COLOUR} :</h3>
        {validation ? <span className='pl-1 font-light text-gray-700 text-ms dark:text-gray-700'>{colorName}</span> : <span className='pl-1 text-sm font-bold text-gray-400'>--</span>}
      </div>
      <RadioGroup value='' onChange={handleChange} className="mt-2">
        <div>
          {renderRadioOptions(
            items,
            DEFAULT_OPTIONS_COUNT,
            currentAttribute,
            openRemainElems,
            handleToggleOpenRemainElems,
            sizeInit,
            setSizeInit,
          )}
        </div>
      </RadioGroup>
    </>
  )
}