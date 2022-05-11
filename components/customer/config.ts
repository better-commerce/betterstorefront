import countryList from '@components/utils/countryList'
import { GENERAL_ADDRESS_LINE1, GENERAL_ADDRESS_LINE2, GENERAL_CITY, GENERAL_POSTCODE, GENERAL_COUNTRY, GENERAL_PHONE } from '@components/utils/textVariables'

export const registrationConfig = [
  {
    key: 'firstName',
    label: 'First Name',
    type: 'text',
    placeholder: 'John',
  },
  {
    key: 'lastName',
    label: 'Last Name',
    type: 'text',
    placeholder: 'Doe',
  },
  {
    key: 'password',
    label: 'Password',
    type: 'password',
    placeholder: 'Strong password',
  },
  {
    key: 'confirmPassword',
    label: 'Confirm Password',
    type: 'password',
    placeholder: 'Confirm password',
  },
]

export const b2bRegistrationConfig = [
  {
    key: 'isRequestTradingAccount',
    id: 'isRequestTradingAccount',
    name: 'isRequestTradingAccount',
    label: 'Create trading account',
    customComponent: 'CustomCheckbox',
    className: 'flex-inline',
  },
  {
    key: 'companyName',
    id: 'companyName',
    name: 'companyName',
    label: 'Company Name',
    type: 'text',
    placeholder: 'Stark Industries',
  },
  {
    key: 'registeredNumber',
    id: 'registeredNumber',
    name: 'registeredNumber',
    label: "Registered Number",
    type: 'phone',
    placeholder: 'Registered number',
  },
  {
    key: 'tradingAcountPassword',
    label: 'Trading Account Password',
    type: 'password',
    placeholder: 'Strong password',
  },
  {
    key: 'tradingAcountConfirmPassword',
    label: 'Confirm Password',
    type: 'password',
    placeholder: 'Confirm password',
  },
  {
    key: 'email',
    id: 'email',
    name: 'email',
    label: 'Email',
    type: 'email',
    placeholder: 'john@doe.com',
  },
  {
    key: 'mobileNumber',
    id: 'mobileNumber',
    name: 'mobileNumber',
    label: "Mobile Number",
    type: 'phone',
    placeholder: 'Mobile number',
  },
  {
    key: 'phoneNumber',
    id: 'phoneNumber',
    name: 'phoneNumber',
    label: "Phone Number",
    type: 'phone',
    placeholder: 'Phone number',
  },
  {
    key: 'address1',
    id: 'address1',
    name: 'address1',
    label: GENERAL_ADDRESS_LINE1,
    type: 'text',
    placeholder: GENERAL_ADDRESS_LINE1,
  },
  {
    key: 'address2',
    id: 'address2',
    name: 'address2',
    label: GENERAL_ADDRESS_LINE2,
    type: 'text',
    placeholder: GENERAL_ADDRESS_LINE2,
  },
  {
    key: 'city',
    id: 'city',
    name: 'city',
    label: GENERAL_CITY,
    type: 'text',
    placeholder: GENERAL_CITY,
  },
  {
    key: 'postCode',
    id: 'postCode',
    name: 'postCode',
    label: GENERAL_POSTCODE,
    type: 'text',
    placeholder: GENERAL_POSTCODE,
  },
  {
    key: 'country',
    id: 'country',
    name: 'country',
    as: 'select',
    options: countryList,
    label: GENERAL_COUNTRY,
  },
]

export const loginConfig = [
  {
    key: 'email',
    label: 'Email',
    type: 'email',
    placeholder: 'john@doe.com',
  },
  {
    key: 'password',
    label: 'Password',
    type: 'password',
    placeholder: 'Strong password',
  },
]
