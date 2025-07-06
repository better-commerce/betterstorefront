import { SITEVIEW_ENDPOINT } from '@components/utils/constants'
import { logError } from '@framework/utils/app-util'
import fetcher from './fetcher'
import { HttpStatusCode } from 'axios'
import { EntitySlugTypes } from 'middleware'

interface Props {
  slug: string
  cookies?: any
}

export default function useSlugResolver() {
  return async function handler({ slug, cookies, }: Props) {
    const params = { slug: slug?.startsWith('/') ? slug.slice(1) : slug }

    try {
      const response: any = await fetcher({ url: `${SITEVIEW_ENDPOINT}/dynamic-slug`, method: 'post', params, cookies, headers: { DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID, }, })

      //console.log("=======================response", response)
      if (response.statusCode === HttpStatusCode.Ok) {
        return response?.slugType
      }
      return EntitySlugTypes.NONE
    } catch (error: any) {
      logError(error)
      throw new Error(error.message)
    }
  }
}
