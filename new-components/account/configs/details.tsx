import * as Yup from 'yup'
import { Messages } from '@new-components/utils/constants'
import { useTranslation } from '@commerce/utils/use-translation'
export const useDetailsFormConfig = () => {
  const translate = useTranslation()
  return [
    {
      type: 'text',
      name: 'firstName',
      placeholder: translate('label.addressBook.firstNameText'),
      label: translate('label.addressBook.firstNameText'),
    },
    {
      type: 'text',
      name: 'lastName',
      placeholder: translate('label.addressBook.lastNameText'),
      label: translate('label.addressBook.lastNameText'),
    },
    {
      type: 'email',
      name: 'email',
      placeholder: translate('label.addressBook.emailText'),
      label: translate('label.addressBook.emailText'),
    },
    {
      type: 'mobile',
      name: 'mobile',
      placeholder: translate('common.label.mobileNumText'),
      label: translate('common.label.mobileNumText'),
    },
    {
      type: 'phone',
      name: 'phone',
      placeholder: translate('label.b2b.phoneNumberText'),
      label: translate('label.b2b.phoneNumberText'),
    },
    {
      type: 'singleSelectButtonGroup',
      name: 'gender',
      placeholder: '',
      label: translate('common.label.genderText'),
      labelClassName: 'nc-Label text-base font-medium text-neutral-900 dark:text-neutral-200 mb-1.5',
      options: [
        {
          label: translate('common.label.femaleText'),
          value: translate('common.label.femaleText'),
        },
        {
          label: translate('common.label.maleText'),
          value: translate('common.label.maleText'),
        },
        {
          label: translate('common.label.otherText'),
          value: translate('common.label.otherText'),
        },
      ],
      activeOptionIndex: '',
      optionClassName: 'inline-block mb-3 mr-2',
      lastOptionClassName: 'inline-block mb-3 mr-2',
      required: false,
      disabled: false,
    },
  ]
}

export const useSchema = () => {
  const translate = useTranslation();
  const schema = Yup.object({
    firstName: Yup.string().required(translate('common.message.firstNameRequiredMsg')),
    lastName: Yup.string().required(translate('common.message.lastNameRequiredMsg')),
    email: Yup.string().email().required(translate('common.message.emailAddressRequiredMsg')),
    mobile: Yup.string()
      .max(10)
      .min(10)
      .matches(Messages.Validations.RegularExpressions.MOBILE_NUMBER, {
        message: translate('common.message.mobileNumInputMsg'),
      }),
    phone: Yup.string()
      .max(10)
      .matches(Messages.Validations.RegularExpressions.MOBILE_NUMBER, {
        message: translate('common.message.phoneNumInputMsg'),
      }),
  })
  return schema;
}
