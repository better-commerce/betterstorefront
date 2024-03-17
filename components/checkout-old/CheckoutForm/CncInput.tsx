import { useState } from 'react'
import Button from '@components/ui/IndigoButton'
import {
  ENTER_POSTCODE,
} from '@components/utils/textVariables'
import { useTranslation } from '@commerce/utils/use-translation'

export default function CncInput({
  handleSubmit,
  placeholder = ENTER_POSTCODE,
}: any) {
  const [value, setValue] = useState('')
  const translate = useTranslation()
  const handleChange = (e: any) => setValue(e.target.value)

  return (
    <div className="flex justify-center py-2 items-center">
      <input
        name={'post-code'}
        placeholder={placeholder}
        onChange={handleChange}
        value={value}
        className="mb-2 mt-2 appearance-none min-w-0 w-full bg-white border border-gray-300 rounded-sm shadow-sm py-3 px-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 "
      />

      <Button
        action={async () => await handleSubmit(value)}
        type="button"
        title={translate('common.label.applyText')}
        className={`max-w-xs flex-1 ml-5 bg-black border border-transparent rounded-sm py-2 px-4 flex items-center justify-center font-medium text-white hover:bg-gray-900 uppercase focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-black sm:w-full`}
      />
    </div>
  )
}
