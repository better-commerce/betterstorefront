import React from 'react'
import { recordGA4Event } from '@components/services/analytics/ga4'
import { getCurrentPage } from '@framework/utils/app-util'

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
    <img
      onClick={logoClick}
      src="/logo-cx-commerce.png"
      alt="BetterComerce"
      width={50}
      height={36}
    />
  )
}

export default Logo
