export const companyMenuTabs = ({ translate }: any) => {
  return [
    {
      name: translate('label.myAccount.myCompanyMenus.user'),
      value: 'users',
    },
    {
      name: translate('label.myAccount.myCompanyMenus.order'),
      value: 'orders',
    },
    {
      name: translate('label.myAccount.myCompanyMenus.quote'),
      value: 'quotes',
    },
    {
      name: translate('label.myAccount.myCompanyMenus.address'),
      value: 'addresses',
    },
    {
      name: translate('label.myAccount.myCompanyMenus.invoice'),
      value: 'invoices',
    },
  ]
}

export enum CompanyTabs {
  USER = 'users',
  ORDER = 'orders',
  QUOTE = 'quotes',
  ADDRESS = 'addresses',
  INVOICE = 'invoices',
}
