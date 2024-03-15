import Spinner from '@components/ui/Spinner'
import React, { useState } from 'react'
import QuoteDetail from './QuoteDetail'
import { useTranslation } from '@commerce/utils/use-translation'

function B2BQuotes({ quotes }: any) {
  const translate = useTranslation()
  const [quoteData, setQuoteDetail] = useState<any>(undefined)
  const [isOpen, setIsOpen] = useState(false)

  const showQuoteDetail = (quote: any) => {
    setQuoteDetail(quote)
    setIsOpen(true)
  }

  const handleCloseQuoteView = () => {
    setQuoteDetail(null)
  }

  const quoteId: any = quoteData?.quoteId

  return (
    <section className="w-full">
      {!quotes ? (<Spinner />) : (
        <>
          <div className="flex flex-col p-0 py-3 gap-y-6 sm:py-8 sm:p-0">
            {quotes?.map((quote: any, Idx: any) => (
              <div
                key={Idx}
                className="flex border-[1px] flex-col gap-y-3 px-6 py-4"
              >
                <div className="flex justify-between gap-x-6">
                  <h2 className="font-semibold leading-6 mob-font-14 sm:text-2xl font-Inter text-brand-blue">
                    {quote?.quoteName} {`(${quote?.customQuoteNo})`}
                  </h2>
                  <button className='btn-default-blue !border-2 uppercase \mr-2' onClick={() => showQuoteDetail(quote)}>{translate('common.label.viewText')}</button>
                </div>
                <div className="flex flex-col gap-y-2 sm:gap-y-0 sm:flex-row gap-x-6">
                  <span className="font-Inter uppercase font-light leading-4 mob-font-14 text-lg tracking-[2%]">
                    {`Valid Until: ${new Date(quote?.validUntil).getUTCDate()}/${new Date(quote?.validUntil).getUTCMonth() + 1
                      }/${new Date(quote?.validUntil).getUTCFullYear()}`}
                  </span>
                  <span className="font-Inter uppercase font-light leading-4 mob-font-14 text-lg tracking-[2%]">
                    {`Validity Days: ${quote?.validDays} ${translate('label.product.productSidebar.daysText')}`}
                  </span>
                </div>
                <div className="flex flex-col gap-y-2 sm:gap-y-0 sm:flex-row gap-x-6">
                  <span className="font-Inter font-light leading-4 text-sm tracking-[2%]">
                  {translate('label.companyUsers.usernameText')} {quote?.userName}
                  </span>
                  <span className="font-Inter font-light leading-4 text-sm tracking-[2%]">
                  {translate('label.companyUsers.emailText')}{quote?.email}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <QuoteDetail
            isQuoteViewOpen={Boolean(quoteData)}
            handleCloseQuoteView={handleCloseQuoteView}
            quoteId={quoteId}
            isOpen={isOpen}
            quoteData={quoteData} 
          />
        </>
      )}
    </section>
  )
}

export default B2BQuotes
