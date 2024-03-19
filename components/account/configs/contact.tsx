import { useTranslation } from "@commerce/utils/use-translation"

export const useContactPrefConfig = () => {
  const translate = useTranslation()
  return [
  {
    key: 'notifyByEmail',
    label: translate('label.addressBook.emailText'),
  },
  {
    key: 'notifyByPost',
    label: translate('common.label.postText'),
  },
  {
    key: 'notifyBySMS',
    label: translate('common.label.smsText'),
  } 
 ]
}
