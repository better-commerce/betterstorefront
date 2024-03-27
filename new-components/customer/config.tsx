import { useTranslation } from '@commerce/utils/use-translation';
import countryList from '@new-components/utils/countryList'

/**
 * This method is responsible for toggling field based on dynamic change of "Request trading account" checkbox.
 * @param values
 * @returns
 */
const showTradingField = (values: any): boolean => {
  return values['isRequestTradingAccount']
}

export const useRegistrationConfig = () => {
  const translate = useTranslation();
  return [
    {
      key: 'firstName',
      label: translate('common.label.firstNameText'),
      type: 'text',
      placeholder: translate('common.label.firstNameText'),
    },
    {
      key: 'lastName',
      label: translate('common.label.lastNameText'),
      type: 'text',
      placeholder: translate('common.label.lastNameText'),
    },
    {
      key: 'password',
      label: translate('label.myAccount.passwordText'),
      type: 'password',
      placeholder: translate('label.myAccount.passwordText'),
    },
    {
      key: 'confirmPassword',
      label: translate('label.myAccount.confirmPasswordText'),
      type: 'password',
      placeholder: translate('label.myAccount.confirmPasswordText'),
    },
  ];
};

/**
 * This is fields config for registration to enable Trading account registration.
 */
export const useB2bRegistrationConfig = () => {
  const translate = useTranslation();
  return [
    {
      key: 'isRequestTradingAccount',
      id: 'isRequestTradingAccount',
      name: 'isRequestTradingAccount',
      label: translate('label.b2b.requestTradingAccountText'),
      customComponent: 'CustomCheckbox',
      className: 'flex-inline',
  
      /**
       * This method ALWAYS returns true to show "Request trading account" checkbox on form.
       * @param values
       * @returns
       */
      show: (values: any) => {
        return true
      },
    },
    {
      key: 'companyName',
      id: 'companyName',
      name: 'companyName',
      label: translate('label.b2b.companyNameText'),
      type: 'text',
      placeholder: translate('label.b2b.companyNameText'),
      show: showTradingField, // Toggle field rendering based on dynamic value of "Request trading account" checkbox.
    },
    {
      key: 'registeredNumber',
      id: 'registeredNumber',
      name: 'registeredNumber',
      label: translate('label.b2b.registeredNumberText'),
      type: 'phone',
      placeholder: translate('label.b2b.registeredNumberText'),
      show: showTradingField, // Toggle field rendering based on dynamic value of "Request trading account" checkbox.
    },
    {
      key: 'email',
      id: 'email',
      name: 'email',
      label: translate('label.addressBook.emailText'),
      type: 'email',
      placeholder: translate('common.message.enterYourEmailText'),
      show: showTradingField, // Toggle field rendering based on dynamic value of "Request trading account" checkbox.
    },
    {
      key: 'mobileNumber',
      id: 'mobileNumber',
      name: 'mobileNumber',
      label: translate('common.label.mobileNumText'),
      type: 'phone',
      placeholder: translate('common.label.mobileNumText'),
      show: showTradingField, // Toggle field rendering based on dynamic value of "Request trading account" checkbox.
    },
    {
      key: 'phoneNumber',
      id: 'phoneNumber',
      name: 'phoneNumber',
      label: translate('label.b2b.phoneNumberText'),
      type: 'phone',
      placeholder: translate('label.b2b.phoneNumberText'),
      show: showTradingField, // Toggle field rendering based on dynamic value of "Request trading account" checkbox.
    },
    {
      key: 'address1',
      id: 'address1',
      name: 'address1',
      label: translate('common.label.addressLine1Text'),
      type: 'text',
      placeholder: translate('common.label.addressLine1Text'),
      show: showTradingField, // Toggle field rendering based on dynamic value of "Request trading account" checkbox.
    },
    {
      key: 'address2',
      id: 'address2',
      name: 'address2',
      label: translate('common.label.addressLine2Text'),
      type: 'text',
      placeholder: translate('common.label.addressLine2Text'),
      show: showTradingField, // Toggle field rendering based on dynamic value of "Request trading account" checkbox.
    },
    {
      key: 'city',
      id: 'city',
      name: 'city',
      label: translate('label.addressBook.townCityText'),
      type: 'text',
      placeholder: translate('label.addressBook.townCityText'),
      show: showTradingField, // Toggle field rendering based on dynamic value of "Request trading account" checkbox.
    },
    {
      key: 'postCode',
      id: 'postCode',
      name: 'postCode',
      label: translate('common.label.postcodeText'),
      type: 'text',
      placeholder: translate('common.label.postcodeText'),
      show: showTradingField, // Toggle field rendering based on dynamic value of "Request trading account" checkbox.
    },
    {
      key: 'country',
      id: 'country',
      name: 'country',
      as: 'select',
      options: countryList,
      label: translate('label.checkout.countryText'),
      show: showTradingField, // Toggle field rendering based on dynamic value of "Request trading account" checkbox.
    },
  ]
} 

export const useLoginConfig = () => {
 const translate = useTranslation();
 return [
    {
      key: 'email',
      label: translate('label.addressBook.emailText'),
      type: 'email',
      placeholder: translate('common.message.enterYourEmailText'),
    },
    {
      key: 'password',
      label: translate('label.myAccount.passwordText'),
      type: 'password',
      placeholder: translate('common.label.strongPasswordText'),
    },
  ]
}
