import React, { useEffect, useMemo, useState } from 'react'
import { LoadingDots, useUI } from '@components/ui'
import { displayCTAByUserRole, isB2BUser } from '@framework/utils/app-util'
import { AlertType, CheckoutStep, UserRoleType } from '@framework/utils/enums'
import BillingAddressForm from './BillingAddressForm'
import { isMobile } from 'react-device-detect'
import { DeliveryType, EmptyObject } from '@components/utils/constants'
import { useTranslation } from '@commerce/utils/use-translation'

interface AddressBookProps {
  editAddressValues: any
  onEditAddressToggleView: any
  onAddressSelect: (shippingAddress: any, billingAddress?: any) => void
  onAddNewAddress: () => void
  onContinue: () => void
  onSubmit: any
  searchAddressByPostcode: any
  addressList: any
  selectedAddress: any
  shippingCountries: any
  billingCountries: any
  basket: any
  deliveryTypeMethod?: any
  setDeliveryTypeMethod?: any
  onContinueToSelectDeliveryType?: any
  featureToggle?: any
  deliveryMethods?: any
  currentStep?: any
  appConfig?: any
}

const AddressBook: React.FC<AddressBookProps> = ({
  editAddressValues,
  onEditAddressToggleView,
  addressList,
  onAddressSelect,
  onAddNewAddress,
  onContinue,
  onSubmit,
  searchAddressByPostcode,
  selectedAddress,
  shippingCountries,
  billingCountries,
  basket,
  deliveryTypeMethod,
  featureToggle,
  onContinueToSelectDeliveryType,
  currentStep,
  appConfig,
}) => {
  const translate = useTranslation()
  const { user, setAlert, isGuestUser } = useUI()
  const { shippingAddress: selectedShippingAddress, billingAddress: selectedBillingAddress, } = selectedAddress || basket || EmptyObject
  const [selectedAddressId, setSelectedAddressId] = useState<string>(selectedShippingAddress?.id || 0)
  const [useSameForBilling, setUseSameForBilling] = useState<boolean>(true)
  const [hasSameBillingChanged, setHasSameBillingChanged] = useState(false)
  const isDeliverMethodSelected = useMemo(() => deliveryTypeMethod?.type?.includes(DeliveryType.STANDARD_DELIVERY) || deliveryTypeMethod?.type?.includes(DeliveryType.EXPRESS_DELIVERY), [deliveryTypeMethod])
  const isCNCMethodSelected = useMemo(() => deliveryTypeMethod?.type?.includes(DeliveryType.COLLECT), [deliveryTypeMethod])
  
  const isSameAddress = useMemo(() => {
    if (hasSameBillingChanged) return useSameForBilling
    if (basket?.shippingAddress && basket?.billingAddress) {
      return basket?.shippingAddress?.id === basket?.billingAddress?.id
    }
    return useSameForBilling
  }, [basket, useSameForBilling, hasSameBillingChanged])
  const [showBillingAddress, setShowBillingAddress] = useState<boolean>(!isSameAddress)
  const [mappedAddressList, setMappedAddressList] = useState<any>(addressList)

  useEffect(() => {
    if (basket?.shippingAddress?.id && basket?.billingAddress?.id) {
      setShowBillingAddress(basket?.shippingAddress?.id !== basket?.billingAddress?.id)
    }
  }, [basket?.shippingAddress, basket?.billingAddress])

  useEffect(() => {
    setShowBillingAddress(!isSameAddress)
  }, [isSameAddress])

  useEffect(() => {
    setMappedAddressList(addressList)
  }, [addressList, isGuestUser])


  const handleAddressSelection = (addressId: string) => {
    setSelectedAddressId(addressId)
    const shippingAddress = mappedAddressList.find(
      (address: any) => address?.id === addressId
    )
    // if billing address exist
    if(basket?.billingAddress?.id !== basket?.shippingAddress?.id){
      onAddressSelect( shippingAddress, basket?.billingAddress )
    } else {
      onAddressSelect(
        shippingAddress,
        useSameForBilling ? shippingAddress : undefined
      )
    }
  }

  useEffect(()=>{
    if(basket?.shippingAddress && selectedAddressId){
      handleAddressSelection(selectedAddressId)
    }
  },[])

  const handleContinue = () => {
    if (isDeliverMethodSelected && selectedShippingAddress && selectedBillingAddress) {
      onContinue()
    } else if (isCNCMethodSelected && selectedBillingAddress) {
      onContinue()
    } else {
      setAlert({ type: AlertType.ERROR, msg: translate('common.message.chooseShippingBillingAddressMsg'), })
    }
  }

  const isB2BUserLoggedIn = isB2BUser(user)
  const noAddressesFound = mappedAddressList?.length < 1
  const isDeliverTypeSelected = useMemo(() => deliveryTypeMethod?.type?.includes(DeliveryType.STANDARD_DELIVERY) || deliveryTypeMethod?.type?.includes(DeliveryType.EXPRESS_DELIVERY), [deliveryTypeMethod])

  if (mappedAddressList === undefined) {
    return <LoadingDots />
  }

  const shouldHideView = useMemo(() => {
    return currentStep === CheckoutStep.ADDRESS && featureToggle?.features?.enableCollectDeliveryOption
  }, [currentStep, featureToggle])

  const isBillingAddress = useMemo(() => {
    return (address: any) => {
      if (typeof address?.isBilling === 'boolean' && typeof address?.isDefaultBilling === 'boolean') {
        return address?.isBilling || address?.isDefaultBilling
      } else if (typeof address?.isDefaultBilling === 'boolean') {
        if (address?.isDefaultBilling && address?.isDefaultDelivery) return !address?.isDefaultBilling
        return address?.isDefaultBilling
      }
      return address?.isBilling || false
    }
  }, [])

  return (
    <>
      {!shouldHideView ? (
        <>
          <div className="flex flex-col gap-0 my-4 bg-white rounded-md sm:p-4 sm:border sm:border-gray-200 sm:bg-gray-50">
            <div className="flex items-center justify-between w-full">
              <h5 className="px-0 font-semibold uppercase sm:px-0 font-18 dark:text-black">
                {translate('label.addressBook.addressBookTitleText')}
              </h5>
              {((!isGuestUser) && (displayCTAByUserRole(user, { isGuestUser, roleId: UserRoleType.ADMIN }))) && <button
                className="py-2 text-xs font-semibold text-black underline sm:text-sm dark:text-black hover:text-orange-600"
                onClick={onAddNewAddress}
              >
                {translate('label.addressBook.addNewAddressText')}
              </button>}
            </div>
            {noAddressesFound && (
              <p className=" dark:text-black">
                {translate('label.checkout.noAddressFoundText')}
              </p>
            )}

            {isDeliverMethodSelected && (
              <>
                {isGuestUser ? (
                  <div className={`grid border border-gray-200 sm:border-0 rounded-md sm:rounded-none sm:p-0 p-2 grid-cols-1 mt-2 bg-[#fbfbfb] sm:bg-transparent sm:mt-4 gap-2 ${ isMobile ? '' : 'max-panel' }`} >
                    <h5 className="mt-2 mb-2 font-normal text-gray-400 sm:font-medium sm:text-black font-14 mob-font-12 dark:text-black">Shipping Address</h5>
                    {(mappedAddressList?.length === 1 
                      ? mappedAddressList?.filter((x: any) => (x?.id > 0))
                      : mappedAddressList?.filter((x: any) => (x?.id > 0 && !isBillingAddress(x))))
                      ?.map((address: any, addIdx: number) => (
                        <div
                          className={`flex gap-1 sm:p-3 p-2 justify-between cursor-pointer rounded-md items-center ${
                            address?.isDefault ? 'bg-gray-200' : ''
                          } ${
                            address?.id === selectedAddressId
                              ? 'bg-gray-200'
                              : 'bg-transparent'
                          }`}
                          key={addIdx}
                          onClick={() => handleAddressSelection(address?.id)}
                        >
                          <div className="flex w-full">
                            <div className="check-panel">
                              <span
                                className={`rounded-check rounded-full check-address ${
                                  address?.id === selectedAddressId
                                    ? 'bg-black border border-black'
                                    : 'bg-white border border-gray-600'
                                }`}
                              ></span>
                            </div>
                            <div className="flex justify-between w-full gap-2 info-panel">
                              <div className="flex flex-col text-xs sm:text-sm dark:text-black">
                                <span className="block font-medium">
                                  {address?.companyName &&
                                    `${address?.companyName}, `}
                                  {address?.firstName && `${address?.firstName} `}
                                  {address?.lastName && `${address?.lastName}, `}
                                  {address?.address1 && `${address?.address1}, `}
                                  {address?.address2 && `${address?.address2}, `}
                                  {address?.address3 && `${address?.address3}, `}
                                </span>
                                <span className="block font-12 dark:text-black">
                                  {address?.city && `${address?.city}, `}
                                  {address?.state && `${address?.state}, `}
                                  {address?.postCode && `${address?.postCode}, `}
                                  {address?.country && `${address?.country} `}
                                </span>
                              </div>
                              {displayCTAByUserRole(user, { isGuestUser, roleId: UserRoleType.ADMIN }) && (
                                <div className="justify-end my-0 edit-btn">
                                  <button
                                    className="text-xs font-medium text-black sm:text-sm dark:text-black hover:text-orange-600"
                                    onClick={(e: any) => {
                                      e.stopPropagation()
                                      onEditAddressToggleView(address)
                                    }}
                                  >
                                    {translate('common.label.editText')}
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                <div className={`grid border border-gray-200 sm:border-0 rounded-md sm:rounded-none sm:p-0 p-2 grid-cols-1 mt-2 bg-[#fbfbfb] sm:bg-transparent sm:mt-4 gap-2 ${ isMobile ? '' : 'max-panel' }`} >
                {(mappedAddressList?.length === 1
                  ? mappedAddressList?.filter((x: any) => (x?.id > 0))
                  : mappedAddressList?.filter((x: any) => (x?.id > 0 && !isBillingAddress(x))))
                    ?.map((address: any, addIdx: number) => (
                      <div
                        className={`flex gap-1 sm:p-3 p-2 justify-between cursor-pointer rounded-md items-center ${
                          address?.isDefault ? 'bg-gray-200' : ''
                        } ${
                          address?.id === selectedAddressId
                            ? 'bg-gray-200'
                            : 'bg-transparent'
                        }`}
                        key={addIdx}
                        onClick={() => handleAddressSelection(address?.id)}
                      >
                        <div className="flex w-full">
                          <div className="check-panel">
                            <span
                              className={`rounded-check rounded-full check-address ${
                                address?.id === selectedAddressId
                                  ? 'bg-black border border-black'
                                  : 'bg-white border border-gray-600'
                              }`}
                            ></span>
                          </div>
                          <div className="flex justify-between w-full gap-2 info-panel">
                            <div className="flex flex-col text-xs sm:text-sm dark:text-black">
                              <span className="block font-medium">
                                {address?.companyName &&
                                  `${address?.companyName}, `}
                                {address?.firstName && `${address?.firstName} `}
                                {address?.lastName && `${address?.lastName}, `}
                                {address?.address1 && `${address?.address1}, `}
                                {address?.address2 && `${address?.address2}, `}
                                {address?.address3 && `${address?.address3}, `}
                              </span>
                              <span className="block font-12 dark:text-black">
                                {address?.city && `${address?.city}, `}
                                {address?.state && `${address?.state}, `}
                                {address?.postCode && `${address?.postCode}, `}
                                {address?.country && `${address?.country} `}
                              </span>
                            </div>
                            {displayCTAByUserRole(user, { isGuestUser, roleId: UserRoleType.ADMIN }) && (
                              <div className="justify-end my-0 edit-btn">
                                <button
                                  className="text-xs font-medium text-black sm:text-sm dark:text-black hover:text-orange-600"
                                  onClick={(e: any) => {
                                    e.stopPropagation()
                                    onEditAddressToggleView(address)
                                  }}
                                >
                                  {translate('common.label.editText')}
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {isDeliverTypeSelected && !noAddressesFound && (

              <>
                {
                  (!isB2BUser(user) || (isB2BUser(user) && user?.companyUserRole === UserRoleType.ADMIN)) && (
                    <div className="mt-4">
                      <input id="useSameForBilling" type="checkbox" defaultChecked={isSameAddress} checked={isSameAddress} onChange={(e) => {
                          setUseSameForBilling(e.target.checked)
                          setHasSameBillingChanged(true)
                          if (e.target.checked) {
                            onAddressSelect( selectedShippingAddress, selectedShippingAddress )
                            setShowBillingAddress(!e.target.checked)
                          } else {
                            onAddressSelect(selectedShippingAddress, undefined)
                          }
                        }}
                      />
                      <label htmlFor="useSameForBilling" className="pl-1 font-semibold text-black font-14">
                        {translate('label.checkout.useSameAddressForBillingText')}
                      </label>
                    </div>
                  )
                }

                {
                  (isB2BUser(user) && user?.companyUserRole !== UserRoleType.ADMIN) && (
                    <div className="mt-4">
                      <input id="useSameForBillingDisabled" type="checkbox" defaultChecked={true} checked={true} disabled={true} />
                      <label htmlFor="useSameForBilling" className="pl-1 font-semibold text-black font-14">
                        {translate('label.checkout.useSameAddressForBillingText')}
                      </label>
                    </div>
                  )
                }
              </>
            )}
            {isDeliverTypeSelected && !useSameForBilling && (
              <div className="mt-4 border-t border-gray-300">
                <BillingAddressForm editAddressValues={editAddressValues} shippingCountries={shippingCountries} billingCountries={billingCountries} searchAddressByPostcode={searchAddressByPostcode} onSubmit={onSubmit} useSameForBilling={useSameForBilling} shouldDisplayEmail={false} appConfig={appConfig} />
              </div>
            )}

            {/*showBillingAddress: {showBillingAddress.toString()}
            useSameForBilling: {useSameForBilling.toString()}*/}
            {((showBillingAddress && useSameForBilling) || (isCNCMethodSelected && useSameForBilling && mappedAddressList?.length > 0) /**&& isGuestUser */) && (<>
              <h5 className="mt-3 mb-4 font-normal text-gray-400 sm:font-medium sm:text-black font-14 mob-font-12 dark:text-black">Billing Address</h5>
              {mappedAddressList
                ?.filter((x: any) => (x?.id > 0 && isBillingAddress(x)))
                ?.map((address: any, addIdx: number) => (
                  <div
                    className={`flex gap-1 sm:p-3 p-2 justify-between cursor-pointer rounded-md items-center ${
                      isBillingAddress(address) ? 'bg-gray-200' : ''
                    } ${
                      isBillingAddress(address)
                        ? 'bg-gray-200'
                        : 'bg-transparent'
                    }`}
                    key={addIdx}
                    // onClick={() => handleAddressSelection(address?.id)}
                  >
                    <div className="flex w-full">
                      <div className="check-panel">
                        <span
                          className={`rounded-check rounded-full check-address ${
                            address?.isBilling
                              ? 'bg-black border border-black'
                              : 'bg-white border border-gray-600'
                          }`}
                        ></span>
                      </div>
                      <div className="flex justify-between w-full gap-2 info-panel">
                        <div className="flex flex-col text-xs sm:text-sm dark:text-black">
                          <span className="block font-medium">
                            {address?.companyName &&
                              `${address?.companyName}, `}
                            {address?.firstName && `${address?.firstName} `}
                            {address?.lastName && `${address?.lastName}, `}
                            {address?.address1 && `${address?.address1}, `}
                            {address?.address2 && `${address?.address2}, `}
                            {address?.address3 && `${address?.address3}, `}
                          </span>
                          <span className="block font-12 dark:text-black">
                            {address?.city && `${address?.city}, `}
                            {address?.state && `${address?.state}, `}
                            {address?.postCode && `${address?.postCode}, `}
                            {address?.country && `${address?.country} `}
                          </span>
                        </div>
                        {displayCTAByUserRole(user, { isGuestUser, roleId: UserRoleType.ADMIN }) && (
                          <div className="justify-end my-0 edit-btn">
                            <button
                              className="text-xs font-medium text-black sm:text-sm dark:text-black hover:text-orange-600"
                              onClick={(e: any) => {
                                e.stopPropagation()
                                onEditAddressToggleView(address,'billing-address')
                              }}
                            >
                              {translate('common.label.editText')}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </>)}
          </div>
          {useSameForBilling && (
            <div className="grid flex-col w-full sm:justify-end sm:flex-row sm:flex sm:w-auto">
              <button
                className="mb-4 border border-black btn-primary lg:py-2 py-3 sm:px-4 px-1 btn-primary disabled:cursor-not-allowed disabled:opacity-60 btn-c btn-primary btn"
                onClick={handleContinue}
              >
                {translate('label.checkout.continueToDeliveryText')}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="grid flex-col w-full sm:justify-end sm:flex-row sm:flex sm:w-auto">
          <button
            className="mb-4 border border-black btn-primary lg:py-2 py-3 sm:px-4 px-1 btn-primary disabled:cursor-not-allowed disabled:opacity-60 btn-c btn-primary btn"
            onClick={onContinueToSelectDeliveryType}
          >
            {translate('label.checkout.continueToDeliveryText')}
          </button>
        </div>
      )}
    </>
  )
}

export default AddressBook
