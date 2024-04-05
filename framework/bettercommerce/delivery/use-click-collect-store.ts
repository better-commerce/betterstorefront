import { BASKET_ENDPOINT } from '@components/utils/constants'
import fetcher from '../fetcher'
import { logError } from '@framework/utils/app-util'
interface Props {
    basketId: string
    deliveryMethodId?: number
    store?: any
    cookies?: any
}

export default function useClickCollectStore() {
    return async function handler({ basketId, deliveryMethodId, store, cookies, }: Props) {
        const data = { slots: null, id: store?.Id, name: store?.Name, externalRefId: store?.StoreId, code: null, stockCode: null, company: null, address1: store?.Address1, address2: store?.address2, city: store?.City, county: null, postCode: store?.PostCode, country: null, countryCode: null, distance: null, availableStock: 0, leadTime: 0, leadTimeUom: 0, latitude: null, longitude: null, phoneNo: null, mobileNo: null, leadTimeMin: store?.LeadTime, leadTimeMax: store?.LeadTimeUom, distanceFromPostCode: store?.DistanceInMetres, leadTimeUnit: "Days", deliveryOption: "orderIntoStore", shippingPlanId: deliveryMethodId, openingHours: null, timeslotActual: null, selectedSlot: null, image: null, distanceUnit: null, hdnCode: null, YourId: store?.StoreId }
        try {
            const response: any = await fetcher({
                url: `${BASKET_ENDPOINT}/${basketId}/delivery/click-collect-store`,
                method: 'put',
                data,
                cookies,
                headers: {
                    DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID,
                },
            })
            return { ...response.result, ...{ message: response.message } }
        } catch (error: any) {
            logError(error)
            return { hasError: true, error}
        }
    }
}
