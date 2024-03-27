// Package Imports
import * as Yup from 'yup'

// Other Imports
import {
  BETTERCOMMERCE_DEFAULT_PHONE_COUNTRY_CODE,
  EmptyString,
  Messages,
} from '@new-components/utils/constants'
import { setNativeValue } from '@framework/utils/ui-util'
import { useTranslation } from '@commerce/utils/use-translation'

export const CHECKOUT_ADDRESS_FORM_ID = 'checkoutDetailsForm'
export const ADDRESS_BOOK_FORM_ID = 'addressBookDetailsForm'

export const addressFinderSchema = () => {
  const translate = useTranslation();
  const ADDRESS_FINDER_SCHEMA = Yup.object().shape({
  postCode: Yup.string()
    .trim()
    .max(
      10,
      translate('common.message.profile.postCodeMaxLenMsg')
    )
    .required(translate('common.message.profile.postCodeRequiredMsg')),
  })

  return ADDRESS_FINDER_SCHEMA;
}

export const checkoutAddressSchema = () => {
  const translate = useTranslation();
  const CHECKOUT_ADDRESS_SCHEMA = Yup.object().shape({
  firstName: Yup.string()
    .trim()
    .min(3, translate('common.message.nameMinLengthMsg'))
    .matches(
      Messages.Validations.RegularExpressions.FULL_NAME,
      translate('common.message.nameInputMsg')
    ),
  lastName: Yup.string()
    .trim()
    .min(
      3,
      translate('common.message.nameMinLengthMsg')
    )
    .matches(
      Messages.Validations.RegularExpressions.FULL_NAME,
      translate('common.message.nameInputMsg')
    ),
  phoneNo: Yup.string()
    .min(7, translate('common.message.mobileNumMinLengthMsg'))
    .max(12, translate('common.message.mobileNumMaxLengthMsg'))
    .matches(Messages.Validations.RegularExpressions.MOBILE_NUMBER, translate('common.message.mobileNumInputMsg')),
  companyName: Yup.string().min(3).notRequired().nullable(),
  postCode: Yup.string()
    .trim()
    .max(10,translate('common.message.postCodeMaxLenMsg'))
    .required(translate('common.message.postCodeRequiredMsg')),
  address1: Yup.string()
    .trim()
    .min(3, translate('common.message.address.addressMinLengthMsg'))
    .required(translate('common.message.address.addressRequiredMsg'))
    .test(
      'no-whitespace',
      translate('common.message.address.address1RequiredMsg'),
      (value: any) => {
        return Messages.Validations.RegularExpressions.EMPTY_SPACE.test(
          value || EmptyString
        )
      }
    )
    .matches(Messages.Validations.RegularExpressions.ADDRESS_LINE, {
      message: translate('common.message.address.address1InputMsg'),
    }),
  address2: Yup.string()
    .trim()
    .nullable()
    .matches(Messages.Validations.RegularExpressions.ADDRESS_LINE, {
      message: translate('common.message.address.address2InputMsg'),
    }),
  address3: Yup.string()
    .trim()
    .nullable()
    .matches(Messages.Validations.RegularExpressions.ADDRESS_LINE, {
      message: translate('common.message.address.address3InputMsg'),
    }),
  state: Yup.string().trim(),
  city: Yup.string()
    .trim()
    .test(
      'no-whitespace',
      (value: any) => {
        return Messages.Validations.RegularExpressions.EMPTY_SPACE.test(
          value || EmptyString
        )
      }
    )
    .required(translate('common.message.address.cityRequiredMsg'))
    .min(3, translate('common.message.address.cityMinLengthMsg')),
  country: Yup.string()
    .trim()
    .test(
      'no-whitespace',
      translate('common.message.address.countryRequiredMsg'),
      (value: any) => {
        return Messages.Validations.RegularExpressions.EMPTY_SPACE.test(
          value || EmptyString
        )
      }
    )
    .required(translate('common.message.address.countryRequiredMsg')),
  })

  return CHECKOUT_ADDRESS_SCHEMA
}

export const checkout2AddressWithPhoneSchema = () => {
  const translate = useTranslation();
  const CHECKOUT_ADDRESS_SCHEMA = checkoutAddressSchema();
  const CHECKOUT2_ADDRESS_WITH_PHONE_SCHEMA = CHECKOUT_ADDRESS_SCHEMA.shape({
    firstName: Yup.string()
      .trim()
      .min(3, translate('common.message.nameMinLengthMsg'))
      .required(translate('common.message.firstNameRequiredMsg'))
      .matches( Messages.Validations.RegularExpressions.FULL_NAME, translate('common.message.nameInputMsg')),
    lastName: Yup.string()
      .trim()
      .min( 3, translate('common.message.nameMinLengthMsg'))
      .required(translate('common.message.lastNameRequiredMsg'))
      .matches(
        Messages.Validations.RegularExpressions.FULL_NAME,
        translate('common.message.nameInputMsg')
      ),
    phoneNo: Yup.string()
      .min(7, translate('common.message.mobileNumMinLengthMsg'))
      .max(12, translate('common.message.mobileNumMaxLengthMsg'))
      .required(translate('common.message.mobileNumRequiredMsg'))
      .matches(Messages.Validations.RegularExpressions.MOBILE_NUMBER, {
        message: translate('common.message.mobileNumInputMsg'),
      }),
    companyName: Yup.string().min(3).notRequired().nullable(),
    postCode: Yup.string().required(
      translate('common.message.postCodeRequiredMsg')
    ),
  })
  return CHECKOUT2_ADDRESS_WITH_PHONE_SCHEMA
}

export const billingAddressCheckout2Schema = () => {
  const translate = useTranslation();
  const CHECKOUT_ADDRESS_SCHEMA = checkoutAddressSchema();
  const BILLING_ADDRESS_CHECKOUT2_SCHEMA = CHECKOUT_ADDRESS_SCHEMA.shape({
  firstName: Yup.string()
    .trim()
    .min(3, translate('common.message.nameMinLengthMsg'))
    .required(translate('common.message.firstNameRequiredMsg'))
    .matches(
      Messages.Validations.RegularExpressions.FULL_NAME,
      translate('common.message.nameInputMsg')
    ),
  lastName: Yup.string()
    .trim()
    .min(
      3,
      translate('common.message.nameMinLengthMsg')
    )
    .required(
      translate('common.message.lastNameRequiredMsg')
    )
    .matches(
      Messages.Validations.RegularExpressions.FULL_NAME,
      translate('common.message.nameInputMsg')
    ),
  })
  return BILLING_ADDRESS_CHECKOUT2_SCHEMA;
}

export const billingAddressWithPhoneCheckout2Schema = () => {
  const translate = useTranslation();
  const BILLING_ADDRESS_CHECKOUT2_SCHEMA = billingAddressCheckout2Schema();
  const BILLING_ADDRESS_WITH_PHONE_CHECKOUT2_SCHEMA = BILLING_ADDRESS_CHECKOUT2_SCHEMA.shape({
      phoneNo: Yup.string()
        .min(7, translate('common.message.mobileNumMinLengthMsg'))
        .max(12, translate('common.message.mobileNumMaxLengthMsg'))
        .required(translate('common.message.mobileNumRequiredMsg'))
        .matches(Messages.Validations.RegularExpressions.MOBILE_NUMBER, {
          message: translate('common.message.mobileNumInputMsg'),
        }),
    })
  return BILLING_ADDRESS_WITH_PHONE_CHECKOUT2_SCHEMA
}

export const guestLoginCheckout2Schema = () => {
  const translate = useTranslation();
  const GUEST_LOGIN_CHECKOUT2_SCHEMA = Yup.object().shape({
  email: Yup.string()
    .trim()
    .required(
      translate('common.message.profile.emailRequiredMsg')
    )
    .email(
      translate('common.message.profile.emailInputMsg')
    ),
  })
  return GUEST_LOGIN_CHECKOUT2_SCHEMA;
}
