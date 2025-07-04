import { updateShipping } from '@framework/checkout'
import { apiMiddlewareErrorHandler } from '@framework/utils'
import apiRouteGuard from './base/api-route-guard'
import { EmptyString } from '@components/utils/constants'
import useInfra from '@framework/api/endpoints/infra'
import { matchStrings } from '@framework/utils/parse-util'

const updateShippingApiMiddleware = async (req: any, res: any) => {
  const { basketId, countryCode, shippingId, shippingAddress, isOmniOmsEnabled }: any = req.body
  try {
    let primaryInventoryPoolCode = EmptyString
    const { result: appConfig }: any = await useInfra(req)()
    if (appConfig && appConfig?.configSettings?.length) {
      const configSettings = appConfig?.configSettings
      const domainSettings = configSettings?.find((x: any) => matchStrings(x?.configType, 'DomainSettings', true))?.configKeys || []
      const enableOmniOms = domainSettings?.find((x: any) => matchStrings(x?.key, 'DomainSettings.EnableOmniOms', true))?.value || 'False'

      const catalogSettings = configSettings?.find((x: any) => matchStrings(x?.configType, 'CatalogSettings', true))?.configKeys || []
      primaryInventoryPoolCode = catalogSettings?.find((x: any) => matchStrings(x?.key, 'CatalogSettings.PrimaryInventoryPoolCode', true))?.value || EmptyString
    }
    const response = await updateShipping()({ basketId, countryCode, shippingId, shippingAddress, isOmniOmsEnabled, primaryInventoryPoolCode, cookies: req?.cookies, })
    res.status(200).json(response)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default apiRouteGuard(updateShippingApiMiddleware)
