import commerce from '@lib/api/commerce'
import { apiMiddlewareErrorHandler } from '@framework/utils'
import apiRouteGuard from '../base/api-route-guard'
import { CURRENT_THEME } from '@components/utils/constants'
import axios, { AxiosRequestConfig } from 'axios'
const featureToggle = require(`../../../public/theme/${CURRENT_THEME}/features.config.json`)

const subscribeApiMiddleware = async (req: any, res: any) => {

  try {
    if (featureToggle?.features?.enableMappAnalytics) {
      const url = `api/rest/contacts/manageSubscription`
      const { email: userEmail, notifyByEmail = false, notifyByPost = false, notifyBySMS = false } = req?.body
      if (!notifyByEmail && !notifyByPost && !notifyBySMS) {
        const config: AxiosRequestConfig = { url, method: 'POST', params: { userEmail, action: "unsubscribe" }, data: { groupList: ["Email_Newsletter_Master", "Post_DirectMail_Master", "SMS_Alerts_Master"], gdprConsent: false, consentTimestamp: new Date().toISOString() }, baseURL: process.env.MAPP_NEWSLETTER_API_BASE_URL }
        const mappUnsubscribeNewsletterResponse: any = await axios(config)
        console.log('mappUnsubscribeNewsletterResponse: ', mappUnsubscribeNewsletterResponse)
      } else {
        let groupList = new Array<string>()
        if (notifyByEmail) groupList = [...groupList, "Email_Newsletter_Master"]
        if (notifyByPost) groupList = [...groupList, "Post_DirectMail_Master"]
        if (notifyBySMS) groupList = [...groupList, "SMS_Alerts_Master"]
        const gdprConsent = true
        const config: AxiosRequestConfig = { url, method: 'POST', params: { userEmail, action: "subscribe" }, data: { groupList, gdprConsent, consentTimestamp: new Date().toISOString() }, baseURL: process.env.MAPP_NEWSLETTER_API_BASE_URL }
        const mappSubscribeNewsletterResponse: any = await axios(config)
        console.log('mappSubscribeNewsletterResponse: ', mappSubscribeNewsletterResponse)
      }
    }
  } catch(error: any) {
    //console.log(error, 'error')
  }

  try {

    const response = await commerce.subscribe({
      query: req.body,
      cookies: req.cookies,
    })

    res.status(200).json(response)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default apiRouteGuard(subscribeApiMiddleware)
