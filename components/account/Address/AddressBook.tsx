import React, { useState, useEffect } from 'react'
import { useUI } from '@components/ui/context'
import {
  NEXT_ADDRESS,
  NEXT_EDIT_ADDRESS,
  NEXT_CREATE_ADDRESS,
  NEXT_DELETE_ADDRESS,
} from '@components/utils/constants'
import axios from 'axios'
import AddressItem from './AddressItem'
import Form from './AddressBookForm'
function asyncHandler() {
  function getAddress() {
    return async (id: string) => {
      const response = await axios.post(NEXT_ADDRESS, {
        id,
      })
      return response.data
    }
  }
  function updateAddress() {
    return async (data: any) => {
      const response = await axios.post(NEXT_EDIT_ADDRESS, data)
      return response.data
    }
  }
  function createAddress() {
    return async (data: any) => {
      const response = await axios.post(NEXT_CREATE_ADDRESS, data)
      return response.data
    }
  }
  function deleteAddress() {
    return async (data: any) => {
      const response = await axios.post(NEXT_DELETE_ADDRESS, data)
      return response.data
    }
  }
  return {
    getAddress: getAddress(),
    updateAddress: updateAddress(),
    createAddress: createAddress(),
    deleteAddress: deleteAddress(),
  }
}

export default function AddressBook() {
  const [data, setData] = useState([])
  const [isNewFormMode, setNewFormMode] = useState(false)
  const [title, setTitle] = useState('Address Book')
  const { getAddress, updateAddress, createAddress, deleteAddress } =
    asyncHandler()

  const { user } = useUI()

  useEffect(() => {
    getAddress(user.userId).then((data: any) => setData(data))
  }, [])

  const success = () => {
    setTitle('Success! Your details have been updated!')
    window.scrollTo(0, 0)
  }

  const failCb = () => {
    setTitle('Woops! Something went wrong!')
    window.scrollTo(0, 0)
  }
  const addNewAddress = (values: any) => {
    createAddress(values)
      .then(() => success())
      .catch(() => failCb())
  }
  return (
    <main className="sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="px-4 sm:px-0">
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
            {title}
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Feel free to edit any of your details below so your account is
            totally up to date.
          </p>
        </div>
      </div>
      {isNewFormMode && (
        <Form
          initialValues={{}}
          closeEditMode={() => setNewFormMode(false)}
          onSubmit={addNewAddress}
        />
      )}
      <div className="max-w-4xl mx-auto">
        {data.map((item: any, idx: number) => {
          return (
            <AddressItem
              errCallback={failCb}
              successCallback={success}
              key={idx}
              updateAddress={updateAddress}
              item={item}
              userId={user.userId}
              deleteAddress={deleteAddress}
            />
          )
        })}
        <button
          type="submit"
          onClick={() => {
            setNewFormMode(true)
            window.scrollTo(0, 0)
          }}
          className="max-w-xs flex-1 bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500 sm:w-full"
        >
          Add new address
        </button>
      </div>
    </main>
  )
}
