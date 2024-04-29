import { STORE_LOCATOR_API } from '@components/utils/constants';
import fetcher from '@framework/fetcher'
import { logError } from '@framework/utils/app-util'
import { OMS_BASE_URL } from '@framework/utils/constants';

export default async function getProductAvailibiltyInStoresByPostCode(data:any, cookies?: any) {
  try {
    const { postCode, stockCode } = data;
    const response: any = await fetcher({
      url: `${STORE_LOCATOR_API}/${postCode}/stock/${stockCode}`,
      method: 'get',
      baseUrl: OMS_BASE_URL,
      cookies,
    })
    return response.Result
  } catch (error) {
    logError(error)
  }
}
