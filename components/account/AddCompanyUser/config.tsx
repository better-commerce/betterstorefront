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
      key: 'country',
      label: translate('label.checkout.countryText'),
      type: 'select',
      options: hierarchy?.filter((item: IHierarchy) => item?.type === HierarchyType.Country)?.map((item: IHierarchy) => ({ value: item?.name, label: item?.name })),
      placeholder: translate('label.myAccount.rfq.selectCountryText'),
    },
    {
      key: 'zone',
      label: translate('label.myAccount.rfq.zoneText'),
      // label: translate('common.label.mobileNumText'),
      type: 'select',
      options: hierarchy?.filter((item: IHierarchy) => item?.type === HierarchyType.Zone)?.map((item: IHierarchy) => ({ value: item.id, label: item?.name })),
      placeholder: 'Select a zone',
    },
    {
      key: 'branch',
      label: translate('label.myAccount.rfq.branchText'),
      // label: translate('common.label.mobileNumText'),
      type: 'select',
      options: [],
      placeholder: translate('label.myAccount.rfq.selectBranchText'),
    },
    {
      key: 'role',
      label: translate('label.myAccount.rfq.role'),
      type: 'select',
      options: [
        { value: '1', label: translate('label.myAccount.rfq.roleAdminText') },
        { value: '2', label: translate('label.myAccount.rfq.roleSalesUserText') },
        { value: '3', label: translate('label.myAccount.rfq.roleUserText') },
        { value: '4', label: translate('label.myAccount.rfq.roleBranchHeadText') },
        { value: '5', label: translate('label.myAccount.rfq.roleZonalHeadText') },
        { value: '6', label: translate('label.myAccount.rfq.roleOrderCreatorText') },
      ],
      placeholder: translate('label.myAccount.rfq.selectRoleText'),
    },
  ]
}
