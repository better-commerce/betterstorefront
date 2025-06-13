import { useTranslation } from '@commerce/utils/use-translation'
export const useAddCompanyUserConfig = () => {
  const translate = useTranslation()
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
      key: 'email',
      id: 'email',
      name: 'email',
      label: translate('label.addressBook.emailText'),
      type: 'email',
      placeholder: translate('common.message.enterYourEmailText'),
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
    {
      key: 'role',
      label: 'Role',
      type: 'select',
      options: [
        { value: '1', label: 'Admin' },
        { value: '2', label: 'Sales user' },
        { value: '3', label: 'User' },
      ],
      placeholder: 'Select a role',
    },
    {
      key: 'mobileNumber',
      id: 'mobileNumber',
      name: 'mobileNumber',
      label: translate('common.label.mobileNumText'),
      type: 'phone',
      placeholder: translate('common.label.mobileNumText'),
    },
    {
      key: 'phoneNumber',
      id: 'phoneNumber',
      name: 'phoneNumber',
      label: translate('label.b2b.phoneNumberText'),
      type: 'phone',
      placeholder: translate('label.b2b.phoneNumberText'),
    },
  ]
}
