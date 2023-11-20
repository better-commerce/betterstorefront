import axios from 'axios'
import { apiMiddlewareErrorHandler } from '@framework/utils'
import apiRouteGuard from './base/api-route-guard'

const getLocationApiMiddleware = async (req: any, res: any) => {
  const url: any = process.env.GEO_ENDPOINT
  try {
    const { data }: any = await axios.get(url, {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    })
    res.status(200).json(data)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default apiRouteGuard(getLocationApiMiddleware)
