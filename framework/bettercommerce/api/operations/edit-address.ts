import fetcher from '../../fetcher'
import { ADDRESS_ENDPOINT } from '@components/utils/constants'
export default function useAddress() {
  async function getAdressAsync({ query }: any) {
    console.group('here', query)
    const data = {
      firstName: query.firstName,
      lastName: query.lastName,
      Address1: query.address1,
      Address2: query.address2,
      City: query.city,
      PostCode: query.postCode,
      Country: query.country,
      CountryCode: query.countryCode,
      CustomerId: query.userId,
      PhoneNo: query.phoneNo,
    }
    try {
      const response: any = await fetcher({
        url: `${ADDRESS_ENDPOINT}${query.id}/update`,
        method: 'post',
        data: data,
      })
      return response.result
    } catch (error: any) {
      throw new Error(error)
    }
  }
  return getAdressAsync
}
