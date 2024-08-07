import { FC, Fragment, useEffect, useState } from 'react'
import { useUI } from '@components/ui/context'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Transition } from '@headlessui/react'

const AlertRibbon: FC = () => {
  const { alertRibbon, displayAlert, hideAlert } = useUI()
  const [showAlert, setShowAlert] = useState(false)

  useEffect(() => {
    setShowAlert(displayAlert)
  }, [displayAlert])

  const color = (type: string) => {
    switch (type) {
      case 'error':
        return 'bg-ribbon-red capitalize'
      case 'success':
        return 'bg-ribbon-green capitalize'
      case 'cancel':
        return 'bg-ribbon-cancel'
      default:
        return ''
    }
  }

  return (
    <Transition
      as={Fragment}
      show={showAlert}
      enter="transform transition ease-in-out duration-300"
      enterFrom="-translate-y-full"
      enterTo="translate-y-0"
      leave="transform transition ease-in-out duration-300"
      leaveFrom="translate-y-0"
      leaveTo="-translate-y-full"
    >
      <div
        aria-label="alert-ribbon"
        className={`${color(
          alertRibbon?.type
        )} justify-between flex w-full px-10 py-3 text-center align-center fixed top-0 z-[9999999]`}
      >
        <div></div>
        <div className="justify-center">
          <h4
            className={`text-16 font-medium btn_text_white ${
              alertRibbon?.type == 'cancel' ? 'text-[#c10000]' : 'text-[#fff]'
            }`}
          >
            {alertRibbon?.msg}
          </h4>
        </div>
        <div>
          <XMarkIcon
            onClick={hideAlert}
            className="w-6 h-6 mt-3 font-bold cursor-pointer text-white"
            aria-hidden="true"
          />
        </div>
      </div>
    </Transition>
  )
}

export default AlertRibbon
