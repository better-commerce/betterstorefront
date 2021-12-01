import axios from 'axios'
import { GEO_ENDPOINT } from '@components/utils/constants'

export default async function geoData() {
  try {
    const { data }: any = await axios.get(GEO_ENDPOINT, {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    })
    console.log(data)
    return data
  } catch (error) {
    console.log(error, 'err')
  }
}
