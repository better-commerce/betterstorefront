// Base Imports
import React from 'react'

// Package Imports
import * as Yup from 'yup'

// Component Imports
import ChequePaymentForm from './ChequePaymentForm'

// Other Imports
import { EmptyString, Messages } from '@components/utils/constants'
import { IChequePaymentProps } from 'framework/contracts/payment/IChequePaymentProps'
import { useTranslation } from '@commerce/utils/use-translation';

export const CHEQUE_PAYMENT_FORM_ID = 'chequePaymentForm'

const CHEQUE_PAYMENT_FORM_SCHEMA = Yup.object().shape({
  chequeNo: Yup.string()
    .max(10)
    .required(Messages.Validations.ChequePayment['CHEQUE_NUMBER_REQUIRED'])
    .matches(Messages.Validations.RegularExpressions.NUMBERS_ONLY, {
      message: Messages.Validations.ChequePayment['CHEQUE_NUMBER_INPUT'],
    }),
})

const ChequePayment = (props: IChequePaymentProps) => {
  const { onSubmit, translate }: any = props

  const CHEQUE_PAYMENT_FORM_FIELDS = [
    {
      type: 'text',
      name: 'chequeNo',
      placeholder: translate('label.checkout.payment.chequeNoText'),
      label: translate('label.checkout.payment.chequeNumberLabelText'),
      className:
        'relative mb-2 mt-2 appearance-none min-w-0 w-full bg-white border border-gray-300 rounded-sm shadow-sm py-2 px-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-black focus:ring-1 focus:ring-black',
      labelClassName: 'text-gray-700 text-sm dark:text-black',
      required: true,
      disabled: false,
      max: 10,
    },
  ]

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
