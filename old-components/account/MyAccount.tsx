import { useTranslation } from '@commerce/utils/use-translation'
import { useEffect } from 'react'

export default function MyAccount() {
  const translate = useTranslation()
  useEffect(() => {}, [])
  return <div className="text-gray-900">{translate('common.label.myAccountText')}</div>
}
