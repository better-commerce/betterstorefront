// Base Imports
import { useEffect, useState } from 'react'

// Package Imports
import * as Yup from 'yup'
import { Formik, Form, Field } from 'formik'

// Other Imports
import { registrationConfig, loginConfig, b2bRegistrationConfig } from './config'
import LoadingDots from '@components/ui/LoadingDots'
import { GENERAL_REGISTER, VALIDATION_PASSWORD_MUST_MATCH } from '@components/utils/textVariables'
import { Checkbox } from '@components/account/Address'
import { mergeSchema, stringToBoolean } from '@framework/utils'

const registerSchema = Yup.object({
  firstName: Yup.string().required(),
  lastName: Yup.string().required(),
  password: Yup.string().min(8).max(24).required(),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], VALIDATION_PASSWORD_MUST_MATCH)
    .required(),
})

const b2bRegisterSchema = Yup.object({
  isRequestTradingAccount: Yup.boolean(),
  companyName: Yup.string().required(),
  registeredNumber: Yup.string().required(),
  email: Yup.string().max(255).required(),
  address1: Yup.string().required(),
  city: Yup.string().required(),
  country: Yup.string().required(),
  postCode: Yup.string().required(),
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

const b2bRegisterInitialValues = {
  isRequestTradingAccount: false,
  companyName: '',
  registeredNumber: '',
  email: '',
  address1: '',
  city: '',
  country: '',
  postCode: '',
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

const COMPONENTS_MAP: any = {
  CustomCheckbox: (props: any) => <Checkbox {...props} />,
}

export default function CustomerForm({
  type = 'register',
  onSubmit = () => { },
  btnText = GENERAL_REGISTER,
  email = "",
  b2bSettings = new Array<{ key: string, value: string }>(),
  apiError = ""
}: any) {
  const b2bEnabled = b2bSettings && b2bSettings.length ? stringToBoolean(b2bSettings.find((x: any) => x.key === "B2BSettings.EnableB2B")?.value) : false;
  const { config, initialValues, schema } = VALUES_MAP[type];
  const extendedInitialValues = (type === "register") ? (b2bEnabled ? { ...initialValues, ...b2bRegisterInitialValues, ...{ isRequestTradingAccount: b2bEnabled, email: email } } : initialValues) : initialValues;
  const extendedConfig = (type === "register") ? (b2bEnabled ? [...config, ...b2bRegistrationConfig] : config) : config;
  const extendedSchema = (type === "register") ? (b2bEnabled ? mergeSchema(schema, b2bRegisterSchema) : schema) : schema;
  //console.log(schema);

  const [error, setError] = useState(apiError)

  useEffect(() => {
    setError(apiError)
  }, [apiError])

  return (
    <Formik
      validationSchema={extendedSchema}
      onSubmit={onSubmit}
      initialValues={extendedInitialValues}
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
          <div className="flex-col w-full px-5 py-5 flex items-center justify-center">
            <Form className="font-semibold w-full sm:w-1/2">
              {extendedConfig.map((formItem: any, idx: number) => {
                return (
                  <div key={`${formItem.key}_${idx}`} className={`form-field ${idx + 1}`}>
                    {
                      formItem.customComponent ? (
                        COMPONENTS_MAP[formItem.customComponent]({
                          formItem,
                          values,
                          handleChange,
                        })
                      ) : (
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

                          {errors[formItem.key] && touched[formItem.key] ? (
                            <div className="text-red-400 text-xs capitalize mb-2">
                              {errors[formItem.key]}
                            </div>
                          ) : null}
                        </>
                      )
                    }
                  </div>
                )
              })}
            </Form>
            {error ? <span className="text-red-500 capitalize">{error}</span> : null}
            <div className="mt-10 flex sm:flex-col1">
              <button
                type="submit"
                onClick={handleSubmit}
                className="max-w-xs flex-1 bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500 sm:w-full"
              >
                {isSubmitting ? <LoadingDots /> : btnText}
              </button>
            </div>
          </div>
        )
      }}
    </Formik>
  )
}
