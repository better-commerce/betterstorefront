import { POST_STORE_BY_POSTALCODE } from '@components/utils/constants'
import fetcher from '@framework/fetcher'
import { logError } from '@framework/utils/app-util'

export default async function getStoreByPostCode(postCode: string) {
  try {
    const response: any = await fetcher({
      url: `${POST_STORE_BY_POSTALCODE}/${postCode}`,
      method: 'post',
    })
    return response.result
  } catch (error: any) {
    logError(error)
  }
}
