import { useTranslation } from "@commerce/utils/use-translation";

export const useFormConfig = () => {

  const translate = useTranslation();

  const formConfig : any = {
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
      userName: {
        label: translate('label.myAccount.rfq.userName'),
        placeholder: translate('label.myAccount.rfq.userName'),
        type: 'text',
        required: true,
      },
      email: {
        label: translate('label.myAccount.rfq.email'),
        placeholder: translate('label.myAccount.rfq.email'),
        type: 'email',
        required: true,
      },
      phoneNumber: {
        label: translate('label.myAccount.rfq.phoneNumber'),
        placeholder: translate('label.myAccount.rfq.phoneNumber'),
        type: 'tel',
        required: false,
      },
      companyName: {
        label: translate('label.myAccount.rfq.companyName'),
        placeholder: translate('label.myAccount.rfq.companyName'),
        type: 'text',
        required: true,
      },
      role: {
        label: translate('label.myAccount.rfq.role'),
        placeholder: translate('label.myAccount.rfq.role'),
        type: 'text',
        required: false,
      },
      poNumber: {
        label: translate('label.myAccount.rfq.poNumber'),
        placeholder: translate('label.myAccount.rfq.poNumber'),
        type: 'text',
        required: false,
      },
      validUntil: {
        label: translate('label.myAccount.rfq.validUntil'),
        type: 'date',
        required: true,
      },
      assignedTo: {
        label: translate('label.myAccount.rfq.assignedTo'),
        type: 'select',
        options: [], 
        required: true,
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
      initialValues: []
    },
  };
  return formConfig
};
