import fetcher from '../../fetcher'
import { CUSTOMER_BASE_API,  } from '@components/utils/constants'

async function getVoucher(data : any) {
  try {
    const response: any = await fetcher({
      url: `${CUSTOMER_BASE_API}${data.userId}/voucher-pdf?voucherCode=${data.voucherCode}`,
      data,
      method: 'post',
    })
    return { result: response?.result, snippets: response?.snippets ?? [] }
  } catch (error) {
    console.log(error)
    return null
  }
}
export default getVoucher
