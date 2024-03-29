import { FetcherError } from '@commerce/utils/errors'
import type { GraphQLFetcher, GraphQLFetcherResult } from '@commerce/api'
import type { BetterCommerceConfig } from '../index'
import fetch from './fetch'

const fetchGraphqlApi: (
  getConfig: () => BetterCommerceConfig
) => GraphQLFetcher =
  (getConfig) =>
  async (
    query: string,
    queryData?: any,
    fetchOptions?: any
  ): Promise<GraphQLFetcherResult<any>> => {
    const { variables, preview }: any = queryData
    const config = getConfig()
    const options: any = {
      ...fetchOptions,
      method: 'POST',
      headers: {
        ...fetchOptions?.headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    }
    const res: any = await fetch(config.commerceUrl, options)

    const json = await res.json()
    if (json.errors) {
      throw new FetcherError({
        errors: json.errors ?? [{ message: 'Failed to fetch for API' }],
        status: res.status,
      })
    }

    let value: GraphQLFetcherResult = { data: json.data, res }
    return value
  }

export default fetchGraphqlApi
