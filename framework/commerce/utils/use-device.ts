// Package Imports
import { isDesktop, isMobile } from 'react-device-detect'

declare const window: any

interface DeviceDetection {
  isMobile: boolean
  isDesktop: boolean
  isIPadorTablet: boolean
  deviceType: DeviceType
}

export enum DeviceType {
  UNKNOWN = 0,
  DESKTOP = 1,
  MOBILE = 2,
  TABLET = 3,
  ANDROID = 5,
  WINDOWS_PHONE = 4,
  IOS = 6,
}

const useDevice = (): DeviceDetection => {
  const UA = navigator.userAgent
  const isIPadorTablet = /\b(Android|Windows Phone|iPad|iPod)\b/i.test(UA)

  /**
   * Determine the mobile operating system.
   * This function returns one of 'IOS', 'ANDROID', 'WINDOWS_PHONE', or 'UNKNOWN'.
   *
   * @returns {String}
   */
  const getDeviceType = () => {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera
    const mobileRegex =
      /Android|webOS|BlackBerry|IEMobile|Opera Mini|iPhone|iPod|Windows Phone/i
    const tabletRegex = /iPad|Android(?!.*(mobile|mobi)).*?(Tablet|Tab)/i

    if (mobileRegex.test(userAgent)) {
      return DeviceType.MOBILE
    } else if (tabletRegex.test(userAgent)) {
      return DeviceType.TABLET
    } else {
      return DeviceType.DESKTOP
    }
  }

  return {
    isMobile,
    isDesktop: isMobile || isIPadorTablet ? false : isDesktop,
    isIPadorTablet,
    deviceType: getDeviceType(),
  }
}

export default useDevice
