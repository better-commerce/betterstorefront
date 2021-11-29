import * as Yup from 'yup'
import countryList from '@components/utils/countryList'

export const formConfig = [
  {
    as: 'select',
    name: 'title',
    options: [
      {
        title: 'Title',
        value: 'Title',
      },
      {
        title: 'Miss',
        value: 'Miss',
      },
      {
        title: 'Mr',
        value: 'Mr',
      },
      {
        title: 'Mrs',
        value: 'Mrs',
      },
    ],
    label: 'Title',
  },
  {
    type: 'text',
    name: 'firstName',
    placeholder: 'First name',
    label: 'First name',
  },
  {
    type: 'text',
    name: 'lastName',
    placeholder: 'Last name',
    label: 'Last name',
  },
  {
    type: 'text',
    name: 'address1',
    placeholder: 'Address line 1',
    label: 'Address line 1',
  },
  {
    type: 'text',
    name: 'address2',
    placeholder: 'Address line 2',
    label: 'Address line 2',
  },
  {
    type: 'text',
    name: 'city',
    placeholder: 'Town / city',
    label: 'Town / city',
  },
  {
    type: 'text',
    name: 'postCode',
    placeholder: 'Postcode',
    label: 'Postcode',
  },
  {
    as: 'select',
    name: 'country',
    options: countryList,
    label: 'Country',
  },
  {
    type: 'phone',
    name: 'phoneNo',
    placeholder: 'Phone',
    label: 'Phone',
  },
  // {
  //   customComponent: 'CustomCheckbox',
  //   name: 'isDefault',
  //   label: 'Is default address',
  //   className: 'mb-2 mt-2',
  // },
  {
    customComponent: 'CustomCheckbox',
    name: 'isDefaultDelivery',
    label: 'Is default delivery address',
    className: ' ',
  },
  {
    customComponent: 'CustomCheckbox',
    name: 'isDefaultBilling',
    label: 'Is default billing address',
    className: ' ',
  },
  // {
  //   customComponent: 'CustomCheckbox',
  //   name: 'isDefaultForSubscription',
  //   label: 'Is default subscription',
  //   className: ' ',
  // },
]

export const schema = Yup.object({
  firstName: Yup.string().required(),
  lastName: Yup.string().required(),
  phoneNo: Yup.string().required(),
  country: Yup.string().required(),
  postCode: Yup.string().required(),
  address1: Yup.string().required(),
  title: Yup.string(),
  city: Yup.string().required(),
  isDefault: Yup.boolean(),
  isDefaultDelivery: Yup.boolean(),
  isDefaultBilling: Yup.boolean(),
  isDefaultSubscription: Yup.boolean(),
})
