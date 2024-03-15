import { useState } from 'react'
import { FC } from 'react'
import { useUI } from '@components/ui/context'
import { LoadingDots } from '@components/ui'
import BagIcon from '@new-components/BagIcon'
interface Props {
  className?: string
  title?: string
  action: any
  buttonType?: string
  type?: string
  colorScheme?: any
  disabled?: boolean
  validateAction?: any
  formId?: string
  size?: string
}

const DEFAULT_COLOR_SCHEME = {
  bgColor: 'bg-black',
  hoverBgColor: 'bg-gray-900',
  focusRingColor: 'ring-black',
}

const DefaultButton: FC<React.PropsWithChildren<Props>> = ({
  className = '',
  title = 'Add to bag',
  buttonType = 'cart',
  action = () => { },
  colorScheme = DEFAULT_COLOR_SCHEME,
  disabled = false,
  validateAction = null,
  formId = null,
  size = ""
}) => {
  const [isLoading, setIsLoading] = useState(false)

  const { openCart } = useUI()

  const handleAction = () => {
    setIsLoading(true)
    if (buttonType === 'cart') {
      if (validateAction) {
        validateAction().then((status: boolean) => {
          setIsLoading(false)
          if (status) {
            setIsLoading(true) // Set isLoading to true before performing action
            action().then(() => {
              setIsLoading(false)
              openCart()
            })
          }
        })
      } else {
        action()?.then(() => {
          setIsLoading(false)
          openCart()
        })
      }
    } else
      action()?.then(() => {
        setIsLoading(false)
      })
  }

  const { bgColor, hoverBgColor, focusRingColor } = colorScheme

  return formId ? (
    <button
      type="submit"
      form={formId}
      className={`xs:max-w-xs flex-1 ${bgColor} border border-transparent flex items-center justify-center hover:${hoverBgColor} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:${focusRingColor} sm:w-full ${className} btn btn-c btn-primary`}
      disabled={isLoading || disabled}
    >
      {isLoading ? <LoadingDots /> : title}
    </button>
  ) : (
    <button
      onClick={handleAction}
      type="button"
      className={`${bgColor} hover:${hoverBgColor} focus:${focusRingColor} ${className} ${size == "small" ? 'text-xs font-medium py-1 px-0 sm:py-1 sm:px-1' : 'ttnc-ButtonPrimary text-sm font-medium py-3 px-4 sm:py-3.5 sm:px-6 nc-Button'} sm:text-white gap-2 relative h-auto inline-flex items-center justify-center rounded-full transition-colors disabled:bg-opacity-90 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 text-slate-50 dark:text-slate-800 shadow-xl flex-1 flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-6000 dark:focus:ring-offset-0`}
      disabled={isLoading || disabled}
    >
      <BagIcon className={`hidden sm:inline-block mb-0.5 ${size == "small" ? ' w-4 h-4' : ' w-5 h-5'}`} /> {isLoading ? <LoadingDots /> : <span>{title}</span>}
    </button>
  )
}

export default DefaultButton
