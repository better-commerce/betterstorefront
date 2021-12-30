import { Formik, Form, Field } from 'formik'
import ConfirmedGeneralComponent from './ConfirmedGeneralComponent'
import { CheckCircleIcon } from '@heroicons/react/solid'
import { useState } from 'react'

export default function AddressForm({
  initialValues = {},
  onSubmit = () => {},
  closeEditMode,
  btnTitle = 'Save',
  toggleAction,
  isInfoCompleted,
  values: defaultValues,
  schema,
  config,
  addresses,
  setAddress,
  sameAddressAction = () => {},
  isSameAddressCheckboxEnabled,
  isSameAddress = true,
  isGuest = false,
  handleNewAddress,
  loqateAddress,
  updateAddress,
  infoType,
  retrieveAddress,
}: any) {
  const defaultItemsToHide = ['address1', 'address2', 'city', 'postCode']
  const [isFormOpen, setNewFormOpen] = useState(!addresses.length)
  const [addressList, setAddressList] = useState([])
  const [postCodeValue, setPostCodeValue] = useState('')
  const [itemsToHide, setItemsToHide] = useState(defaultItemsToHide)

  const IS_LOQATE_AVAILABLE =
    process.env.NEXT_PUBLIC_IS_LOQATE_AVAILABLE === 'true'

  if (isInfoCompleted) {
    return (
      <ConfirmedGeneralComponent
        onStateChange={toggleAction}
        content={{
          name: defaultValues.firstName + ' ' + defaultValues.lastName,
          address1: defaultValues.address1,
          address2: defaultValues.address2,
          city: defaultValues.city,
          postCode: defaultValues.postCode,
          phone: defaultValues.phoneNo,
        }}
      />
    )
  }

  const handleNewFormButton = (values?: any) => {
    if (!isFormOpen) {
      setNewFormOpen(true)
    } else {
      handleNewAddress(values, () => setNewFormOpen(false))
    }
  }

  const initState = Object.keys(defaultValues).length
    ? defaultValues
    : initialValues

  const handleAddressList = async (postCode: string) => {
    setPostCodeValue(postCode)
    const data: any = await loqateAddress(postCode)
    if (data.length) {
      setAddressList(data)
    }
  }

  const handleAddress = async (
    address: any,
    setValues: any,
    existingValues: any
  ) => {
    const foundAddress = await retrieveAddress(address.id)
    if (foundAddress) {
      const isAddressUpdated = updateAddress(infoType, foundAddress)
      if (isAddressUpdated) {
        setAddressList([])
        setValues({ ...existingValues, ...foundAddress })
        setItemsToHide([])
      }
    }
  }

  return (
    <Formik
      validationSchema={schema}
      initialValues={initState}
      onSubmit={onSubmit}
    >
      {({
        errors,
        touched,
        handleSubmit,
        values,
        handleChange,
        setValues,
      }: any) => {
        return (
          <>
            <div className="flex flex-wrap">
              {addresses.map((item: any, idx: number) => {
                return (
                  <div
                    key={idx}
                    onClick={() => {
                      setValues(item)
                      setAddress(item)
                    }}
                    className={`w-full cursor-pointer text-gray-900 border border-gray-200 rounded-lg py-2 px-5 mb-0 mt-3 flex justify-between items-center ${
                      item.id === defaultValues.id ? 'border-indigo-600' : ''
                    }`}
                  >
                    <div>
                      {item.id === defaultValues.id ? (
                        <CheckCircleIcon
                          className="h-5 pr-4 text-left align-left text-indigo-600"
                          aria-hidden="true"
                        />
                      ) : null}
                      {item.id !== defaultValues.id ? (
                        <CheckCircleIcon
                          className="h-5 pr-4 text-left align-left text-gray-200"
                          aria-hidden="true"
                        />
                      ) : null}
                      <div className="space-y-4 mt-6 sm:flex sm:space-x-4 sm:space-y-0 md:mt-0 justify-end"></div>
                    </div>
                    <div className="flex text-md font-regular flex-wrap =">
                      <span className="font-semibold pr-1">
                        {item.firstName + ' ' + item.lastName},
                      </span>
                      <span className="pr-1">{item.address1}, </span>
                      <span className="pr-1">{item.address2}, </span>
                      <span className="pr-1">{item.city}, </span>
                      <span className="pr-1">{item.postCode}, </span>
                      <span className="pr-1">{item.country}, </span>
                      <span className="pr-1">{item.phoneNo}</span>
                    </div>
                  </div>
                )
              })}
            </div>
            {isFormOpen && (
              <Form className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                {config.map((formItem: any, idx: number) => {
                  let classNames = ''
                  formItem.isFullWidth
                    ? (classNames = classNames + ` sm:col-span-2`)
                    : ''
                  formItem.addressFinder
                    ? (classNames = classNames + ' flex')
                    : ''
                  if (itemsToHide.includes(formItem.name)) {
                    return null
                  }

                  return (
                    <div
                      key={`${formItem.label}_${idx}`}
                      className={classNames}
                    >
                      <div>
                        <label className="text-gray-700 text-sm">
                          {formItem.label}
                        </label>
                        <Field
                          key={idx}
                          as={formItem.as || ''}
                          name={formItem.name}
                          placeholder={formItem.placeholder}
                          onChange={handleChange}
                          value={values[formItem.name]}
                          type={formItem.type}
                          className={
                            formItem.className ||
                            'relative mb-2 mt-2 appearance-none min-w-0 w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 '
                          }
                        >
                          {formItem.options?.map((option: any, idx: number) => {
                            return (
                              <option key={idx} value={option.value}>
                                {option.title}
                              </option>
                            )
                          })}
                        </Field>
                        {formItem.addressFinder && (
                          <span
                            onClick={() => setItemsToHide([])}
                            className="text-gray-400 underline cursor-pointer"
                          >
                            Enter address manually
                          </span>
                        )}
                        {formItem.addressFinder &&
                        values[formItem.name] === postCodeValue &&
                        addressList.length > 0 ? (
                          <div className="absolute bg-white z-10 w-64 max-h-80 overflow-scroll">
                            <div className="bg-gray-900">
                              <h2
                                onClick={() => setAddressList([])}
                                className="py-2 px-2 text-white cursor-pointer"
                              >
                                Close
                              </h2>
                            </div>
                            {addressList.map(
                              (address: any, addressIdx: number) => {
                                return (
                                  <div
                                    key={addressIdx}
                                    className="py-2 px-2 text-gray-900 hover:text-white border-t hover:bg-gray-900"
                                  >
                                    <h2
                                      className="cursor-pointer"
                                      onClick={() =>
                                        handleAddress(
                                          address,
                                          setValues,
                                          values
                                        )
                                      }
                                    >
                                      {address.text}, {address.description}
                                    </h2>
                                  </div>
                                )
                              }
                            )}
                          </div>
                        ) : null}
                      </div>
                      {formItem.addressFinder && itemsToHide.length > 0 ? (
                        <button
                          type="button"
                          onClick={() =>
                            handleAddressList(values[formItem.name])
                          }
                          style={{ maxWidth: '20%' }}
                          className="ml-3 mt-8 mb-8 max-w-xs flex-1 bg-indigo-600 border border-transparent rounded-md py-2 px-1 flex items-center justify-center font-medium text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500 sm:w-full"
                        >
                          Find
                        </button>
                      ) : null}
                      {errors[formItem.name] && touched[formItem.name] ? (
                        <div className="text-red-400 text-sm">
                          {errors[formItem.name]}
                        </div>
                      ) : null}
                    </div>
                  )
                })}
              </Form>
            )}
            {!isGuest && (
              <div className="flex">
                <button
                  type="button"
                  onClick={() => handleNewFormButton(values)}
                  className="max-w-xs m-2 flex-1 bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500 sm:w-full"
                >
                  {isFormOpen ? 'Save' : 'Add new address'}
                </button>
                {isFormOpen && (
                  <button
                    type="button"
                    onClick={() => setNewFormOpen(false)}
                    className="max-w-xs m-2 flex-1 bg-gray-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-gray-500 sm:w-full"
                  >
                    Cancel
                  </button>
                )}
              </div>
            )}
            {isSameAddressCheckboxEnabled && (
              <div className="flex items-center mt-10">
                <input
                  name={`sameAddress`}
                  type="checkbox"
                  defaultChecked={isSameAddress}
                  onChange={(e) => {
                    if (e.target.checked) {
                      sameAddressAction(values)
                    }
                  }}
                  className="h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500"
                />
                <label
                  htmlFor={`sameAddress`}
                  className="ml-3 text-sm text-gray-500"
                >
                  My billing and delivery address are the same
                </label>
              </div>
            )}

            <div className="mt-10 flex sm:flex-col1 w-full justify-center">
              <button
                type="submit"
                onClick={handleSubmit}
                className="max-w-xs flex-1 bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500 sm:w-full"
              >
                {btnTitle}
              </button>
              {!!closeEditMode && (
                <button
                  type="button"
                  onClick={closeEditMode}
                  className="max-w-xs flex-1 bg-gray-500 border border-transparent rounded-md py-3 ml-5 px-8 flex items-center justify-center font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500 sm:w-full"
                >
                  Cancel
                </button>
              )}
            </div>
          </>
        )
      }}
    </Formik>
  )
}
