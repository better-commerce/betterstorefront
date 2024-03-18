import * as Yup from 'yup'
import countryList from '@components/utils/countryList'
import { Messages } from '@components/utils/constants'
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

export const schema = Yup.object({
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
