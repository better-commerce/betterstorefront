import { useTranslation } from '@commerce/utils/use-translation'

export const useSaveFormConfig = () => {
  const translate = useTranslation()

  const formConfig: any = {
    fields: {
      firstName: {
        label: translate('label.myAccount.rfq.firstName'),
        placeholder: translate('label.myAccount.rfq.firstName'),
        type: 'text',
        required: true,
      },
      lastName: {
        label: translate('label.myAccount.rfq.lastName'),
        placeholder: translate('label.myAccount.rfq.lastName'),
        type: 'text',
        required: true,
      },
      email: {
        label: translate('label.myAccount.rfq.email'),
        placeholder: translate('label.myAccount.rfq.email'),
        type: 'email',
        required: false,
        readOnly: true,
      },
      companyName: {
        label: translate('label.myAccount.rfq.companyName'),
        placeholder: translate('label.myAccount.rfq.companyName'),
        type: 'text',
        required: false,
        readOnly: true,
      },
      phoneNumber: {
        label: translate('label.myAccount.rfq.phoneNumber'),
        placeholder: translate('label.myAccount.rfq.phoneNumber'),
        type: 'tel',
        required: false,
        readOnly: true,
      },
      poNumber: {
        label: translate('label.myAccount.rfq.poNumber'),
        placeholder: translate('label.myAccount.rfq.poNumber'),
        type: 'text',
        required: true,
      },
      validUntil: {
        label: translate('label.myAccount.rfq.generalETAText'),
        type: 'date',
        required: true,
      },
      assignTo: {
        label: translate('label.myAccount.rfq.assignTo'),
        type: 'text',
        required: true,
        readOnly: true,
      },
      notes: {
        label: translate('label.myAccount.rfq.notes'),
        placeholder: translate('label.myAccount.rfq.notes'),
        type: 'textarea',
        required: false,
      },
    },
    lines: {
      headers: {
        productId: translate('label.myAccount.rfq.productId'),
        productName: translate('label.myAccount.rfq.productName'),
        stockCode: translate('label.myAccount.rfq.stockCode'),
        qty: translate('label.myAccount.rfq.qty'),
        price: translate('label.myAccount.rfq.price'),
        targetPrice: translate('label.myAccount.rfq.targetPrice'),
      },
      initialValues: [],
    },
  }
  return formConfig
}
