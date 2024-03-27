// Base Imports
import React, { Fragment, useRef } from 'react'

// Package Imports
import { Formik, Form } from 'formik'

// Component Imports
import FloatingLabelFormField from '@components/utils/FloatingLabelFormField'

// Other Imports
import { IFormProps } from 'framework/contracts/IFormProps'
import { findByFieldName } from '@framework/utils/app-util'

const ChequePaymentForm = (props: IFormProps) => {
  const chequePaymentFormRef: any = useRef(null)
  const {
    formId,
    schema,
    initialValues = null,
    defaultValues,
    formFields,
    onSubmit = () => {},
  } = props
  const initState = defaultValues
    ? Object.keys(defaultValues).length
      ? defaultValues
      : initialValues
    : initialValues

  return (
    <Formik
      innerRef={chequePaymentFormRef}
      validationSchema={schema}
      initialValues={initState}
      onSubmit={(values) => {
        const payload = {
          ...values,
        }
        onSubmit(payload)
      }}
    >
      {(context) => {
        const {
          errors,
          touched,
          handleSubmit,
          values,
          handleChange,
          setValues,
          handleBlur,
          setFieldValue,
        } = context

        return (
          <Form id={formId} onSubmit={handleSubmit}>
            <div className="w-full p-4">
              <div className="w-full mt-1 add-form-section">
                {
                  <FloatingLabelFormField
                    key={1}
                    context={context}
                    item={findByFieldName(formFields, 'chequeNo')}
                  />
                }
              </div>
            </div>
          </Form>
        )
      }}
    </Formik>
  )
}

export default ChequePaymentForm
