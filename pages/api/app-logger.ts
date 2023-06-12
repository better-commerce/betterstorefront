import { apiMiddlewareErrorHandler, appLogger } from '@framework/utils'

const appLoggerApi = async (req: any, res: any) => {
  const { data }: any = req.body
  try {
    if (process.env.LOG_ENABLED === 'true') appLogger().info(data)
    res.status(200).send('ok')
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default appLoggerApi
