import Spinner from '@components/ui/Spinner'
import React, { useState, useEffect } from 'react'
import { useTranslation } from '@commerce/utils/use-translation'
import { DATE_FORMAT, QuoteStatus } from '@components/utils/constants'
import moment from 'moment'
import { EyeIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/router'
import Link from 'next/link'

function B2BQuotes({ quotes }: any) {
  const translate = useTranslation()
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1)
  const quotesPerPage = 10
  const quotesList = quotes?.filter((item: any) => item?.status != QuoteStatus.DRAFT)
  const totalQuotes = quotesList?.length || 0
  const totalPages = Math.ceil(totalQuotes / quotesPerPage)
  const indexOfLastQuote = currentPage * quotesPerPage
  const indexOfFirstQuote = indexOfLastQuote - quotesPerPage
  const currentQuotes = quotesList?.slice(indexOfFirstQuote, indexOfLastQuote)
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    router.push(`?page=${page}`, undefined, { shallow: true }) // Update the URL with the current page
  }
  useEffect(() => {
    const pageFromQuery = parseInt(router.query.page as string) || 1
    setCurrentPage(pageFromQuery)
  }, [router.query.page])

  return (
    <section className="w-full">
      {!quotes ? (<Spinner />) : (
        <>
          <div className="mt-4 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 pl-3 pr-3 text-[13px] font-semibold text-left text-gray-900 sm:pl-4">Quote No.</th>
                  <th className="px-3 py-3 text-[13px] font-semibold text-left text-gray-900">RFQ No.</th>
                  <th className="px-3 py-3 text-[13px] font-semibold text-left text-gray-900">User</th>
                  <th className="px-3 py-3 text-[13px] font-semibold text-left text-gray-900">Valid Until</th>
                  <th className="px-3 py-3 text-[13px] font-semibold text-left text-gray-900">Validity</th>
                  <th className="px-3 py-3 text-[13px] font-semibold text-right text-gray-900">Status</th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {currentQuotes?.map((quote: any, Idx: any) => {
                  return (
                    <tr key={`quote-list-${Idx}`} className="text-xs bg-white border-b shadow-none group border-slate-200 hover:shadow hover:bg-gray-100">
                      <td className="py-3 pl-3 pr-3 text-[13px] font-medium cursor-pointer text-sky-500 whitespace-nowrap sm:pl-4 hover:text-sky-600">
                        <Link href={`/my-account/my-company/quotes/${quote?.quoteId}`}>
                          {quote?.customQuoteNo}
                        </Link>
                      </td>
                      <td className="px-3 py-3 text-[13px] font-medium cursor-pointer text-sky-500 sm:pl-4 hover:text-sky-600 whitespace-nowrap">
                        <Link href={`/my-account/request-for-quote/rfq/${quote?.rfqId}`}>
                          {quote?.rfqNumber}
                        </Link>
                      </td>
                      <td className="flex flex-col gap-0 px-3 py-3 text-[13px] font-medium text-black">
                        <span> {quote?.userName}</span>
                        <span className="font-Inter font-light leading-4 text-xs text-gray-500 tracking-[2%]">
                          {quote?.email}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-[13px] text-gray-500 whitespace-nowrap">
                        {quote?.status != QuoteStatus.CONVERTED && quote?.status != QuoteStatus.PAYMENT_LINK_SENT &&
                          moment(new Date(quote?.validUntil)).format(DATE_FORMAT)
                        }
                      </td>
                      <td className="px-3 py-3 text-[13px] text-gray-500 whitespace-nowrap">
                        {quote?.status != QuoteStatus.CONVERTED && quote?.status != QuoteStatus.PAYMENT_LINK_SENT &&
                          (() => {
                            const validUntilDate = moment(new Date(quote?.validUntil));
                            const currentDate = moment();
                            let validDays = validUntilDate.diff(currentDate, 'days') + 1; // Add 1 to include both dates

                            // Ensure validDays does not go below 0
                            validDays = validDays < 0 ? 0 : validDays;

                            return `${validDays} ${translate('label.product.productSidebar.daysText')}`;
                          })()
                        }
                      </td>

                      <td align='right' className="px-3 py-3 text-[13px] font-semibold text-gray-500 whitespace-nowrap">
                        {
                          quote?.status == QuoteStatus.ABANDONED ?
                            <span className='px-3 py-1 text-xs text-red-600 bg-red-200 border border-red-400 rounded-full'>Abandoned</span> :
                            quote?.status == QuoteStatus.CANCELLED ?
                              <span className='px-3 py-1 text-xs text-red-600 bg-red-200 border border-red-400 rounded-full'>Cancelled</span> :
                              quote?.status == QuoteStatus.CONVERTED ?
                                <span className='px-3 py-1 text-xs border rounded-full text-emerald-600 bg-emerald-200 border-emerald-400'>Converted</span> :
                                quote?.status == QuoteStatus.DRAFT ?
                                  <span className='px-3 py-1 text-xs text-gray-600 bg-gray-200 border border-gray-400 rounded-full'>Draft</span> :
                                  quote?.status == QuoteStatus.NOT_QUOTE ?
                                    <span className='px-3 py-1 text-xs text-gray-600 bg-gray-100 border border-gray-400 rounded-full'>Not Quote</span> :
                                    quote?.status == QuoteStatus.PAYMENT_LINK_SENT ?
                                      <span className='px-3 py-1 text-xs border rounded-full text-sky-600 bg-sky-200 border-sky-400'>Payment Link Sent</span> :
                                      quote?.status == QuoteStatus.QUOTE_SENT ?
                                        <span className='px-3 py-1 text-xs text-purple-600 bg-purple-100 border border-purple-400 rounded-full'>Quote Sent</span> : ''
                        }
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          {quotesList?.length > 10 &&
            <div className="flex justify-center mt-6">
              {Array.from({ length: totalPages }, (_, index) => (
                <button key={index + 1} onClick={() => handlePageChange(index + 1)} className={`mx-1 w-8 h-8 text-sm font-semibold rounded-full ${currentPage === index + 1 ? 'bg-black text-white' : 'bg-gray-100 text-gray-800'}`} >
                  {index + 1}
                </button>
              ))}
            </div>
          }
        </>
      )}
    </section>
  )
}

export default B2BQuotes
