import { FC } from 'react'
import s from './ShippingWidget.module.css'
import { ChevronRight, MapPin, Check } from '@old-components/icons'
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
      <div className="flex flex-1 items-center">
        <MapPin className="w-5 flex" />
        <span className="ml-5 text-sm text-center font-medium">
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
