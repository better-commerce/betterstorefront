import { useTranslation } from "@commerce/utils/use-translation"
import { OTP_LOGIN_ENABLED } from "@components/utils/constants";

export const useContactPrefConfig = () => {
  const translate = useTranslation()
  const config = [
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
  ];
  if (OTP_LOGIN_ENABLED) {
   config.push({
     key: 'notifyByWhatsapp',
     label: translate('common.message.whatsAppText'),
   })
  }
  return config;
}
