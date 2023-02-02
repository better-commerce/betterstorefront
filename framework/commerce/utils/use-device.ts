// Package Imports
import { isDesktop, isMobile } from "react-device-detect";

declare const window: any;

interface DeviceDetection {
    isMobile: boolean;
    isDesktop: boolean;
    isIPadorTablet: boolean;
    deviceType: DeviceType;
}

export enum DeviceType {
    UNKNOWN = 0,
    IOS = 1,
    ANDROID = 2,
    WINDOWS_PHONE = 3,
}

const useDevice = (): DeviceDetection => {
    const UA = navigator.userAgent;
    const isIPadorTablet = /\b(Android|Windows Phone|iPad|iPod)\b/i.test(UA);

    /**
     * Determine the mobile operating system.
     * This function returns one of 'IOS', 'ANDROID', 'WINDOWS_PHONE', or 'UNKNOWN'.
     *
     * @returns {String}
     */
    const getDeviceType = () => {
        var userAgent = navigator.userAgent || navigator.vendor || window.opera;

        // Windows Phone must come first because its UA also contains "Android"
        if (/windows phone/i.test(userAgent)) {
            return DeviceType.WINDOWS_PHONE;
        }

        if (/android/i.test(userAgent)) {
            return DeviceType.ANDROID;
        }

        // iOS detection from: http://stackoverflow.com/a/9039885/177710
        if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
            return DeviceType.IOS;
        }

        return DeviceType.UNKNOWN;
    }

    return {
        isMobile,
        isDesktop: (isMobile || isIPadorTablet) ? false : isDesktop,
        isIPadorTablet,
        deviceType: getDeviceType(),
    }
};

export default useDevice;