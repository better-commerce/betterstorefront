import fetcher from '../../fetcher'

export default function getAllSlugsOperation() {
  async function getAllSlugs() {
    try {
      const response: any = await fetcher({
        url: 'api/v1/content/siteview/slug?slug=/',
        method: 'post',
      })
      return response.result
    } catch (error) {
      console.log(error)
    }
  }
  return getAllSlugs
}
