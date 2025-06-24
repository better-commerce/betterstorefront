import { OMS_BASE_URL } from '@framework/utils/constants'
import { STORE_STOCK_CHECK } from '@components/utils/constants'
import fetcher from '@framework/fetcher'
import { logError } from '@framework/utils/app-util'

export default async function getStockCheck(stockCode: string, cookies?: any) {
  try {
    const response: any = await fetcher({
      url: `${STORE_STOCK_CHECK}`,
      method: 'post',
      data: { stockCode: stockCode }, // ✅ FIXED
      baseUrl: OMS_BASE_URL,
      cookies,
    })
    return response
  } catch (error) {
    logError(error)
    return null
  }
}
