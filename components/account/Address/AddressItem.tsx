import { useState } from 'react'
import Form from './AddressBookForm'
import eventDispatcher from '@components/services/analytics/eventDispatcher'
import { EVENTS_MAP } from '@components/services/analytics/constants'
import {
  GENERAL_EDIT,
  GENERAL_DELETE,
  GENERAL_DEFAULT_DELIVERY_ADDRESS,
  GENERAL_DEFAULT_BILLING_ADDRESS,
} from '@components/utils/textVariables'
import { getCurrentPage } from '@framework/utils/app-util'
import { recordGA4Event } from '@components/services/analytics/ga4'

export default function AddressItem({
  item,
  updateAddress,
  errCallback = () => {},
  successCallback = () => {},
  userId,
  deleteAddress,
}: any) {
  const [isEditMode, setEditMode] = useState(false)
  const {
    title,
    firstName,
    lastName,
    address1,
    address2,
    city,
    state,
    postCode,
    country,
    phoneNo,
    isDefault,
    isDefaultBilling,
    isDefaultDelivery,
    isDefaultSubscription,
    countryCode,
    user,
    label
  } = item

  const { CustomerUpdated } = EVENTS_MAP.EVENT_TYPES

  const handleAddressSubmit = async (values: any) => {
    let currentPage = getCurrentPage()
    if (typeof window !== "undefined") {
      if (currentPage) {
        recordGA4Event(window, 'address_changes', {
          delivery_address_name: values?.address1,
          current_page: currentPage,
        });
      }
    }
    return updateAddress({ ...item, ...values, ...{ userId } })
      .then(
        () =>
          successCallback() && isEditMode &&
          eventDispatcher(CustomerUpdated, {
            entity: JSON.stringify({
              id: user.userId,
              name: user.username,
              dateOfBirth: user.yearOfBirth,
              gender: user.gender,
              email: user.email,
              postCode: user.postCode,
            }),
            entityId: user.userId,
            entityName: user.firstName + user.lastName,
            eventType: CustomerUpdated,
          })
      )
      .catch(() => errCallback())
  }

  const deleteItem = () => {
    deleteAddress({ userId, addressId: item.id })
      .then(
        () =>
          successCallback() &&
          eventDispatcher(CustomerUpdated, {
            entity: JSON.stringify({
              id: user.userId,
              name: user.username,
              dateOfBirth: user.yearOfBirth,
              gender: user.gender,
              email: user.email,
              postCode: user.postCode,
            }),
            entityId: user.userId,
            entityName: user.firstName + user.lastName,
            eventType: CustomerUpdated,
          })
      )
      .catch(() => errCallback)
  }

  return (
    <div>
      {isEditMode ? (
        <Form
          initialValues={{
            title: title || 'title',
            firstName: firstName || '',
            lastName: lastName || '',
            address1: address1 || '',
            address2: address2 || '',
            city: city || '',
            state: state || '',
            postCode: postCode || '',
            countryCode: countryCode || '',
            country: country || '',
            phoneNo: phoneNo || '',
            isDefault: isDefault || false,
            isDefaultBilling: isDefaultBilling || false,
            isDefaultDelivery: isDefaultDelivery || false,
            isDefaultSubscription: isDefaultSubscription || false,
            label: label || 'Home'
          }}
          closeEditMode={() => setEditMode(false)}
          onSubmit={handleAddressSubmit}
        />
      ) : (
        <>
          <div className="flex flex-row items-center justify-between px-5 py-5 mt-5 mb-5 border rounded-lg">
            <div className="flex flex-col text-md font-regular">
              <span className="text-xl font-bold">
                {item.firstName + ' ' + item.lastName}
              </span>
              {item.label && (
                  <span className="p-1 bg-black text-white text-sm rounded-sm ">
                    {label}
                  </span>
                )}
              <span>{item.address1}</span>
              <span>{item.address2}</span>

              <span>{item.city}</span>
              <span>{item.postCode}</span>
              <span>{item.country}</span>
              <span>{item.phoneNo}</span>
            </div>
            <div>
              <div className="justify-end mt-6 space-y-4 sm:flex sm:space-x-4 sm:space-y-0 md:mt-0">
                <button
                  onClick={() => setEditMode(true)}
                  className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 md:w-auto"
                >
                  {GENERAL_EDIT}
                </button>
                <button
                  onClick={deleteItem}
                  className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 md:w-auto"
                >
                  {GENERAL_DELETE}
                </button>
              </div>
              <div className="flex items-center justify-between mt-5">
                {item.isDefaultDelivery && (
                  <div className="px-2 py-2 mr-2 border">
                    {GENERAL_DEFAULT_DELIVERY_ADDRESS}
                  </div>
                )}
                {item.isDefaultBilling && (
                  <div className="px-2 py-2 border">
                    {GENERAL_DEFAULT_BILLING_ADDRESS}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
