import axios from 'axios'
import { EmptyString, OMNILYTICS_IP_INFO } from '@components/utils/constants'

export default async function geoData(ipAddress = EmptyString) {
  try {
    const { data }: any = await axios.get(process.env.NEXT_PUBLIC_GEO_ENDPOINT!, {
      params: {
        ipAddress,
      },
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    })
    return data
  } catch (error) {
    console.log(error, 'err')
  }
}
