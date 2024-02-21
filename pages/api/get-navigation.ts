import { apiMiddlewareErrorHandler } from '@framework/utils'
import apiRouteGuard from './base/api-route-guard'
import useNavTree from '@framework/api/endpoints/nav-tree'
import { Redis } from '@framework/utils/redis-constants'
import { getDataByUID, parseDataValue, setData } from '@framework/utils/redis-util'

const getNavTreeApiMiddleware = async (req: any, res: any) => {
  try {
    const navTreeUID = Redis.Key.NavTree
    const cachedData = await getDataByUID([ navTreeUID ])
    let navTreeUIDData: any = parseDataValue(cachedData, navTreeUID)
    if (!navTreeUIDData) {
      const { result: response } = await useNavTree(req?.cookies)
      const { header = [], footer = [] } = response
      if (header?.length || footer?.length) {
        navTreeUIDData = response
        await setData([{ key: navTreeUID, value: navTreeUIDData }])
      }
    }
    res.status(200).json({ nav:  navTreeUIDData?.header || [], footer:  navTreeUIDData?.footer || [] })
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default apiRouteGuard(getNavTreeApiMiddleware)
