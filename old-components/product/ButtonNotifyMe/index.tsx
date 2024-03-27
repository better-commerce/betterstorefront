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
      title={"Notify me"}
      className={className}
      action={() => handleNotification(product?.recordId)}
      type="button"
      buttonType={"Notify me"}
      aria-label={"Notify me"}
    />
  )
}
