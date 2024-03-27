// Base Imports
import React, { useEffect, useState } from 'react'

// Package Imports
import NextHead from 'next/head'
import cache from 'memory-cache'
import { getMinutesInDays } from '@components//utils/setSessionId'

// Other Imports

const CURRENT_VER_KEY = 'CURRENT_VER'

interface IProps {
  readonly buildVersion: string
}

const CustomCacheBuster = ({ buildVersion }: IProps) => {
  const [cacheControl, setCacheControl] = useState(false)

  const getBuildNumber = (version: string) => {
    const arrNo = version.split('.')
    if (arrNo?.length) {
      return arrNo
        ?.map((x: string) => parseInt(x))
        ?.reduce((partialSum, a) => partialSum + a, 0)
    }
    return 0
  }

  const emptyCache = () => {
    if ('caches' in window) {
      caches.keys().then((names) => {
        // Delete all the cache files
        names.forEach((name) => {
          caches.delete(name)
        })
      })
    }
  }

  useEffect(() => {
    const self = window
    const cachedVersion = cache.get(CURRENT_VER_KEY)
    if (cachedVersion) {
      //console.log("buildVersion", buildVersion);
      //console.log("cachedVersion", cachedVersion);
      if (getBuildNumber(cachedVersion) < getBuildNumber(buildVersion)) {
        setCacheControl(true)
        //console.log("build ver mismatch", `${getBuildNumber(cachedVersion).toString()} < ${getBuildNumber(buildVersion).toString()}`);
        cache.put(
          CURRENT_VER_KEY,
          buildVersion,
          getMinutesInDays(100 * 365) * 60 * 1000
        )
        emptyCache()
        setTimeout(() => {
          // Refresh cache and reload.
          self.location.reload()
        }, 100)
      }
    } else {
      cache.put(
        CURRENT_VER_KEY,
        buildVersion,
        getMinutesInDays(100 * 365) * 60 * 1000
      )
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      {cacheControl && (
        <NextHead>
          <meta httpEquiv="Cache-control" content="no-cache" />
          <meta httpEquiv="Expires" content="-1" />
        </NextHead>
      )}
      <span
        className="data-ver"
        style={{ position: 'relative', display: 'none' }}
      >
        {buildVersion}
      </span>
    </>
  )
}

export default CustomCacheBuster
