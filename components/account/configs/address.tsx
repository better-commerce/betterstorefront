import * as Yup from 'yup'
import countryList from '@components//utils/countryList'
import { Messages } from '@components//utils/constants'
import { useTranslation } from '@commerce/utils/use-translation'


export const useAddressFormConfig = () => {
  const translate = useTranslation();
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
      name: 'address1',
      placeholder: translate('common.label.addressLine1Text'),
      label: translate('common.label.addressLine1Text'),
    },
    {
      type: 'text',
      name: 'address2',
      placeholder: translate('common.label.addressLine2Text'),
      label: translate('common.label.addressLine2Text'),
    },
    {
      type: 'text',
      name: 'city',
      placeholder: translate('label.addressBook.townCityText'),
      label: translate('label.addressBook.townCityText'),
    },
    {
      type: 'text',
      name: 'postCode',
      placeholder: translate('common.label.postcodeText'),
      label: translate('common.label.postcodeText'),
    },
    {
      as: 'select',
      name: 'country',
      options: countryList,
      label: translate('label.checkout.countryText'),
    },
    {
      type: 'phone',
      name: 'phoneNo',
      placeholder: translate('label.b2b.phoneNumberText'),
      label: translate('label.b2b.phoneNumberText'),
    },
    {
      customComponent: 'CustomCheckbox',
      name: 'isDefaultDelivery',
      label: translate('common.label.isDefaultDeliveryAddressText'),
      className: 'flex-inline',
    },
    {
      customComponent: 'CustomCheckbox',
      name: 'isDefaultBilling',
      label: translate('common.label.isDefaultBillingAddressText'),
      className: 'flex-inline',
    },
    {
      as: 'select',
      name: 'label',
      options: [
        {
          title: translate('common.label.homeText'),
          value: translate('common.label.homeText'),
        },
        {
          title: translate('common.label.workText'),
          value: translate('common.label.workText'),
        },
        {
          title: translate('common.label.otherText'),
          value: translate('common.label.otherText'),
        },
      ],
      label: translate('common.label.saveAsText'),
    },
  ]
}


export const useSchema = () => {
  const translate = useTranslation();
  const schema = Yup.object({
    firstName: Yup.string().required(),
    lastName: Yup.string().required(),
    phoneNo: Yup.string()
      .max(10)
      .required(translate('common.message.mobileNumRequiredMsg'))
      .matches(Messages.Validations.RegularExpressions.MOBILE_NUMBER, {
        message: translate('common.message.profile.mobileNumInputMsg'),
      }),
    country: Yup.string().required(),
    postCode: Yup.string()
      .required(translate('common.message.address.postCodeRequiredMsg'))
      .min(3)
      .matches(/^(0*[1-9][0-9]*(\.[0-9]*)?|0*\.[0-9]*[1-9][0-9]*)$/, {
        message: translate('common.message.address.postCodeNumMsg'),
      }),
    address1: Yup.string()
      .min(3)
      .required(translate('common.message.address.address1ReuiredMsg'))
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
  return schema;
}
