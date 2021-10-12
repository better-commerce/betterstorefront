import { Fetcher } from '@commerce/utils/types'
import { getToken, getError } from './utils'
import { BASE_URL } from './utils/constants'
import getAuthToken from './auth/get-auth-token'
import axios from 'axios'

const fetcher = async ({ url = '', method = 'post', body = {} }: any) => {
  let token = getToken()

  if (!token) {
    const tokenGenerator = await getAuthToken()
    token = tokenGenerator.access_token
  }

  const computedUrl = new URL(url, BASE_URL)
  const config = {
    method: method,
    url: computedUrl.href,
    body,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-type': 'application/json',
    },
  }
  try {
    const response = await axios(config)
    return response.data
  } catch (error: any) {
    throw getError(error, error.status)
  }
}
export default fetcher
