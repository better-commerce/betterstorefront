import * as Yup from 'yup'

import {
  GENERAL_DELIVERY_METHOD,
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
import { useTranslation } from '@commerce/utils/use-translation'

export const PANELS = [
  {
    title: GENERAL_DELIVERY_METHOD,
    key: 'deliveryMethod',
  },
  {
    title: "Delivery Address",
    key: 'deliveryAddress',
  },
  {
    title: "Payment Method",
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

export const useShippingSchema = () => {
  const translate = useTranslation();
  const shippingSchema = Yup.object({
  firstName: Yup.string().required(),
  lastName: Yup.string().required(),
  phoneNo: Yup.string()
    .max(10)
    .required(translate('common.message.mobileNumRequiredMsg'))
    .matches(Messages.Validations.RegularExpressions.MOBILE_NUMBER, {
      message: translate('common.message.mobileNumInputMsg'),
    }),
  country: Yup.string().required(),
  postCode: Yup.string()
    .required(translate('common.message.postCodeRequiredMsg'))
    .min(3),
  // .matches(/^(0*[1-9][0-9]*(\.[0-9]*)?|0*\.[0-9]*[1-9][0-9]*)$/, {
  //   message: translate('common.message.address.postCodeNumMsg'),
  // }),
  address1: Yup.string()
    .min(3)
    .required(translate('common.message.address.address1RequiredMsg'))
    .matches(Messages.Validations.RegularExpressions.ADDRESS_LINE, {
      message: translate('common.message.address.address1InputMsg'),
    }),
  title: Yup.string().nullable(),
  city: Yup.string()
    .required(translate('common.message.address.cityRequiredMsg'))
    .min(3),
  isDefault: Yup.boolean(),
  isDefaultDelivery: Yup.boolean(),
  isDefaultBilling: Yup.boolean(),
  isDefaultSubscription: Yup.boolean(),
  label: Yup.string().nullable(),
  })
  return shippingSchema;
}

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

export const useBillingSchema = ()  => {
  const translate = useTranslation();
  const billingSchema = Yup.object({
  firstName: Yup.string().required(),
  lastName: Yup.string().required(),
  phoneNo: Yup.string()
    .max(10)
    .required(translate('common.message.mobileNumRequiredMsg'))
    .matches(Messages.Validations.RegularExpressions.MOBILE_NUMBER, {
      message: translate('common.message.mobileNumInputMsg'),
    }),
  country: Yup.string().required(),
  postCode: Yup.string()
    .required(translate('common.message.postCodeRequiredMsg'))
    .min(3)
    .matches(/^(0*[1-9][0-9]*(\.[0-9]*)?|0*\.[0-9]*[1-9][0-9]*)$/, {
      message: translate('common.message.address.postCodeNumMsg'),
    }),
  address1: Yup.string()
    .min(3)
    .required(translate('common.message.address.address1RequiredMsg'))
    .matches(Messages.Validations.RegularExpressions.ADDRESS_LINE, {
      message: translate('common.message.address.address1InputMsg'),
    }),
  title: Yup.string().nullable(),
  city: Yup.string()
    .required(translate('common.message.address.cityRequiredMsg'))
    .min(3),
  isDefault: Yup.boolean(),
  isDefaultDelivery: Yup.boolean(),
  isDefaultBilling: Yup.boolean(),
  isDefaultSubscription: Yup.boolean(),
  label: Yup.string().nullable(),
  })
  return billingSchema;
}
