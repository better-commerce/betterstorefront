import { FC } from 'react'
import { useUI } from '@components/ui/context'
import { useState } from 'react'
import { LoadingDots } from '@components/ui'
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
  action = () => {},
  colorScheme = DEFAULT_COLOR_SCHEME,
  disabled = false,
  validateAction = null,
  formId = null,
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
      className={`xs:max-w-xs flex-1 ${bgColor} border border-transparent rounded-sm uppercase lg:py-2 py-3 sm:px-4 px-1 flex items-center justify-center font-medium text-white hover:${hoverBgColor} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:${focusRingColor} sm:w-full ${className} btn-c btn-primary`}
      disabled={disabled}
    >
      {isLoading ? <LoadingDots /> : title}
    </button>
  ) : (
    <button
      onClick={handleAction}
      type="button"
      className={`xs:max-w-xs flex-1 ${bgColor} border border-transparent rounded-sm uppercase lg:py-2 py-3 sm:px-4 px-1 flex items-center justify-center font-medium text-white hover:${hoverBgColor} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:${focusRingColor} sm:w-full ${className} btn-c btn-primary`}
      disabled={disabled}
    >
      {isLoading ? <LoadingDots /> : title}
    </button>
  )
}

export default DefaultButton
