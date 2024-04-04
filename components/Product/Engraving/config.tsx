import { useTranslation } from "@commerce/utils/use-translation"

export const useEngravingConfig = () =>{
  const translate = useTranslation()
  return [
    {
      key: 'line1',
      label: translate('common.label.line1Text'),
      type: 'text',
      placeholder: translate('common.label.addMsg1Text'),
    },
    {
      key: 'line2',
      label: translate('common.label.line2Text'),
      type: 'text',
      placeholder: translate('common.label.addMsg2Text'),
    },
    {
      key: 'line3',
      label: translate('common.label.line3Text'),
      type: 'text',
      placeholder: translate('common.label.addMsg3Text'),
    },
  ]
  
} 