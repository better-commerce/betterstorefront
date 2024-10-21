// Base Imports
import React from 'react'

// Package Imports
import Link from "next/link";

// Other Imports
import { useUI } from '@components/ui';
import { Guid } from '@commerce/types';
import { DocumentIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useTranslation } from '@commerce/utils/use-translation'
import { TransferIcon, } from '@components/shared/icons';
import TransferSm from '@components/shared/icons/TransferSm';
import { ArrowPathRoundedSquareIcon, PencilSquareIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/router';

const BasketList = ({ baskets, openMiniBasket, deleteBasket, openTransferBasketModal }: any) => {
  const { setBasketId } = useUI()
  const router = useRouter()
  const translate = useTranslation()

  if (!baskets || (baskets && !baskets?.length)) {
    return null
  }
  let index = 0

  return (
    <>
      {baskets?.length > 0 &&
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 pl-3 pr-3 text-[13px] font-semibold text-left text-gray-900 sm:pl-4">Baskets</th>
                <th className="px-3 py-3 text-[13px] font-semibold text-left text-gray-900">Item Count</th>
                <th className="relative py-3 pl-3 pr-3 sm:pr-4"><span className="sr-only">Action</span></th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {baskets?.map((basket: any) => {
                let basketName = basket?.name
                if (!basketName) {
                  basketName = `${translate('label.b2b.basket.Unnamed')} ${index + 1}`
                  index = index + 1
                }
                return (
                  <tr key={basket?.recordId} className="text-xs bg-white border-b shadow-none border-slate-200 hover:shadow hover:bg-gray-100">
                    <td className="py-2 pl-3 pr-3 text-[13px] font-medium text-gray-900 whitespace-nowrap sm:pl-4">
                      <Link key={basket?.id} title={basketName} passHref href="#" className="flex items-center justify-between w-full rounded-lg text-sky-500 hover:text-sky-600 dark:hover:bg-neutral-700 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50" onClick={(ev: any) => {
                        ev.preventDefault()
                        ev.stopPropagation()
                        if (basket?.id && basket?.id !== Guid.empty) {
                          setBasketId(basket?.id)
                          openMiniBasket(basket)
                        }
                      }}>{basketName}</Link>
                    </td>
                    <td className="px-3 py-2 text-[13px] text-gray-500 whitespace-nowrap">{basket?.lineItems?.filter((item: any) => item?.price?.raw?.withTax > 0)?.length ?? 0}</td>
                    <td className="relative py-2 pl-3 pr-4 text-[13px] font-medium text-right whitespace-nowrap sm:pr-4">
                      {!basket?.isLocked && (
                        <div className='flex items-center justify-end flex-shrink-0 gap-4 capitalize text-neutral-500 dark:text-neutral-300'>
                          <button className='px-2 py-1 text-xs text-black bg-white border border-gray-400 rounded-full hover:border-black hover:bg-black hover:text-white' onClick={(ev: any) => {
                            ev.preventDefault()
                            ev.stopPropagation()
                            router.push(`/my-account/request-for-quote/${basket?.id}`)
                          }}>
                            Create RFQ
                          </button>

                          <button className='opacity-40 hover:opacity-100' title='Transfer Basket' onClick={(ev: any) => {
                            ev.preventDefault()
                            ev.stopPropagation()
                            openTransferBasketModal()
                          }}>
                            <TransferIcon className="w-5 h-5 text-sm font-semibold opacity-50 cursor-pointer text-sky-600 hover:text-sky-800" />
                          </button>
                          <TrashIcon className="w-4 h-4 text-gray-400 cursor-pointer stroke-2 hover:text-red-500" onClick={(ev: any) => {
                            ev.preventDefault()
                            ev.stopPropagation()
                            deleteBasket(basket?.id)
                          }} />
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      }
    </>
  )
}

export default BasketList