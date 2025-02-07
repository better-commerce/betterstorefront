// Base Imports
import { useEffect, useState } from 'react'

// Package Imports
import axios from 'axios'

// Other Imports
import { useUI } from '@components/ui/context'
import { NEXT_GET_ORDERS, } from '@components/utils/constants'
import OrdersTableView from './OrderTableView'

export default function B2BOrders({ deviceInfo }: any) {
  const PAGE_SIZE = 10
  const { isMobile, isIPadorTablet } = deviceInfo
  const { user, displayAlert, alertRibbon } = useUI()
  const [ordersList, setOrdersList] = useState<any>(null)

  const fetchOrders = async (pageNumber = 1) => {
    const { data: ordersResult }: any = await axios.post(NEXT_GET_ORDERS, {
      id: user?.userId,
      hasMembership: user?.hasMembership,
      pageNumber: pageNumber,
      pageSize: PAGE_SIZE,
    })
    setOrdersList(ordersResult)
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
    fetchOrders()
  }, [])

  return (
    <OrdersTableView alertRibbon={alertRibbon} displayAlert={displayAlert} isIPadorTablet={isIPadorTablet} isMobile={isMobile} alertBgColor={alertBgColor} ordersList={ordersList} />
  )
}
