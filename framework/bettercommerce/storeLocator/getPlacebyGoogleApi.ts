import { NEXT_GET_GOOGLE_API } from '@components/utils/constants'
import fetcher from '@framework/fetcher'
import { GOOGLE_MAP_API_KEY } from '@framework/utils/constants'

export default async function googlePlaceAutocomplete(input: string) {
  try {
    const response = await fetcher({
      url: `${NEXT_GET_GOOGLE_API}?input=${input}&components=country:UK&types=geocode&key=${GOOGLE_MAP_API_KEY}`,
      method: 'get',
    })
    return response
  } catch (error) {
    console.error(error)
  }
}
