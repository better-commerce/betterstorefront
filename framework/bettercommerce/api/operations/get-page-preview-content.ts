import fetcher from '../../fetcher'
import { PAGE_PREVIEW_CONTENT_ENDPOINT } from '@components/utils/constants'
import { BETTERCMS_BASE_URL } from '@framework/utils/constants'

/**
 * Creates an operation to fetch BetterCMS page content based on provided options.
 * 
 * This operation returns a function that fetches the page content by ID or slug
 * from the BetterCMS API. It supports fetching the working version, specifying 
 * the channel, currency, language, and whether to use a cached copy. The request
 * can also include cookies for authentication or personalization.
 * 
 * @returns {Function} A function that fetches BetterCMS page content when invoked.
 */
export default function getPagePreviewContentOperation() {
  
  /**
   * Fetches the BetterCMS page content for the given ID.
   * @param {Object} options
   * @prop {string} [options.id] ID of the page content to retrieve.
   * @prop {string} [options.slug=/] Slug of the page content to retrieve.
   * @prop {boolean} [options.workingVersion=false] Whether to retrieve the working version of the content.
   * @prop {string} [options.channel] Channel of the page content to retrieve.
   * @prop {boolean} [options.cachedCopy=true] Whether to retrieve a cached copy of the content.
   * @prop {string} [options.currency] Currency of the page content to retrieve.
   * @prop {string} [options.language=en-GB] Language of the page content to retrieve.
   * @prop {Object} [options.cookies] Cookies to include in the request.
   * @returns {Promise<any>}
   */
  async function getPagePreviewContent({ id, slug = '/', workingVersion = false, channel, cachedCopy = true, currency, language = 'en-GB', cookies = {}, }: any) {
    try {
      const response: any = await fetcher({
        url: `${PAGE_PREVIEW_CONTENT_ENDPOINT}`,
        method: 'get',
        params: { id: id, slug: slug, workingVersion: workingVersion, cachedCopy: cachedCopy, },
        headers: { DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID, Channel: channel, Language: language, Currency: currency, },
        baseUrl: BETTERCMS_BASE_URL,
        cookies,
      })
      return response.result
    } catch (error) {
      console.log(error)
    }
  }
  return getPagePreviewContent
}
