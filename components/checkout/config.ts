// Package Imports
import * as Yup from 'yup'

// Other Imports
import {
  BETTERCOMMERCE_DEFAULT_PHONE_COUNTRY_CODE,
  EmptyString,
  Messages,
} from '@components/utils/constants'
import { setNativeValue } from '@framework/utils/ui-util'

export const CHECKOUT_ADDRESS_FORM_ID = 'checkoutDetailsForm'
export const ADDRESS_BOOK_FORM_ID = 'addressBookDetailsForm'

export const ADDRESS_FINDER_SCHEMA = Yup.object().shape({
  postCode: Yup.string()
    .trim()
    .max(
      10,
      Messages.Validations.CheckoutSection.BillingAddressDetails[
        'POST_CODE_MAX_LEN'
      ]
    )
    .required(
      Messages.Validations.CheckoutSection.BillingAddressDetails[
        'POST_CODE_REQUIRED'
      ]
    ),
})

export const CHECKOUT_ADDRESS_SCHEMA = Yup.object().shape({
  firstName: Yup.string()
    .trim()
    .min(3, Messages.ContactUs.FIRST_NAME_MIN_LEN)
    .matches(
      Messages.Validations.RegularExpressions.FULL_NAME,
      Messages.ContactUs.FIRST_NAME_INPUT
    ),
  lastName: Yup.string()
    .trim()
    .min(
      3,
      Messages.Validations.CheckoutSection.ContactDetails.LAST_NAME_MIN_LEN
    )
    .matches(
      Messages.Validations.RegularExpressions.FULL_NAME,
      Messages.Validations.CheckoutSection.ContactDetails.LAST_NAME_INPUT
    ),
  phoneNo: Yup.string()
    .min(7, Messages.Validations.AddNewAddress['MOBILE_NUMBER_MIN_LEN'])
    .max(12, Messages.Validations.AddNewAddress['MOBILE_NUMBER_MAX_LEN'])
    .matches(Messages.Validations.RegularExpressions.MOBILE_NUMBER, {
      message: Messages.Validations.AddNewAddress['MOBILE_NUMBER_INPUT'],
    }),
  companyName: Yup.string().min(3).notRequired().nullable(),
  postCode: Yup.string()
    .trim()
    .max(
      10,
      Messages.Validations.CheckoutSection.BillingAddressDetails[
        'POST_CODE_MAX_LEN'
      ]
    )
    .required(
      Messages.Validations.CheckoutSection.BillingAddressDetails[
        'POST_CODE_REQUIRED'
      ]
    ),
  address1: Yup.string()
    .trim()
    .min(3, Messages.Validations.AddNewAddress['ADDRESS_LEN_REQUIRED'])
    .required(Messages.Validations.AddNewAddress['ADDRESS_1_REQUIRED'])
    .test(
      'no-whitespace',
      Messages.Validations.AddNewAddress['ADDRESS_1_REQUIRED'],
      (value: any) => {
        return Messages.Validations.RegularExpressions.EMPTY_SPACE.test(
          value || EmptyString
        )
      }
    )
    .matches(Messages.Validations.RegularExpressions.ADDRESS_LINE, {
      message: Messages.Validations.AddNewAddress['ADDRESS_1_INPUT'],
    }),
  address2: Yup.string()
    .trim()
    .nullable()
    .matches(Messages.Validations.RegularExpressions.ADDRESS_LINE, {
      message: Messages.Validations.AddNewAddress['ADDRESS_2_INPUT'],
    }),
  address3: Yup.string()
    .trim()
    .nullable()
    .matches(Messages.Validations.RegularExpressions.ADDRESS_LINE, {
      message: Messages.Validations.AddNewAddress['ADDRESS_3_INPUT'],
    }),
  state: Yup.string().trim(),
  city: Yup.string()
    .trim()
    .test(
      'no-whitespace',
      Messages.Validations.AddNewAddress['CITY_LEN_REQUIRED'],
      (value: any) => {
        return Messages.Validations.RegularExpressions.EMPTY_SPACE.test(
          value || EmptyString
        )
      }
    )
    .required(Messages.Validations.AddNewAddress['CITY_REQUIRED'])
    .min(3, Messages.Validations.AddNewAddress['CITY_LEN_REQUIRED']),
  country: Yup.string()
    .trim()
    .test(
      'no-whitespace',
      Messages.Validations.AddNewAddress['COUNTRY_REQUIRED'],
      (value: any) => {
        return Messages.Validations.RegularExpressions.EMPTY_SPACE.test(
          value || EmptyString
        )
      }
    )
    .required(Messages.Validations.AddNewAddress['COUNTRY_REQUIRED']),
})

export const CHECKOUT2_ADDRESS_WITH_PHONE_SCHEMA =
  CHECKOUT_ADDRESS_SCHEMA.shape({
    firstName: Yup.string()
      .trim()
      .min(3, Messages.ContactUs.FIRST_NAME_MIN_LEN)
      .required(Messages.ContactUs.FIRST_NAME_REQUIRED)
      .matches(
        Messages.Validations.RegularExpressions.FULL_NAME,
        Messages.ContactUs.FIRST_NAME_INPUT
      ),
    lastName: Yup.string()
      .trim()
      .min(
        3,
        Messages.Validations.CheckoutSection.ContactDetails.LAST_NAME_MIN_LEN
      )
      .required(
        Messages.Validations.CheckoutSection.ContactDetails.LAST_NAME_REQUIRED
      )
      .matches(
        Messages.Validations.RegularExpressions.FULL_NAME,
        Messages.Validations.CheckoutSection.ContactDetails.LAST_NAME_INPUT
      ),
    phoneNo: Yup.string()
      .min(7, Messages.Validations.AddNewAddress['MOBILE_NUMBER_MIN_LEN'])
      .max(12, Messages.Validations.AddNewAddress['MOBILE_NUMBER_MAX_LEN'])
      .required(Messages.Validations.AddNewAddress['MOBILE_NUMBER_REQUIRED'])
      .matches(Messages.Validations.RegularExpressions.MOBILE_NUMBER, {
        message: Messages.Validations.AddNewAddress['MOBILE_NUMBER_INPUT'],
      }),
    companyName: Yup.string().min(3).notRequired().nullable(),
    postCode: Yup.string().required(
      Messages.Validations.AddNewAddress['POST_CODE_REQUIRED']
    ),
  })

export const BILLING_ADDRESS_CHECKOUT2_SCHEMA = CHECKOUT_ADDRESS_SCHEMA.shape({
  firstName: Yup.string()
    .trim()
    .min(3, Messages.ContactUs.FIRST_NAME_MIN_LEN)
    .required(Messages.ContactUs.FIRST_NAME_REQUIRED)
    .matches(
      Messages.Validations.RegularExpressions.FULL_NAME,
      Messages.ContactUs.FIRST_NAME_INPUT
    ),
  lastName: Yup.string()
    .trim()
    .min(
      3,
      Messages.Validations.CheckoutSection.ContactDetails.LAST_NAME_MIN_LEN
    )
    .required(
      Messages.Validations.CheckoutSection.ContactDetails.LAST_NAME_REQUIRED
    )
    .matches(
      Messages.Validations.RegularExpressions.FULL_NAME,
      Messages.Validations.CheckoutSection.ContactDetails.LAST_NAME_INPUT
    ),
})

export const BILLING_ADDRESS_WITH_PHONE_CHECKOUT2_SCHEMA =
  BILLING_ADDRESS_CHECKOUT2_SCHEMA.shape({
    phoneNo: Yup.string()
      .min(7, Messages.Validations.AddNewAddress['MOBILE_NUMBER_MIN_LEN'])
      .max(12, Messages.Validations.AddNewAddress['MOBILE_NUMBER_MAX_LEN'])
      .required(Messages.Validations.AddNewAddress['MOBILE_NUMBER_REQUIRED'])
      .matches(Messages.Validations.RegularExpressions.MOBILE_NUMBER, {
        message: Messages.Validations.AddNewAddress['MOBILE_NUMBER_INPUT'],
      }),
  })

export const GUEST_LOGIN_CHECKOUT2_SCHEMA = Yup.object().shape({
  email: Yup.string()
    .trim()
    .required(
      Messages.Validations.CheckoutSection.ContactDetails.EMAIL_ADDRESS_REQUIRED
    )
    .email(
      Messages.Validations.CheckoutSection.ContactDetails.EMAIL_ADDRESS_INPUT
    ),
})
