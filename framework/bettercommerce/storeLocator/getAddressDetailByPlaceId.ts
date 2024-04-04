import { NEXT_GET_PLACE_DETAILS } from '@components/utils/constants'
import fetcher from '@framework/fetcher'
import { GOOGLE_MAP_API_KEY } from '@framework/utils/constants'

export default async function getAddressDetailByPlaceId(id: string) {
  try {
    const response = await fetcher({
      url: `${NEXT_GET_PLACE_DETAILS}?&place_id=${id}&key=${GOOGLE_MAP_API_KEY}`,
      method: 'get',
    })
    return response
  } catch (error) {
    console.error(error)
  }
}
