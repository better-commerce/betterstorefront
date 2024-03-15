import React, { useEffect, useState } from 'react'
import { LoadingDots, useUI } from '@components/ui'
import { isB2BUser } from '@framework/utils/app-util'
import { AlertType, UserRoleType } from '@framework/utils/enums'
import BillingAddressForm from './BillingAddressForm'
import { isMobile } from 'react-device-detect'
import { EmptyObject } from '@components/utils/constants'
import DeliveryTypeSelection from './DeliveryTypeSelection'
import { ADD_ADDRESS, GENERAL_EDIT } from '@components/utils/textVariables'
import { useTranslation } from '@commerce/utils/use-translation'

interface AddressBookProps {
  editAddressValues: any
  onEditAddressToggleView: (address: any) => void
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
  handleCollect?: any
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
  setDeliveryTypeMethod,
  handleCollect
}) => {
  const translate = useTranslation()
  const { user, setAlert, isGuestUser } = useUI()
  const {
    shippingAddress: selectedShippingAddress,
    billingAddress: selectedBillingAddress,
  } = selectedAddress || basket || EmptyObject
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    selectedShippingAddress?.id || 0
  )
  const [useSameForBilling, setUseSameForBilling] = useState<boolean>(true)
  const [mappedAddressList, setMappedAddressList] = useState<any>(addressList)

  useEffect(() => {
    setMappedAddressList(addressList)
  }, [addressList, isGuestUser])

  const handleAddressSelection = (addressId: string) => {
    setSelectedAddressId(addressId)
    const shippingAddress = mappedAddressList.find(
      (address: any) => address?.id === addressId
    )
    onAddressSelect(
      shippingAddress,
      useSameForBilling ? shippingAddress : undefined
    )
  }

  const handleContinue = () => {
    if (selectedShippingAddress && selectedBillingAddress) {
      onContinue()
    } else {
      setAlert({
        type: AlertType.ERROR,
        msg: translate('message.chooseShippingBillingAddressMsg'),
      })
    }
  }

  const isB2BUserLoggedIn = isB2BUser(user)
  const noAddressesFound = mappedAddressList?.length < 1

  if (mappedAddressList === undefined) {
    return <LoadingDots />
  }

  return (
    <>
      <div className="flex flex-col gap-0 p-2 my-2 border border-gray-200 rounded-md sm:my-4 sm:p-4 bg-gray-50">
        <span className="font-semibold text-black font-14 mob-font-12 dark:text-black">
          {user?.userEmail || user?.email}
        </span>
      </div>
      <DeliveryTypeSelection
        basket={basket}
        deliveryTypeMethod={deliveryTypeMethod}
        setDeliveryTypeMethod={setDeliveryTypeMethod}
      />
      {deliveryTypeMethod?.type === 1 ? (
        <>
          <div className="flex flex-col gap-0 my-4 bg-white rounded-md sm:p-4 sm:border sm:border-gray-200 sm:bg-gray-50">
            <div className="flex items-center justify-between w-full">
              <h5 className="px-0 font-semibold uppercase sm:px-2 font-18 dark:text-black">
                {translate('label.addressBook.addressBookTitleText')}
              </h5>
              <button
                className="py-2 text-xs font-semibold text-black underline sm:text-sm dark:text-black hover:text-orange-600"
                onClick={onAddNewAddress}
              >
                {ADD_ADDRESS}
              </button>
            </div>
            {noAddressesFound && (
              <p className=" dark:text-black">
                {translate('label.checkout.noAddressFoundText')}
              </p>
            )}
            <div
              className={`grid border border-gray-200 sm:border-0 rounded-md sm:rounded-none sm:p-0 p-2 grid-cols-1 mt-2 bg-[#fbfbfb] sm:bg-transparent sm:mt-4 ${
                isMobile ? '' : 'max-panel'
              }`}
            >
              {mappedAddressList
                ?.filter((x: any) => x?.id > 0)
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
                        {isB2BUserLoggedIn ? (
                          <>
                            {user?.companyUserRole === UserRoleType.ADMIN && (
                              <div className="justify-end my-0 edit-btn">
                                <button
                                  className="text-xs font-medium text-black sm:text-sm dark:text-black hover:text-orange-600"
                                  onClick={(e: any) => {
                                    e.stopPropagation()
                                    onEditAddressToggleView(address)
                                  }}
                                >
                                  {GENERAL_EDIT}
                                </button>
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="justify-end my-0 edit-btn">
                            <button
                              className="text-xs font-medium text-black sm:text-sm dark:text-black hover:text-orange-600"
                              onClick={(e: any) => {
                                e.stopPropagation()
                                onEditAddressToggleView(address)
                              }}
                            >
                              {GENERAL_EDIT}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {!noAddressesFound && (
              <div className="px-3 mt-4">
                <input
                  id="useSameForBilling"
                  type="checkbox"
                  checked={useSameForBilling}
                  onChange={(e) => {
                    setUseSameForBilling(e.target.checked)
                    if (e.target.checked) {
                      onAddressSelect(
                        selectedShippingAddress,
                        selectedShippingAddress
                      )
                    } else {
                      onAddressSelect(selectedShippingAddress, undefined)
                    }
                  }}
                />
                <label
                  htmlFor="useSameForBilling"
                  className="pl-1 font-semibold text-black font-14"
                >
                  {translate('label.checkout.useSameAddressForBillingText')}
                </label>
              </div>
            )}
            {!useSameForBilling && (
              <div className="mt-4 border-t border-gray-300">
                <BillingAddressForm
                  editAddressValues={editAddressValues}
                  shippingCountries={shippingCountries}
                  billingCountries={billingCountries}
                  searchAddressByPostcode={searchAddressByPostcode}
                  onSubmit={onSubmit}
                  useSameForBilling={useSameForBilling}
                  shouldDisplayEmail={false}
                />
              </div>
            )}
          </div>
          {useSameForBilling && (
            <div className="grid flex-col w-full sm:justify-end sm:flex-row sm:flex sm:w-auto">
              <button
                className="mb-4 border border-black btn-primary lg:py-2 py-3 sm:px-4 px-1"
                onClick={handleContinue}
              >
                {translate('label.checkout.continueToDeliveryText')}
              </button>
            </div>
          )}
        </>
      ) : (
        <>
         <div className="grid flex-col w-full gap-2 mt-6 sm:justify-end sm:gap-2 sm:flex-row sm:flex sm:w-auto">
              <button
                className="px-3 py-3 border border-black rounded btn-primary disabled:cursor-not-allowed disabled:opacity-60 btn-c lg:py-2 sm:px-4"
                onClick={handleCollect}
              >
                {translate('label.checkout.continueToCollectText')}
              </button>
          </div>
        </>
      )}
    </>
  )
}

export default AddressBook
