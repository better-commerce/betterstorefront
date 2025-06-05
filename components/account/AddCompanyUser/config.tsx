import { useTranslation } from '@commerce/utils/use-translation'

export interface IHierarchy {
  companyId: string;
  id: string;
  name: string;
  parentId: string;
  type: number;
  typeLabel: string;
}

enum HierarchyType {
  Country = 1,
  Zone = 2,
  Branch = 3
}

export interface ICountry {
  itemText: string
  itemValue: string
}
export const useAddCompanyUserConfig = (hierarchy: Array<IHierarchy> = []) => {
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
      key: 'countryCode',
      label: 'Country',
      type: 'select',
      options: hierarchy?.filter((item: IHierarchy) => item?.type === HierarchyType.Country)?.map((item: IHierarchy) => ({ value: item?.name, label: item?.name })),
      placeholder: 'Select a country',
    },
    {
      key: 'zone',
      label: 'Zone',
      // label: translate('common.label.mobileNumText'),
      type: 'select',
      options: hierarchy?.filter((item: IHierarchy) => item?.type === HierarchyType.Zone)?.map((item: IHierarchy) => ({ value: item?.name, label: item?.name })),
      placeholder: 'Select a zone',
    },
    {
      key: 'branch',
      label: 'Branch',
      // label: translate('common.label.mobileNumText'),
      type: 'select',
      options: hierarchy?.filter((item: IHierarchy) => item?.type === HierarchyType.Branch)?.map((item: IHierarchy) => ({ value: item?.name, label: item?.name })),
      placeholder: 'Select a branch',
    },
    {
      key: 'role',
      label: 'Role',
      type: 'select',
      options: [
        { value: 'Branch head', label: 'Branch head' },
        { value: 'Zonal head', label: 'Zonal head' },
        { value: 'Order head', label: 'Order head' },
      ],
      placeholder: 'Select a role',
    },
  ]
}
