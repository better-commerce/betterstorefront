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
    (baskets?.length > 0) && (
      baskets?.map((basket: any) => {
        let basketName = basket?.name
        if (!basketName) {
          basketName = `${translate('label.b2b.basket.Unnamed')} ${index + 1}`
          index = index + 1
        }
        return (
          <div className='flex justify-between p-2 transition duration-150 ease-in-out bg-white rounded-lg group hover:bg-neutral-100' key={`basket-${basket?.id}`}>
            <Link key={basket?.id} title={basketName} passHref href="#" className="flex items-center justify-between w-full rounded-lg dark:hover:bg-neutral-700 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50" onClick={(ev: any) => {
              ev.preventDefault()
              ev.stopPropagation()
              if (basket?.id && basket?.id !== Guid.empty) {
                setBasketId(basket?.id)
                openMiniBasket(basket)
              }
            }}>
              <div className='flex items-center gap-2'>
                <div className={`flex items-center justify-center flex-shrink-0 capitalize text-neutral-500 dark:text-neutral-300`}>
                  <div className="w-6 h-6 flex items-center justify-center bg-primary-500 top-1.5 right-1.5 rounded-full text-[14px] leading-none text-white font-medium">
                    {basket?.lineItems?.filter((item: any) => item?.price?.raw?.withTax > 0)?.length ?? 0}
                  </div>
                </div>
                <p className="text-sm font-medium capitalize w-28">{basketName}</p>
              </div>
            </Link>
            {!basket?.isLocked && (
              <div className='flex items-center justify-center flex-shrink-0 gap-4 capitalize text-neutral-500 dark:text-neutral-300'>
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
          </div>
        )
      })
    )
  )
}

export default BasketList