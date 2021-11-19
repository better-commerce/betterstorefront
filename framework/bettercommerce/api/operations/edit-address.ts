import fetcher from '../../fetcher'
import { ADDRESS_ENDPOINT } from '@components/utils/constants'
import countryList from '@components/utils/countryList'

export default function useAddress() {
  async function getAdressAsync({ query }: any) {
    const countryCode = countryList.find(
      (country) => country.value === query.country
    )?.code
    const data = {
      firstName: query.firstName,
      lastName: query.lastName,
      Address1: query.address1,
      Address2: query.address2,
      City: query.city,
      PostCode: query.postCode,
      Country: query.country,
      CountryCode: countryCode,
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
