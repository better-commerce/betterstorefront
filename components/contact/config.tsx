// Package Imports
import { useTranslation } from "@commerce/utils/use-translation";
// Package Imports
import * as Yup from 'yup'

// Other Imports
import { EmptyString, Messages } from '@components/utils/constants'

export const CONTACT_US_FORM_ID = 'contactUsForm'

export const useContactUsFormSchema = () => {
  const translate = useTranslation();
  const contactUsFormSchema = Yup.object().shape({
  title: Yup.string()
    .trim()
    .required(translate('common.message.titleRequiredMsg')),
  firstName: Yup.string()
    .trim()
    .min(3, translate('common.message.nameMinLengthMsg'))
    .required(translate('common.message.firstNameRequiredMsg'))
    .matches(Messages.Validations.RegularExpressions.FULL_NAME, {
      message: translate('common.message.nameInputMsg'),
    }),
  lastName: Yup.string(),
  email: Yup.string()
    .max(255)
    .required(translate('common.message.emailAddressRequiredMsg'))
    .matches(Messages.Validations.RegularExpressions.EMAIL, {
      message: translate('common.message.emailAddressInvalidMsg'),
    }),
  phoneNo: Yup.string().matches(/^[0-9]+$/, 'Phone number must contain only numbers')
  .min(10, 'Phone number must be at least 10 digits')
   .required('Phone number is required'),
  company: Yup.string(),
  subject: Yup.string().required('Subject is required'),
  message: Yup.string()
    .trim()
    .required(translate('common.message.messageRequiredMsg')),
  })
  return contactUsFormSchema;
}

export const CONTACT_US_DEFAULT_VALUES = {
  title: EmptyString,
  firstName: EmptyString,
  lastName: EmptyString,
  email: EmptyString,
  phoneNo: EmptyString,
  company: EmptyString,
  subject: EmptyString,
  message: EmptyString,
}

export const useContactUsFields = () => {
  const translate = useTranslation();
  const contactUsFields = [
  {
    name: 'title',
    label: translate('common.label.titleRequiredText'),
    type: 'text',
    placeholder: translate('common.label.enterTitleText'),
  },
  {
    name: 'firstName',
    label: translate('common.label.firstNameRequiredText'),
    placeholder: translate('common.label.enterFirstNameText'),
    type: 'text',
  },
  {
    name: 'lastName',
    label: translate('common.label.lastNameText'),
    placeholder: translate('common.label.enterLastNameText'),
    type: 'text',
  },
  {
    name: 'company',
    label: translate('label.contactUs.companyText'),
    placeholder: translate('label.contactUs.enterCompanyText'),
    type: 'text',
  },
  {
    name: 'email',
    label: translate('label.myAccount.emailAddressRequiredText'),
    placeholder: translate('label.myAccount.emailAddressplaceholderText'),
    type: 'text',
  },
  {
    name: 'phoneNo',
    label: translate('label.contactUs.phoneNumberText'),
    placeholder: translate('label.contactUs.phoneNumberText'),
    type: 'text',
  },
  {
    name: 'subject',
    label: translate('common.label.subjectRequiredText'),
    type: 'text',
    placeholder: translate('common.label.subjectText'),
  },
  {
    name: 'message',
    label: translate('label.product.messageRequiredText'),
    placeholder: translate('label.product.messagePlaceholderText'),
    type: 'textarea',
  },
]
return contactUsFields;
}