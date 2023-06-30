import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import cn from 'classnames'
import { registrationConfig, loginConfig } from './config'
import LoadingDots from '@components/ui/LoadingDots'
import Button from '@components/ui/Button'
import {
  GENERAL_REGISTER,
  VALIDATION_PASSWORD_MUST_MATCH,
} from '@components/utils/textVariables'
const registerSchema = Yup.object({
  firstName: Yup.string().required(),
  lastName: Yup.string().required(),
  password: Yup.string().min(8).max(24).required(),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], VALIDATION_PASSWORD_MUST_MATCH)
    .required(),
})

const loginSchema = Yup.object({
  email: Yup.string().email().required(),
  password: Yup.string().min(8).max(24).required(),
})

const registerInitialValues = {
  firstName: '',
  lastName: '',
  password: '',
  confirmPassword: '',
}

const loginInitialValues = {
  email: '',
  password: '',
}

const VALUES_MAP: any = {
  register: {
    schema: registerSchema,
    initialValues: registerInitialValues,
    config: registrationConfig,
  },
  login: {
    schema: loginSchema,
    initialValues: loginInitialValues,
    config: loginConfig,
  },
}

export default function CustomerForm({
  type = 'register',
  onSubmit = () => {},
  btnText = GENERAL_REGISTER,
}: any) {
  const { config, initialValues, schema } = VALUES_MAP[type]

  return (
    <Formik
      validationSchema={schema}
      // onSubmit={onSubmit}
      initialValues={initialValues}
      onSubmit={(values, actions) => {
        onSubmit(values, () => {
          actions.setSubmitting(false)
          // actions.resetForm()
        })
      }}
    >
      {({
        errors,
        touched,
        handleSubmit,
        values,
        handleChange,
        isSubmitting,
      }: any) => {
        return (
          <div className="flex flex-col items-center justify-center w-full px-5 py-1">
            <Form className="w-full font-semibold sm:w-1/2">
              {config.map((formItem: any, idx: number) => {
                function handleKeyPress(e: any) {
                  if (e.keyCode == 13) {
                    handleSubmit()
                  }
                }
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
                      onKeyUp={(e: any) => handleKeyPress(e)}
                      type={formItem.type}
                      className="w-full min-w-0 px-4 py-2 mt-2 mb-2 text-gray-900 placeholder-gray-500 bg-white border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 "
                    />

                    {errors[formItem.key] && touched[formItem.key] ? (
                      <div className="mb-2 text-xs text-red-400 capitalize">
                        {errors[formItem.key]}
                      </div>
                    ) : null}
                  </>
                )
              })}
            </Form>
            <div className="flex items-center justify-center w-full my-5 sm:w-1/2">
              <Button
                type="submit"
                onClick={handleSubmit}
                className="!font-normal w-full border border-black btn-c btn-primary"
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                {!isSubmitting && btnText}
              </Button>
            </div>
          </div>
        )
      }}
    </Formik>
  )
}
