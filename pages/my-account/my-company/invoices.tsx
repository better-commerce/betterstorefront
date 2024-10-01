import { useState, useEffect, useMemo } from 'react'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import withAuth from '@components/utils/withAuth'
import { useRouter } from 'next/router'
import { EVENTS_MAP } from '@components/services/analytics/constants'
import useAnalytics from '@components/services/analytics/useAnalytics'
import { useUI } from '@components/ui/context'
import React from 'react'
import MyDetails from '@components/account/MyDetails'
import { useTranslation } from '@commerce/utils/use-translation'
import LayoutAccount from '@components/Layout/LayoutAccount'
import { IPagePropsProvider } from '@framework/contracts/page-props/IPagePropsProvider'
import { getPagePropType, PagePropType } from '@framework/page-props'
import B2BQuotes from '@components/account/B2BQuotes'
import { generatePDF } from '@components/utils/order'
import axios from 'axios'
import { DATE_FORMAT, NEXT_B2B_GET_QUOTES, NEXT_B2B_GET_USERS, NEXT_DOWNLOAD_INVOICE, NEXT_GET_INVOICE, NEXT_GET_ORDERS } from '@components/utils/constants'
import B2BOrders from '@components/account/Orders/B2BOrders'
import { deliveryDateFormat } from '@framework/utils/parse-util'
import moment from 'moment'
import { AnalyticsEventType } from '@components/services/analytics'

function MyInvoices({ deviceInfo }: any) {
  const [isShow, setShow] = useState(true)
  const [userOrderIdMap, setUserOrderIdMap] = useState<any>(null)
  const { user, isGuestUser, changeMyAccountTab, displayDetailedOrder, setAlert, setOverlayLoaderState, hideOverlayLoaderState } = useUI()
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [b2bUsers, setB2BUsers] = useState<any>(null)
  const translate = useTranslation()
  const { Customer } = EVENTS_MAP.ENTITY_TYPES
  const [isShowDetailedOrder, setIsShowDetailedOrder] = useState(displayDetailedOrder)
  const [data, setData] = useState<any>([])

  useEffect(() => {
    setIsShowDetailedOrder(displayDetailedOrder)
  }, [displayDetailedOrder])
  useEffect(() => {
    if (isGuestUser) {
      router.push('/')
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  let loggedInEventData: any = {
    eventType: AnalyticsEventType.CUSTOMER_PROFILE_VIEWED,
  }
  const userAdminCheck = (b2bUsers: any) => {
    let isAdmin =
      b2bUsers.find((x: any) => x?.userId === user?.userId)?.companyUserRole ===
      'Admin'
    setIsAdmin(isAdmin)
  }

  const fetchB2BUsers = async () => {
    let { data: b2bUsers } = await axios.post(NEXT_B2B_GET_USERS, {
      companyId: user?.companyId,
    })
    if (b2bUsers?.length) {
      setB2BUsers(b2bUsers)
      userAdminCheck(b2bUsers)
    }
    return b2bUsers
  }
  if (user && user.userId) {
    loggedInEventData = {
      ...loggedInEventData,
      entity: JSON.stringify({
        email: user.email,
        dateOfBirth: user.yearOfBirth,
        gender: user.gender,
        id: user.userId,
        name: user.firstName + user.lastName,
        postCode: user.postCode,
      }),
      entityId: user.userId,
      entityName: user.firstName + user.lastName,
      entityType: Customer,
    }
  }
  useEffect(() => {
    changeMyAccountTab(translate('label.myAccount.myCompanyMenus.invoice'))
  }, [])

  useAnalytics(AnalyticsEventType.CUSTOMER_PROFILE_VIEWED, loggedInEventData)

  const handleToggleShowState = () => {
    setShow(!isShow)
  }
  const fetchOrders = async (userId: any) => {
    const { data } = await axios.post(NEXT_GET_ORDERS, { id: userId })
    return data?.map((order: any) => order?.id) || []
  }
  useEffect(() => {
    const fetchData = async () => {
      if (!b2bUsers) return

      const userOrderMap = await Promise.all(
        b2bUsers
          .filter((user: any) => user?.companyUserRole !== 'Admin')
          .map(async (user: any) => {
            const orders = await fetchOrders(user.userId)
            return { userId: user.userId, orders }
          })
      )
      setUserOrderIdMap([...userOrderMap])
    }

    fetchData()
  }, [b2bUsers])

  // Fetch Invoice
  useEffect(() => {
    const fetchInvoice = async () => {
      if (!user?.companyId) return;
      try {
        const response: any = await axios.post(NEXT_GET_INVOICE, {
          companyId: user?.companyId,
          currentPage: 1,
          pageSize: 1000,
          fromDate: '',
          toDate: '',
        })
        setData(response?.data)
      } catch (error) {
        console.error(error)
      }
    }
    fetchInvoice()
  }, [user?.companyId])

  async function downloadOrderInvoice(order: any) {
    setOverlayLoaderState({ visible: true, message: 'Generating invoice...', })
    const res: any = await axios.post(NEXT_DOWNLOAD_INVOICE, {
      orderId: order?.orderId,
    })
    if (res?.data) {
      generatePDF(res?.data?.base64Pdf, order);
    } else {
      console.log('invoice Details not found')
    }
    hideOverlayLoaderState()
  }

  return (
    <div className={'orders bg-white dark:bg-transparent'}>
      <div>
        <h1 className="text-2xl font-semibold sm:text-3xl dark:text-black">
          Invoices
        </h1>
        {data?.result?.length > 0 ? (
          <div className="mt-8 overflow-hidden border rounded-2xl border-slate-200">
            <table className="min-w-full text-left">
              <thead>
                <tr className="w-full text-xs bg-[#f1f5f7] leading-normal">
                  <th className="px-2 py-3 text-sm font-semibold text-left border border-slate-200">Invoice No</th>
                  <th className="px-2 py-3 text-sm font-semibold text-left border border-slate-200">Invoice Date</th>
                  <th className="px-2 py-3 text-sm font-semibold text-left border border-slate-200">Order No</th>
                  <th className="px-2 py-3 text-sm font-semibold text-left border border-slate-200">Invoice Amount</th>
                  <th className="px-2 py-3 text-sm font-semibold text-left border border-slate-200">Paid Amount</th>
                  <th className="px-2 py-3 text-sm font-semibold text-left border border-slate-200">Status</th>
                </tr>
              </thead>
              <tbody>
                {data?.result?.map((invoice: any, idx: any) => (
                  <tr key={invoice?.recordId} className="text-xs bg-white border-b shadow-none border-slate-200 hover:shadow hover:bg-gray-100">
                    <td className="p-2 text-sm text-left">
                      <div onClick={() => downloadOrderInvoice(invoice)} className='flex items-center gap-2 font-medium cursor-pointer text-sky-500 '>
                        <img className="w-4 h-4" src="/images/pdf.png" alt="" />{invoice?.customNo}
                      </div>
                    </td>
                    <td className="p-2 text-sm text-left">{moment(new Date(invoice?.invoiceDate)).format(DATE_FORMAT)}</td>
                    <td className="p-2 text-sm text-left">{invoice?.orderNo}</td>
                    <td className="p-2 text-sm text-left"> {invoice?.currencySymbol}{invoice?.grandTotal} </td>
                    <td className="p-2 text-sm text-left"> {invoice?.currencySymbol}{invoice?.paidAmount} </td>
                    <td className="p-2 text-sm text-left">
                      {invoice?.paymentStatus == 0 && <span className='px-3 py-1 text-xs rounded-full label-pending'>Pending</span>}
                      {invoice?.paymentStatus == 1 && <span className='px-3 py-1 text-xs rounded-full label-confirmed'>Authorized</span>}
                      {invoice?.paymentStatus == 2 && <span className='px-3 py-1 text-xs rounded-full label-confirmed'>Paid</span>}
                      {invoice?.paymentStatus == 3 && <span className='px-3 py-1 text-xs rounded-full label-Cancelled'>Declined</span>}
                      {invoice?.paymentStatus == 4 && <span className='px-3 py-1 text-xs rounded-full label-Cancelled'>Cancelled</span>}
                      {invoice?.paymentStatus == 5 && <span className='px-3 py-1 text-xs rounded-full label-Cancelled'>Cancelled By PSP</span>}
                      {invoice?.paymentStatus == 6 && <span className='px-3 py-1 text-xs rounded-full label-blue'>Refunded</span>}
                      {invoice?.paymentStatus == 7 && <span className='px-3 py-1 text-xs rounded-full label-blue'>Charging</span>}
                      {invoice?.paymentStatus == 8 && <span className='px-3 py-1 text-xs rounded-full label-Cancelled'>Voided</span>}
                      {invoice?.paymentStatus == 9 && <span className='px-3 py-1 text-xs rounded-full label-confirmed'>Require Pre-Auth</span>}
                      {invoice?.paymentStatus == 10 && <span className='px-3 py-1 text-xs rounded-full label-pending'>Problem InRefund</span>}
                      {invoice?.paymentStatus == 11 && <span className='px-3 py-1 text-xs rounded-full label-pending'>Problem In Post-Auth</span>}
                      {invoice?.paymentStatus == 12 && <span className='px-3 py-1 text-xs rounded-full label-pending'>Awaiting Post Auth Response</span>}
                      {invoice?.paymentStatus == 13 && <span className='px-3 py-1 text-xs rounded-full label-Cancelled'>Request To Cancel Pre-Auth</span>}
                      {invoice?.paymentStatus == 14 && <span className='px-3 py-1 text-xs rounded-full label-Cancelled'>Problem In Cancel Pre-Auth</span>}
                      {invoice?.paymentStatus == 15 && <span className='px-3 py-1 text-xs rounded-full label-blue'>Po Received</span>}
                      {invoice?.paymentStatus == 16 && <span className='px-3 py-1 text-xs rounded-full label-pending'>Duplicate Request</span>}
                      {invoice?.paymentStatus == 17 && <span className='px-3 py-1 text-xs rounded-full label-confirmed'>Initiated</span>}
                      {invoice?.paymentStatus == 18 && <span className='px-3 py-1 text-xs rounded-full label-blue'>Retry Refund</span>}
                      {invoice?.paymentStatus == 19 && <span className='px-3 py-1 text-xs rounded-full label-confirmed'>Authorized By Webhook</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div>
            <h3>No Invoice Available</h3>
          </div>
        )}
      </div>
    </div>
  )
}

MyInvoices.LayoutAccount = LayoutAccount

const PAGE_TYPE = PAGE_TYPES.MyInvoices

export async function getServerSideProps(context: any) {
  const { locale } = context
  const props: IPagePropsProvider = getPagePropType({ type: PagePropType.COMMON })
  const pageProps = await props.getPageProps({ cookies: context?.req?.cookies })

  return {
    props: {
      ...pageProps,
    }, // will be passed to the page component as props
  }
}

export default withDataLayer(withAuth(MyInvoices), PAGE_TYPE, true, LayoutAccount)