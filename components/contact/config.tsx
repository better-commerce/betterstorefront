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

export const CONTACT_US_FIELDS = [
  {
    name: 'title',
    label: 'Title*',
    type: 'text',
    placeholder: 'Enter your Title',
  },
  {
    name: 'firstName',
    label: 'First Name*',
    placeholder: 'Enter your First Name',
    type: 'text',
  },
  {
    name: 'lastName',
    label: 'Last Name',
    placeholder: 'Enter your last Name',
    type: 'text',
  },
  {
    name: 'company',
    label: 'Company',
    placeholder: "Enter Company Name",
    type: 'text',
  },
  {
    name: 'email',
    label: 'Email address*',
    placeholder: 'example@example.com',
    type: 'text',
  },
  {
    name: 'phoneNo',
    label: 'Phone number',
    placeholder: 'Phone number',
    type: 'text',
  },
  {
    name: 'subject',
    label: 'Subject*',
    type: 'text',
    placeholder: 'Subject',
  },
  {
    name: 'message',
    label: 'Message*',
    placeholder: 'Brief Message of Query',
    type: 'textarea',
  },
]