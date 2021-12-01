import { SHIPPING_ENDPOINT } from '@components/utils/constants'
import fetcher from '../fetcher'
import { Disclosure } from '@headlessui/react'
import { ChevronUpIcon } from '@heroicons/react/solid'

interface Props {
  userId?: string
  basketId?: string
  shipToCountryIso?: string
  postCode?: string
  type?: string
  method?: string
}

const TYPES_MAP_TO_ACTIONS: any = {
  GET_ALL: ({ basketId, shipToCountryIso, postCode }: any) =>
    `/country/${basketId}/${shipToCountryIso}/${postCode}`,
  CLICK_AND_COLLECT: ({ basketId, postCode }: any) =>
    `/clickandcollect/${basketId}/${postCode}`,
  ACTIVE_SHIPPING_METHODS: () => '/all',
}

export default function getShippingMethods() {
  return async function handler({
    basketId,
    shipToCountryIso,
    postCode,
    method = 'GET_ALL',
  }: Props) {
    const url =
      SHIPPING_ENDPOINT +
      TYPES_MAP_TO_ACTIONS[method]({ basketId, shipToCountryIso, postCode })
    try {
      const response: any = await fetcher({
        url,
        method: 'get',
        headers: {
          DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID,
        },
      })
      console.log(response)
      return response.result
    } catch (error: any) {
      console.log(error)
      // throw new Error(error.message)
    }
  }
}
