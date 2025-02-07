// Base Imports
import { useEffect } from 'react'
import { useUI } from '@components/ui/context'
import OrdersListView from './OrdersListView'
export default function MyOrders({ allOrders, handleInfiniteScroll, deviceInfo, isShowDetailedOrder, setIsShowDetailedOrder }: any) {
  const { isMobile, isIPadorTablet } = deviceInfo
  const { displayAlert, alertRibbon } = useUI()

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

  useEffect(() => {
    allOrders?.forEach((orderObj: any) => {
      // remove personalization from order items
      if (!!orderObj?.itemsBasic?.length) {
        orderObj.itemsBasic = orderObj?.itemsBasic?.filter((o: any) => o?.name !== 'Personalization')
      }
      // remove personalization from order delivery plans items
      if (!!orderObj?.deliveryPlans?.length) {
        orderObj.deliveryPlans = orderObj?.deliveryPlans?.map((o: any) => {
          o.items = o?.items?.filter((o: any) => o?.productName !== 'Personalization')
          return o
        })
      }
    })
  }, [allOrders])

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
      handleInfiniteScroll={handleInfiniteScroll}
      setIsShowDetailedOrder={setIsShowDetailedOrder}
      deviceInfo={deviceInfo}
    />
  )
}
