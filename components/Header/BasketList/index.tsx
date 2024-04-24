// Base Imports
import React from 'react'

// Package Imports
import Link from "next/link";

// Other Imports
import { useUI } from '@components/ui';
import { Guid } from '@commerce/types';
import { TrashIcon } from '@heroicons/react/24/outline';
import { useTranslation } from '@commerce/utils/use-translation'

const BasketList = ({ baskets, openMiniBasket, deleteBasket }: any) => {
    const { setBasketId } = useUI()
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
                    <Link key={basket?.id} title={basketName} passHref href="#" className="flex justify-between items-center p-2 -m-3 transition duration-150 ease-in-out rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50" onClick={(ev: any) => {
                        ev.preventDefault()
                        ev.stopPropagation()
                        if (basket?.id && basket?.id !== Guid.empty) {
                            setBasketId(basket?.id)
                            openMiniBasket(basket)
                        }
                    }}>
                        <div className='flex gap-2 items-center'>
                            <div className={`flex items-center justify-center flex-shrink-0 capitalize text-neutral-500 dark:text-neutral-300`}>
                                <div className="w-6 h-6 flex items-center justify-center bg-primary-500 top-1.5 right-1.5 rounded-full text-[14px] leading-none text-white font-medium">
                                    {basket?.lineItems?.length}
                                </div>
                            </div>
                            <p className="text-sm font-medium capitalize w-28">{basketName}</p>
                        </div>

                        {!basket?.isLocked && (
                            <div className='flex items-center justify-center flex-shrink-0 capitalize text-neutral-500 dark:text-neutral-300 z-99'>
                                <TrashIcon className="w-5 h-5 text-black stroke-2" onClick={(ev: any) => {
                                    ev.preventDefault()
                                    ev.stopPropagation()
                                    deleteBasket(basket?.id)
                                }} />
                            </div>
                        )}
                    </Link>
                )
            })
        )
    )
}

export default BasketList