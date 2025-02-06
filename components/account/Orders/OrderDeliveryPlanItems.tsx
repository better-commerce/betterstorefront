import { DATE_FORMAT } from '@components/utils/constants'
import { matchStrings } from '@framework/utils/parse-util'
import { Disclosure } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import moment from 'moment'
import React from 'react'
import OrderLog from './OrderLog'
import OrderStatusMapping from './OrderStatusMapping'
import TrackingDetail from './TrackingDetail'
import { useTranslation } from '@commerce/utils/use-translation'
import KitOrderItems from './KitOrderItem'
const OrderDeliveryPlanItems = ({ items, details, trackPackage, ifCancelled, openHelpModal, setReview, }: any) => {
  const translate = useTranslation()
  return (
    <>
      {items?.map((deliveryPlan: any, idx: number) => (
        <div key={idx} className="w-full">
          <div className="flex items-center justify-between w-full pb-4 border-b border-gray-300 border-dashed">
            <div className="">
              <h4 className="mb-2 text-xs text-black opacity-60">
                {deliveryPlan?.items?.length} {translate('common.label.itemPluralText')}
              </h4>
              <span className="text-base font-semibold text-black">
                {translate('label.orderDetails.packageText')} {idx + 1}
                {' of '}
                {details?.deliveryPlans?.length}
              </span>
            </div>
            <div className="">
              <OrderStatusMapping orderStatusDisplay={deliveryPlan?.orderStatusDisplay} orderStatusRag={deliveryPlan?.orderStatusRag} orderStatus={deliveryPlan.statusType} orderId={details?.orderId} orderLog={details?.orderLog} />
            </div>
          </div>

          {/* order status section start */}
          <div className="w-full pb-0 mb-4 border-b border-gray-300 border-dashed">
            <Disclosure defaultOpen>
              {({ open }) => (
                <>
                  {deliveryPlan?.showETA && (
                    <Disclosure.Button className="flex items-center justify-between w-full py-3">
                      <p className="text-sm font-light text-black">
                        <span> ETA: {' '} {moment(new Date(deliveryPlan?.deliveryDateTarget)).format(DATE_FORMAT)} </span>
                      </p>
                      <button className="border border-gray-900 rounded-full">
                        <ChevronDownIcon className={`w-4 h-4 dark:text-gray-900 ${open && 'rotate-180 transform'}`} />
                      </button>
                    </Disclosure.Button>
                  )}
                  <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                    <div className="order-track">
                      <OrderLog orderLog={deliveryPlan?.orderLog} orderStatus={details?.orderStatus} orderJourney={deliveryPlan?.orderJourney} deliveryPlanId={deliveryPlan?.recordId} />
                    </div>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          </div>
          {details?.allowedToTrack && (
            <div className="w-full px-4 py-4 border-b border-gray-300 border-dashed sm:px-16 sm:pl-0 sm:pt-0">
              <div className="flex flex-col w-full">
                <a onClick={() => trackPackage(details)} className="font-semibold text-[#32CD32] cursor-pointer text-14" target="_blank" rel="noopener noreferrer" href={deliveryPlan?.trackingLink} >
                  {translate('label.orderDetails.trackingDetailsBtnText')} </a>
              </div>
            </div>
          )}

          <div className="flow-root w-full px-0">
            <ul role="list" className="flex flex-col w-full gap-2 pt-4">
              {deliveryPlan?.items?.map((item: any, idx: number) =>
                details?.items?.filter((x: any) => matchStrings(x?.productId, item?.productId, true))?.map((productItem: any, pId: number) => {
                  return item?.price?.raw?.withTax == 0 ? (
                    <></>
                  ) : (
                    <KitOrderItems orderItem={productItem} isKitOrderItem={false} openHelpModal={openHelpModal} />
                  )
                })
              )}
            </ul>
          </div>
          {details?.allowedToTrack && (
            <TrackingDetail deliveryPlan={deliveryPlan} />
          )}
          {deliveryPlan?.invoiceURL && (
            <div className="py-6">
              <a href={deliveryPlan?.invoiceURL} className="block w-full px-4 font-bold text-center text-black border rounded-sm btn-basic-property" > {translate('label.orderDetails.downloadInvoiceBtnText')} </a>
            </div>
          )}
        </div>
      ))}
    </>
  )
}
export default OrderDeliveryPlanItems