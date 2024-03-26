import * as Yup from 'yup'
import { useTranslation } from "@commerce/utils/use-translation"
import { Messages } from '@new-components/utils/constants'

// export const PANELS = () => {
//   const translate = useTranslation()
//   return [
//    {
//      title: translate('label.checkout.deliveryMethodHeadingText'),
//      key: 'deliveryMethod',
//    },
//    {
//      title: translate('label.orderDetails.deliveryAddressHeadingText'),
//      key: 'deliveryAddress',
//    },
//    {
//      title: translate('label.checkout.paymentMethodText'),
//      key: 'paymentMethod',
//    },
//  ]
// } 

export const useShippingFormConfig = () => {
  const translate = useTranslation()
  return [
    {
      as: 'select',
      name: 'title',
      options: [
        {
          title: translate('common.label.titleText'),
          value: translate('common.label.titleText'),
        },
        {
          title: translate('common.label.missText'),
          value: translate('common.label.missText'),
        },
        {
          title: translate('common.label.mrText'),
          value: translate('common.label.mrText'),
        },
        {
          title: translate('common.label.mrsText'),
          value: translate('common.label.mrsText'),
        },
      ],
      label: translate('common.label.titleText'),
      isFullWidth: true,
    },
    {
      type: 'text',
      name: 'firstName',
      placeholder: translate('label.addressBook.firstNameText'),
      label: translate('label.addressBook.firstNameText'),
    },
    {
      type: 'text',
      name: 'lastName',
      placeholder: translate('label.addressBook.lastNameText'),
      label: translate('label.addressBook.lastNameText'),
    },
    {
      type: 'text',
      name: 'addressFinder',
      placeholder: translate('label.addressBook.enterPostcodeText'),
      label:  translate('label.addressBook.addressFinderText'),
      isFullWidth: true,
      addressFinder: true,
    },
    {
      type: 'text',
      name: 'address1',
      placeholder: translate('common.label.addressLine1Text'),
      label: translate('common.label.addressLine1Text'),
      isFullWidth: true,
    },
    {
      type: 'text',
      name: 'address2',
      placeholder: translate('common.label.addressLine2Text'),
      label: translate('common.label.addressLine2Text'),
      isFullWidth: true,
    },
    {
      type: 'text',
      name: 'city',
      placeholder: translate('label.addressBook.townCityText'),
      label: translate('label.addressBook.townCityText'),
      isFullWidth: true,
    },
    {
      type: 'text',
      name: 'postCode',
      placeholder: translate('common.label.postcodeText'),
      label: translate('common.label.postcodeText'),
      isFullWidth: true,
    },
  
    {
      type: 'phone',
      name: 'phoneNo',
      placeholder: translate('label.b2b.phoneNumberText'),
      label: translate('label.b2b.phoneNumberText'),
      isFullWidth: true,
    },
  ]
}

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

export const useBillingFormConfig = () => {
  const translate = useTranslation()
  return [
    {
      as: 'select',
      name: 'title',
      options: [
        {
          title: translate('common.label.titleText'),
          value: translate('common.label.titleText'),
        },
        {
          title: translate('common.label.missText'),
          value: translate('common.label.missText'),
        },
        {
          title: translate('common.label.mrText'),
          value: translate('common.label.mrText'),
        },
        {
          title: translate('common.label.mrsText'),
          value: translate('common.label.mrsText'),
        },
      ],
      label: translate('common.label.titleText'),
      isFullWidth: true,
    },
    {
      type: 'text',
      name: 'firstName',
      placeholder: translate('label.addressBook.firstNameText'),
      label: translate('label.addressBook.firstNameText'),
    },
    {
      type: 'text',
      name: 'lastName',
      placeholder: translate('label.addressBook.lastNameText'),
      label: translate('label.addressBook.lastNameText'),
    },
    {
      type: 'text',
      name: 'addressFinder',
      placeholder: translate('label.addressBook.enterPostcodeText'),
      label:  translate('label.addressBook.addressFinderText'),
      addressFinder: true,
      isFullWidth: true,
    },
    {
      type: 'text',
      name: 'address1',
      placeholder: translate('common.label.addressLine1Text'),
      label: translate('common.label.addressLine1Text'),
      isFullWidth: true,
    },
    {
      type: 'text',
      name: 'address2',
      placeholder: translate('common.label.addressLine2Text'),
      label: translate('common.label.addressLine2Text'),
      isFullWidth: true,
    },
    {
      type: 'text',
      name: 'city',
      placeholder: translate('label.addressBook.townCityText'),
      label: translate('label.addressBook.townCityText'),
      isFullWidth: true,
    },
    {
      type: 'text',
      name: 'postCode',
      placeholder: translate('common.label.postcodeText'),
      label: translate('common.label.postcodeText'),
      isFullWidth: true,
    },
  
    {
      type: 'phone',
      name: 'phoneNo',
      placeholder: translate('label.b2b.phoneNumberText'),
      label: translate('label.b2b.phoneNumberText'),
      isFullWidth: true,
    },
  ]
}

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
