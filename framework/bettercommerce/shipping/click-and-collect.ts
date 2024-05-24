import { OMS_CLICK_AND_COLLECT } from '@components/utils/constants'
import { OMS_BASE_URL } from '@framework/utils/constants'
import fetcher from '../fetcher'
import { logError } from '@framework/utils/app-util'

interface Props {
  items: []
  postCode: string
  cookies?: any
}

export default function getClickAndCollectPlans() {
  return async function handler({ items, postCode, cookies }: Props) {
    const url = new URL(OMS_CLICK_AND_COLLECT, OMS_BASE_URL)

    try {
      const response: any = await fetcher({
        url: url,
        method: 'post',
        data: {
          orgId: process.env.NEXT_PUBLIC_ORG_ID,
          postCode,
          items,
        },
        cookies,
        headers: {
          DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID,
        },
      })
      return response?.Result?.length ? response?.Result : []
    } catch (error: any) {
      logError(error)
      // throw new Error(error.message)
    }
  }
}
