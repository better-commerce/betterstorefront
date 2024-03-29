import fetcher from '../../fetcher'
import {
  BETTERCOMMERCE_DEFAULT_COUNTRY,
  CREATE_ADDRESS_ENDPOINT,
} from '@components/utils/constants'
import countryList from '@components/utils/countryList'

export default function useAddress() {
  async function getAdressAsync({ query, cookies }: any) {
    const countryCode = countryList.find(
      (country) => country.value === query.country
    )?.code
    const data = {
      title: query?.title || '',
      firstName: query?.firstName,
      lastName: query?.lastName,
      Address1: query?.address1,
      Address2: query?.address2,
      Address3 : query?.address3,
      City: query?.city,
      PostCode: query?.postCode,
      Country: query?.country || BETTERCOMMERCE_DEFAULT_COUNTRY,
      CountryCode:
        query?.countryCode || countryCode || BETTERCOMMERCE_DEFAULT_COUNTRY,
      CustomerId: query?.userId,
      PhoneNo: query?.phoneNo,
      isDefault: query?.isDefault || false,
      isDefaultBilling: query?.isDefaultBilling || false,
      isDefaultDelivery: query?.isDefaultDelivery || false,
      isDefaultSubscription: query?.isDefaultSubscription || false,
      label: query?.label || '',
      State: query?.state,
      isConsentSelected: query?.isConsentSelected,
    }
    try {
      const response: any = await fetcher({
        url: `${CREATE_ADDRESS_ENDPOINT}`,
        method: 'post',
        data,
        cookies,
      })
      return response.result
    } catch (error: any) {
      throw new Error(error)
    }
  }
  return getAdressAsync
}
