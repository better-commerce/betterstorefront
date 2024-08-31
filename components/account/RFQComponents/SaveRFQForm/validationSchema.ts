import * as Yup from 'yup';
import { useTranslation } from '@commerce/utils/use-translation';

export const useValidationSchema : () => any = () => {
  const translate = useTranslation();

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required(translate('label.myAccount.rfq.firstNameRequired')),
    lastName: Yup.string().required(translate('label.myAccount.rfq.lastNameRequired')),
    userName: Yup.string().required(translate('label.myAccount.rfq.userNameRequired')),
    email: Yup.string().email(translate('label.myAccount.rfq.emailInvalid')).required(translate('label.myAccount.rfq.emailRequired')),
    phoneNumber: Yup.string().required(translate('label.myAccount.rfq.phoneNumberRequired')),
    companyName: Yup.string().required(translate('label.myAccount.rfq.companyNameRequired')),
    role: Yup.string().required(translate('label.myAccount.rfq.roleRequired')),
    poNumber: Yup.string().required(translate('label.myAccount.rfq.poNumberRequired')),
    validUntil: Yup.date().required(translate('label.myAccount.rfq.validUntilRequired')),
    assignedTo: Yup.string().required(translate('label.myAccount.rfq.assignedToRequired')),
    notes: Yup.string().nullable(),
    lines: Yup.array().min(1, translate('label.myAccount.rfq.productRequired')),
  });

  return validationSchema;
};
