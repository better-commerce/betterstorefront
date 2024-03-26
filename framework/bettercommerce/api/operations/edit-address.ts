import fetcher from '../../fetcher'
import { ADDRESS_ENDPOINT } from '@new-components/utils/constants'
import countryList from '@new-components/utils/countryList'

export default function useAddress() {
  async function getAdressAsync({ query, cookies }: any) {
    const countryCode = countryList.find(
      (country) => country.value === query.country
    )?.code
    const data = {
      firstName: query?.firstName,
      lastName: query?.lastName || ' ',
      address1: query?.address1,
      address2: query?.address2,
      address3: query?.address3,
      city: query?.city,
      PostCode: query?.postCode,
      Country: query?.country,
      CountryCode: query?.countryCode ?? countryCode,
      CustomerId: query?.userId,
      PhoneNo: query?.phoneNo,
      isDefault: query?.isDefault,
      isDefaultBilling: query?.isDefaultBilling,
      isDefaultDelivery: query?.isDefaultDelivery,
      isDefaultSubscription: query?.isDefaultSubscription,
      id: query?.id,
      label: query?.label,
      state: query?.state,
      title: query?.title,
      userId: query?.userId,
      isConsentSelected: query?.isConsentSelected,
    }
    try {
      const response: any = await fetcher({
        url: `${ADDRESS_ENDPOINT}${query.id}/update`,
        method: 'put',
        data: data,
        cookies,
      })
      return response.result
    } catch (error: any) {
      throw new Error(error)
    }
  }
  return getAdressAsync
}
