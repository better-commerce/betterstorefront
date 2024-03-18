import * as Yup from 'yup'
import countryList from '@components/utils/countryList'
import {
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
  GENERAL_IS_DEFAULT_DELIVERY_ADDRESS,
  GENERAL_IS_DEFAULT_BILLING_ADDRESS,
} from '@components/utils/textVariables'
import { Messages } from '@components/utils/constants'
import { useTranslation } from '@commerce/utils/use-translation'


export const formConfig = [
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
      name: 'address1',
      placeholder: GENERAL_ADDRESS_LINE1,
      label: GENERAL_ADDRESS_LINE1,
    },
    {
      type: 'text',
      name: 'address2',
      placeholder: GENERAL_ADDRESS_LINE2,
      label: GENERAL_ADDRESS_LINE2,
    },
    {
      type: 'text',
      name: 'city',
      placeholder: GENERAL_CITY,
      label: GENERAL_CITY,
    },
    {
      type: 'text',
      name: 'postCode',
      placeholder: GENERAL_POSTCODE,
      label: GENERAL_POSTCODE,
    },
    {
      as: 'select',
      name: 'country',
      options: countryList,
      label: GENERAL_COUNTRY,
    },
    {
      type: 'phone',
      name: 'phoneNo',
      placeholder: GENERAL_PHONE,
      label: GENERAL_PHONE,
    },
    {
      customComponent: 'CustomCheckbox',
      name: 'isDefaultDelivery',
      label: GENERAL_IS_DEFAULT_DELIVERY_ADDRESS,
      className: 'flex-inline',
    },
    {
      customComponent: 'CustomCheckbox',
      name: 'isDefaultBilling',
      label: GENERAL_IS_DEFAULT_BILLING_ADDRESS,
      className: 'flex-inline',
    },
    {
      as: 'select',
      name: 'label',
      options: [
        {
          title: 'Home',
          value: 'Home',
        },
        {
          title: 'Work',
          value: 'Work',
        },
        {
          title: 'Other',
          value: 'Other',
        },
      ],
      label: 'Save As',
    },
  ]


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
