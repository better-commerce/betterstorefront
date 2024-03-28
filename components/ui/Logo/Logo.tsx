import React from 'react'
import { CURRENT_THEME } from '@components/utils/constants'
import { recordGA4Event } from '@components/services/analytics/ga4'
import { getCurrentPage } from '@framework/utils/app-util'
import Image from 'next/image'

const Logo = ({ className = '', ...props }) => {
  let currentPage = getCurrentPage()

  function logoClick() {
    if (currentPage) {
      if (typeof window !== 'undefined') {
        recordGA4Event(window, 'logo_click', {
          current_page: currentPage,
        })
      }
    }
  }

  return (
    <img onClick={logoClick} src={`/theme/${CURRENT_THEME}/image/logo-tagdeal.png?fm=webp&h=60`} alt="Tag Deal" width={120} height={100} className="w-auto h-auto md:w-48 lg:w-48 invert" />
  )
}

export default Logo
