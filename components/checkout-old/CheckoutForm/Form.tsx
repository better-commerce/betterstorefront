import { Formik} from 'formik'
import ConfirmedGeneralComponent from './ConfirmedGeneralComponent'
import { CheckCircleIcon } from '@heroicons/react/24/solid'
import { useState, useRef, useEffect } from 'react'
import {
  ADD_ADDRESS,
  BILLING_ADDRESS_SAME_AS_DELIVERY_ADDRESS,
  BTN_FIND,
  BTN_SAVE,
  ENTER_ADDRESS_MANUALY,
  GENERAL_CANCEL,
  GENERAL_CLOSE,
} from '@components/utils/textVariables'

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
  handleOpenNewAddressModal,
  isPaymentLink,
}: any) {
  const defaultItemsToHide = ['address1', 'address2', 'city', 'postCode']
  const [isFormOpen, setNewFormOpen] = useState(!addresses.length)
  const [addressList, setAddressList] = useState([])
  const [postCodeValue, setPostCodeValue] = useState('')
  const [itemsToHide, setItemsToHide] = useState(defaultItemsToHide)

  const IS_LOQATE_AVAILABLE =
    process.env.NEXT_PUBLIC_IS_LOQATE_AVAILABLE === 'true'

  const formikRef: any = useRef(null)

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
        isPaymentLink={isPaymentLink}
      />
    )
  }

  const touchedValidationObject = config.reduce((acc: any, next: any) => {
    acc[next.name] = true
    return acc
  }, {})

  const handleNewFormButton = (values?: any, errors?: any) => {
    if (!isFormOpen) {
      formikRef.current.setValues({})
      setNewFormOpen(true)
    } else {
      if (itemsToHide.length > 0) {
        setItemsToHide([])
      }

      formikRef.current.setTouched(touchedValidationObject)
      formikRef.current.validateForm()
      if (!Object.keys(errors).length) {
        handleNewAddress(values, () => setNewFormOpen(false))
      }
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

  const handleFormSubmit = (handleSubmit: any, ...args: any) => {
    if (formikRef) {
      formikRef?.current?.validateForm()
    }
    handleSubmit(...args)
    if (itemsToHide?.length > 0) {
      setItemsToHide([])
    }
    formikRef?.current?.setTouched(touchedValidationObject)
  }

  return (
    <Formik
      validationSchema={schema}
      initialValues={initState}
      onSubmit={(values: any) => {
        // Pass on dirty flag to the parent ref.
        onSubmit({ ...values, ...{ isDirty: formikRef?.current?.dirty } })
      }}
      innerRef={formikRef}
    >
      {({
        errors,
        touched,
        handleSubmit,
        values,
        handleChange,
        setValues,
      }: any) => {

        useEffect(() => {
          setValues(initState)
          setAddress(initState)
        },[initState])
        
        return (
          <>
            <div className="flex flex-wrap bg-white">
              {!!addresses?.length ? (
                <>
                  {!isPaymentLink &&
                    addresses.map((item: any, idx: number) => {
                      return (
                        <div
                          key={idx}
                          onClick={() => {
                            setValues(item)
                            setAddress(item)
                          }}
                          className={`w-full cursor-pointer text-gray-900 border border-gray-200 rounded-lg py-2 px-5 mb-0 mt-3 flex items-center ${
                            item.id === defaultValues.id ? 'border-black' : ''
                          }`}
                        >
                          <div>
                            {item.id === defaultValues.id ? (
                              <CheckCircleIcon
                                className="h-5 pr-4 text-left text-black align-left"
                                aria-hidden="true"
                              />
                            ) : null}
                            {item.id !== defaultValues.id && (
                              <CheckCircleIcon
                                className="h-5 pr-4 text-left text-gray-200 align-left"
                                aria-hidden="true"
                              />
                            )}
                            <div className="justify-end mt-6 space-y-4 sm:flex sm:space-x-4 sm:space-y-0 md:mt-0"></div>
                          </div>
                          <div className="flex text-md font-regular flex-wrap =">
                            <span className="pr-1 font-semibold">
                              {item.firstName + ' ' + item.lastName},
                            </span>
                            <span className="pr-1">{item.address1}, </span>
                            <span className="pr-1">{item.address2}, </span>
                            <span className="pr-1">{item.city}, </span>
                            <span className="pr-1">{item.postCode}, </span>
                            <span className="pr-1">{item.country}, </span>
                            <span className="pr-1">{item.phoneNo}</span>
                            {/* <button
                            onClick={() => {
                            onEditAddress(item?.id)
                            }}
                            className="flex items-end justify-end w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 md:w-auto"
                            >
                            {GENERAL_EDIT}
                            </button> */}
                          </div>
                        </div>
                      )
                    })}
                </>
              ) : (
                <div className="w-full mt-4 text-center">
                  <span className="text-sm text-gray-500">
                    No saved addresses.
                  </span>
                </div>
              )}
            </div>
            {/* {isFormOpen && (
              <Form className="grid grid-cols-1 mt-4 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
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
                        <label className="text-sm text-gray-700">
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
                            {ENTER_ADDRESS_MANUALY}
                          </span>
                        )}
                        {formItem.addressFinder &&
                        values[formItem.name] === postCodeValue &&
                        addressList.length > 0 ? (
                          <div className="absolute z-10 w-64 overflow-scroll bg-white max-h-80">
                            <div className="bg-gray-900">
                              <h2
                                onClick={() => setAddressList([])}
                                className="px-2 py-2 text-white cursor-pointer"
                              >
                                {GENERAL_CLOSE}
                              </h2>
                            </div>
                            {addressList.map(
                              (address: any, addressIdx: number) => {
                                return (
                                  <div
                                    key={addressIdx}
                                    className="px-2 py-2 text-gray-900 border-t hover:text-white hover:bg-gray-900"
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
                          className="flex items-center justify-center flex-1 max-w-xs px-6 py-2 mt-8 mb-8 ml-3 font-medium text-white uppercase bg-black border border-transparent rounded-sm hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-black sm:w-full"
                        >
                          {BTN_FIND}
                        </button>
                      ) : null}
                      {errors[formItem.name] && touched[formItem.name] ? (
                        <div className="text-sm text-red-400">
                          {errors[formItem.name]}
                        </div>
                      ) : null}
                    </div>
                  )
                })}
              </Form>
            )} */}
            {!isPaymentLink && (
              <div className="flex flex-col flex-wrap justify-center gap-2 mt-10 lg:flex-row md:flex-row">
                {/* {isFormOpen && (
                  <button
                    type="button"
                    onClick={() => setNewFormOpen(false)}
                    className="flex items-center justify-center flex-1 max-w-xs px-8 py-3 m-2 font-medium text-white bg-gray-600 border border-transparent rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-gray-500 sm:w-full"
                  >
                    {GENERAL_CANCEL}
                  </button>
                )} */}

                {!!addresses?.length && (
                  <button
                    type="submit"
                    onClick={(...args) =>
                      handleFormSubmit(handleSubmit, ...args)
                    }
                    className="flex items-center justify-center flex-1 w-full max-w-xs border border-transparent sm:w-full btn btn-primary"
                  >
                    {btnTitle}
                  </button>
                )}
                <button
                  type="button"
                  // onClick={() => handleNewFormButton(values, errors)}
                  onClick={(ev: any) => handleOpenNewAddressModal()}
                  className="flex items-center justify-center flex-1 w-full max-w-xs px-8 py-2 text-sm font-medium text-black uppercase border border-black rounded-md hover:bg-black hover:text-white sm:w-full"
                >
                  {ADD_ADDRESS}
                </button>
                {/* {!!closeEditMode && (
                <button
                  type="button"
                  onClick={closeEditMode}
                  className="flex items-center justify-center flex-1 max-w-xs px-8 py-3 ml-5 font-medium text-white bg-gray-500 border border-transparent rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500 sm:w-full"
                >
                  {GENERAL_CANCEL}
                </button>
              )} */}
              </div>
            )}
            {/* {isSameAddressCheckboxEnabled && (
              <div className="flex items-center mt-10">
                <input
                  name={`sameAddress`}
                  type="checkbox"
                  defaultChecked={isSameAddress}
                  onChange={(e) => {
                    // if (e.target.checked) {
                    sameAddressAction(values)
                    // }
                  }}
                  className="w-4 h-4 accent-gray-900"
                />
                <label
                  htmlFor={`sameAddress`}
                  className="ml-3 text-sm text-gray-500"
                >
                  {BILLING_ADDRESS_SAME_AS_DELIVERY_ADDRESS}
                </label>
              </div>
            )} */}
          </>
        )
      }}
    </Formik>
  )
}
