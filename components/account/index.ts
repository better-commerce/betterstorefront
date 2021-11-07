import MyAccount from './MyAccount'
import MyOrders from './MyOrders'
import AddressBook from './Address/AddressBook'
import ContactPreferences from './ContactPreferences'
import MyDetails from './MyDetails'
import MyReturns from './MyReturns'

const COMPONENTS_MAP: any = {
  'my-account': MyAccount,
  'my-orders': MyOrders,
  'my-details': MyDetails,
  'my-returns': MyReturns,
  'address-book': AddressBook,
  contact: ContactPreferences,
}

export default COMPONENTS_MAP
