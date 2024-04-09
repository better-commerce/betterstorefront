import { updateAddress } from '@framework/checkout2'
import { apiMiddlewareErrorHandler } from '@framework/utils'
import apiRouteGuard from '../base/api-route-guard'
import useInfra from '@framework/api/endpoints/infra'
import { matchStrings, stringToBoolean } from '@framework/utils/parse-util'
import { EmptyString } from '@components/utils/constants'

const updateAddressApiMiddleware = async (req: any, res: any) => {
  const { basket, postCode, basketId, model, cdp, isCNC = false }: any = req.body
  try {
    let isOmniOmsEnabled = false
    let primaryInventoryPoolCode = EmptyString
    const { result: appConfig }: any = await useInfra(req)()
    if (appConfig && appConfig?.configSettings?.length) {
      const configSettings = appConfig?.configSettings
      const domainSettings = configSettings?.find((x: any) => matchStrings(x?.configType, 'DomainSettings', true))?.configKeys || []
      const enableOmniOms = domainSettings?.find((x: any) => matchStrings(x?.key, 'DomainSettings.EnableOmniOms', true))?.value || 'False'
      isOmniOmsEnabled = stringToBoolean(enableOmniOms)

      const catalogSettings = configSettings?.find((x: any) => matchStrings(x?.configType, 'CatalogSettings', true))?.configKeys || []
      primaryInventoryPoolCode = catalogSettings?.find((x: any) => matchStrings(x?.key, 'CatalogSettings.PrimaryInventoryPoolCode', true))?.value || EmptyString
    }
    const response = await updateAddress()({
      basketId,
      model,
      cdp,
      basket,
      postCode,
      isOmniOmsEnabled,
      primaryInventoryPoolCode,
      isCNC,
      cookies: req?.cookies,
    })
    res.status(200).json(response)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default apiRouteGuard(updateAddressApiMiddleware)
