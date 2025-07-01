import fetcher from '../../fetcher'
import { BLOG_LIST_ENDPOINT } from '@components/utils/constants'
import { BETTERCMS_BASE_URL } from '@framework/utils/constants'

export default function getBlogListOperation() {
  async function getBlogList({
    pagetypeId,
    cols,
    skip,
    pagesize,
    sortby,
    sortorder,
  }: any) {
    try {
      const response: any = await fetcher({
        url: `${BLOG_LIST_ENDPOINT}/${pagetypeId}`,
        method: 'get',
        params: {
          skip: skip,
          pagesize: pagesize,
          sortby: sortby,
          sortorder: sortorder,
          cols: cols,
        },
        headers: {
          DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID,
        },
        baseUrl: BETTERCMS_BASE_URL,
      })
      return response.result
      console.log(response.result)
    } catch (error) {
      console.log(error)
    }
  }
  return getBlogList
}
