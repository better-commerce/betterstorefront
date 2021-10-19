import { RadioGroup } from '@headlessui/react'
import classNames from '@components/utils/classNames'

export default function InlineList({
  items = [],
  onChange = () => {},
  label = 'Choose a color',
  fieldCode = 'global.colour',
  currentAttribute = 'black',
}: any) {
  const handleChange = (value: any) => {
    return onChange(fieldCode, value)
  }
  return (
    <>
      <h3 className="text-sm text-gray-600">{label}</h3>
      <RadioGroup
        value={'ring-gray-700'}
        onChange={handleChange}
        className="mt-2"
      >
        <RadioGroup.Label className="sr-only">{label}</RadioGroup.Label>
        <div className="flex items-center space-x-3">
          {items.map((item: any, idx: any) => {
            return (
              <RadioGroup.Option
                key={idx}
                value={item.fieldValue}
                style={{ backgroundColor: item.fieldValue }}
                className={({ active, checked }) =>
                  classNames(
                    active && checked ? 'ring ring-offset-1' : '',
                    !active && checked ? 'ring-2' : '',
                    '-m-0.5 relative p-0.5 rounded-full flex items-center justify-center cursor-pointer focus:outline-none'
                  )
                }
              >
                <RadioGroup.Label as="p" className="sr-only">
                  {item.fieldName}
                </RadioGroup.Label>
                <span
                  aria-hidden="true"
                  className={classNames(
                    item.fieldvalue,
                    'h-8 w-8 border border-black border-opacity-10 rounded-full'
                  )}
                />
              </RadioGroup.Option>
            )
          })}
        </div>
      </RadioGroup>
    </>
  )
}
