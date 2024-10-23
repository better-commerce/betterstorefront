import Spinner from '@components/ui/Spinner'
import React, { useState, useEffect } from 'react'
import { useTranslation } from '@commerce/utils/use-translation'
import { DATE_FORMAT, QuoteStatus } from '@components/utils/constants'
import moment from 'moment'
import { useRouter } from 'next/router'
import Link from 'next/link'

function B2BQuotes({ quotes }: any) {
  const translate = useTranslation()
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState<string>("");
  const quotesPerPage = 10
  const quotesList = quotes?.filter((item: any) => item?.status != QuoteStatus.DRAFT)

  const filteredQuotes = quotesList?.filter((rfq: any) => {
    return (
      rfq?.rfqNumber?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
      rfq?.customQuoteNo?.toLowerCase()?.includes(searchTerm.toLowerCase())
    );
  });

  const totalQuotes = filteredQuotes?.length || 0
  const totalPages = Math.ceil(totalQuotes / quotesPerPage)
  const indexOfLastQuote = currentPage * quotesPerPage
  const indexOfFirstQuote = indexOfLastQuote - quotesPerPage
  const currentQuotes = filteredQuotes?.slice(indexOfFirstQuote, indexOfLastQuote)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    router.push(`?page=${page}`, undefined, { shallow: true }) // Update the URL with the current page
  }

  // Reset currentPage when searchTerm changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  useEffect(() => {
    const pageFromQuery = parseInt(router.query.page as string) || 1
    setCurrentPage(pageFromQuery)
  }, [router.query.page])

  return (
    <section className="w-full">
      <div className="flex items-center justify-between w-full gap-4 mb-4">
        <h1 className="text-xl font-normal sm:text-2xl dark:text-black"> Quotes </h1>
        <div className='flex gap-3 justify-normal'>
          <input
            type="text"
            placeholder="Search by Quote/RFQ No."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 text-sm font-normal border border-gray-200 rounded-md w-72"
          />
        </div>
      </div>
      {!quotes ? (<Spinner />) : (
        <>
          {currentQuotes?.length > 0 ? (
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
                          <Link href={`/my-account/my-company/quotes/${quote?.quoteId}`}>{quote?.customQuoteNo}</Link>
                        </td>
                        <td className="px-3 py-3 text-[13px] font-medium cursor-pointer text-sky-500 sm:pl-4 hover:text-sky-600 whitespace-nowrap">
                          <Link href={`/my-account/request-for-quote/rfq/${quote?.rfqId}`}>{quote?.rfqNumber}</Link>
                        </td>
                        <td className="flex flex-col gap-0 px-3 py-3 text-[13px] font-medium text-black">
                          <span> {quote?.userName}</span>
                          <span className="font-Inter font-light leading-4 text-xs text-gray-500 tracking-[2%]"> {quote?.email} </span>
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
                              let validDays = validUntilDate.diff(currentDate, 'days') + 1;
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
          ) : (
            <div className='flex flex-col items-center justify-center w-full py-6'>
              <h4 className='text-xl font-normal text-gray-300'>No Quote Available</h4>
            </div>
          )}

          {filteredQuotes?.length > quotesPerPage && (
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
      )}
    </section>
  )
}
export default B2BQuotes
