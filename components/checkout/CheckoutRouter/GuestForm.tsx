import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import Checkbox from '@components/account/Address/Checkbox'

const COMPONENTS_MAP: any = {
  CustomCheckbox: (props: any) => <Checkbox {...props} />,
}

const schema = Yup.object({
  email: Yup.string().email().required(),
  isEmailChecked: Yup.boolean(),
  isSmsChecked: Yup.boolean(),
  isPostChecked: Yup.boolean(),
})

const initialValues = {
  email: '',
  password: '',
}

export const config = [
  {
    key: 'email',
    label: 'Your email',
    type: 'email',
    placeholder: 'john@doe.com',
  },
]

const checkboxConfig = [
  {
    customComponent: 'CustomCheckbox',
    name: 'isEmailChecked',
    label: 'Email',
    className: ' ',
  },
  {
    customComponent: 'CustomCheckbox',
    name: 'isSmsChecked',
    label: 'SMS',
    className: ' ',
  },
  {
    customComponent: 'CustomCheckbox',
    name: 'isPostChecked',
    label: 'Post',
    className: ' ',
  },
]

export default function GuestForm({ onSubmit = () => {} }: any) {
  return (
    <Formik
      validationSchema={schema}
      onSubmit={onSubmit}
      initialValues={initialValues}
    >
      {({ errors, touched, handleSubmit, values, handleChange }: any) => {
        return (
          <div className="flex-col w-full px-5 py-5 flex items-center justify-center">
            <Form className="font-semibold w-full sm:w-1/2">
              {config.map((formItem: any, idx: number) => {
                return (
                  <>
                    <label className="text-gray-700 text-sm">
                      {formItem.label}
                    </label>

                    <Field
                      key={idx}
                      name={formItem.key}
                      placeholder={formItem.placeholder}
                      onChange={handleChange}
                      value={values[formItem.key]}
                      type={formItem.type}
                      className="mb-2 mt-2 appearance-none min-w-0 w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 "
                    />
                    <h3 className="text-center py-2 text-gray-600 text-sm">
                      To get our latest promotions, exclusive offers, new
                      launches and more, let us know how you'd like us to keep
                      you updated
                    </h3>

                    {errors[formItem.key] && touched[formItem.key] ? (
                      <div className="text-red-400 text-sm">
                        {errors[formItem.key]}
                      </div>
                    ) : null}
                  </>
                )
              })}
              <div className="flex">
                {checkboxConfig.map((box: any, idx: number) => {
                  return COMPONENTS_MAP[box.customComponent]({
                    formItem: box,
                    values,
                    handleChange,
                    flexDireciton: 'flex-row',
                  })
                })}
              </div>
            </Form>
            <div className="mt-10 flex sm:flex-col1">
              <button
                type="submit"
                onClick={handleSubmit}
                className="max-w-xs flex-1 bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500 sm:w-full"
              >
                Checkout securely
              </button>
            </div>
          </div>
        )
      }}
    </Formik>
  )
}
