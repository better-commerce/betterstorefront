import fetcher from '../../fetcher'
import { CREATE_ADDRESS_ENDPOINT } from '@components/utils/constants'
export default function useAddress() {
  async function getAdressAsync({ query }: any) {
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
        url: `${CREATE_ADDRESS_ENDPOINT}`,
        method: 'post',
        data,
      })
      return response.result
    } catch (error: any) {
      throw new Error(error)
    }
  }
  return getAdressAsync
}
