import { CHECKOUT_ENDPOINT } from '@components/utils/constants'
import fetcher from '../fetcher'

interface Props {
  userId?: string
  basketId?: string
  countryCode?: string
  postCode?: string
  type?: string
  method?: string
}

const TYPES_MAP_TO_ACTIONS: any = {
  GET_ALL: ({ basketId, countryCode, postCode }: any) =>
    `/${basketId}/shipping-methods?countryCode=${countryCode}&postcode`,
  CLICK_AND_COLLECT: ({ basketId, postCode }: any) =>
    `/clickandcollect/${basketId}/${postCode}`,
  ACTIVE_SHIPPING_METHODS: () => '/all',
}

export default function getShippingMethods() {
  return async function handler({
    basketId,
    countryCode,
    postCode,
    method = 'GET_ALL',
  }: Props) {
    const url =
      CHECKOUT_ENDPOINT +
      TYPES_MAP_TO_ACTIONS[method]({ basketId, countryCode, postCode })
    try {
      const response: any = await fetcher({
        url,
        method: 'get',
        headers: {
          DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID,
        },
      })
      return response.result
    } catch (error: any) {
      console.log(error)
      // throw new Error(error.message)
    }
  }
}
