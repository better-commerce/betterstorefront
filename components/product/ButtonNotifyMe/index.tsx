import { BTN_NOTIFY_ME, BTN_PRE_ORDER } from '@components/utils/textVariables'
import { useUI } from '@components/ui'
import dynamic from 'next/dynamic'
const Button = dynamic(() => import('@components/ui/IndigoButton'))
interface Props {
  product: any
  className?: any
}

export default function ButtonNotifyMe({ product, className = '' }: Props) {
  const { openNotifyUser } = useUI()
  const handleNotification = async (id: any) => {
    openNotifyUser(id)
  }
  return (
    <Button
      title={BTN_NOTIFY_ME}
      className={className}
      action={() => handleNotification(product?.recordId)}
      type="button"
      buttonType={BTN_NOTIFY_ME}
      aria-label={BTN_NOTIFY_ME}
    />
  )
}
