// Package Imports
import jwt from 'jsonwebtoken'
import { CookieSerializeOptions, serialize } from 'cookie'

// Other Imports
import { SessionIdCookieKey, SITE_HOST } from '@components/utils/constants'
import { decrypt } from '@framework/utils/cipher'
import { Cookie } from '@framework/utils/constants'

/**
 * apiRouteGuard is a middleware that checks for the following conditions
 * before calling the original API route handler:
 * - Checks if the user's token is expired
 * - Checks if the request's origin and referer match the site's host
 *
 * If any of the conditions are not met, it will return a 401 Unauthorized response
 *
 * @param {Function} handler - The original API route handler
 * @returns {Function} - The middleware function
 */
export default function apiRouteGuard(handler: any) {
  return async (req: any, res: any) => {

    if (isUserTokenExpired(req)) {
      const expirationConfig: CookieSerializeOptions = { path: '/', expires: new Date(0), httpOnly: process.env.NODE_ENV === 'production', sameSite: 'lax', secure: process.env.NODE_ENV === 'production', }
      const expiredCookies = [
        serialize(Cookie.Key.USER_TOKEN, '', expirationConfig),
        serialize(Cookie.Key.SITE_USER_ID, '', expirationConfig),
        serialize(Cookie.Key.SITE_USER_HAS_MEMBERSHIP, '', expirationConfig),
        serialize(SessionIdCookieKey, '', expirationConfig),
        serialize(Cookie.Key.COMPANY_ID, '', expirationConfig),
        serialize(Cookie.Key.BASKET_ID, '', expirationConfig),
        serialize(Cookie.Key.IS_PAYMENT_LINK, '', expirationConfig),
      ];
      res.setHeader('Set-Cookie', expiredCookies);
      //res.setHeader('Clear-Site-Data', '"storage"');
      //res.setHeader('X-Clear-Storage', 'user,wishListItems,cartItems,isPaymentLink')
      res.setHeader('Location', `/my-account/login?reason=session_expired`);
      return res.status(302).end();
    }

    let siteHostValid = undefined
    let siteOriginValid = undefined
    let siteRefererValid = undefined

    const siteHost = req?.headers?.host
    const siteOrigin = req?.headers?.origin
    const siteReferer = req?.headers?.referer
    const siteHosts =
      process.env.NODE_ENV === 'development'
        ? ['localhost']
        : SITE_HOST?.split(',')
    if (siteHosts?.length) {
      siteHostValid = siteHosts?.find((x: string) => siteHost?.includes(x))
      siteOriginValid = siteHosts?.find((x: string) => siteOrigin?.includes(x))
      siteRefererValid = siteHosts?.find((x: string) =>
        siteReferer?.includes(x)
      )
    }

    if (siteRefererValid || (siteHostValid && siteOriginValid)) {
      try {
        // Call the original API route handler
        return await handler(req, res)
      } catch (error) {
        return res.status(401).json({ error: 'Unauthorized' })
      }
    }
    return res.status(401).json({ error: 'Unauthorized' })
  }
}

/**
 * Checks if the user token in the request cookies has expired.
 * @param req Request object
 * @returns True if the user token has expired, false otherwise
 */
function isUserTokenExpired(req: any) {
  let userToken = req?.cookies?.[Cookie.Key.USER_TOKEN]

  if (userToken) {
    let decryptedUserToken = ""
    try {
      decryptedUserToken = decrypt(userToken)
    } catch (error) {
    }

    if (decryptedUserToken) {
      const jwtResult: any = jwt.decode(decryptedUserToken)
      if (jwtResult?.exp) {
        const expiryDate = new Date(jwtResult?.exp * 1000)
        if (expiryDate < new Date()) {
          return true
        }
      }
    }
  }

  return false
}
