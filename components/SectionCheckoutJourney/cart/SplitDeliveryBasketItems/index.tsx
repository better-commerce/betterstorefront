import { useEffect, useMemo, useState } from 'react'
import { Disclosure } from '@headlessui/react'
import moment from "moment"
import { useTranslation } from '@commerce/utils/use-translation'
//
import BasketItems from '@components/SectionCheckoutJourney/checkout/BasketItems'
import { DATE_FORMAT } from '@components/utils/constants'

const SplitDeliveryBasketItems = ({ basket }: any) => {
  const translate = useTranslation()
  const [deliveryPlans, setDeliveryPlans] = useState([])

  const groupBasketByDeliveryPlan = useMemo(() => {
    return () => {
      let deliveryPlans: any = []
      basket?.deliveryPlans?.forEach((plan: any) => {
        deliveryPlans.push({
          deliveryDateTarget: new Date(plan?.deliveryDateTarget),
          items: plan?.lineItems,
        })
      })
      deliveryPlans = deliveryPlans?.sort((a: any, b: any) => a.deliveryDateTarget - b.deliveryDateTarget)
      setDeliveryPlans(deliveryPlans)
    }
  }, [basket?.deliveryPlans])

  useEffect(() => {
    groupBasketByDeliveryPlan()
  }, [basket?.deliveryPlans])

  return (
    <div>
      {deliveryPlans?.map((plan: any, idx: number) => (
        <div key={idx} className={`${idx > 0 ? 'mt-4' : ''}`}>
          <Disclosure defaultOpen={idx === 0}>
            {({ open }) => (
              <>
                <Disclosure.Button className="flex items-center justify-between w-full gap-2 text-sm font-light text-left text-black normal-case">
                  <span className="font-semibold text-black w-full flex justify-between">
                    <span>{translate('label.checkout.deliveryText')} {idx + 1} of {deliveryPlans?.length}</span>
                    <span className='ml-2 text-xs font-medium'>{translate('label.checkout.expectedDateText')}: {moment(new Date(plan?.deliveryDateTarget)).format(DATE_FORMAT)}</span>
                  </span>
                  <i
                    className={`${
                      open ? 'rotate-180 transform' : ''
                    } sprite-icons sprite-dropdown`}
                  />
                </Disclosure.Button>
                <Disclosure.Panel className="px-0 pt-3 pb-2">
                  <div className="w-full max-basket-panel">
                    <BasketItems userBasket={basket} />
                  </div>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        </div>
      ))}
    </div>
  )
}

export default SplitDeliveryBasketItems
