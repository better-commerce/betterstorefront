import React from 'react'
import TrackingDetail from '@components/account/Orders/TrackingDetail'
import KitBasketOrderItem from '@components/account/Orders/KitBasketOrderItem'
import KitOrderItems from './KitOrderItem'
const OrderItems = ({ items, details, ifCancelled, openHelpModal, setReview, }: any) => {
  return (
    <>
      <ul role="list" className="flex flex-col w-full gap-2 pt-4">
        {items?.map((orderItem: any, orderItemIdx: number) => {
          if (orderItem?.length) {
            return (
              <React.Fragment key={`order-items-${orderItemIdx}`}>
                <KitBasketOrderItem orderItem={orderItem} openHelpModal={openHelpModal} />
              </React.Fragment>
            )
          }
          return (
            <React.Fragment key={`order-items-${orderItemIdx}`}>
              {orderItem?.statusDisplay !== "Cancelled" &&
                <KitOrderItems orderItem={orderItem} isKitOrderItem={true} openHelpModal={openHelpModal} />
              }
            </React.Fragment>
          )
        })}
        {items?.map((orderItem: any, orderItemIdx: number) => {
          return (
            <React.Fragment key={`order-items-cancel-${orderItemIdx}`}>
              {orderItem?.statusDisplay === "Cancelled" &&
                <KitOrderItems orderItem={orderItem} isKitOrderItem={true} openHelpModal={openHelpModal} />
              }
            </React.Fragment>
          )
        })}
      </ul>
      {details?.allowedToTrack && (
        <TrackingDetail deliveryPlan={details?.deliveryPlans} />
      )}
    </>
  )
}
export default OrderItems