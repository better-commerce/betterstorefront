import { useState } from 'react'
import { FC } from 'react'
import { useUI } from '@components/ui/context'
import { LoadingDots } from '@components/ui'
import BagIcon from '@components/BagIcon'
import { useTranslation } from '@commerce/utils/use-translation'
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
  title = 'Add to basket',
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
  const translate = useTranslation()
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
  const isPreOrder = title === translate('label.product.preOrderText');
  const isNotifyMe = title === translate('label.product.notifyMeText');

  const baseClass = [
    'w-full flex items-center justify-center gap-2 relative h-auto',
    'rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:bg-opacity-90 shadow-xl flex-1 flex-shrink-0',
    'hover:bg-slate-800 text-slate-50 dark:text-white',
    'bg-slate-900 dark:bg-slate-100 sm:text-white',
    '!w-full', // override width if needed
  ];

  const variantClass = formId
    ? `xs:max-w-xs border border-transparent hover:${hoverBgColor} focus:ring-offset-gray-50 focus:${focusRingColor}`
    : `hover:${hoverBgColor} focus:${focusRingColor}`;

  const dynamicButtonType = formId
    ? title === translate('label.product.preOrderText')
      ? 'btn-black'
      : title === translate('label.product.notifyMeText')
        ? 'btn-blue'
        : 'btn-primary'
    : title === translate('label.product.preOrderText')
      ? 'ttnc-ButtonBlack'
      : title === translate('label.product.notifyMeText')
        ? 'ttnc-ButtonBlue'
        : 'ttnc-ButtonPrimary';

  const sizeClass =
    !formId && size === 'small'
      ? 'text-xs font-medium py-1 px-0 sm:py-1 sm:px-1'
      : 'text-sm font-medium py-3 px-4 sm:py-3.5 sm:px-6 nc-Button';

  const buttonClass = [
    bgColor,
    variantClass,
    focusRingColor,
    className,
    dynamicButtonType,
    sizeClass,
    ...baseClass,
  ].join(' ');
  return formId ? (
    <button
      type="submit"
      form={formId}
      className={buttonClass}
      disabled={isLoading || disabled}
    >
      {isLoading ? <LoadingDots /> : title}
    </button>
  ) : (
    <button
      onClick={handleAction}
      type="button"
      className={buttonClass}
      disabled={isLoading || disabled}
    >
      <BagIcon className={`inline-block mb-0.5 ${size === 'small' ? 'w-4 h-4' : 'w-5 h-5'}`} />
      {isLoading ? <LoadingDots /> : <span>{title}</span>}
    </button>
  );
}

export default DefaultButton
