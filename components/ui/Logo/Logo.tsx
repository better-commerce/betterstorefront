import React, { useMemo } from 'react'
import { CURRENT_THEME } from '@components/utils/constants'
import {  } from '@components/services/analytics/ga4'
import { getCurrentPage } from '@framework/utils/app-util'
import Image from 'next/image'
import { analyticsEventDispatch } from '@components/services/analytics/analyticsEventDispatch'
import { AnalyticsEventType } from '@components/services/analytics'

const Logo = ({ className = '', ...props }) => {
  let currentPage = getCurrentPage()

  function logoClick() {
    if (currentPage) {
      if (typeof window !== 'undefined') {
        debugger
        analyticsEventDispatch(AnalyticsEventType.LOGO_CLICK, { currentPage, })
      }
    }
  }
  const logoSrc = useMemo(() => {
    const fileExtension = CURRENT_THEME === 'schbang' ? 'gif' : CURRENT_THEME === 'cam' ? 'svg' : 'png';
    return `/theme/${CURRENT_THEME}/image/logo.${fileExtension}?fm=webp&h=200`;
  }, [CURRENT_THEME]);

  return (
    <div className='logo-container'>
      <img onClick={logoClick} src={logoSrc} width={60} height={60} alt="Store" className="brand-logo" />
    </div>
  )
}

export default Logo
