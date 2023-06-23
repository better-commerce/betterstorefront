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
    <div className="flex items-center">
      {defaultItems.map((item: any, idx: any) => (
        <RadioGroup.Option
          key={idx}
          value={item.fieldValue}
          title={item.fieldLabel}
          onClick={() => {
            setSizeInit('false')
          }}
          style={{ backgroundColor: item.fieldValue }}
          className={cn(
            'pdp-color-swatch-item relative z-1 h-10 w-10 border border-gray-200 items-center justify-center cursor-pointer outline-none ring-gray-600 ring-offset-1 hover:ring-1',
            {
              'ring-1 z-1': selectedValue === item.fieldValue,
            }
          )}
        />
      ))}

      {/* remaining elements as hidden at first */}
      {remainingItems.map((item: any, idx: any) => (
        <RadioGroup.Option
          key={idx}
          value={item.fieldValue}
          title={item.fieldLabel}
          style={{ backgroundColor: item.fieldValue }}
          className={cn(
            'pdp-color-swatch-item relative z-1 h-10 w-10  border border-gray-200 items-center justify-center cursor-pointer outline-none ring-gray-600 ring-offset-1 hover:ring-1',
            {
              'ring-1 z-1': selectedValue === item.fieldValue,
              hidden: !openRemainElems,
            }
          )}
        />
      ))}

      {/* show less button */}
      {openRemainElems && (
        <button
          className="relative flex items-center justify-center h-10 px-1 bg-gray-300 z-1 hover:opacity-75 bg-nav"
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
        <h4 className="text-gray-700">{GENERAL_COLOUR} :</h4>
        {validation ? (
          <span className="pl-1 font-light text-gray-700 text-ms dark:text-gray-700">
            {colorName}
          </span>
        ) : (
          <span className="pl-1 text-sm font-bold text-gray-400">--</span>
        )}
        {/* <h3 className='px-2' >{color}</h3>
      <div style={{ color: `${color}` }}></div> */}
      </div>
      <RadioGroup onChange={handleChange} className="mt-2">
        {/* <RadioGroup.Label className="sr-only">{label}</RadioGroup.Label> */}
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

// import { RadioGroup } from '@headlessui/react'
// import classNames from '@components/utils/classNames'
// import Link from 'next/link'
// import { CHOOSE_A_COLOR } from '@components/utils/textVariables'
// import { CheckIcon } from '@heroicons/react/outline'
// export default function InlineList({
//   items = [],
//   onChange = () => { },
//   label = CHOOSE_A_COLOR,
//   fieldCode = '',
//   currentAttribute = '',
//   generateLink = () => { },
// }: any) {
//   const handleChange = (value: any) => {
//     return onChange(fieldCode, value)
//   }

//   return (
//     <>
//       <h3 className="pt-3 text-sm font-medium text-left text-gray-600 uppercase border-t border-gray-200 border-solid">{label}</h3>
//       <RadioGroup value={'ring-gray-700'} onChange={() => { }} className="mt-4">
//         <RadioGroup.Label className="sr-only">{label}</RadioGroup.Label>
//         <div className="flex items-center space-x-2 border lg-grid lg-grid-cols-8 border-grey-40">
//           {items.map((item: any, idx: any) => {
//             const path = generateLink(fieldCode, item.fieldValue)
//             return (
//               <RadioGroup.Option
//                 key={idx}
//                 value={item.fieldValue}
//                 style={{ backgroundColor: item.fieldValue }}
//                 className={({ active, checked }) =>
//                   classNames(
//                     currentAttribute == item.fieldValue ? 'border-black' : 'border-gray-400',
//                     '-m-0.5 relative p-0.5 border border-opacity-1 rounded-full flex items-center justify-center cursor-pointer focus:outline-none'
//                   )
//                 }
//               >
//                 <CheckIcon className={classNames(
//                   currentAttribute == item.fieldValue ? 'inline-block' : 'hidden',
//                   'w-5 h-5 text-black absolute'
//                 )}></CheckIcon>
//                 <RadioGroup.Label as="p" className="sr-only">
//                   {item.fieldName} {item.value}
//                 </RadioGroup.Label>
//                 <Link href={`/${path}`} passHref>
//                   <a
//                     aria-hidden="true"
//                     onClick={() => handleChange(item.fieldvalue)}
//                     className={classNames(
//                       item.fieldvalue,
//                       'h-6 w-6 rounded-full'
//                     )}>
//                   {/* <img src='/pngTemplate.jpg' className={"bg-transparent"} /> */}

//                   </a>

//                 </Link>
//               </RadioGroup.Option>
//             )
//           })}
//         </div>
//       </RadioGroup>
//     </>
//   )
// }
