import { FC } from 'react'
import { useUI } from '@components/ui/context'
interface Props {
  className?: string
  title?: string
  action: any
  buttonType?: string
  type?: string
  colorScheme?: any
}

const DEFAULT_COLOR_SCHEME = {
  bgColor: 'bg-indigo-600',
  hoverBgColor: 'bg-indigo-500',
  focusRingColor: 'ring-indigo-500',
}

const DefaultButton: FC<Props> = ({
  className = '',
  title = 'Add to bag',
  buttonType = 'cart',
  action = () => {},
  colorScheme = DEFAULT_COLOR_SCHEME,
}) => {
  const { openCart } = useUI()

  const handleAction = () => {
    if (buttonType === 'cart') {
      action().then(() => openCart())
    } else action()
  }

  const { bgColor, hoverBgColor, focusRingColor } = colorScheme

  return (
    <button
      onClick={handleAction}
      type="button"
      className={`max-w-xs flex-1 ${bgColor} border border-transparent rounded-md py-3 px-8 flex items-center justify-center font-medium text-white hover:${hoverBgColor} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:${focusRingColor} sm:w-full ${className}`}
    >
      {title}
    </button>
  )
}

export default DefaultButton
