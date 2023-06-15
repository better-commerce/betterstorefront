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
    <Image
      onClick={logoClick}
      src={`/theme/${CURRENT_THEME}/image/logo.png`}
      alt="BetterComerce"
      width={60}
      height={36}
    />
  )
}

export default Logo
