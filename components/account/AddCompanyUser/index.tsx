'use client'

import React, { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

import Form from '@components/account/AddCompanyUser/Form'
import { useUI } from '@components/ui'
import { useTranslation } from '@commerce/utils/use-translation'
import { NEXT_CREATE_CUSTOMER,} from '@components/utils/constants'
import { AlertType, UserRoleType } from '@framework/utils/enums'
import Layout from '@components/Layout/Layout'

interface IAddNewUserModalProps {
  readonly isOpen: boolean
  readonly btnTitle: string
  companyDetails: any
  closeModal: () => void
}

const AddNewUserModal = (props: IAddNewUserModalProps) => {
  const { isOpen, closeModal, companyDetails } = props
  const translate = useTranslation()
  const { setAlert }= useUI()
  const router = useRouter()
  
  const onAddCompanyUser = async (values: any) => {
    const reqData = {
      firstName: values?.firstName ?? '',
      lastName: values?.lastName ?? '',
      email: values?.email ?? '',
      password: values?.password,
      telephone: values.phoneNumber,
      mobile: values.mobileNumber,
      companyName: companyDetails?.companyName ?? '',
      companyCode: companyDetails?.companyCode ?? '',
      companyUserRole: values.role ?? UserRoleType.ADMIN,
    }

    try {
      const result: any = await axios.post(NEXT_CREATE_CUSTOMER, reqData)
      if (result) {
        setAlert({type: AlertType.SUCCESS, msg: translate('common.message.userAddedSuccessfullyMsg')})
      }
      router.refresh()
      window.scrollTo(0, 0)
      closeModal()
    } catch (error: any) {
      setAlert({type: 'error', msg: error?.response?.data?.description?.message})
    }
  }

  return (
    <>
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-999999" onClose={closeModal}>
          <div className="fixed inset-0 left-0 bg-black/70 z-999" />
          <div className="fixed inset-0 overflow-hidden z-999">
            <div className="absolute inset-0 overflow-hidden">
              <div className="fixed inset-y-0 right-0 flex max-w-full pointer-events-none">
                <Transition.Child as={Fragment} enter="transform transition ease-in-out duration-500 sm:duration-400" enterFrom="translate-x-full" enterTo="translate-x-0" leave="transform transition ease-in-out duration-500 sm:duration-400" leaveFrom="translate-x-0" leaveTo="translate-x-full" >
                  <Dialog.Panel className="w-screen max-w-md pointer-events-auto">
                    <div className="relative z-50 flex flex-col h-full bg-white shadow-xl">
                      <div className="z-10 px-4 py-6 pb-2 border-b sm:px-6 left-1 top-1">
                        <div className="flex justify-between pb-2 mb-0">
                          <h3 className="flex items-center font-bold text-black text-20 dark:text-black"> {translate('label.myAccount.addNewUserText')} </h3>
                          <button type="button" className="hidden text-black rounded-md outline-none hover:text-gray-500 sm:inline-block" onClick={closeModal} >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6" >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div className="p-0 px-2 py-2 mx-2 my-4 overflow-y-auto sm:p-0 sm:px-2">
                        <Form type="addCompanyUser" onSubmit={onAddCompanyUser} btnText={translate('label.myAccount.addNewUserText')} />
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
AddNewUserModal.Layout = Layout
export default AddNewUserModal
