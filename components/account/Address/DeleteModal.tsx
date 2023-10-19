import useDevice from '@commerce/utils/use-device'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Fragment } from 'react'

export default function DeleteModal({isOpen, setIsOpen, deleteItem = () => {}}:any) {
  const { isMobile } = useDevice()
  function closeModal() {
    setIsOpen(false)
  }

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full md:max-w-[628px] max-w-[320px] rounded-md transform overflow-hidden bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-2xl font-semibold leading-7 text-blue-dark"
                  >
                    <div className={`flex ${isMobile ? `justify-end` : `justify-between`} items-start`}>
                      {!isMobile && <span className='w-2/3 pb-10 dark:text-black'>Are you sure you want to delete this address?</span>}
                      <button className='btn-default justify-center w-auto !py-1 !px-3 rounded-md' onClick={closeModal}>
                        <XMarkIcon className='w-6 h-6'/>
                      </button>
                    </div>
                    {isMobile && <span className='pb-10 dark:text-black mob-font-18'>Are you sure you want to delete this address?</span>}
                    
                  </Dialog.Title>
                  <div className="flex flex-col md:flex-row gap-2 mt-4">
                    <button
                      type="button"
                      className="btn-default inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={deleteItem}
                    >
                      Delete address
                    </button>
                    <button
                      type="button"
                      className="btn-default inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
