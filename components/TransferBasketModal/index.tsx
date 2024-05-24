import React, { Fragment, useEffect, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { LoadingDots } from '@components/ui'
import {
  EmptyString,
  LoadingActionType,
  NEXT_B2B_GET_USERS,
} from '@components/utils/constants'
import { useTranslation } from '@commerce/utils/use-translation'
import axios from 'axios'
import { useUI } from '@components/ui/context'

const TransferBasketModal = ({
  isOpen,
  userCarts,
  closeModal,
  loadingAction,
  handleTransferBasket,
  setLoadingAction,
}: any) => {
  const { user } = useUI()
  const translate = useTranslation()
  const [b2bUsers, setB2BUsers] = useState<any>([])
  const [selectedUserCart, setSelectedUserCart] = useState<any>(null)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [validationError, setValidationError] = useState<string>('')
  let index = 0
  
  const fetchB2BUsers = async () => {
    let { data: b2bUsers } = await axios.post(NEXT_B2B_GET_USERS, {
      companyId: user?.companyId,
    })
    if (b2bUsers?.length) {
      setB2BUsers(b2bUsers)
    }
    return b2bUsers
  }
  useEffect(() => {
    fetchB2BUsers()
  }, [])

  const handleTransfer = () => {
    setValidationError('')
    if (!selectedUserCart) {
      setValidationError("cartNotSelectedErr")
        return
      }
  
      if (!selectedUser) {
        setValidationError("userNotSelectedErr")
        return
      }
    // Implement the logic to transfer the basket here
    handleTransferBasket(selectedUserCart?.id, selectedUser?.userId , user?.userId)
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        open={isOpen}
        className="relative z-9999"
        onClose={closeModal}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-1s00"
          enterFrom="opacity-0"
          enterTo="opacity-30"
          leave="ease-in duration-100"
          leaveFrom="opacity-30"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-full p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="transition duration-100 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-75 ease-out"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
            >
              <Dialog.Panel className="w-full max-w-md pb-6 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <Dialog.Title
                  as="div"
                  className="flex justify-between items-center w-full px-6 py-3 text-lg font-medium leading-6 text-gray-900/70 border-b-2 shadow xsm:text-md border-gray-50"
                >
                  {translate('label.b2b.basket.transferBasketLinkText')}
                  {loadingAction === LoadingActionType.NONE && (
                    <XMarkIcon
                      className="w-5 h-5 text-gray-500 hover:text-gray-400 cursor-pointer"
                      onClick={closeModal}
                    ></XMarkIcon>
                  )}
                </Dialog.Title>

                <div className="px-6 mt-4">
                  <label
                    htmlFor="userCart"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    {translate('label.b2b.basket.selectBasketToTransferText')}
                  </label>
                  <select
                    id="userCart"
                    value={selectedUserCart?.id}
                    onChange={(e) =>{
                        const selectedUserCart:any[] = userCarts.find( (cart: any) => cart?.id === e.target.value )
                        setSelectedUserCart( selectedUserCart )}
                    }
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  >
                    <option value=""> {translate('label.b2b.basket.selectBasketToTransferText')}</option>
                    {userCarts?.length>0 && userCarts?.map((cart: any) => {
                        let basketName = cart?.name
                        if (!basketName) {
                            basketName = translate('label.b2b.basket.Unnamed') +" "+ (index + 1)
                            index = index + 1
                        }
                        return(
                      <option key={cart?.id} value={cart?.id}>
                        {basketName}
                      </option>
                    )})}
                  </select>
                  { validationError === "cartNotSelectedErr" && <p> {translate('label.b2b.basket.noCartSelectedText')} </p>}
                </div>

                <div className="px-6 mt-4">
                  <label
                    htmlFor="user"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    {translate('label.b2b.basket.selectUserToTransferText')}
                  </label>
                  <select
                    id="user"
                    value={selectedUser?.userId}
                    onChange={(e) =>
                      setSelectedUser(
                        b2bUsers.find(
                          (transitUser: any) => transitUser?.userId === e.target.value
                        )
                      )
                    }
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  >
                    <option value=""> {translate('label.b2b.basket.selectUserToTransferText')}</option>
                    {b2bUsers?.map((transitUser: any) => {
                        if(transitUser?.userId === user?.userId) return
                        return(
                      <option key={transitUser?.userId} value={transitUser?.userId}>
                        {transitUser?.firstName} {transitUser?.lastName}
                      </option>
                    )})}
                  </select>
                  { validationError === "userNotSelectedErr" && <p> {translate('label.b2b.basket.noUserSelectedText')} </p>}
                </div>

                <div className="flex items-center justify-around w-full px-6 mt-2">
                  <button className="nc-Button relative h-auto inline-flex items-center justify-center rounded-full transition-colors text-sm sm:text-base font-medium py-3 px-4 sm:py-3.5 sm:px-6  ttnc-ButtonPrimary disabled:bg-opacity-90 bg-slate-900 dark:bg-slate-100  !text-slate-50 dark:text-slate-800 shadow-xl mt-4 w-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-6000 dark:focus:ring-offset-0 mr-2 disabled:cursor-not-allowed"
                    onClick={handleTransfer}
                    disabled={!selectedUserCart || !selectedUser}
                    >

                    {loadingAction === LoadingActionType.TRANSFER_BASKET ? (
                      <LoadingDots />
                    ) : (
                      <>{translate('common.label.submitText')}</>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      closeModal()
                    }}
                    className="nc-Button relative h-auto inline-flex items-center justify-center rounded-full transition-colors text-sm sm:text-base font-medium py-3 px-4 sm:py-3.5 sm:px-6  ttnc-ButtonPrimary disabled:bg-opacity-90 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 !text-slate-50 dark:text-slate-800 shadow-xl mt-4 w-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-6000 dark:focus:ring-offset-0 ml-2"
                  >
                    {translate('common.label.cancelText')}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default TransferBasketModal
