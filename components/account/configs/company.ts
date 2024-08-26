export const companyMenuTabs = ({ translate }: any) => {
  return [
    {
      name: translate('label.myAccount.myCompanyMenus.companyDetail'),
      value: 'company',
    },
    {
      name: translate('label.myAccount.myCompanyMenus.user'),
      value: 'users',
    },
    {
      name: translate('label.myAccount.myCompanyMenus.address'),
      value: 'addresses',
    },
  ]
}

export enum CompanyTabs {
  COMPANYDETAIL = 'companyDetail',
  USER = 'users',
  ADDRESS = 'addresses',
}
