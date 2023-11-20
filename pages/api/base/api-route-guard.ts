// Package Imports
import qs from 'querystring'
import jwt from 'jsonwebtoken'

// Other Imports
import { Cookie } from '@framework/utils/constants'
import { decrypt } from '@framework/utils/cipher'
import { EmptyString, SITE_HOST } from '@components/utils/constants'

export default function apiRouteGuard(handler: any) {
  return async (req: any, res: any) => {
    let siteHostValid = undefined
    let siteOriginValid = undefined
    let token = EmptyString
    const cookies = qs.decode(req?.headers?.cookie, '; ')
    if (cookies[Cookie.Key.API_TOKEN]) {
      token = cookies[Cookie.Key.API_TOKEN] as string
    }

    const siteHost = req?.headers?.host
    const siteOrigin = req?.headers?.origin
    const siteHosts =
      process.env.NODE_ENV === 'development'
        ? ['localhost']
        : SITE_HOST?.split(',')
    if (siteHosts?.length) {
      siteHostValid = siteHosts?.find((x: string) => siteHost?.includes(x))
      siteOriginValid = siteHosts?.find((x: string) => siteOrigin?.includes(x))
    }

    if (token || (siteHostValid && siteOriginValid)) {
      try {
        if (token) {
          const decryptedToken = decrypt(token)
          const jwtResult: any = jwt.decode(decryptedToken)
          if (jwtResult?.exp) {
            const expiryTime = jwtResult?.exp * 1000
            const nowTime = new Date().getTime()

            if (nowTime >= expiryTime) {
              // Token is expired
              return res.status(401).json({ error: 'Unauthorized' })
            }
          }
        }

        // Call the original API route handler
        return await handler(req, res)
      } catch (error) {
        return res.status(401).json({ error: 'Unauthorized' })
      }
    }
    return res.status(401).json({ error: 'Unauthorized' })
  }
}
