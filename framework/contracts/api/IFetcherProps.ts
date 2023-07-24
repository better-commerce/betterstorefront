export interface IFetcherProps {
  readonly url: string
  readonly method: string
  readonly data?: any
  readonly params?: any
  readonly headers?: any
  readonly cookies?: any
  readonly baseUrl?: string
  readonly logRequest?: boolean
}
