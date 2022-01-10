import { useState, useEffect } from 'react'
import eventDispatcher from './eventDispatcher'

export default function useAnalytics(event: string, data: any) {
  const windowClone: any = typeof window !== 'undefined' ? window : {}
  const dataLayer = !!(
    windowClone.dataLayer && windowClone.dataLayer[0].ipAddress
  )

  useEffect(() => {
    if (dataLayer) eventDispatcher(event, data)
  }, [dataLayer])
}
