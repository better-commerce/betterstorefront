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
}

const DEFAULT_COLOR_SCHEME = {
  bgColor: 'bg-black',
  hoverBgColor: 'bg-gray-700',
  focusRingColor: 'ring-gray-500',
}

const DefaultButton: FC<Props> = ({
  className = '',
  title = 'Add to bag',
  buttonType = 'cart',
  action = () => { },
  colorScheme = DEFAULT_COLOR_SCHEME,
}) => {
  const [isLoading, setIsLoading] = useState(false)

  const { openCart } = useUI()

  const handleAction = () => {
    setIsLoading(true)
    if (buttonType === 'cart') {
      action()?.then(() => {
        setIsLoading(false)
        openCart()
      })
    } else
      action()?.then(() => {
        setIsLoading(false)
      })
  }

  const { bgColor, hoverBgColor, focusRingColor } = colorScheme

  return (
    <button
      onClick={handleAction}
      type="button"
      className={`xs:max-w-xs flex-1 ${bgColor} border border-2 border-lime uppercase rounded-xs sm:py-3 py-1 sm:px-8 px-1 flex items-center justify-center font-medium text-lime hover:${hoverBgColor} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:${focusRingColor} sm:w-full ${className}`}
    >
      {isLoading ? <LoadingDots /> : title}
    </button>
  )
}

export default DefaultButton
