import { useTranslation } from '@commerce/utils/use-translation'
import CreateRFQModal from '@components/account/RequestForQuote/createRFQModal'
import AddBasketModal from '@components/AddBasketModal'
import LayoutAccount from '@components/Layout/LayoutAccount'
import { AnalyticsEventType } from '@components/services/analytics'
import { EVENTS_MAP } from '@components/services/analytics/constants'
import useAnalytics from '@components/services/analytics/useAnalytics'
import { basketId as generateBasketId, useUI } from '@components/ui/context'
import Spinner from '@components/ui/Spinner'
import { DATE_FORMAT, EmptyGuid, LoadingActionType, NEXT_CREATE_BASKET, NEXT_GET_ALL_RFQ, QuoteStatus, SITE_ORIGIN_URL } from '@components/utils/constants'
import withAuth from '@components/utils/withAuth'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import { getCurrentPage, isB2BUser } from '@framework/utils/app-util'
import { AlertType } from '@framework/utils/enums'
import axios from 'axios'
import moment from 'moment'
import Link from 'next/link'
import Router, { useRouter } from "next/router"
import { useEffect, useState } from 'react'


function formatISODate(date: any) { return date.toISOString(); }

// Calculate default dates
const today = new Date();
const fromDate = new Date(today);
fromDate.setDate(today.getDate() - 31);

const toDate = new Date(today);
toDate.setDate(today.getDate() + 31);

function RequestQuote() {
  const { user, changeMyAccountTab, setBasketId, setAlert, openCart } = useUI()
  const [isLoading, setIsLoading] = useState(true)
  const translate = useTranslation()
  const [rfqData, setRfqData] = useState<any>([]);
  const router = useRouter()
  const [isCreateBasketModalOpen, setIsCreateBasketModalOpen] = useState<boolean>(false)
  const [isCreateRFQModalOpen, setIsCreateRFQModalOpen] = useState<boolean>(false)
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loadingAction, setLoadingAction] = useState(LoadingActionType.NONE)
  const [currentPage, setCurrentPage] = useState(1)
  const rfqPerPage = 10
  const rfqList = rfqData

  const { recordAnalytics } = useAnalytics()

  const openCreateRFQModal = () => setIsCreateRFQModalOpen(true)
  const closeCreateRFQModal = () => {
    setIsCreateRFQModalOpen(!isCreateRFQModalOpen)
  }

  const openCreateBasketModal = () => setIsCreateBasketModalOpen(true)
  const closeCreateBasketModal = () => {
    if (loadingAction === LoadingActionType.CREATE_BASKET) return
    setLoadingAction(LoadingActionType.NONE)
    setIsCreateBasketModalOpen(!isCreateBasketModalOpen)
  }
  const navigateToRFQ = (recordId: any) => {
    router.push(`/my-account/request-for-quote/rfq/${recordId}`);
  }

  useEffect(() => { changeMyAccountTab(translate('label.myAccount.myCompanyMenus.requestQuote')) }, [])

  useEffect(() => {
    if (isB2BUser(user)) {
      const fetchAllRFQ = async (data: any) => {
        const result = await axios.post(NEXT_GET_ALL_RFQ, { data })
        setRfqData(result?.data ?? []);
        setIsLoading(false)
      }
      const data = {
        companyName: user?.companyName,
        companyId: user?.companyId,
        email: user?.email,
        fromDate: formatISODate(fromDate),
        toDate: formatISODate(toDate),
        currentPage: 1,
        pageSize: 300,
      }
      fetchAllRFQ(data);
    } else {
      router.push('/')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])
  let filteredRFQs:any = []
  if (rfqData?.length > 0) {
    // Filter the RFQs based on the search term
    filteredRFQs = rfqData?.filter((rfq: any) => {
      return (
        rfq?.rfqNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rfq?.quoteNumber?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }


  // Calculate pagination variables
  const totalRFQs = filteredRFQs?.length || 0;
  const totalPages = Math.ceil(totalRFQs / rfqPerPage);
  const indexOfLastQuote = currentPage * rfqPerPage;
  const indexOfFirstQuote = indexOfLastQuote - rfqPerPage;
  const currentRFQs = filteredRFQs?.slice(indexOfFirstQuote, indexOfLastQuote);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    router.push(`?page=${page}`, undefined, { shallow: true }); // Update URL with page number
  };

  // Reset to page 1 when search term changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to the first page when a new search is made
  };
  useEffect(() => {
    const pageFromQuery = parseInt(router.query.page as string) || 1;
    setCurrentPage(pageFromQuery);
  }, [router.query.page]);

  const viewCart = (cartItems: any) => {
    if (currentPage) {
      if (typeof window !== 'undefined') {
        //debugger
        const extras = { originalLocation: SITE_ORIGIN_URL + Router.asPath }
        recordAnalytics(AnalyticsEventType.VIEW_BASKET, { ...{ ...extras }, cartItems, currentPage, itemListName: 'Cart', itemIsBundleItem: false, entityType: EVENTS_MAP.ENTITY_TYPES.Basket, })
      }
    }
  }

  const openMiniBasket = (basket: any) => {
    viewCart(basket);
    openCart();
  }

  const handleCreateBasket = async (basketName: string) => {
    if (basketName) {
      setLoadingAction(LoadingActionType.CREATE_BASKET)

      const newBasketId = generateBasketId(true)
      const { data }: any = await axios.post(NEXT_CREATE_BASKET, { basketId: newBasketId, basketName, userId: user?.userId })
      setLoadingAction(LoadingActionType.NONE)

      if (data?.recordId !== EmptyGuid) {
        setBasketId(data?.recordId)
        closeCreateBasketModal()
        setAlert({ type: AlertType.SUCCESS, msg: translate('common.message.basketCreatedSuccessfullMsg') })
      } else {
        setAlert({ type: AlertType.ERROR, msg: data?.message || translate('common.message.requestCouldNotProcessErrorMsg') })
      }
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between w-full gap-4 mb-4">
        <h1 className="text-xl font-normal sm:text-2xl dark:text-black">Request For Quote</h1>
        <div className='flex gap-3 justify-normal'>
          <input
            type="text"
            placeholder="Search by RFQ/Quote No."
            value={searchTerm}
            onChange={handleSearchChange} // Use the new handleSearchChange
            className="p-2 text-sm font-normal border border-gray-200 rounded-md w-72"
          />
          <div className="flex items-center justify-center flex-shrink-0 capitalize text-sky-500 hover:text-sky-600 dark:text-neutral-300">
            <div className="cursor-pointer font-medium text-[14px]" onClick={openCreateRFQModal}>Create RFQ</div>
          </div>
        </div>

      </div>
      {isLoading ? (<Spinner />) : (
        <>
          {rfqData?.length > 0 ? (
            <>

              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-3 pl-3 pr-3 text-[13px] font-semibold text-left text-gray-900 sm:pl-4">RFQ No.</th>
                      <th className="px-3 py-3 text-[13px] font-semibold text-left text-gray-900">Quote No.</th>
                      <th className="px-3 py-3 text-[13px] font-semibold text-left text-gray-900">User</th>
                      <th className="px-3 py-3 text-[13px] font-semibold text-left text-gray-900">Created On</th>
                      <th className="px-3 py-3 text-[13px] font-semibold text-left text-gray-900">ETA</th>
                      <th className="px-3 py-3 text-[13px] font-semibold text-left text-gray-900">Valid Days</th>
                      <th className="px-3 py-3 text-[13px] font-semibold text-right text-gray-900">{translate('label.myAccount.rfq.status')}</th>
                    </tr>
                  </thead>
                  <tbody className='bg-white divide-y divide-gray-200'>
                    {currentRFQs?.map?.((rfq: any) => (
                      <tr key={rfq?.rfqNumber} className="text-xs bg-white border-b shadow-none group border-slate-200 hover:shadow hover:bg-gray-100">
                        <td className="py-3 pl-3 pr-3 text-[13px] font-medium cursor-pointer text-sky-500 whitespace-nowrap sm:pl-4 hover:text-sky-600" onClick={() => navigateToRFQ(rfq?.id)}>{rfq?.rfqNumber}</td>
                        <td className="py-3 pl-3 pr-3 text-[13px] font-medium cursor-pointer text-sky-500 whitespace-nowrap sm:pl-4 hover:text-sky-600">
                          {rfq?.quoteStatus != QuoteStatus.DRAFT ?
                            <Link href={`/my-account/my-company/quotes/${rfq?.quoteBasketId}` || ""} passHref>
                              {rfq?.quoteNumber}
                            </Link> : <></>
                          }
                        </td>
                        <td className="flex flex-col gap-0 px-3 py-3 text-[13px] font-medium text-black">
                          <span> {rfq?.firstName}{' '}{rfq?.lastName}</span>
                          <span className="font-Inter font-light leading-4 text-xs text-gray-500 tracking-[2%]">
                            {rfq?.createdBy || rfq?.email}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-[13px] text-gray-500 whitespace-nowrap">{moment(new Date(rfq?.created)).format(DATE_FORMAT)}</td>
                        <td className="px-3 py-3 text-[13px] text-gray-500 whitespace-nowrap">{moment(new Date(rfq?.validUntil)).format(DATE_FORMAT)}</td>
                        <td className={`px-3 py-3 text-[13px] whitespace-nowrap ${rfq?.validDays > 0 ? 'text-black font-semibold' : 'text-red-300 font-normal'}`}>{rfq?.validDays > 0 ? rfq?.validDays + ' days' : 'expired'}</td>
                        <td className="px-3 py-3 text-[13px] text-gray-500 whitespace-nowrap" align='right'>
                          <span className={`px-3 py-1 text-xs font-semibold leading-none truncate rounded-full ${rfq?.quoteStatus == QuoteStatus.DRAFT && rfq?.status == "QuoteCreated" ? 'label-progress' : rfq?.status == "QuoteCreated" ? 'label-confirmed' : (rfq?.status == "Submitted" || rfq?.status == "Received") ? 'label-blue' : rfq?.status == "Cancelled" ? 'label-Cancelled' : 'label-pending'}`}>
                            {rfq?.quoteStatus == QuoteStatus.DRAFT && rfq?.status == "QuoteCreated" ? 'In Progress' : rfq?.status == "QuoteCreated" ? 'Quote Created' : (rfq?.status == "Submitted" || rfq?.status == "Received") ? 'Submitted' : rfq?.status == "Cancelled" ? 'Cancelled' : ''}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {totalRFQs > rfqPerPage && (
                <div className="flex justify-center mt-6">
                  {/* Previous Arrow */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`mx-1 w-8 h-8 text-sm font-semibold rounded-full ${currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-gray-100 text-gray-800'}`}
                  >
                    &lt;
                  </button>

                  {/* Page Numbers */}
                  {Array.from({ length: totalPages }, (_, index) => {
                    const page = index + 1;

                    if (page === 1 || page === 2 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`mx-1 w-8 h-8 text-sm font-semibold rounded-full ${currentPage === page ? 'bg-black text-white' : 'bg-gray-100 text-gray-800'}`}
                        >
                          {page}
                        </button>
                      );
                    }

                    // Ellipsis (Dots)
                    if (page === 3 && currentPage > 3) {
                      return <span key={page} className="w-8 h-8 mx-1 text-sm">...</span>;
                    }

                    if (page === totalPages - 1 && currentPage < totalPages - 2) {
                      return <span key={page} className="w-8 h-8 mx-1 text-sm">...</span>;
                    }

                    return null;
                  })}

                  {/* Next Arrow */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`mx-1 w-8 h-8 text-sm font-semibold rounded-full ${currentPage === totalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-gray-100 text-gray-800'}`}
                  >
                    &gt;
                  </button>
                </div>
              )}

            </>
          ) :
            <div className="flex flex-col justify-center w-full py-6 text-center">
              <h4 className='text-xl font-semibold text-gray-400'>{translate('label.myAccount.rfq.noRequestForQuoteFound')}</h4>
              <div className='flex items-center justify-center gap-4'></div>
            </div>
          }
        </>
      )}
      <AddBasketModal isOpen={isCreateBasketModalOpen} closeModal={closeCreateBasketModal} loadingAction={loadingAction} handleCreateBasket={handleCreateBasket} setLoadingAction={setLoadingAction} />
      <CreateRFQModal isOpen={isCreateRFQModalOpen} openCreateBasketModal={openCreateBasketModal} closeModal={closeCreateRFQModal} openMiniBasket={openMiniBasket} />
    </div>
  )
}

RequestQuote.LayoutAccount = LayoutAccount
export default withDataLayer(withAuth(RequestQuote), PAGE_TYPES.RequestQuote, true, LayoutAccount)
