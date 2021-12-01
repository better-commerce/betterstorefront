import { Formik, Form, Field } from 'formik'
import ConfirmedGeneralComponent from './ConfirmedGeneralComponent'
import { CheckCircleIcon } from '@heroicons/react/solid'

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
  sameAddressAction,
  isSameAddressCheckboxEnabled,
}: any) {
  if (Object.keys(defaultValues).length > 0) {
    return (
      <ConfirmedGeneralComponent
        onStateChange={toggleAction}
        content={{
          name: defaultValues.firstName + ' ' + defaultValues.lastName,
          address1: defaultValues.address1,
          address2: defaultValues.address2,
          city: defaultValues.city,
          postCode: defaultValues.postCode,
          country: defaultValues.country + ', ' + defaultValues.countryCode,
          phone: defaultValues.phoneNo,
        }}
      />
    )
  }

  return (
    <Formik
      validationSchema={schema}
      initialValues={initialValues}
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
            <div className="flex flex-1 flex-grow">
              {addresses.map((item: any, idx: number) => {
                return (
                  <div
                    onClick={() => {
                      setValues(item)
                      setAddress(item)
                    }}
                    className={`cursor-pointer w-full m-5 text-gray-900 border rounded-lg py-5 px-5 mb-5 mt-5 flex flex-row justify-between items-center ${
                      item.id === defaultValues.id ? 'border-indigo-600' : ''
                    }`}
                  >
                    <div className="flex flex-col text-md font-regular">
                      <span className="text-xl font-bold">
                        {item.firstName + ' ' + item.lastName}
                      </span>
                      <span>{item.address1}</span>
                      <span>{item.address2}</span>

                      <span>{item.city}</span>
                      <span>{item.postCode}</span>
                      <span>{item.country}</span>
                      <span>{item.phoneNo}</span>
                    </div>
                    <div>
                      {item.id === defaultValues.id ? (
                        <CheckCircleIcon
                          className="h-5 w-5 text-indigo-600"
                          aria-hidden="true"
                        />
                      ) : null}
                      <div className="space-y-4 mt-6 sm:flex sm:space-x-4 sm:space-y-0 md:mt-0 justify-end"></div>
                    </div>
                  </div>
                )
              })}
            </div>
            <Form className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
              {config.map((formItem: any, idx: number) => {
                return (
                  <div
                    key={`${formItem.label}_${idx}`}
                    className={formItem.isFullWidth ? 'sm:col-span-2' : ''}
                  >
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
                        'mb-2 mt-2 appearance-none min-w-0 w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 '
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
                    {errors[formItem.name] && touched[formItem.name] ? (
                      <div className="text-red-400 text-sm">
                        {errors[formItem.name]}
                      </div>
                    ) : null}
                  </div>
                )
              })}
            </Form>
            {isSameAddressCheckboxEnabled && (
              <div className="flex items-center mt-10">
                <input
                  name={`sameAddress`}
                  type="checkbox"
                  defaultChecked={true}
                  onChange={(e) => {
                    console.log(e.target.checked)
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
            <div className="mt-10 flex sm:flex-col1 w-1/2">
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
