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
import { NEXT_B2B_GET_QUOTES, NEXT_B2B_GET_USERS, NEXT_DOWNLOAD_INVOICE, NEXT_GET_INVOICE, NEXT_GET_ORDERS } from '@components/utils/constants'
import B2BOrders from '@components/account/Orders/B2BOrders'
import { deliveryDateFormat } from '@framework/utils/parse-util'

function MyInvoices({ deviceInfo }: any) {
  const [isShow, setShow] = useState(true)
  const [b2bQuotes, setB2BQuotes] = useState<any>(null)
  const [userOrderIdMap, setUserOrderIdMap] = useState<any>(null)
  const { user, isGuestUser, changeMyAccountTab, displayDetailedOrder, setAlert, setOverlayLoaderState, hideOverlayLoaderState } = useUI()
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [b2bUsers, setB2BUsers] = useState<any>(null)
  const translate = useTranslation()
  const { CustomerProfileViewed } = EVENTS_MAP.EVENT_TYPES
  const { Customer } = EVENTS_MAP.ENTITY_TYPES
  const [isShowDetailedOrder, setIsShowDetailedOrder] = useState(displayDetailedOrder)
  const [data, setData] = useState<any>([])

  useEffect(() => {
    setIsShowDetailedOrder(displayDetailedOrder)
  }, [displayDetailedOrder])
  useEffect(() => {
    fetchB2BUserQuotes()
    if (isGuestUser) {
      router.push('/')
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const fetchB2BUserQuotes = async () => {
    let { data: b2bQuotes } = await axios.post(NEXT_B2B_GET_QUOTES, {
      userId: user?.userId,
    })
    setB2BQuotes(b2bQuotes)
  }
  let loggedInEventData: any = {
    eventType: CustomerProfileViewed,
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

  useAnalytics(CustomerProfileViewed, loggedInEventData)

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
          <div className="mt-10 overflow-x-auto sm:overflow-x-hidden">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="w-full text-xs bg-[#f1f5f7] leading-normal">
                  <td className="py-2 px-4 text-left text-xs !border">Invoice No</td>
                  <td className="py-2 px-4 text-left text-xs">Invoice Date</td>
                  <td className="py-2 px-4 text-left text-xs">Order No</td>
                  <td className="py-2 px-4 text-left text-xs">Order Date</td>
                  <td className="py-2 px-4 text-left text-xs">Invoice Amount</td>
                  <td className="py-2 px-4 text-left text-xs">Paid Amount</td>
                  <td className="py-2 px-4 text-left text-xs">Due Amount</td>
                  <td className="py-2 px-4 text-left text-xs">Due Date</td>
                  <td className="py-2 px-4 text-left text-xs">Status</td>
                  <td className="py-2 px-4 text-left text-xs">Over Due</td>
                </tr>
              </thead>
              <tbody>
                {data?.result?.map((invoice: any, idx: any) => (
                  <tr key={invoice?.recordId}>
                    <td className="py-2 px-4 text-left text-xs border-b text-blue">
                      <div onClick={() => downloadOrderInvoice(invoice)} className=' flex gap-2 cursor-pointer'>
                      <img className="h-3 w-3" src="/images/pdf.png" alt=""/>{invoice?.invoiceNo}
                      </div>
                    </td>
                    <td className="py-2 px-4 text-left text-xs border-b">
                    {deliveryDateFormat(invoice?.invoiceDate)}
                    </td>
                    <td className="py-2 px-4 text-left text-xs border-b">{invoice?.orderNo}</td>
                    <td className="py-2 px-4 text-left text-xs border-b">
                    {deliveryDateFormat(invoice?.orderDate)}
                    </td>

                    <td className="py-2 px-4 text-left text-xs border-b">
                      {invoice?.grandTotal}
                    </td>
                    <td className="py-2 px-4 text-left text-xs border-b">
                      {invoice?.paidAmount}
                    </td>
                    <td className="py-2 px-4 text-left text-xs border-b">
                      {invoice?.dueAmount.toFixed(2)}{' '}
                    </td>
                    <td className="py-2 px-4 text-left text-xs border-b">{deliveryDateFormat(invoice?.dueDate)}</td>
                    <td className="py-2 px-4 text-left text-xs border-b">
                      {invoice?.paymentStatus}
                    </td>
                    <td className="py-2 px-4 text-left text-xs border-b">
                    <span className={`p-1 px-4 rounded-md ${
                        invoice?.isOverDue ? 'label-confirmed' : 'label-cancelled'
                      }`}>{invoice?.isOverDue ? 'Yes' : 'No'}</span>
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