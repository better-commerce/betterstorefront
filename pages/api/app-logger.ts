import { apiMiddlewareErrorHandler, appLogger } from '@framework/utils'
import { ERROR_LOG_ENABLED } from '@framework/utils/constants'

const appLoggerApi = async (req: any, res: any) => {
  const { data }: any = req.body
  try {
    if (ERROR_LOG_ENABLED) appLogger().info(data)
    res.status(200).send('ok')
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default appLoggerApi
