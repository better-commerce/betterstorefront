import { FC } from 'react'
import s from './ShippingWidget.module.css'
import { ChevronRight, MapPin, Check } from '@components/shared/icons'
import { useTranslation } from '@commerce/utils/use-translation'

interface ComponentProps {
  onClick?: () => any
  isValid?: boolean
}

const ShippingWidget: FC<React.PropsWithChildren<ComponentProps>> = ({ onClick, isValid }) => {
  const translate = useTranslation();
  /* Shipping Address
  Only available with checkout set to true -
  This means that the provider does offer checkout functionality. */
  return (
    <div onClick={onClick} className={s.root}>
      <div className="flex items-center flex-1">
        <MapPin className="flex w-5" />
        <span className="ml-5 text-sm font-medium text-center">
          {translate('common.label.addShippingAddressText')}
        </span>
        {/* <span>
          1046 Kearny Street.<br/>
          San Franssisco, California
        </span> */}
      </div>
      <div>{isValid ? <Check /> : <ChevronRight />}</div>
    </div>
  )
}

export default ShippingWidget
