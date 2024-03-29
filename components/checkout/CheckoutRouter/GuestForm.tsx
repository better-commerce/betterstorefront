import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import Checkbox from '@components/account/Address/Checkbox'
import {
  BTN_CHECKOUT_SECURELY,
  GENERAL_EMAIL,
  GENERAL_POST,
  GENERAL_SMS,
  GUEST_LATEST_PROMOTIONS_OFFERS_INFORMATION,
} from '@components/utils/textVariables'

const COMPONENTS_MAP: any = {
  CustomCheckbox: (props: any) => <Checkbox {...props} />,
}

const schema = Yup.object({
  email: Yup.string().email().required(),
  notifyByEmail: Yup.boolean(),
  notifyBySms: Yup.boolean(),
  notifyByPost: Yup.boolean(),
})

const initialValues = {
  email: '',
  notifyByEmail: true,
  notifyBySms: false,
  notifyByPost: false,
}

export const config = [
  {
    key: 'email',
    label: GENERAL_EMAIL,
    type: 'email',
    placeholder: 'john@doe.com',
  },
]

const checkboxConfig = [
  {
    customComponent: 'CustomCheckbox',
    name: 'notifyByEmail',
    label: GENERAL_EMAIL,
    className: ' ',
  },
  {
    customComponent: 'CustomCheckbox',
    name: 'notifyBySms',
    label: GENERAL_SMS,
    className: ' ',
  },
  {
    customComponent: 'CustomCheckbox',
    name: 'notifyByPost',
    label: GENERAL_POST,
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
          <div className="flex flex-col items-center justify-center w-full px-5 py-5">
            <Form className="w-full font-semibold sm:w-1/2">
              {config.map((formItem: any, idx: number) => {
                return (
                  <>
                    <label className="text-sm text-gray-700">
                      {formItem.label}
                    </label>

                    <Field
                      key={idx}
                      name={formItem.key}
                      placeholder={formItem.placeholder}
                      onChange={handleChange}
                      value={values[formItem.key]}
                      type={formItem.type}
                      className="w-full min-w-0 px-4 py-2 mt-2 mb-2 text-gray-900 placeholder-gray-500 bg-white border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 "
                    />
                    <h3 className="py-2 text-sm text-center text-gray-600">
                      {GUEST_LATEST_PROMOTIONS_OFFERS_INFORMATION}
                    </h3>

                    {errors[formItem.key] && touched[formItem.key] ? (
                      <div className="text-sm text-red-400">
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
            <div className="flex mt-10 sm:flex-col1">
              <button
                type="submit"
                onClick={handleSubmit}
                className="flex items-center justify-center flex-1 w-full max-w-xs px-8 py-3 uppercase bg-black border border-transparent rounded-sm btn-primary sm:w-full"
              >
                {BTN_CHECKOUT_SECURELY}
              </button>
            </div>
          </div>
        )
      }}
    </Formik>
  )
}
