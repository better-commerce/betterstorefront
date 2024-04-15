import { ENGAGE_WEB_CAMPAIGN } from '@components/utils/constants'
import fetcher from '@framework/fetcher'
import { tryParseJson } from '@framework/utils/parse-util'

export default async function useGetEngageCampaigns(req: any, currentUrl = '/') {
  try {
    const chCookie: any = tryParseJson(req?.cookies?.ch_cookie)
    let apiUrl = ENGAGE_WEB_CAMPAIGN
    // generate respective API url
    if (currentUrl.startsWith('/products')) {
      // for PDP
      apiUrl += `/productpage/all/`
    } else if (currentUrl === '/') {
      // for homepage
      apiUrl += `/indexpage/all/`
    } else {
      return
    }
    const response = await fetcher({
      url: apiUrl,
      method: 'get',
      // headers: {
      //   Origin: req.headers?.host,
      // },
      params: {
        ch_guid: chCookie?.user_id,
        ch_data: JSON.stringify({ data: {} }),
      },
    })
    return response
  } catch (error: any) {
    console.log(error)
  }
}
