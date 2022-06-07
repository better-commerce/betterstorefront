import countryList from '@components/utils/countryList'
import { GENERAL_ADDRESS_LINE1, GENERAL_ADDRESS_LINE2, GENERAL_CITY, GENERAL_POSTCODE, GENERAL_COUNTRY, GENERAL_PHONE } from '@components/utils/textVariables'

/**
 * This method is responsible for toggling field based on dynamic change of "Request trading account" checkbox.
 * @param values 
 * @returns 
 */
const showTradingField = (values: any): boolean => {
  return values["isRequestTradingAccount"];
};

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

/**
 * This is fields config for registration to enable Trading account registration.
 */
export const b2bRegistrationConfig = [
  {
    key: 'isRequestTradingAccount',
    id: 'isRequestTradingAccount',
    name: 'isRequestTradingAccount',
    label: 'Request trading account',
    customComponent: 'CustomCheckbox',
    className: 'flex-inline',

    /**
     * This method ALWAYS returns true to show "Request trading account" checkbox on form.
     * @param values 
     * @returns 
     */
    show: (values: any) => {
      return true;
    }
  },
  {
    key: 'companyName',
    id: 'companyName',
    name: 'companyName',
    label: 'Company Name',
    type: 'text',
    placeholder: 'Company name',
    show: showTradingField, // Toggle field rendering based on dynamic value of "Request trading account" checkbox.
  },
  {
    key: 'registeredNumber',
    id: 'registeredNumber',
    name: 'registeredNumber',
    label: "Registered Number",
    type: 'phone',
    placeholder: 'Registered number',
    show: showTradingField, // Toggle field rendering based on dynamic value of "Request trading account" checkbox.
  },
  {
    key: 'email',
    id: 'email',
    name: 'email',
    label: 'Email',
    type: 'email',
    placeholder: 'john@doe.com',
    show: showTradingField, // Toggle field rendering based on dynamic value of "Request trading account" checkbox.
  },
  {
    key: 'mobileNumber',
    id: 'mobileNumber',
    name: 'mobileNumber',
    label: "Mobile Number",
    type: 'phone',
    placeholder: 'Mobile number',
    show: showTradingField, // Toggle field rendering based on dynamic value of "Request trading account" checkbox.
  },
  {
    key: 'phoneNumber',
    id: 'phoneNumber',
    name: 'phoneNumber',
    label: "Phone Number",
    type: 'phone',
    placeholder: 'Phone number',
    show: showTradingField, // Toggle field rendering based on dynamic value of "Request trading account" checkbox.
  },
  {
    key: 'address1',
    id: 'address1',
    name: 'address1',
    label: GENERAL_ADDRESS_LINE1,
    type: 'text',
    placeholder: GENERAL_ADDRESS_LINE1,
    show: showTradingField, // Toggle field rendering based on dynamic value of "Request trading account" checkbox.
  },
  {
    key: 'address2',
    id: 'address2',
    name: 'address2',
    label: GENERAL_ADDRESS_LINE2,
    type: 'text',
    placeholder: GENERAL_ADDRESS_LINE2,
    show: showTradingField, // Toggle field rendering based on dynamic value of "Request trading account" checkbox.
  },
  {
    key: 'city',
    id: 'city',
    name: 'city',
    label: GENERAL_CITY,
    type: 'text',
    placeholder: GENERAL_CITY,
    show: showTradingField, // Toggle field rendering based on dynamic value of "Request trading account" checkbox.
  },
  {
    key: 'postCode',
    id: 'postCode',
    name: 'postCode',
    label: GENERAL_POSTCODE,
    type: 'text',
    placeholder: GENERAL_POSTCODE,
    show: showTradingField, // Toggle field rendering based on dynamic value of "Request trading account" checkbox.
  },
  {
    key: 'country',
    id: 'country',
    name: 'country',
    as: 'select',
    options: countryList,
    label: GENERAL_COUNTRY,
    show: showTradingField, // Toggle field rendering based on dynamic value of "Request trading account" checkbox.
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
