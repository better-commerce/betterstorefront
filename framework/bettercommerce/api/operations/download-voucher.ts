import fetcher from '../../fetcher'
import { CUSTOMER_BASE_API, EmptyObject,  } from '@components/utils/constants'

async function getVoucher(data : any, cookies = EmptyObject) {
  try {
    const response: any = await fetcher({
      url: `${CUSTOMER_BASE_API}${data.userId}/voucher-pdf?voucherCode=${data.voucherCode}`,
      data,
      method: 'post',
      cookies
    })
    return { result: response?.result, snippets: response?.snippets ?? [] }
  } catch (error) {
    console.log(error)
    return null
  }
}
export default getVoucher
