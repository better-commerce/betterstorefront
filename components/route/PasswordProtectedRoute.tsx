// Base Imports
import React, { useEffect, useState } from 'react'

// Package Imports
import Router from 'next/router'

// Component Imports
import Loader from '@components/Loader'

// Other Imports
import { stringToBoolean } from '@framework/utils/parse-util'
import Cookies from 'js-cookie'
import { Cookie } from '@framework/utils/constants'

const PasswordProtectedRoute = ({ config, children }: any) => {
  let configSettings: any
  let isPasswordProtectionEnabled: boolean = false
  if (config) {
    configSettings = config?.configSettings
    if (configSettings) {
      const passwordProtectionSettings =
        configSettings?.find(
          (x: any) => x?.configType === 'PasswordProtectionSettings'
        )?.configKeys || []
      isPasswordProtectionEnabled = stringToBoolean(
        passwordProtectionSettings?.find(
          (x: any) =>
            x?.key === 'PasswordProtectionSettings.LivePasswordEnabled'
        )?.value || 'False'
      )
    }
  }

  const [isProtectionEligible, setIsProtectionEligible] = useState(
    isPasswordProtectionEnabled
  )

  useEffect(() => {
    if (configSettings) {
      const passwordProtectionSettings =
        configSettings?.find(
          (x: any) => x?.configType === 'PasswordProtectionSettings'
        )?.configKeys || []
      const isPasswordProtectionEnabled = stringToBoolean(
        passwordProtectionSettings?.find(
          (x: any) =>
            x?.key === 'PasswordProtectionSettings.LivePasswordEnabled'
        )?.value || 'False'
      )

      const authenticated = Cookies.get(Cookie.Key.PASSWORD_PROTECTION_AUTH)
      const isAuthenticated = stringToBoolean(authenticated)
      if (isPasswordProtectionEnabled && !isAuthenticated) {
        Router.push('/password-protection').then(() => {
          setIsProtectionEligible(false)
        })
      } else {
        setIsProtectionEligible(false)
      }
      return
    }
  }, [])

  return isProtectionEligible ? (
    <Loader backdropInvisible={true} message={''} />
  ) : (
    <>{children}</>
  )
}

export default PasswordProtectedRoute
