import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'

//
import { Button } from '@components/ui'
import { useTranslation } from '@commerce/utils/use-translation'
import { stringFormat } from '@framework/utils/parse-util'
import { useRouter } from 'next/router'

function SaveQuoteSuccessModal({ quoteDetails, isQuoteSuccessOpen = false, handleToggleOpenQuoteSuccess = () => {} }: any) {
  const translate = useTranslation()
  const router = useRouter()

  const onCloseAndGoBack = () => {
    handleToggleOpenQuoteSuccess()
    router.push('/')
  }

  return (
    <Transition appear show={isQuoteSuccessOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onCloseAndGoBack}>
        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                  {translate('label.thankyou.thankyouText')}
                </Dialog.Title>
                <p className="mt-3">
                  {stringFormat(translate('label.quotes.quoteSavedSuccessMsg'), {
                    quoteNum: quoteDetails?.message,
                  })}
                </p>
                <Button type="button" onClick={onCloseAndGoBack} className="!rounded-full !bg-slate-900 !capitalize mt-8 float-right hover:!bg-slate-800 dark:!bg-slate-100 focus:!ring-black focus:!outline-none focus:!ring-2 focus:!ring-offset-2">
                  {translate('common.label.backToHomepageText')}
                </Button>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default SaveQuoteSuccessModal
