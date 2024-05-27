import { useMemo } from 'react'

//
import { DeliveryType } from '@components/utils/constants'
import ShippingAddressForm from '../ShippingAddressForm'
import BillingAddressForm from '../BillingAddressForm'
import AddressBook from '@components/SectionCheckoutJourney/checkout/AddressBook'

const withAddressSelection = (Component: any) => (props: any) => {
  const { basket, shippingCountries, billingCountries, deliveryTypeMethod, setDeliveryTypeMethod, deliveryMethods, featureToggle, onSubmit, searchAddressByPostcode, user, currentStep, addressBookProps } = props

  const renderAddressFormUI = useMemo(() => {
    return () => {
      if (addressBookProps?.addressList?.length > 0) {
        return <AddressBook {...addressBookProps} currentStep={currentStep} />
      }
      if (deliveryTypeMethod?.type?.includes(DeliveryType.STANDARD_DELIVERY) || deliveryTypeMethod?.type?.includes(DeliveryType.EXPRESS_DELIVERY)) {
        return <ShippingAddressForm shippingCountries={shippingCountries} onSubmit={onSubmit} searchAddressByPostcode={searchAddressByPostcode} deliveryType={deliveryTypeMethod?.type} isGuest={true} basket={basket} deliveryTypeMethod={deliveryTypeMethod} setDeliveryTypeMethod={setDeliveryTypeMethod} featureToggle={featureToggle} deliveryMethods={deliveryMethods} billingCountries={billingCountries} currentStep={currentStep} />
      } else if (deliveryTypeMethod?.type?.includes(DeliveryType.COLLECT)) {
        return <BillingAddressForm shippingCountries={shippingCountries} billingCountries={billingCountries} searchAddressByPostcode={searchAddressByPostcode} onSubmit={onSubmit} useSameForBilling={false} shouldDisplayEmail={false} currentStep={currentStep} />
      } else {
        return <></>
      }
    }
  }, [addressBookProps?.addressList, deliveryTypeMethod])

  return (
    <>
      <div className="flex flex-col gap-0 p-2 my-2 border border-gray-200 rounded-md sm:my-4 sm:p-4 bg-gray-50">
        <span className="font-semibold text-black font-14 mob-font-12 dark:text-black">{user?.userEmail || user?.email}</span>
      </div>
      <Component {...props} />
      {renderAddressFormUI()}
    </>
  )
}

export default withAddressSelection
