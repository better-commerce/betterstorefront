import fetcher from '../../fetcher'

export default function getSlugsOperation() {
  async function getSlugs({ slug }: any) {
    try {
      const response: any = await fetcher({
        url: `api/v1/content/siteview/slug?slug=${slug}`,
        method: 'post',
      })
      return response.result
    } catch (error) {
      console.log(error)
    }
  }
  return getSlugs
}
