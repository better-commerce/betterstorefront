import { RETURNS_ENDPOINT } from '@components/utils/constants'
import fetcher from '../fetcher'

export default async function createReturn(model: any) {
  try {
    const res = await fetcher({
      url: RETURNS_ENDPOINT + '/create',
      method: 'post',
      data: JSON.stringify({ ...model }),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
    return res
  } catch (error: any) {
    console.log(error)
    throw new Error(error)
  }
}
