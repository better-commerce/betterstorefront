import { BASKET_ENDPOINT } from '@components/utils/constants'
import fetcher from '../fetcher'
interface Props {
  basketId?: string
  info: any
  lineInfo: any
}

export default function useUpdateCartInfo() {
  return async function handler({ basketId, info, lineInfo }: Props) {
    const params = new URLSearchParams()
    info.forEach((item: any, index: number) => {
      params.append(`customInfo${index + 1}`, item)
    })
    params.append('lineInfo', JSON.stringify(lineInfo))
    try {
      const response: any = await fetcher({
        url: `${BASKET_ENDPOINT}/${basketId}/updateInfo`,
        method: 'post',
        data: params,
        headers: {
          DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      return response.result
    } catch (error: any) {
      throw new Error(error.message)
    }
  }
}
