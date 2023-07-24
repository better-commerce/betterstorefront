import {useB2BCompanyUsers} from '@framework/b2b'
import { apiMiddlewareErrorHandler } from '@framework/utils'

const GetCompanyUsersApiMiddleware = async (req: any, res: any) => {
    const { companyId }: any = req?.body
  try {
    const response = await useB2BCompanyUsers()(companyId)
    
    res.status(200).json(response?.result)
  } catch (error) {
    apiMiddlewareErrorHandler(req, res, error)
  }
};

export default GetCompanyUsersApiMiddleware;