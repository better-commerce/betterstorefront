import moment from 'moment'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

//
import { generateUri } from '@commerce/utils/uri-util'
import { useTranslation } from '@commerce/utils/use-translation'
import { DATE_FORMAT } from '@components/utils/constants'
import { IMG_PLACEHOLDER } from '@components/utils/textVariables'

function SplitDeliveryOrderItems({ order }: any) {
  const translate = useTranslation()
  const [deliveryPlans, setDeliveryPlans] = useState([])

  const groupBasketByDeliveryPlan = useMemo(() => {
    return () => {
      let deliveryPlans: any = []
      order?.deliveryPlans?.forEach((plan: any) => {
        deliveryPlans.push({
          deliveryDateTarget: new Date(plan?.deliveryDateTarget),
          items: order?.items?.filter((orderLineItem: any) => {
            return plan?.items?.some((orderItem: any) => orderItem?.orderLineRecordId === orderLineItem?.id)
          }),
        })
      })
      deliveryPlans = deliveryPlans?.sort((a: any, b: any) => a.deliveryDateTarget - b.deliveryDateTarget)
      setDeliveryPlans(deliveryPlans)
    }
  }, [order?.deliveryPlans])

  useEffect(() => {
    groupBasketByDeliveryPlan()
  }, [order?.deliveryPlans])

  const css = { maxWidth: '100%', height: 'auto' }

  return (
    <div>
      {deliveryPlans?.map((plan: any, idx: number) => (
        <div className={`${idx > 0 ? 'mt-4' : ''}`}>
          <span className="font-semibold text-black w-full flex items-center">
            <span>Delivery {idx + 1} of {deliveryPlans?.length}</span>
            <span className='ml-2 text-xs font-medium'>Expected date: {moment(new Date(plan?.deliveryDateTarget)).format(DATE_FORMAT)}</span>
          </span>
          {plan?.items?.map((product: any) => (
            <div key={idx} className="flex py-10 space-x-6 border-b border-gray-200">
              <div className="flex-shrink-0 w-24 h-24 overflow-hidden border border-gray-200 rounded-md">
                <img style={css} src={generateUri(product.image, 'h=200&fm=webp') || IMG_PLACEHOLDER} width={200} height={200} alt={product.name || 'thank you'} className="flex-none object-cover object-center w-20 h-20 bg-gray-100 rounded-lg sm:w-40 sm:h-40" />
              </div>
              <div className="flex flex-col flex-auto">
                <div>
                  <h4 className="font-medium text-gray-900">
                    <Link href={`/${product.slug}`}>{product.name}</Link>
                  </h4>
                  <p className="mr-1 text-sm font-medium text-gray-700">
                    {translate('label.thankyou.sizeText')}: <span className="uppercase">{product.size}</span>
                  </p>
                </div>
                <div className="flex items-end mt-2">
                  <dl className="flex space-x-4 text-sm divide-x divide-gray-200 sm:space-x-6">
                    <div className="flex">
                      <dt className="font-medium text-gray-900">{translate('common.label.quantityText')}</dt>
                      <dd className="ml-2 text-gray-700">{product.qty}</dd>
                    </div>
                    <div className="flex pl-4 sm:pl-6">
                      <dt className="font-medium text-gray-900">{translate('common.label.priceText')}</dt>
                      <dd className="ml-2 text-gray-700">{product?.price?.raw?.withTax > 0 ? product.price.formatted.withTax : <span className="font-medium uppercase text-14 xs-text-14 text-emerald-600">{translate('label.orderSummary.freeText')}</span>}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export default SplitDeliveryOrderItems
