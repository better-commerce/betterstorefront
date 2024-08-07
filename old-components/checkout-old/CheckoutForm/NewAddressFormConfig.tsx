// Package Imports
import { useTranslation } from "@commerce/utils/use-translation";

const useNewAddressFormFields = () => {
  const translate = useTranslation()
  const NEW_ADDRESS_FORM_FIELDS = [
    {
      type: 'text',
      name: 'postCode',
      placeholder: translate('common.label.postcodeText'),
      label: translate('common.label.postcodeText'),
      className: 'relative mb-2 mt-2 appearance-none min-w-0 w-full bg-white border border-gray-300 rounded-sm shadow-sm py-2 px-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-black focus:ring-1 focus:ring-black',
      labelClassName: 'text-gray-700 text-sm dark:text-black',
      required: true,
      disabled: false,
      max: 10,
      // handleChange: (e: any, item: any, context: any) => {
      //   const regex = /^[0-9\s]*$/
      //   if (regex.test(e?.target.value.toString())) {
      //     context.setFieldValue(NEW_ADDRESS_FORM_FIELDS[0]?.name, e.target.value)
      //   }
      // },
    },
    {
      type: 'text',
      name: 'city',
      placeholder: translate('common.label.cityText'),
      label: translate('common.label.cityText'),
      className: 'relative mb-2 mt-2 appearance-none min-w-0 w-full bg-white border border-gray-300 rounded-sm shadow-sm py-2 px-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-black focus:ring-1 focus:ring-black',
      labelClassName: 'text-gray-700 text-sm dark:text-black',
      required: true,
      disabled: false,
    },
    {
      type: 'text',
      name: 'state',
      placeholder: translate('common.label.stateText'),
      label: translate('common.label.stateText'),
      className: 'relative mb-2 mt-2 appearance-none min-w-0 w-full bg-white border border-gray-300 rounded-sm shadow-sm py-2 px-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-black focus:ring-1 focus:ring-black',
      labelClassName: 'text-gray-700 text-sm dark:text-black',
      required: true,
      disabled: false,
    },
    {
      type: 'text',
      name: 'address1',
      placeholder: translate('common.label.addressLine1Text'),
      label: translate('common.label.addressLine1Text'),
      className: 'relative mb-2 mt-2 appearance-none min-w-0 w-full bg-white border border-gray-300 rounded-sm shadow-sm py-2 px-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-black focus:ring-1 focus:ring-black',
      labelClassName: 'text-gray-700 text-sm dark:text-black',
      required: true,
      disabled: false,
    },
    {
      type: 'text',
      name: 'address2',
      placeholder: translate('common.label.addressLine2Text'),
      label: translate('common.label.addressLine2Text'),
      className: 'relative mb-2 mt-2 appearance-none min-w-0 w-full bg-white border border-gray-300 rounded-sm shadow-sm py-2 px-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-black focus:ring-1 focus:ring-black',
      labelClassName: 'text-gray-700 text-sm dark:text-black',
      required: false,
      disabled: false,
    },
    {
      type: 'text',
      name: 'address3',
      placeholder: translate('common.label.addressLine3Text'),
      label: translate('common.label.addressLine3Text'),
      className: 'relative mb-2 mt-2 appearance-none min-w-0 w-full bg-white border border-gray-300 rounded-sm shadow-sm py-2 px-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-black focus:ring-1 focus:ring-black',
      labelClassName: 'text-gray-700 text-sm dark:text-black',
      required: false,
      disabled: false,
    },
    {
      type : 'select',
      name : 'country',
      label : translate('label.checkout.countryText'),
      labelClassName: 'text-gray-600 text-sm dark:text-black',
      className: 'relative mb-2 mt-2 appearance-none min-w-0 w-full bg-gray-200 border border-gray-300 text-sm rounded-sm shadow-sm py-4 px-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-black focus:ring-1 focus:ring-black',
      required : true,
      disabled : false
    },
    {
      type: 'checkbox',
      name: 'useAsDefault',
      placeholder: '',
      label: translate('common.label.useAsDefautAddressText'),
      className: 'custom-checkbox',
      labelClassName: 'ml-2 text-sm text-black dark:text-black',
      required: false,
      disabled: false,
      htmlFor: 'default-address',
    },
    {
      type: 'text',
      name: 'firstName',
      placeholder: translate('common.label.firstNameText'),
      label: translate('common.label.firstNameText'),
      className: 'relative mb-2 mt-2 appearance-none min-w-0 w-full bg-white border border-gray-300 rounded-sm shadow-sm py-2 px-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-black focus:ring-1 focus:ring-black',
      labelClassName: 'text-gray-700 text-sm dark:text-black',
      required: true,
      disabled: false,
    },
    {
      type: 'text',
      name: 'lastName',
      placeholder: translate('common.label.lastNameText'),
      label: translate('common.label.lastNameText'),
      className: 'relative mb-2 mt-2 appearance-none min-w-0 w-full bg-white border border-gray-300 rounded-sm shadow-sm py-2 px-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-black focus:ring-1 focus:ring-black',
      labelClassName: 'text-gray-700 text-sm dark:text-black',
      required: true,
      disabled: false,
    },
    {
      type: 'tel',
      name: 'mobileNumber',
      placeholder: translate('common.label.mobileNumText'),
      label: translate('common.label.mobileNumText'),
      className: 'relative mb-2 mt-2 appearance-none min-w-0 w-full bg-white border border-gray-300 rounded-sm shadow-sm py-2 px-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-black focus:ring-1 focus:ring-black',
      labelClassName: 'text-gray-700 text-sm dark:text-black',
      required: true,
      disabled: false,
      max: 10,
    },
    {
      type: 'singleSelectButtonGroup',
      name: 'categoryName',
      placeholder: '',
      label: translate('common.label.saveAsText'),
      labelClassName: 'text-base text-black font-bold mb-3 dark:text-black',
      options: [
        {
          label: translate('common.label.homeText'),
          value: translate('common.label.homeText'),
        },
        {
          label: translate('common.label.workText'),
          value: translate('common.label.workText'),
        },
        {
          label: translate('common.label.otherText'),
          value: translate('common.label.otherText'),
        },
      ],
      activeOptionIndex: 0,
      optionClassName: 'inline-block mb-3 mr-2',
      lastOptionClassName: 'inline-block mb-3 mr-2',
      required: false,
      disabled: false,
    },
    {
      type: 'text',
      name: 'otherAddressType',
      placeholder: translate('label.checkout.otherAddressTypeText'),
      label: translate('label.checkout.otherAddressTypeText'),
      className:
        'relative mb-2 mt-2 appearance-none min-w-0 w-full bg-white border border-gray-300 rounded-sm shadow-sm py-2 px-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-black focus:ring-1 focus:ring-black',
      labelClassName: 'text-gray-700 text-sm dark:text-black',
      max: 20,
      required: true,
      disabled: false,
      dependant: true,
    },
    {
      type: 'checkbox',
      name: 'whtsappUpdated',
      placeholder: '',
      label: translate('label.checkout.whatsappUpdatesText'),
      className: 'custom-checkbox',
      labelClassName: 'ml-0 text-sm text-black dark:text-black',
      required: false,
      disabled: false,
      htmlFor: 'whtsappUpdated',
    },
  ]
  return NEW_ADDRESS_FORM_FIELDS
}

export default useNewAddressFormFields