import { useState, useEffect } from 'react'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import withAuth from '@components/utils/withAuth'
import { useRouter } from 'next/router'
import { EVENTS_MAP } from '@components/services/analytics/constants'
import useAnalytics from '@components/services/analytics/useAnalytics'
import { useUI } from '@components/ui/context'
import React from 'react'
import { useTranslation } from '@commerce/utils/use-translation'
import LayoutAccount from '@components/Layout/LayoutAccount'
import { IPagePropsProvider } from '@framework/contracts/page-props/IPagePropsProvider'
import { getPagePropType, PagePropType } from '@framework/page-props'
import { generatePDF } from '@components/utils/order'
import axios from 'axios'
import { DATE_FORMAT, NEXT_DOWNLOAD_INVOICE, NEXT_GET_INVOICE } from '@components/utils/constants'
import moment from 'moment'
import { AnalyticsEventType } from '@components/services/analytics'
import Link from 'next/link'
import Spinner from '@components/ui/Spinner'

function MyInvoices({ deviceInfo }: any) {
  const { user, isGuestUser, changeMyAccountTab, setOverlayLoaderState, hideOverlayLoaderState } = useUI()
  const router = useRouter()
  const translate = useTranslation()
  const { Customer } = EVENTS_MAP.ENTITY_TYPES
  const [data, setData] = useState<any>([])
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (isGuestUser) {
      router.push('/')
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  let loggedInEventData: any = { eventType: AnalyticsEventType.CUSTOMER_PROFILE_VIEWED, entityType: Customer, }
  if (user && user.userId) {
    loggedInEventData = { ...loggedInEventData, ...user, }
  }
  useEffect(() => {
    changeMyAccountTab(translate('label.myAccount.myCompanyMenus.invoice'))
  }, [])

  useAnalytics(AnalyticsEventType.CUSTOMER_PROFILE_VIEWED, loggedInEventData)

  // Fetch Invoice
  useEffect(() => {
    const fetchInvoice = async () => {
      setIsLoading(true);
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
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Get the current page from URL query string
  useEffect(() => {
    const page = parseInt(router.query.page as string) || 1
    setCurrentPage(page)
  }, [router.query.page])

  const totalPages = Math.ceil(data?.result?.length / itemsPerPage)

  // Paginate orders
  const currentInvoices = data?.result?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handlePageChange = (page: number) => {
    // Update the URL with the new page number
    router.push({ query: { ...router.query, page } })
    setCurrentPage(page)
  }

  return (
    <div className={'orders bg-white dark:bg-transparent'}>
      <div>
        <h1 className="text-xl font-normal sm:text-2xl dark:text-black"> Invoices </h1>
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            {data?.result?.length > 0 ? (
              <>
                <div className="mt-4 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="py-3 pl-3 pr-3 text-[13px] font-semibold text-left text-gray-900 sm:pl-4">Invoice No.</th>
                        <th className="px-3 py-3 text-[13px] font-semibold text-left text-gray-900">Date</th>
                        <th className="px-3 py-3 text-[13px] font-semibold text-left text-gray-900">Order No.</th>
                        <th className="px-3 py-3 text-[13px] font-semibold text-left text-gray-900">Amount</th>
                        <th className="px-3 py-3 text-[13px] font-semibold text-left text-gray-900">Paid Amount</th>
                        <th className="px-3 py-3 text-[13px] font-semibold text-right text-gray-900">Status</th>
                      </tr>
                    </thead>
                    <tbody className='bg-white divide-y divide-gray-200'>
                      {currentInvoices?.map((invoice: any, idx: any) => (
                        <tr key={`invoice-list-${idx}`} className="text-xs bg-white border-b shadow-none group border-slate-200 hover:shadow hover:bg-gray-100">
                          <td className="px-3 py-3 text-[13px] text-gray-500 whitespace-nowrap">
                            <div onClick={() => downloadOrderInvoice(invoice)} className='flex items-center gap-2 font-medium cursor-pointer text-sky-500 '>
                              <img className="w-5 h-5" src="/images/pdf-new.png" alt="" />{invoice?.customNo}
                            </div>
                          </td>
                          <td className="px-3 py-3 text-[13px] text-gray-500 whitespace-nowrap">{moment(new Date(invoice?.invoiceDate)).format(DATE_FORMAT)}</td>
                          <td className="px-3 py-3 text-[13px] font-medium cursor-pointer text-sky-500 hover:text-sky-600 whitespace-nowrap">
                            <Link href={`/my-account/orders/${invoice?.orderId}`} passHref>
                              {invoice?.orderNo}
                            </Link>
                          </td>
                          <td className="px-3 py-3 text-[13px] text-gray-500 whitespace-nowrap"> {invoice?.currencySymbol}{invoice?.grandTotal} </td>
                          <td className="px-3 py-3 text-[13px] text-gray-500 whitespace-nowrap"> {invoice?.currencySymbol}{invoice?.paidAmount} </td>
                          <td align='right' className="px-3 py-3 text-[13px] text-gray-500 whitespace-nowrap">
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
                {data?.result?.length > 10 &&
                  <div className="flex justify-center mt-4 space-x-2">
                    {Array.from({ length: totalPages }, (_, index) => (
                      <button key={index} className={`mx-1 w-8 h-8 text-sm font-semibold rounded-full ${currentPage === index + 1 ? 'bg-black text-white' : 'bg-gray-100 text-gray-800'}`} onClick={() => handlePageChange(index + 1)} >
                        {index + 1}
                      </button>
                    ))}
                  </div>
                }
              </>
            ) : (
              <div>
                <h3>No Invoice Available</h3>
              </div>
            )}
          </>
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