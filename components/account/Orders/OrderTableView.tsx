import Spinner from '@components/ui/Spinner'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { useTranslation } from '@commerce/utils/use-translation'
import moment from 'moment'
import { DATE_FORMAT } from '@components/utils/constants'
import OrderStatusMapping from './OrderStatusMapping'
import { useRouter } from 'next/router'

function OrdersTableView({ alertRibbon, displayAlert, isIPadorTablet, isMobile, alertBgColor, ordersList }: any) {
  const translate = useTranslation()
  const router = useRouter()

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Get the current page from URL query string
  useEffect(() => {
    const page = parseInt(router.query.page as string) || 1
    setCurrentPage(page)
  }, [router.query.page])

  const totalPages = Math.ceil(ordersList?.length / itemsPerPage)

  // Paginate orders
  const currentOrders = ordersList?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handlePageChange = (page: number) => {
    // Update the URL with the new page number
    router.push({ query: { ...router.query, page } })
    setCurrentPage(page)
  }

  return (
    <div className="w-full bg-white dark:bg-transparent">
      {!ordersList ? (
        <Spinner />
      ) : ordersList?.length > 0 ? (
        <section aria-labelledby="recent-heading" className="mt-2">
          <h1 id="recent-heading" className="sr-only">
            {translate('label.orderDetails.recentOrdersText')}
          </h1>
          <div className="mt-4 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 pl-3 pr-3 text-[13px] font-semibold text-left text-gray-900 sm:pl-4">Order No.</th>
                  <th className="py-3 pl-3 pr-3 text-[13px] font-semibold text-left text-gray-900 sm:pl-4">User</th>
                  <th className="px-3 py-3 text-[13px] font-semibold text-left text-gray-900">Items</th>
                  <th className="px-3 py-3 text-[13px] font-semibold text-left text-gray-900">Order Date</th>
                  <th className="px-3 py-3 text-[13px] font-semibold text-left text-gray-900">ETA</th>
                  <th className="px-3 py-3 text-[13px] font-semibold text-left text-gray-900">Order Total</th>
                  <th className="px-3 py-3 text-[13px] font-semibold text-right text-gray-900">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentOrders?.map((order: any, orderIndex: number) => (
                  <tr key={`orders-list-${orderIndex}`} className="text-xs bg-white border-b shadow-none group border-slate-200 hover:shadow hover:bg-gray-100">
                    <td className="px-3 py-4 text-[13px] font-medium cursor-pointer text-sky-500 sm:pl-4 hover:text-sky-600 whitespace-nowrap">
                      <Link href={`/my-account/orders/${order?.id}`} passHref>
                        <span>{order?.orderNo}</span>
                      </Link>
                    </td>
                    <td className="px-3 py-4 text-[13px] text-gray-500 whitespace-nowrap">{order?.createdBy}</td>
                    <td className="px-3 py-4 text-[13px] text-gray-500 whitespace-nowrap">
                      {order?.orderDetails?.order?.deliveryPlans?.length > 0 ? order?.orderDetails?.order?.items?.length : order?.itemsBasic?.length}
                    </td>
                    <td className="px-3 py-4 text-[13px] text-gray-500 whitespace-nowrap">
                      {moment(new Date(order?.orderDate)).format(DATE_FORMAT)}
                    </td>
                    <td className="px-3 py-4 text-[13px] text-gray-500 whitespace-nowrap">
                      {moment(new Date(order?.dueDate)).format(DATE_FORMAT)}
                    </td>
                    <td className="px-3 py-4 text-[13px] text-black font-semibold whitespace-nowrap">{order?.grandTotal?.formatted?.withTax}</td>
                    <td align="right" className="px-3 py-4 text-[13px] text-gray-500 whitespace-nowrap">
                      <OrderStatusMapping orderStatusDisplay={order?.orderStatusDisplay} orderStatusRag={order?.orderStatusRag} isTabular={true} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {ordersList?.length > 10 &&
            <div className="flex justify-center mt-4 space-x-2">
              {Array.from({ length: totalPages }, (_, index) => (
                <button key={index} className={`mx-1 w-8 h-8 text-sm font-semibold rounded-full ${currentPage === index + 1 ? 'bg-black text-white' : 'bg-gray-100 text-gray-800'}`} onClick={() => handlePageChange(index + 1)} >
                  {index + 1}
                </button>
              ))}
            </div>
          }
        </section>
      ) : (
        <div className="flex flex-col w-full px-4 py-12 max-acc-container sm:px-0">
          <h1 className="my-2 text-2xl font-semibold text-black dark:text-white">
            {translate('label.orderDetails.noOrderFoundHeadingText')}
          </h1>
          <div className="flex mt-5 w-60 sm:flex-col">
            <Link legacyBehavior passHref href="/">
              <a className="w-full flex items-center justify-center px-4 py-3 -mr-0.5 rounded-sm sm:px-6 link-button btn-primary">
                {translate('label.orderDetails.startShoppingBtnText')}
              </a>
            </Link>
          </div>
        </div>
      )}
      {(isMobile || isIPadorTablet) && (
        <div className="sticky bottom-0 z-50 p-0 sm:px-0">
          {displayAlert && (
            <div className="mb-3 mt-3 m-[-20px] w-auto">
              <div className={`${alertBgColor(alertRibbon?.type)} justify-center w-full px-10 py-4 text-center align-center`}>
                <h4 className={`text-16 font-medium ${alertRibbon?.type == 'cancel' ? 'text-[#c10000]' : 'text-[#fff]'}`}>
                  {alertRibbon?.msg}
                </h4>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default OrdersTableView
