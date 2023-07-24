import Spinner from '@components/ui/Spinner'
import React from 'react'

function B2BQuotes({ quotes }: any) {
  return (
    <section className="w-full">
      {!quotes ? (
        <>
          <Spinner />
        </>
      ) : (
        <div className="flex flex-col gap-y-6 p-8">
          {quotes?.map((quote: any, Idx: any) => (
            <div
              key={Idx}
              className="flex border-[1px] flex-col gap-y-3 px-6 py-4"
            >
              <div className="flex flex-row gap-x-6">
                <h2 className="text-2xl font-Inter font-semibold text-brand-blue leading-6">
                  {quote?.quoteName} {`(${quote?.customQuoteNo})`}
                </h2>
              </div>
              <div className="flex flex-row gap-x-6">
                <span className="font-Inter uppercase font-light leading-4 text-lg tracking-[2%]">
                  {`Valid Until: ${new Date(quote?.validUntil).getUTCDate()}/${
                    new Date(quote?.validUntil).getUTCMonth() + 1
                  }/${new Date(quote?.validUntil).getUTCFullYear()}`}
                </span>
                <span className="font-Inter uppercase font-light leading-4 text-lg tracking-[2%]">
                  {`Validity Days: ${quote?.validDays} days`}
                </span>
              </div>
              <div className="flex flex-row gap-x-6">
                <span className="font-Inter font-light leading-4 text-sm tracking-[2%]">
                  Username: {quote?.userName}
                </span>
                <span className="font-Inter font-light leading-4 text-sm tracking-[2%]">
                  Email: {quote?.email}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default B2BQuotes
