import { useState } from 'react'
import Form from './AddressBookForm'

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
  } = item

  const handleAddressSubmit = (values: any) => {
    updateAddress({ ...item, ...values, ...{ userId } })
      .then(() => successCallback() && setEditMode(false))
      .catch(() => errCallback())
  }

  const deleteItem = () => {
    deleteAddress({ userId, addressId: item.id })
      .then(() => successCallback())
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
            country: country || '',
            phoneNo: phoneNo || '',
          }}
          closeEditMode={() => setEditMode(false)}
          onSubmit={handleAddressSubmit}
        />
      ) : (
        <div className="border py-5 px-5 mb-5 mt-5 flex flex-row justify-between items-center">
          <div className="flex flex-col text-xl font-medium">
            <span>{item.firstName + ' ' + item.lastName}</span>
            <span>{item.address1}</span>
            <span>{item.address2}</span>

            <span>{item.city}</span>
            <span>{item.postCode}</span>
            <span>{item.country}</span>
            <span>{item.phoneNo}</span>
          </div>
          <div className="space-y-4 mt-6 sm:flex sm:space-x-4 sm:space-y-0 md:mt-0">
            <button
              onClick={() => setEditMode(true)}
              className="w-full flex items-center justify-center bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 md:w-auto"
            >
              Edit
            </button>
            <button
              onClick={deleteItem}
              className="w-full flex items-center justify-center bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 md:w-auto"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
