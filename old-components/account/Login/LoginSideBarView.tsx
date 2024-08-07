import { useUI } from '@components/ui/context'
import { FC, useEffect, useState } from 'react'

import { XMarkIcon } from '@heroicons/react/24/outline'
import Login from './index'
import { useTranslation } from '@commerce/utils/use-translation';

interface LoginSideBarViewProps {
  pluginConfig: any;
}

const LoginSideBarView: React.FC<LoginSideBarViewProps> = ({pluginConfig = []}) => {
  const { closeSidebar, displaySidebar } = useUI()
  const [openSidebar, setOpenSidebar] = useState(false)
  const translate = useTranslation()
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
          <span className="sr-only">{translate('common.label.closePanelText')}</span>
          <XMarkIcon className="w-5 h-5" aria-hidden="true" />
        </button>
      </div>
      <Login isLoginSidebarOpen={true} pluginConfig={pluginConfig}/>
    </section>
  )
}

export default LoginSideBarView
