// Base Imports
import { useEffect, useState } from 'react'
import { useUI } from '@components/ui/context'
import OrdersListView from './OrdersListView'
export default function MyOrders({ allOrders, handleInfiniteScroll, deviceInfo, isShowDetailedOrder, setIsShowDetailedOrder }: any) {
  const { isMobile, isIPadorTablet } = deviceInfo
  const { displayAlert, alertRibbon } = useUI()
  const [orderDetails, setOrderDetails] = useState<any>(undefined)

  const fetchOrderDetails = async (id: any) => {
    const { orderDetails } = allOrders.find((order: any) => order.id === id)
    setOrderDetails(orderDetails)
  }

  const onOrderDetail = async (id: any) => {
    await fetchOrderDetails(id)
  }

  useEffect(() => {
    allOrders?.forEach((orderObj: any) => {
      // remove personalization from order items
      if (!!orderObj?.orderDetails?.order?.items?.length) {
        orderObj.orderDetails.order.items = orderObj.orderDetails.order.items.filter((o: any) => o.name !== 'Personalization')
      }
      // remove personalization from order delivery plans items
      if (!!orderObj?.orderDetails?.order?.deliveryPlans?.length) {
        orderObj.orderDetails.order.deliveryPlans = orderObj.orderDetails.order.deliveryPlans.map((o: any) => {
          o.items = o.items.filter((o: any) => o.productName !== 'Personalization')
          return o
        })
      }
    })
  }, [allOrders])

  let deviceCheck = ''
  if (isMobile || isIPadorTablet) {
    deviceCheck = 'Mobile'
  } else {
    deviceCheck = 'Desktop'
  }
  const trackPackage = (order: any) => {
    //
  }

  const alertBgColor = (type: string) => {
    switch (type) {
      case 'error':
        return 'bg-ribbon-red capitalize'

      case 'success':
        return 'bg-ribbon-green capitalize'

      case 'cancel':
        return 'bg-ribbon-cancel'
    }
  }

  return (
    <OrdersListView
      isShowDetailedOrder={isShowDetailedOrder}
      alertRibbon={alertRibbon}
      displayAlert={displayAlert}
      isIPadorTablet={isIPadorTablet}
      isMobile={isMobile}
      alertBgColor={alertBgColor}
      ordersList={allOrders}
      trackPackage={trackPackage}
      onOrderDetail={onOrderDetail}
      handleInfiniteScroll={handleInfiniteScroll}
      setIsShowDetailedOrder={setIsShowDetailedOrder}
      deviceInfo={deviceInfo}
      orderDetails={orderDetails}
    />
  )
}
