import {useB2BUserQuotes} from '@framework/b2b'
import { apiMiddlewareErrorHandler } from '@framework/utils'

const GetUserQuotesApiMiddleware = async (req: any, res: any) => {
    const { userId }: any = req?.body
  try {
    const response = await useB2BUserQuotes()(userId)
    
    res.status(200).json(response?.result)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
};

export default GetUserQuotesApiMiddleware;