// Base Imports
import React, { Fragment } from 'react'

// Package Imports
import * as Yup from 'yup'
// import { XIcon } from "@heroicons/react/outline";
import { Dialog, Transition } from '@headlessui/react'

// Component Imports
import NewAddressForm from './NewAddressForm'
import { useUI } from '@components/ui'

// Other Imports
import { findByFieldName } from '@framework/utils/app-util'
import { ISubmitStateInterface } from '@commerce/utils/use-data-submit'
import { Messages } from '@components/utils/constants'
import { useTranslation } from '@commerce/utils/use-translation'

export const NEW_ADDRESS_FORM_ID = 'newAddressForm'
export const NEW_ADDRESS_FORM_FIELDS = [
  {
    type: 'text',
    name: 'postCode',
    placeholder: 'Postcode',
    label: 'Postcode',
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
    placeholder: 'City',
    label: 'City',
    className: 'relative mb-2 mt-2 appearance-none min-w-0 w-full bg-white border border-gray-300 rounded-sm shadow-sm py-2 px-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-black focus:ring-1 focus:ring-black',
    labelClassName: 'text-gray-700 text-sm dark:text-black',
    required: true,
    disabled: false,
  },
  {
    type: 'text',
    name: 'state',
    placeholder: 'State',
    label: 'State',
    className: 'relative mb-2 mt-2 appearance-none min-w-0 w-full bg-white border border-gray-300 rounded-sm shadow-sm py-2 px-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-black focus:ring-1 focus:ring-black',
    labelClassName: 'text-gray-700 text-sm dark:text-black',
    required: true,
    disabled: false,
  },
  {
    type: 'text',
    name: 'address1',
    placeholder: 'Address Line 1',
    label: 'Address Line 1',
    className: 'relative mb-2 mt-2 appearance-none min-w-0 w-full bg-white border border-gray-300 rounded-sm shadow-sm py-2 px-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-black focus:ring-1 focus:ring-black',
    labelClassName: 'text-gray-700 text-sm dark:text-black',
    required: true,
    disabled: false,
  },
  {
    type: 'text',
    name: 'address2',
    placeholder: 'Address Line 2',
    label: 'Address Line 2',
    className: 'relative mb-2 mt-2 appearance-none min-w-0 w-full bg-white border border-gray-300 rounded-sm shadow-sm py-2 px-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-black focus:ring-1 focus:ring-black',
    labelClassName: 'text-gray-700 text-sm dark:text-black',
    required: false,
    disabled: false,
  },
  {
    type: 'text',
    name: 'address3',
    placeholder: 'Address Line 3',
    label: 'Address Line 3',
    className: 'relative mb-2 mt-2 appearance-none min-w-0 w-full bg-white border border-gray-300 rounded-sm shadow-sm py-2 px-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-black focus:ring-1 focus:ring-black',
    labelClassName: 'text-gray-700 text-sm dark:text-black',
    required: false,
    disabled: false,
  },
  {
    type : 'select',
    name : 'country',
    label : 'Country',
    labelClassName: 'text-gray-600 text-sm dark:text-black',
    className: 'relative mb-2 mt-2 appearance-none min-w-0 w-full bg-gray-200 border border-gray-300 text-sm rounded-sm shadow-sm py-4 px-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-black focus:ring-1 focus:ring-black',
    required : true,
    disabled : false
  },
  {
    type: 'checkbox',
    name: 'useAsDefault',
    placeholder: '',
    label: 'Use as Default Address',
    className: 'custom-checkbox',
    labelClassName: 'ml-2 text-sm text-black dark:text-black',
    required: false,
    disabled: false,
    htmlFor: 'default-address',
  },
  {
    type: 'text',
    name: 'firstName',
    placeholder: 'First Name',
    label: 'First Name',
    className: 'relative mb-2 mt-2 appearance-none min-w-0 w-full bg-white border border-gray-300 rounded-sm shadow-sm py-2 px-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-black focus:ring-1 focus:ring-black',
    labelClassName: 'text-gray-700 text-sm dark:text-black',
    required: true,
    disabled: false,
  },
  {
    type: 'text',
    name: 'lastName',
    placeholder: 'Last Name',
    label: 'Last Name',
    className: 'relative mb-2 mt-2 appearance-none min-w-0 w-full bg-white border border-gray-300 rounded-sm shadow-sm py-2 px-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-black focus:ring-1 focus:ring-black',
    labelClassName: 'text-gray-700 text-sm dark:text-black',
    required: true,
    disabled: false,
  },
  {
    type: 'tel',
    name: 'mobileNumber',
    placeholder: 'Mobile Number',
    label: 'Mobile Number',
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
    label: 'Save As',
    labelClassName: 'text-base text-black font-bold mb-3 dark:text-black',
    options: [
      {
        label: 'Home',
        value: 'Home',
      },
      {
        label: 'Work',
        value: 'Work',
      },
      {
        label: 'Other',
        value: 'Other',
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
    placeholder: 'Other Address Type',
    label: 'Other Address Type',
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
    label: 'Send me updates on WhatsApp',
    className: 'custom-checkbox',
    labelClassName: 'ml-0 text-sm text-black dark:text-black',
    required: false,
    disabled: false,
    htmlFor: 'whtsappUpdated',
  },
]

export const DEFAULT_ADDRESS_VALUES = {
  id: 0,
  postCode: '',
  city: '',
  state: '',
  address1: '',
  address2: '',
  country: '',
  useAsDefault: false,
  firstName: '',
  lastName: '',
  mobileNumber: '',
  categoryName: findByFieldName(NEW_ADDRESS_FORM_FIELDS, 'categoryName')
  ?.options?.length
  ? findByFieldName(NEW_ADDRESS_FORM_FIELDS, 'categoryName')?.options[0]
        ?.value
        : '',
        otherAddressType: '',
        whtsappUpdated: true,
      }

      interface INewAddressModalProps {
        readonly selectedAddress: any | undefined
        readonly submitState: ISubmitStateInterface
        readonly countries: any
        readonly isOpen: boolean
        readonly btnTitle: string
        readonly isRegisterAsGuestUser: boolean
        onSubmit: any
        onCloseModal: any
      }
      
      const NewAddressModal = (props: INewAddressModalProps) => {
        const {
          selectedAddress = undefined,
          submitState,
          isOpen,
          onSubmit,
          countries,
          onCloseModal = () => {},
          btnTitle,
          isRegisterAsGuestUser,
        } = props
        const translate = useTranslation()
        const NEW_ADDRESS_FORM_SCHEMA = Yup.object().shape({
          id: Yup.number().notRequired(),
          postCode: Yup.string()
            .required(translate('common.message.postCodeRequiredMsg'))
            .min(3),
          // .matches(/^(0*[1-9][0-9]*(\.[0-9]*)?|0*\.[0-9]*[1-9][0-9]*)$/, {
          //   message: translate('common.message.address.postCodeNumMsg'),
          // }),
          city: Yup.string()
            .required(translate('common.message.address.cityRequiredMsg'))
            .min(3),
          state: Yup.string().min(3)
          .required(translate('common.message.address.stateRequiredMsg')),
          address1: Yup.string()
            .min(15)
            .required(translate('common.message.address.address1RequiredMsg'))
            .matches(Messages.Validations.RegularExpressions.ADDRESS_LINE, {
              message: translate('common.message.address.address1InputMsg'),
            }),
          address2: Yup.string().nullable()
            .matches(Messages.Validations.RegularExpressions.ADDRESS_LINE, {
              message: translate('common.message.address.address2InputMsg'),
            }),
          address3: Yup.string().nullable()
            .matches(Messages.Validations.RegularExpressions.ADDRESS_LINE, {
              message: translate('common.message.address.address3InputMsg'),
          }),
          country: Yup.string().required(translate('common.message.address.countryRequiredMsg')),
          useAsDefault: Yup.boolean(),
          firstName: Yup.string()
            .min(3)
            .required(translate('common.message.firstNameRequiredMsg'))
            .matches(Messages.Validations.RegularExpressions.FULL_NAME, {
              message: translate('common.message.nameInputMsg'),
          }),
          lastName: Yup.string()
            .min(3)
            .required(translate('common.message.lastNameRequiredMsg'))
            .matches(Messages.Validations.RegularExpressions.FULL_NAME, {
              message: translate('common.message.nameInputMsg'),
          }),
          mobileNumber: Yup.string()
            .max(10)
            .required(translate('common.message.mobileNumRequiredMsg'))
            .matches(Messages.Validations.RegularExpressions.MOBILE_NUMBER, {
              message: translate('common.message.mobileNumInputMsg'),
            }),
          label: Yup.string().nullable(),
          otherAddressType: Yup.string().nullable(),
          whtsappUpdated: Yup.boolean(),
          // .when(["categoryName"], {
          //     is: (label: string) => {
          //         return matchStrings(categoryName, "Other", true);
          //     },
          //     then: Yup.string().min(3, Messages.Validations.AddNewAddress["ADDRESS_TYPE_MIN_LENGTH"])
          //         .required(Messages.Validations.AddNewAddress["ADDRESS_TYPE_REQUIRED"])
          //         .matches(
          //             Messages.Validations.RegularExpressions.ADDRESS_LABEL, {
          //             message: Messages.Validations.AddNewAddress["ADDRESS_TYPE_INPUT"],
          //         }).nullable(),
          //     otherwise: Yup.string().nullable(),
          // }),
        })
        const { user, selectedAddressId } = useUI()
        
        return (
          <>
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-999999" onClose={onCloseModal}>
          <div className="fixed inset-0 left-0 bg-gray-900/20" />
          <div className="fixed inset-0 overflow-hidden z-999">
            <div className="absolute inset-0 overflow-hidden">
              <div className="fixed inset-y-0 right-0 flex max-w-full pointer-events-none">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500 sm:duration-400"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-400"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="w-screen max-w-md pointer-events-auto">
                    <div className="relative z-50 flex flex-col h-full bg-white shadow-xl">
                      <div className="z-10 px-4 py-6 pb-2 border-b sm:px-6 left-1 top-1">
                        <div className="flex justify-between pb-2 mb-0">
                          <h3 className="font-bold text-black text-20 dark:text-black">
                            <a
                              onClick={onCloseModal}
                              className="inline-block cursor-pointer sm:hidden"
                            >
                              <i className="mr-2 sprite-icon sprite-left-arrow"></i>
                            </a>
                            {selectedAddressId ? (
                              <>{translate('common.label.editAddressText')}</>
                            ) : (
                              <>{translate('common.label.addAddressText')}</>
                            )}
                          </h3>
                          <button
                            type="button"
                            className="hidden text-black rounded-md outline-none hover:text-gray-500 sm:inline-block"
                            onClick={onCloseModal}
                          >
                            <span className="sr-only">{translate('common.label.closePanelText')}</span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="w-6 h-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div className="p-0 px-2 py-2 overflow-y-auto sm:p-0 sm:px-2">
                        {/* New Address Form start */}
                        <NewAddressForm
                          isRegisterAsGuestUser={isRegisterAsGuestUser}
                          btnTitle={btnTitle}
                          submitState={submitState}
                          countries={countries}
                          formId={NEW_ADDRESS_FORM_ID}
                          formFields={NEW_ADDRESS_FORM_FIELDS}
                          schema={NEW_ADDRESS_FORM_SCHEMA}
                          defaultValues={
                            selectedAddress && selectedAddress?.id
                              ? {
                                  id: selectedAddressId ?? selectedAddress?.id,
                                  postCode: selectedAddress?.postCode,
                                  city: selectedAddress?.city,
                                  state: selectedAddress?.state,
                                  countryCode: selectedAddress?.countryCode,
                                  country : selectedAddress?.country,
                                  address1: selectedAddress?.address1,
                                  address2: selectedAddress?.address2,
                                  address3: selectedAddress?.address3,
                                  useAsDefault: selectedAddress?.isDefault ?? false,
                                  name: `${selectedAddress?.firstName} ${selectedAddress?.lastName}`.trim(),
                                  firstName: selectedAddress?.firstName.trim(),
                                  lastName: selectedAddress?.lastName.trim(),
                                  mobileNumber: selectedAddress?.phoneNo,
                                  categoryName: findByFieldName(
                                    NEW_ADDRESS_FORM_FIELDS,
                                    'categoryName'
                                  )
                                    ?.options?.filter(
                                      (x: any) => x?.label != 'Other'
                                    )
                                    ?.map((x: any) => x.label)
                                    ?.includes(selectedAddress?.label)
                                    ? selectedAddress?.label
                                    : 'Other',
                                  otherAddressType: !findByFieldName(
                                    NEW_ADDRESS_FORM_FIELDS,
                                    'categoryName'
                                  )
                                    ?.options?.filter(
                                      (x: any) => x?.label != 'Other'
                                    )
                                    ?.map((x: any) => x.label)
                                    ?.includes(selectedAddress?.label)
                                    ? selectedAddress?.label
                                    : '',
                                  whtsappUpdated:
                                    selectedAddress?.isConsentSelected,
                                }
                              : { ...DEFAULT_ADDRESS_VALUES }
                          }
                          onSubmit={onSubmit}
                        />
                        {/* New Address Form End */}

                        {/* <div className="py-4 mt-2 chk-btn">
                                                    <button
                                                        type="submit"
                                                        form={NEW_ADDRESS_FORM_ID}
                                                        className="w-full flex items-center justify-center px-4 py-3 -mr-0.5 text-white bg-black border-2 border-black rounded-sm hover:bg-gray-800 hover:text-whitesm:px-6 hover:border-gray-900"
                                                    >
                                                        Deliver to this Address
                                                        <span className="ml-2">
                                                            <i className="sprite-icon sprite-right-white-arrow"></i>
                                                        </span>
                                                    </button>
                                                </div> */}
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  )
}

export default NewAddressModal
