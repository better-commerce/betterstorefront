import { useMemo } from 'react'

//
import { DeliveryType } from '@components/utils/constants'
import ShippingAddressForm from '../ShippingAddressForm'
import BillingAddressForm from '../BillingAddressForm'
import AddressBook from '@components/SectionCheckoutJourney/checkout/AddressBook'

const withAddressSelection = (Component: any) => (props: any) => {
  const { basket, shippingCountries, billingCountries, deliveryTypeMethod, setDeliveryTypeMethod, deliveryMethods, featureToggle, onSubmit, searchAddressByPostcode, user, currentStep, addressBookProps, appConfig } = props

  const renderAddressFormUI = useMemo(() => {
    return () => {
      if (addressBookProps?.addressList?.length > 0) {
        return <AddressBook {...addressBookProps} currentStep={currentStep} />
      }
      if (deliveryTypeMethod?.type?.includes(DeliveryType.STANDARD_DELIVERY) || deliveryTypeMethod?.type?.includes(DeliveryType.EXPRESS_DELIVERY)) {
        return <ShippingAddressForm shippingCountries={shippingCountries} onSubmit={onSubmit} searchAddressByPostcode={searchAddressByPostcode} deliveryType={deliveryTypeMethod?.type} isGuest={true} basket={basket} deliveryTypeMethod={deliveryTypeMethod} setDeliveryTypeMethod={setDeliveryTypeMethod} featureToggle={featureToggle} deliveryMethods={deliveryMethods} billingCountries={billingCountries} currentStep={currentStep} appConfig={appConfig} />
      } else if (deliveryTypeMethod?.type?.includes(DeliveryType.COLLECT)) {
        return <BillingAddressForm shippingCountries={shippingCountries} billingCountries={billingCountries} searchAddressByPostcode={searchAddressByPostcode} onSubmit={onSubmit} useSameForBilling={false} shouldDisplayEmail={false} currentStep={currentStep} />
      } else {
        return <></>
      }
    }
  }, [addressBookProps?.addressList, deliveryTypeMethod, addressBookProps?.selectedAddress])

  return (
    <>
      <Component {...props} />
      {renderAddressFormUI()}
    </>
  )
}

export default withAddressSelection
