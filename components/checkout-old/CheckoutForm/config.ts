import * as Yup from 'yup'

import {
  GENERAL_DELIVERY_METHOD,
  GENERAL_DELIVERY_ADDRESS,
  GENERAL_PAYMENT_METHOD,
  GENERAL_TITLE,
  GENERAL_MISS,
  GENERAL_MR,
  GENERAL_MRS,
  GENERAL_FIRST_NAME,
  GENERAL_LAST_NAME,
  GENERAL_ADDRESS_LINE1,
  GENERAL_ADDRESS_LINE2,
  GENERAL_CITY,
  GENERAL_POSTCODE,
  GENERAL_COUNTRY,
  GENERAL_PHONE,
  GENERAL_ENTER_POSTCODE,
  GENERAL_ADDRESS_FINDER,
} from '@components/utils/textVariables'
import { Messages } from '@components/utils/constants'

export const PANELS = [
  {
    title: GENERAL_DELIVERY_METHOD,
    key: 'deliveryMethod',
  },
  {
    title: GENERAL_DELIVERY_ADDRESS,
    key: 'deliveryAddress',
  },
  {
    title: GENERAL_PAYMENT_METHOD,
    key: 'paymentMethod',
  },
]

export const shippingFormConfig = [
  {
    as: 'select',
    name: 'title',
    options: [
      {
        title: GENERAL_TITLE,
        value: GENERAL_TITLE,
      },
      {
        title: GENERAL_MISS,
        value: GENERAL_MISS,
      },
      {
        title: GENERAL_MR,
        value: GENERAL_MR,
      },
      {
        title: GENERAL_MRS,
        value: GENERAL_MRS,
      },
    ],
    label: GENERAL_TITLE,
    isFullWidth: true,
  },
  {
    type: 'text',
    name: 'firstName',
    placeholder: GENERAL_FIRST_NAME,
    label: GENERAL_FIRST_NAME,
  },
  {
    type: 'text',
    name: 'lastName',
    placeholder: GENERAL_LAST_NAME,
    label: GENERAL_LAST_NAME,
  },
  {
    type: 'text',
    name: 'addressFinder',
    placeholder: GENERAL_ENTER_POSTCODE,
    label: GENERAL_ADDRESS_FINDER,
    isFullWidth: true,
    addressFinder: true,
  },
  {
    type: 'text',
    name: 'address1',
    placeholder: GENERAL_ADDRESS_LINE1,
    label: GENERAL_ADDRESS_LINE1,
    isFullWidth: true,
  },
  {
    type: 'text',
    name: 'address2',
    placeholder: GENERAL_ADDRESS_LINE2,
    label: GENERAL_ADDRESS_LINE2,
    isFullWidth: true,
  },
  {
    type: 'text',
    name: 'city',
    placeholder: GENERAL_CITY,
    label: GENERAL_CITY,
    isFullWidth: true,
  },
  {
    type: 'text',
    name: 'postCode',
    placeholder: GENERAL_POSTCODE,
    label: GENERAL_POSTCODE,
    isFullWidth: true,
  },

  {
    type: 'phone',
    name: 'phoneNo',
    placeholder: GENERAL_PHONE,
    label: GENERAL_PHONE,
    isFullWidth: true,
  },
]

export const shippingSchema = Yup.object({
  firstName: Yup.string().required(),
  lastName: Yup.string().required(),
  phoneNo: Yup.string()
    .max(10)
    .required(Messages.Validations.AddNewAddress['MOBILE_NUMBER_REQUIRED'])
    .matches(Messages.Validations.RegularExpressions.MOBILE_NUMBER, {
      message: Messages.Validations.AddNewAddress['MOBILE_NUMBER_INPUT'],
    }),
  country: Yup.string().required(),
  postCode: Yup.string()
    .required(Messages.Validations.AddNewAddress['PIN_CODE_REQUIRED'])
    .min(3),
  // .matches(/^(0*[1-9][0-9]*(\.[0-9]*)?|0*\.[0-9]*[1-9][0-9]*)$/, {
  //   message: Messages.Validations.AddNewAddress['PIN_CODE_NUM'],
  // }),
  address1: Yup.string()
    .min(3)
    .required(Messages.Validations.AddNewAddress['ADDRESS_1_REQUIRED'])
    .matches(Messages.Validations.RegularExpressions.ADDRESS_LINE, {
      message: Messages.Validations.AddNewAddress['ADDRESS_1_INPUT'],
    }),
  title: Yup.string().nullable(),
  city: Yup.string()
    .required(Messages.Validations.AddNewAddress['CITY_REQUIRED'])
    .min(3),
  isDefault: Yup.boolean(),
  isDefaultDelivery: Yup.boolean(),
  isDefaultBilling: Yup.boolean(),
  isDefaultSubscription: Yup.boolean(),
  label: Yup.string().nullable(),
})

export const billingFormConfig = [
  {
    as: 'select',
    name: 'title',
    options: [
      {
        title: GENERAL_TITLE,
        value: GENERAL_TITLE,
      },
      {
        title: GENERAL_MISS,
        value: GENERAL_MISS,
      },
      {
        title: GENERAL_MR,
        value: GENERAL_MR,
      },
      {
        title: GENERAL_MRS,
        value: GENERAL_MRS,
      },
    ],
    label: 'Title',
    isFullWidth: true,
  },
  {
    type: 'text',
    name: 'firstName',
    placeholder: GENERAL_FIRST_NAME,
    label: GENERAL_FIRST_NAME,
  },
  {
    type: 'text',
    name: 'lastName',
    placeholder: GENERAL_LAST_NAME,
    label: GENERAL_LAST_NAME,
  },
  {
    type: 'text',
    name: 'addressFinder',
    placeholder: GENERAL_ENTER_POSTCODE,
    label: GENERAL_ADDRESS_FINDER,
    addressFinder: true,
    isFullWidth: true,
  },
  {
    type: 'text',
    name: 'address1',
    placeholder: GENERAL_ADDRESS_LINE1,
    label: GENERAL_ADDRESS_LINE1,
    isFullWidth: true,
  },
  {
    type: 'text',
    name: 'address2',
    placeholder: GENERAL_ADDRESS_LINE2,
    label: GENERAL_ADDRESS_LINE2,
    isFullWidth: true,
  },
  {
    type: 'text',
    name: 'city',
    placeholder: GENERAL_CITY,
    label: GENERAL_CITY,
    isFullWidth: true,
  },
  {
    type: 'text',
    name: 'postCode',
    placeholder: GENERAL_POSTCODE,
    label: GENERAL_POSTCODE,
    isFullWidth: true,
  },

  {
    type: 'phone',
    name: 'phoneNo',
    placeholder: GENERAL_PHONE,
    label: GENERAL_PHONE,
    isFullWidth: true,
  },
]

export const billingSchema = Yup.object({
  firstName: Yup.string().required(),
  lastName: Yup.string().required(),
  phoneNo: Yup.string()
    .max(10)
    .required(Messages.Validations.AddNewAddress['MOBILE_NUMBER_REQUIRED'])
    .matches(Messages.Validations.RegularExpressions.MOBILE_NUMBER, {
      message: Messages.Validations.AddNewAddress['MOBILE_NUMBER_INPUT'],
    }),
  country: Yup.string().required(),
  postCode: Yup.string()
    .required(Messages.Validations.AddNewAddress['PIN_CODE_REQUIRED'])
    .min(3)
    .matches(/^(0*[1-9][0-9]*(\.[0-9]*)?|0*\.[0-9]*[1-9][0-9]*)$/, {
      message: Messages.Validations.AddNewAddress['PIN_CODE_NUM'],
    }),
  address1: Yup.string()
    .min(3)
    .required(Messages.Validations.AddNewAddress['ADDRESS_1_REQUIRED'])
    .matches(Messages.Validations.RegularExpressions.ADDRESS_LINE, {
      message: Messages.Validations.AddNewAddress['ADDRESS_1_INPUT'],
    }),
  title: Yup.string().nullable(),
  city: Yup.string()
    .required(Messages.Validations.AddNewAddress['CITY_REQUIRED'])
    .min(3),
  isDefault: Yup.boolean(),
  isDefaultDelivery: Yup.boolean(),
  isDefaultBilling: Yup.boolean(),
  isDefaultSubscription: Yup.boolean(),
  label: Yup.string().nullable(),
})
