import { Square2StackIcon } from '@heroicons/react/24/outline'
import { GiftIcon } from '@heroicons/react/24/outline'
import React, { useState } from 'react'
import { useTranslation } from '@commerce/utils/use-translation'

interface Currency {
  currencySymbol: string
}

interface Promotion {
  code: string
  name: string
  additionalInfo1?: string
  additionalInfo6?: string
  additionalInfo8: string
}

interface Offers {
  availablePromotions?: Promotion[]
}

interface AvailableOffersProps {
  currency?: Currency
  offers?: Offers
  key?: string
}

export default function AvailableOffers({ currency, offers, key }: AvailableOffersProps) {
  const translate = useTranslation()
  const [isCopied, showCopied] = useState(false)
  const [copyData, setCode] = useState<string>()

  const copyCode = (code: string) => {
    if (!code) return
    
    navigator.clipboard.writeText(code)
    showCopied(true)
    setCode(code)
    setTimeout(() => {
      showCopied(false)
    }, 3000)
  }

  // Early return if no offers available
  if (!offers?.availablePromotions?.length) {
    return null
  }

  return (
    <section key={key} aria-labelledby="details-heading" className="mt-2 w-full sm:mt-2 ipad-border-none-pdp">
      <div className="flex flex-col px-0 py-2 pr-0 pt-0 sm:pr-0 gap-x-4 sm:px-0 offeres">
        <div className="flex flex-col gap-4">
          {offers.availablePromotions.map((saving: Promotion, sid: number) => {
            if (saving?.additionalInfo8 !== 'False') {
              return null
            }

            return (
              <div 
                key={`promo-${sid}-best-available-${saving?.code || sid}`} 
                className="border rounded-lg bg-white p-0 pb-2 flex flex-col gap-2 shadow-sm max-w-md"
              >
                <div className="flex items-center gap-2 mb-1 bg-[#F5F5F5] rounded-t-md px-3 py-2">
                  <GiftIcon className="w-4 h-4 text-[#1E1E1E]" />
                  <span className="font-semibold text-[#1E1E1E] text-sm">
                    {saving?.name || 'Offer'}
                  </span>
                </div>
                
                {saving?.code && (
                  <div className="flex items-center gap-2 px-3 mb-1">
                    <span className="text-xs font-medium text-gray-700">Use code:</span>
                    <span className="font-semibold text-black text-sm bg-gray-100 px-2 py-1 rounded">
                      {saving.code}
                    </span>
                    <button 
                      onClick={() => copyCode(saving.code)} 
                      className="ml-1 p-1 rounded hover:bg-gray-200"
                      aria-label="Copy code"
                    >
                      <Square2StackIcon className="w-4 h-4 text-blue-600" />
                    </button>
                    {isCopied && copyData === saving.code && (
                      <span className="text-green-600 text-xs ml-2">
                        {translate('label.product.copiedText')}
                      </span>
                    )}
                  </div>
                )}
                
                {saving?.additionalInfo1 && (
                  <div className="flex items-center gap-2 mb-1 px-3">
                    <span className="text-green-600 font-semibold text-sm">
                      Save {currency?.currencySymbol || ''}{saving.additionalInfo1}
                    </span>
                  </div>
                )}
                
                {saving?.additionalInfo6 && (
                  <p className="text-xs text-gray-700 px-3">{saving.additionalInfo6}</p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
