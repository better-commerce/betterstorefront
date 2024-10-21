// Base Imports
import { useEffect, useState } from 'react'

// Package Imports
import axios from 'axios'
// Component Imports
import { useUI } from '@components/ui/context'
// Other Imports
import { NEXT_GET_ORDERS, NEXT_GET_ORDER_DETAILS, } from '@components/utils/constants'
import { matchStrings } from '@framework/utils/parse-util'
import React from 'react'
import OrdersTableView from './OrderTableView'

export default function B2BOrders({ deviceInfo, isShowDetailedOrder, setIsShowDetailedOrder, isAdmin, userOrderIdMap, }: any) {
  const PAGE_SIZE = 10
  const { isMobile, isIPadorTablet } = deviceInfo
  const { user, displayAlert, alertRibbon } = useUI()
  const [ordersList, setOrdersList] = useState<any>(null)
  const [allOrders, setAllOrders] = useState<Array<any> | undefined>(undefined)
  const [pagedOrders, setPagedOrders] = useState<Array<any>>()
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [allOrderIds, setAllOrderIds] = useState<Array<string> | undefined>(
    undefined
  )
  const [allOrdersFetched, setAllOrdersFetched] = useState<boolean>(false)
  useEffect(() => {
    if (allOrdersFetched) {
      setAllOrderIds(pagedOrders?.map((x: any) => x?.id))
    } else {
      fetchOrders(pageNumber)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allOrdersFetched])

  useEffect(() => {
    setAllOrdersFetched(false)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber])

  const findUserIdByOrderId = (IdMapArray: any, orderId: any) => {
    if (IdMapArray) {
      for (const data of IdMapArray) {
        const { userId, orders } = data
        const foundOrder = orders.find((order: any) => order === orderId)
        if (foundOrder) {
          return userId
        }
      }
    }
    return null
  }

  useEffect(() => {
    if (allOrderIds?.length) {
      allOrderIds?.forEach((id: string, index: number) => {
        let userMappedId = findUserIdByOrderId(userOrderIdMap, id)
        handleFetchOrderDetails(
          id,
          userMappedId ? userMappedId : user?.userId
        ).then((orderDetails: any) => {
          const newOrders = pagedOrders?.map((obj: any) =>
            matchStrings(obj?.id, id, true)
              ? Object.assign(obj, { orderDetails: orderDetails })
              : obj
          )
          setPagedOrders(newOrders)
          setAllOrders((allOrders ?? [])?.concat(newOrders))
        })
      })
    } else {
      if (allOrderIds !== undefined) {
        setAllOrders([])
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allOrderIds])

  const fetchOrders = async (pageNumber: number) => {
    const { data: ordersResult }: any = await axios.post(NEXT_GET_ORDERS, {
      id: user?.userId,
      hasMembership: user?.hasMembership,
      pageNumber: pageNumber,
      pageSize: PAGE_SIZE,
    })

    setPagedOrders(ordersResult)
    setAllOrdersFetched(true)
  }

  const handleInfiniteScroll = () => {
    //alert(pageNumber)
    setPageNumber(pageNumber + 1)
  } //TILL HERE DONE

  const handleFetchOrderDetails = async (id: any, userId: any) => {
    const { data: orderDetails }: any = await axios.post(
      NEXT_GET_ORDER_DETAILS,
      {
        id: userId,
        orderId: id,
      }
    )
    return orderDetails
  }

  useEffect(() => {
    allOrders?.forEach((orderObj: any) => {
      // remove personalization from order items
      if (!!orderObj?.orderDetails?.order?.items?.length) {
        orderObj.orderDetails.order.items =
          orderObj.orderDetails.order.items.filter(
            (o: any) => o.name !== 'Personalization'
          )
      }
      // remove personalization from order delivery plans items
      if (!!orderObj?.orderDetails?.order?.deliveryPlans?.length) {
        orderObj.orderDetails.order.deliveryPlans =
          orderObj.orderDetails.order.deliveryPlans.map((o: any) => {
            o.items = o.items.filter(
              (o: any) => o.productName !== 'Personalization'
            )
            return o
          })
      }
    })
  }, [allOrders])

  useEffect(() => {
    if (allOrders) {
      setOrdersList(allOrders)
    }
  }, [allOrders])

  let deviceCheck = ''
  if (isMobile || isIPadorTablet) {
    deviceCheck = 'Mobile'
  } else {
    deviceCheck = 'Desktop'
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
    <OrdersTableView alertRibbon={alertRibbon} displayAlert={displayAlert} isIPadorTablet={isIPadorTablet} isMobile={isMobile} alertBgColor={alertBgColor} ordersList={ordersList} />
  )
}
