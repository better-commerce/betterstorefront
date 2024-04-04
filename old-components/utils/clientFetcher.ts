import axios from 'axios'
import Cookies from 'js-cookie'
import { Cookie } from '@framework/utils/constants'
import { EmptyString } from './constants'

export const getData = (url: string) => axios.get(url).then((res) => res.data)

export const postData = (url: string, body: any) =>
  axios
    .post(url, body, {
      headers: Cookies.get(Cookie.Key.COMPANY_ID)
        ? {
            CompanyId: Cookies.get(Cookie.Key.COMPANY_ID),
          }
        : {},
    })
    .then((res) => res.data)
