import { useEffect, useState } from 'react'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import withAuth from '@components/utils/withAuth'
import { useUI } from '@components/ui/context'
import React from 'react'
import { isB2BUser } from '@framework/utils/app-util'
import { useTranslation } from '@commerce/utils/use-translation'
import LayoutAccount from '@components/Layout/LayoutAccount'
import { EyeIcon } from "@heroicons/react/24/outline";
import { useRouter } from 'next/router'
import axios from 'axios'
import { DATE_FORMAT, NEXT_GET_ALL_RFQ } from '@components/utils/constants'
import Spinner from '@components/ui/Spinner'
import moment from 'moment'

function formatISODate(date: any) { return date.toISOString(); }

// Calculate default dates
const today = new Date();
const fromDate = new Date(today);
fromDate.setDate(today.getDate() - 30);

const toDate = new Date(today);
toDate.setDate(today.getDate() + 30);

function RequestQuote() {
  const { user, changeMyAccountTab } = useUI()
  const [isLoading, setIsLoading] = useState(true)
  const translate = useTranslation()
  const [rfqData, setRfqData] = useState<any>([]);
  const router = useRouter()

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
        pageSize: 40,
      }
      fetchAllRFQ(data);
    } else {
      router.push('/')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  if (isLoading) { return (<Spinner />) }

  return (
    rfqData?.length > 0 ? (
      <div>
        <div className=''>
          <h1 className="text-2xl font-semibold sm:text-3xl dark:text-black">
            Request for Quote (RFQ)
          </h1>
        </div>
        <div className="overflow-hidden border my-7 rounded-2xl border-slate-200">
          <table className="min-w-full text-left">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-2 py-3 text-sm font-semibold text-left border border-slate-200">RFQ No.</th>
                <th className="px-2 py-3 text-sm font-semibold text-left border border-slate-200">{translate('label.myAccount.rfq.poNumber')}</th>
                <th className="px-2 py-3 text-sm font-semibold text-right border border-slate-200">{translate('label.myAccount.rfq.status')}</th>
                <th className="px-2 py-3 text-sm font-semibold text-right border border-slate-200">{translate('label.myAccount.rfq.createdAt')}</th>
                <th className="w-20 px-2 py-3 text-sm font-semibold text-left border border-slate-200"></th>
              </tr>
            </thead>
            <tbody>
              {rfqData?.map?.((rfq: any) => (
                <tr key={rfq.rfqNumber} className="text-xs bg-white border-b shadow-none group border-slate-200 hover:shadow hover:bg-gray-100">
                  <td className="px-2 py-3 text-sm font-medium text-left cursor-pointer text-sky-600" onClick={() => navigateToRFQ(rfq?.recordId)}>{rfq?.rfqNumber}</td>
                  <td className="px-2 py-3 text-sm text-left">{rfq?.poNumber}</td>
                  <td className="px-2 py-3 text-sm text-right">
                    <span className={`px-2 py-1 text-[10px] font-semibold leading-none truncate rounded-full ${rfq?.status == "QuoteCreated" ? 'label-confirmed' : (rfq?.status == "Submitted" || rfq?.status == "Received") ? 'label-blue' : rfq?.status == "Cancelled" ? 'label-Cancelled' : 'label-pending'}`}>
                      {rfq?.status == "QuoteCreated" ? 'Quote Created' : (rfq?.status == "Submitted" || rfq?.status == "Received") ? 'Submitted' : rfq?.status == "Cancelled" ? 'Cancelled' : ''}
                    </span>
                  </td>
                  <td className="px-2 py-3 text-sm text-right">{moment(new Date(rfq?.created)).format(DATE_FORMAT)}</td>
                  <td className="px-2 py-3 text-sm" align='right'>
                    <button className="flex text-black" onClick={() => navigateToRFQ(rfq?.recordId)}>
                      <EyeIcon className="hidden w-4 h-4 text-black group-hover:flex" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>) : <div className="p-4 text-center">{translate('label.myAccount.rfq.noRequestForQuoteFound')}</div>)
}

RequestQuote.LayoutAccount = LayoutAccount
export default withDataLayer(withAuth(RequestQuote), PAGE_TYPES.RequestQuote, true, LayoutAccount)
