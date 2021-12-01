import * as Yup from 'yup'

export const PANELS = [
  {
    title: 'Delivery Method',
    key: 'deliveryMethod',
  },
  {
    title: 'Delivery Address',
    key: 'deliveryAddress',
  },
  {
    title: 'Payment method',
    key: 'paymentMethod',
  },
]

export const shippingFormConfig = [
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
    isFullWidth: true,
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
    isFullWidth: true,
  },
  {
    type: 'text',
    name: 'address2',
    placeholder: 'Address line 2',
    label: 'Address line 2',
    isFullWidth: true,
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
    type: 'phone',
    name: 'phoneNo',
    placeholder: 'Phone',
    label: 'Phone',
    isFullWidth: true,
  },
]

export const shippingSchema = Yup.object({
  firstName: Yup.string().required(),
  lastName: Yup.string().required(),
  phoneNo: Yup.string().required(),
  postCode: Yup.string().required(),
  address1: Yup.string().required(),
  title: Yup.string(),
  city: Yup.string().required(),
})
