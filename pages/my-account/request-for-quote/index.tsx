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
import { NEXT_GET_ALL_RFQ } from '@components/utils/constants'
import Spinner from '@components/ui/Spinner'

function formatISODate(date:any) { return date.toISOString(); }

// Calculate default dates
const today = new Date();
const fromDate = new Date(today);
fromDate.setDate(today.getDate() - 30);

const toDate = new Date(today);
toDate.setDate(today.getDate() + 30);

const statusStyles:any = {
  Cancelled: 'text-red-600',
  Submitted: 'text-gray-600',
  QuoteCreated: 'text-emerald-600', 
};

function RequestQuote() {
  const { user, changeMyAccountTab } = useUI()
  const [isLoading, setIsLoading] = useState(true)
  const translate = useTranslation()
  const [rfqData, setRfqData] = useState<any>([]);
  const router = useRouter()

  const navigateToRFQ = (recordId:any) => {
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

  if (isLoading) { return (<Spinner/>)}

  return (
    rfqData?.length > 0 ? (
      <div className="p-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-lg font-semibold">{translate('label.myAccount.rfq.allRequestsForQuote')}</h2>
        </div>
        <div className="my-4 flex justify-between">
          <p className="text-sm text-gray-600">{translate('label.myAccount.rfq.totalRequestForQuote', { count: rfqData.length })}</p>
        </div>
        <div className="border overflow-hidden shadow-sm">
          <table className="min-w-full text-left">
            <thead>
              <tr className="bg-gray-100 text-xs text-gray-600">
                <th className="py-2 px-4">{translate('label.myAccount.rfq.status')}</th>
                <th className="py-2 px-4">{translate('label.myAccount.rfq.poNumber')}</th>
                <th className="py-2 px-4">{translate('label.myAccount.rfq.createdAt')}</th>
                <th className="py-2 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {rfqData?.map?.((rfq: any) => (
                <tr key={rfq.rfqNumber} className="text-xs border-b">
                  <td className={`py-2 px-4 ${statusStyles[rfq?.status]}`}>{rfq?.status}</td>
                  <td className="py-2 px-4">{rfq?.poNumber}</td>
                  <td className="py-2 px-4">{rfq?.created}</td>
                  <td className="py-2 px-4">
                      <button className="flex items-center text-black" onClick={() => navigateToRFQ(rfq?.recordId)}>
                       <EyeIcon className="h-5 w-5 mr-1" /> {translate('label.myAccount.rfq.view')} 
                      </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>) : <div className="text-center p-4">{translate('label.myAccount.rfq.noRequestForQuoteFound')}</div>)
}

RequestQuote.LayoutAccount = LayoutAccount
export default withDataLayer(withAuth(RequestQuote), PAGE_TYPES.RequestQuote, true, LayoutAccount)
