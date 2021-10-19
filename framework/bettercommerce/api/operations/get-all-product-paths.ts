import fetcher from '../../fetcher'

export type GetAllProductPathsResult = {
  products: Array<{ path: string }>
}

export default function getAllProductPathsOperation() {
  async function getAllProductPaths(): Promise<GetAllProductPathsResult> {
    try {
      const response: any = await fetcher({
        url: `api/v1/catalog/search/r`,
        method: 'post',
        // url: `api/v1/catalog/product?page=${parsedQuery.page}&sortBy=${parsedQuery.sortBy}&sortOrder=${parsedQuery.sortOrder}`,
      })
      return {
        products:
          response.result.products.map(({ slug }: any) => ({ slug })) || [],
      }
    } catch (error: any) {
      throw new Error(error)
    }
  }

  return getAllProductPaths
  // function getAllProductPaths(): Promise<GetAllProductPathsResult> {
  //   return Promise.resolve({
  //     products: data.products.map(({ path }) => ({ path })),
  //   })
  // }

  // return getAllProductPaths
}
