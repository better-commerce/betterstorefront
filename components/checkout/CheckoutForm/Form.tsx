import { Formik, Form, Field } from 'formik'
import { shippingFormConfig, shippingSchema } from './config'
import ConfirmedGeneralComponent from './ConfirmedGeneralComponent'

export default function AddressForm({
  initialValues = {},
  onSubmit = () => {},
  closeEditMode,
  btnTitle = 'Save',
  toggleAction,
  isShippingInformationCompleted,
}: any) {
  if (isShippingInformationCompleted) {
    return <ConfirmedGeneralComponent onStateChange={toggleAction} />
  }
  return (
    <Formik
      validationSchema={shippingSchema}
      initialValues={initialValues}
      onSubmit={onSubmit}
    >
      {({ errors, touched, handleSubmit, values, handleChange }: any) => {
        return (
          <>
            <Form className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
              {shippingFormConfig.map((formItem: any, idx: number) => {
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
