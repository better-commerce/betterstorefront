// Base Imports
import React, { FC, useEffect, useState } from 'react'

// Package Imports
import Router from 'next/router'

// Component Imports
import AlertRibbon from '@new-components/ui/AlertRibbon'

// Other Imports
import { useUI } from '@new-components/ui'

const BasicLayout: FC<any> = ({ children }) => {
  const { displayAlert } = useUI()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    Router.events.on('routeChangeStart', () => setIsLoading(true))
    Router.events.on('routeChangeComplete', () => setIsLoading(false))

    if (!document.title) {
      document.title = document.location.host
    }

    return () => {
      Router.events.off('routeChangeStart', () => {})
      Router.events.off('routeChangeComplete', () => {})
    }
  }, [])

  return (
    <>
      <main className="pt-16 sm:pt-20 fit">
        {displayAlert && <AlertRibbon />}
        {children}
      </main>
    </>
  )
}

export default BasicLayout
