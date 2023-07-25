import fetcher from '@framework/fetcher'
import { CUSTOMER_BASE_API } from '@components/utils/constants'
import apiRouteGuard from '../base/api-route-guard'

const getCustomerDetailsApiMiddleware = async (req: any, res: any) => {
  try {
    const response: any = await fetcher({
      url: CUSTOMER_BASE_API + `${req.query.customerId}`,
      method: 'get',
    })
    res.status(200).json(response.result)
  } catch (error) {
    console.log(error, 'error')
    res.status(500).json({ error })
  }
}

export default apiRouteGuard(getCustomerDetailsApiMiddleware)
