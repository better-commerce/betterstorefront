import { Fetcher } from '@commerce/utils/types'
import { getToken, getError, setToken, clearTokens } from './utils'
import { BASE_URL, AUTH_URL, CLIENT_ID, SHARED_SECRET } from './utils/constants'
import axios from 'axios'
import store from 'store'

const SingletonFactory = (function () {
  let accessToken = ''
  const axiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
  })
  const getToken = () => accessToken

  const setToken = (token: string) => (accessToken = token)

  const clearToken = () => (accessToken = '')

  axiosInstance.interceptors.request.use(
    (config: any) => {
      const token = getToken()
      //this is to be changed when we implement currency / language switcher
      if (token) {
        config.headers['Authorization'] = 'Bearer ' + token
      }
      return config
    },
    (err) => Promise.reject(err)
  )
  function createAxiosResponseInterceptor() {
    const interceptor = axiosInstance.interceptors.response.use(
      (response: any) => response,
      (error: any) => {
        // Reject promise if usual error
        if (error.response.status !== 401) {
          return Promise.reject(error)
        }
        /*
         * When response code is 401, try to refresh the token.
         * Eject the interceptor so it doesn't loop in case
         * token refresh causes the 401 response
         */
        axiosInstance.interceptors.response.eject(interceptor)

        // return getAuthToken().finally(createAxiosResponseInterceptor)
        const url = new URL('oAuth/token', AUTH_URL)

        return axiosInstance({
          url: url.href,
          method: 'post',
          data: `client_id=${CLIENT_ID}&client_secret=${SHARED_SECRET}&grant_type=client_credentials`,
        })
          .then((res: any) => {
            setToken(res.data.access_token)
            error.response.config.headers['Authorization'] =
              'Bearer ' + getToken()
            return axiosInstance(error.response.config)
          })
          .catch((error) => {
            clearToken()
            //@TODO redirect here to Login page
            return Promise.reject(error)
          })
          .finally(createAxiosResponseInterceptor)
      }
    )
  }

  createAxiosResponseInterceptor()
  return { axiosInstance }
})()

const axiosInstance = SingletonFactory.axiosInstance

Object.freeze(axiosInstance)

export const setGeneralParams = (param: any, value: any) => {
  store.set(param, value)
}

const fetcher = async ({
  url = '',
  method = 'post',
  data = {},
  params = {},
  headers = {},
}: any) => {
  const computedUrl = new URL(url, BASE_URL)
  const newConfig = {
    Currency: store.get('Currency') || 'GBP',
    Language: store.get('Language') || 'en',
  }
  const config: any = {
    method: method,
    url: computedUrl.href,
    headers: { ...headers, ...newConfig },
  }

  if (Object.keys(params).length) {
    config.params = params
  }

  if (Object.keys(data).length) {
    config.data = data
  }
  console.log(url)
  try {
    const response = await axiosInstance(config)
    return response.data
  } catch (error: any) {
    throw getError(error, error.status)
  }
}
export default fetcher
