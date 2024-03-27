// Base Imports
import React from 'react'

// Package Imports
import * as Yup from 'yup'

// Component Imports
import ChequePaymentForm from './ChequePaymentForm'
import { t as translate } from "i18next";
// Other Imports
import { EmptyString, Messages } from '@new-components/utils/constants'
import { IChequePaymentProps } from 'framework/contracts/payment/IChequePaymentProps'

export const CHEQUE_PAYMENT_FORM_ID = 'chequePaymentForm'

const CHEQUE_PAYMENT_FORM_FIELDS = [
  {
    type: 'text',
    name: 'chequeNo',
    placeholder: translate('label.checkoutForm.chequeNoText'),
    label: 'Cheque Number',
    className:
      'relative mb-2 mt-2 appearance-none min-w-0 w-full bg-white border border-gray-300 rounded-sm shadow-sm py-2 px-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-black focus:ring-1 focus:ring-black',
    labelClassName: 'text-gray-700 text-sm dark:text-black',
    required: true,
    disabled: false,
    max: 10,
  },
]

const CHEQUE_PAYMENT_FORM_SCHEMA = Yup.object().shape({
  chequeNo: Yup.string()
    .max(10)
    .required(Messages.Validations.ChequePayment['CHEQUE_NUMBER_REQUIRED'])
    .matches(Messages.Validations.RegularExpressions.NUMBERS_ONLY, {
      message: Messages.Validations.ChequePayment['CHEQUE_NUMBER_INPUT'],
    }),
})

const ChequePayment = (props: IChequePaymentProps) => {
  const { onSubmit } = props

  return (
    <ChequePaymentForm
      formId={CHEQUE_PAYMENT_FORM_ID}
      formFields={CHEQUE_PAYMENT_FORM_FIELDS}
      schema={CHEQUE_PAYMENT_FORM_SCHEMA}
      defaultValues={{ chequeNo: EmptyString }}
      onSubmit={onSubmit}
    />
  )
}

export default ChequePayment
