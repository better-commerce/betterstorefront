import fetcher from '../../fetcher'
export default function getNavTree() {
  async function getNavTreeAsync() {
    try {
      const response: any = await fetcher({
        url: '/api/v1/content/nav',
        method: 'GET',
      })
      return response.result
    } catch (error: any) {
      console.log(error)
      // throw new Error(error.message)
    }
  }
  return getNavTreeAsync()
}
