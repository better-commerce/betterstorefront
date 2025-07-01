import { Formik, Form } from 'formik'
import { useState, Fragment, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import * as Yup from 'yup'
import { AxiosRequestConfig } from 'axios'
import { NEXT_BANK_TRANSFER, NEXT_GET_CUSOMER_BANK_LIST, } from '@components/utils/constants'
import { RequestMethod } from 'bc-payments-sdk/dist/constants'
import { callApi } from '@framework/utils/api-util'
import { logError } from '@framework/utils/app-util'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'

export default function TransferModal({ open, handleClose, walletId, walletDetail, setSuccessMessage, refreshWalletDetails, refreshWalletTranscations }: any) {
  const [customerBankList, setCustomerBankList] = useState([{}])
  const [customerBankDropdown, setCustomerBankDropdown] = useState([])
  const router = useRouter()

  const onClose = () => { handleClose() }

  const validationSchema = Yup.object({
    amount: Yup.number()
      .required('Amount is required')
      .positive('Amount must be positive')
      .test( 'insufficient-balance', 'Insufficient balance', (value) => (value || 0) <= (walletDetail?.balance || 0) ),
    accountDetails: Yup.string().required('Please select Account Details'),
  })

  const config = [
    {
      placeholder: 'Enter Amount',
      label: 'Amount',
      as: 'number',
      name: 'amount',
    },
    {
      label: 'Account Details',
      as: 'select',
      name: 'accountDetails',
      options: customerBankDropdown?.length > 0 ? customerBankDropdown : [],
    },
  ]

  const handleCreateBankTransfer = async (payload: any) => {
    try {
      const config: AxiosRequestConfig = { url: NEXT_BANK_TRANSFER, method: RequestMethod.POST, data: payload, }
      const { data }: any = await callApi(config)
      if(data) {
        setSuccessMessage("Amount Transfer to bank successfully!!!");
        refreshWalletDetails(walletDetail?.walletId)
        router.refresh()
      }
      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
    } catch (error) {
      logError(error)
    } finally {
      onClose()
    }
  }

  const handleSubmit = (values: any) => {
    const selectedBankDetails: any = customerBankList.find( (item: any) => item?.data?.customerBankId === values.accountDetails )
    if (!selectedBankDetails) return
    const payload = { walletId: selectedBankDetails?.data?.walletId, amount: values.amount, currency: walletDetail?.currency, bankName: selectedBankDetails?.data?.bankName, accountNumber: selectedBankDetails?.data?.accountNumber, sortCode: selectedBankDetails?.data?.sortCode, }
    handleCreateBankTransfer(payload)
  }

  const getCustomerBankList = async (walletId: any) => {
    try {
      const config: AxiosRequestConfig = { url: NEXT_GET_CUSOMER_BANK_LIST, method: RequestMethod.POST, data: { walletId }, }
      const { data }: any = await callApi(config)
      setCustomerBankList(data?.data?.items)
      setCustomerBankDropdown( data?.data?.items?.map((item: any) => ({ itemText: `${item?.data?.accountNumber} (${item?.data?.bankName})`, itemValue: item?.data?.customerBankId, })) || [] )
    } catch (error) {
      logError(error)
    }
  }
  useEffect(() => {
    if (!open) return
    getCustomerBankList(walletId)
  }, [open, walletId])

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" open={open} className="relative z-9999" onClose={onClose} >
        <Transition.Child as={Fragment} enter="ease-out duration-1s00" enterFrom="opacity-0" enterTo="opacity-50" leave="ease-in duration-100" leaveFrom="opacity-50" leaveTo="opacity-0" >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-full p-4 text-center">
            <Transition.Child as={Fragment} enter="transition duration-100 ease-out" enterFrom="transform scale-95 opacity-0" enterTo="transform scale-100 opacity-100" leave="transition duration-75 ease-out" leaveFrom="transform scale-100 opacity-100" leaveTo="transform scale-95 opacity-0" >
              <Dialog.Panel className="w-full max-w-lg pb-6 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl">
                <Dialog.Title as="div" className="flex justify-between w-full px-6 py-3 text-lg font-medium leading-6 text-gray-900 border-b-2 shadow xsm:text-md border-gray-50" > 
                  Transfer To Bank
                  <XMarkIcon className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-400" onClick={onClose} ></XMarkIcon>
                </Dialog.Title>
                <div className="px-6 py-4">
                  <Formik validationSchema={validationSchema} initialValues={{ amount: '', accountDetails: '' }} onSubmit={handleSubmit} >
                    {({ values, handleChange, handleBlur, errors, touched, }) => {
                      return (
                        <Form>
                          {config.map((item: any, idx: number) => (
                            <div key={idx} className="mb-4">
                              <label className="block text-sm font-medium text-gray-700"> {item.label} </label>
                              {item.as === 'select' ? (
                                <select name={item.name} onChange={handleChange} onBlur={handleBlur} value={ values[item.name as keyof typeof values] } className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md" >
                                  <option key={idx} value="" disabled> --Select Account Details-- </option>
                                  {item.options.map( (option: any, index: number) => ( <option key={index} value={option.itemValue} > {option.itemText} </option> ) )}
                                </select>
                              ) : ( <input type="number" name={item.name} value={ values[item.name as keyof typeof values] } onChange={handleChange} onBlur={handleBlur} placeholder={item.placeholder} className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" /> )}
                              {errors[item.name as keyof typeof errors] && touched[item.name as keyof typeof touched] && (
                                <div className="text-red-500 text-sm mt-1"> {errors[item.name as keyof typeof errors]} </div>
                              )}
                            </div>
                          ))}
                          <div className="mt-6 flex gap-4 justify-end">
                            <button type="button" onClick={onClose} className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" > Cancel </button>
                            <button type="submit" className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white ttnc-ButtonPrimary border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" > Save </button>
                          </div>
                        </Form>
                      )
                    }}
                  </Formik>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
