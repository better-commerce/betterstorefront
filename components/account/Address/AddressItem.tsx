import { useState } from 'react'
import Form from './AddressBookForm'
import eventDispatcher from '@components/services/analytics/eventDispatcher'
import { EVENTS_MAP } from '@components/services/analytics/constants'
import { getCurrentPage, isB2BUser } from '@framework/utils/app-util'
import { recordGA4Event } from '@components/services/analytics/ga4'
import { UserRoleType } from '@framework/utils/enums'
import DeleteModal from './DeleteModal'
import { useTranslation } from '@commerce/utils/use-translation'

export default function AddressItem({
  item,
  updateAddress,
  errCallback = () => { },
  successCallback = () => { },
  userId,
  deleteAddress,
  onEditAddress = (id: number) => { },
}: any) {
  const translate = useTranslation();
  const [isEditMode, setEditMode] = useState(false)
  const {
    title,
    firstName,
    lastName,
    address1,
    address2,
    address3,
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
    label,
  } = item

  const { CustomerUpdated } = EVENTS_MAP.EVENT_TYPES
  let [isOpen, setIsOpen] = useState(false)

  const handleAddressSubmit = async (values: any) => {
    let currentPage = getCurrentPage()
    if (typeof window !== 'undefined') {
      if (currentPage) {
        recordGA4Event(window, 'address_changes', {
          delivery_address_name: values?.address1,
          current_page: currentPage,
        })
      }
    }
    return updateAddress({ ...item, ...values, ...{ userId } })
      .then(
        () =>
          successCallback() &&
          isEditMode &&
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
    deleteCloseModal()
  }

  function deleteCloseModal() {
    setIsOpen(false)
  }

  function deleteOpenModal() {
    setIsOpen(true)
  }
  const isB2B = isB2BUser(user)
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
            address3: address3 || '',
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
            label: label || 'Home',
          }}
          closeEditMode={() => setEditMode(false)}
          onSubmit={handleAddressSubmit}
        />
      ) : (
        <>
          {isB2B ? (
            <div className='flex flex-col w-full px-5 py-5 mt-0 mb-0 border rounded-lg '>
              <div className='flex justify-between w-full gap-2'>
                <div>
                  <span className="text-xl font-bold">
                    {item?.firstName + ' ' + item?.lastName}
                  </span>
                  {item?.label && (
                    <span className="flex items-start mt-1">
                      <span className="px-0 font-bold text-black uppercase font-12">
                        {label}
                      </span>
                    </span>
                  )}
                </div>
                <div>
                  {item?.isDefault && (
                    <div className="p-1 px-2 bg-black border rounded-md">
                      <span className="font-medium text-white font-12">
                        Default
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-center justify-betweenlg:flex-row">
                <div className="flex flex-col w-full text-md font-regular">
                  <span className='mt-2'>{item?.address1}</span>
                  <span>{item?.address2}</span>
                  <span>
                    {item?.city} - {item?.postCode}
                  </span>
                  <span>{item?.phoneNo}</span>
                </div>
                <div className='w-full'>
                  {user?.companyUserRole === UserRoleType.ADMIN && <div className="justify-end w-full mt-6 space-y-4 sm:flex sm:space-x-4 sm:space-y-0 md:mt-0">
                    <button
                      onClick={() => {
                        onEditAddress(item?.id)
                      }}
                      className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 md:w-auto"
                    >
                      {translate('common.label.editText')}
                    </button>
                    <button
                      onClick={deleteOpenModal}
                      className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 md:w-auto"
                    >
                      {translate('common.label.deleteText')}
                    </button>
                  </div>}

                </div>
              </div>
            </div>
          ) : (
            <div className='flex flex-col w-full px-5 py-5 mt-0 mb-0 border rounded-lg '>
              <div className='flex justify-between w-full gap-2'>
                <div>
                  <span className="text-xl font-bold">
                    {item?.firstName + ' ' + item?.lastName}
                  </span>
                  {item?.label && (
                    <span className="flex items-start mt-1">
                      <span className="px-0 font-bold text-black uppercase font-12">
                        {label}
                      </span>
                    </span>
                  )}
                </div>
                <div>
                  {item?.isDefault && (
                    <div className="p-1 px-2 bg-black border rounded-md">
                      <span className="font-medium text-white font-12">
                        Default
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-center justify-between lg:flex-row">
                <div className="flex flex-col w-full text-md font-regular">
                  <span className='mt-2'>{item?.address1}</span>
                  <span>{item?.address2}</span>
                  <span>{item?.address3}</span>
                  <span>{item?.country}</span>
                  <span> {item?.city} - {item?.postCode} 
                  </span> <span>{item?.phoneNo}</span> 
                </div>
                <div className='w-full'>
                  <div className="justify-end w-full mt-6 space-y-4 sm:flex sm:space-x-4 sm:space-y-0 md:mt-0">
                    <button
                      onClick={() => {
                        onEditAddress(item?.id)
                      }}
                      className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 md:w-auto"
                    >
                      {translate('common.label.editText')}
                    </button>
                    <button
                      onClick={deleteOpenModal}
                      className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 md:w-auto"
                    >
                      {translate('common.label.deleteText')}
                    </button>
                  </div>

                </div>
              </div>
            </div>
          )}
          <DeleteModal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            deleteItem={deleteItem}
          />
        </>
      )}
    </div>
  )
}
