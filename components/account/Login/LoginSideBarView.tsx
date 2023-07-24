import { useUI } from '@components/ui/context'
import { FC, useEffect, useState } from 'react'

import { CLOSE_PANEL } from '@components/utils/textVariables'
import { XMarkIcon } from '@heroicons/react/24/outline'
import Login from './index'

const LoginSideBarView: FC<React.PropsWithChildren<unknown>> = () => {
  const { closeSidebar, displaySidebar } = useUI()
  const [openSidebar, setOpenSidebar] = useState(false)

  useEffect(() => {
    // set to 'true'
    setOpenSidebar(displaySidebar)
  }, [displaySidebar])

  function handleClose(value: any) {
    closeSidebar()
    setOpenSidebar(false)
    return
  }

  return (
    <section
      aria-labelledby="trending-heading"
      className="bg-white h-screen overflow-y-auto"
    >
      <div className="flex pt-5 justify-end pr-14 sm:pr-18 lg:pr-8">
        <button
          type="button"
          className="text-gray-400 transition hover:text-gray-500"
          onClick={handleClose}
        >
          <span className="sr-only">{CLOSE_PANEL}</span>
          <XMarkIcon className="w-5 h-5" aria-hidden="true" />
        </button>
      </div>
      <Login isLoginSidebarOpen={true} />
    </section>
  )
}

export default LoginSideBarView
