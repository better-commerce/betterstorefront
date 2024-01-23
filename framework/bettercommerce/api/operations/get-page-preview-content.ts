import fetcher from '../../fetcher'
import { PAGE_PREVIEW_CONTENT_ENDPOINT } from '@components/utils/constants'
import { BETTERCMS_BASE_URL } from '@framework/utils/constants'

export default function getPagePreviewContentOperation() {
  async function getPagePreviewContent({
    id,
    slug = '/',
    workingVersion = false,
    channel,
    cachedCopy = true,
    language = 'en-GB',
  }: any) {
    try {
      const response: any = await fetcher({
        url: `${PAGE_PREVIEW_CONTENT_ENDPOINT}`,
        method: 'get',
        params: {
          id: id,
          slug: slug,
          workingVersion: workingVersion,
          cachedCopy: cachedCopy,
        },
        headers: {
          DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID,
          Channel: channel,
          language: language,
        },
        baseUrl: BETTERCMS_BASE_URL,
      })
      return response.result
    } catch (error) {
      console.log(error)
    }
  }
  return getPagePreviewContent
}
