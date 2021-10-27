import Cookies from 'js-cookie'
import { SessionIdCookieKey } from '@components/utils/constants'

const DataLayerSingleton = function () {
  const windowObject: any = window
  const navigator: any = windowObject.navigator

  const setDataLayer = () => {
    const dataLayer = {
      SessionId: Cookies.get(SessionIdCookieKey),
      BrowserInfo: navigator.userAgent,
      DeviceType: navigator.userAgentData.mobile ? true : false,
    }
    windowObject.dataLayer = [dataLayer]
  }

  const getItemFromDataLayer = (item: any) => windowObject.dataLayer[0][item]

  const setItemInDataLayer = (item: any, value: any) =>
    (windowObject.dataLayer[0][item] = value)

  return { setItemInDataLayer, getItemFromDataLayer, setDataLayer }
}

let DataLayerInstance: any = null

if (typeof window !== 'undefined') {
  DataLayerInstance = DataLayerSingleton()
  Object.freeze(DataLayerInstance)
}

export default DataLayerInstance
