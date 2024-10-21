// Base Imports
import { Fragment, useEffect, useState } from 'react'

// Package Imports
import { Dialog, Transition } from '@headlessui/react'

// Component Imports
import { useUI } from '@components/ui'

// Other Imports
import { Guid } from '@commerce/types'
import { useTranslation } from '@commerce/utils/use-translation'
import useCart from '@components/services/cart'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { AddBasketIcon } from '@components/shared/icons'

const CreateRFQModal = ({ isOpen, closeModal, openMiniBasket, openCreateBasketModal }: any) => {
    const translate = useTranslation()
    const { getUserCarts } = useCart()
    const [userCarts, setUserCarts] = useState<any>()
    const [useExistingBasket, setUseExistingBasket] = useState(false);
    const { isGuestUser, user, setBasketId } = useUI()
    const router = useRouter()

    useEffect(() => {
        if (!isGuestUser && user?.userId && user?.userId !== Guid.empty) {
            getBaskets(user?.userId)
        }
    }, [user?.userId])

    const getBaskets = async (userId: string) => {
        const userCarts = await getUserCarts({ userId })
        setUserCarts(userCarts)
    }
    const handleCloseModal = () => {
        setUseExistingBasket(false) // Reset the state here
        closeModal()
    }

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog
                as="div"
                open={isOpen}
                className="relative z-9999"
                onClose={handleCloseModal}
            >
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-1s00"
                    enterFrom="opacity-0"
                    enterTo="opacity-30"
                    leave="ease-in duration-100"
                    leaveFrom="opacity-30"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-50" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-full p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="transition duration-100 ease-out"
                            enterFrom="transform scale-95 opacity-0"
                            enterTo="transform scale-100 opacity-100"
                            leave="transition duration-75 ease-out"
                            leaveFrom="transform scale-100 opacity-100"
                            leaveTo="transform scale-95 opacity-0"
                        >
                            <Dialog.Panel className="w-full max-w-xl overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                                <Dialog.Title as="div" className="flex items-center justify-between w-full px-4 py-3 text-lg font-medium leading-6 text-gray-900 border-b-2 shadow xsm:text-md border-gray-50" >
                                    Select Basket
                                </Dialog.Title>

                                {userCarts?.length > 0 ?
                                    <>
                                        <div className="overflow-hidden ring-1 ring-black ring-opacity-5">
                                            <table className="min-w-full divide-y divide-gray-300">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="py-3 pl-3 pr-3 text-sm font-semibold text-left text-gray-900 sm:pl-4">Baskets</th>
                                                        <th className="px-3 py-3 text-sm font-semibold text-left text-gray-900">Item Count</th>
                                                        <th className="relative py-3 pl-3 pr-3 sm:pr-4"><span className="sr-only">Action</span></th>
                                                    </tr>
                                                </thead>
                                                <tbody className='bg-white divide-y divide-gray-200'>
                                                    {userCarts?.map((basket: any, index: number) => {
                                                        let basketName = basket?.name
                                                        if (!basketName) {
                                                            basketName = `${translate('label.b2b.basket.Unnamed')} ${index + 1}`
                                                            index = index + 1
                                                        }
                                                        return (
                                                            <tr key={basket?.recordId} className="text-xs bg-white border-b shadow-none border-slate-200 hover:shadow hover:bg-gray-100">
                                                                <td className="py-2 pl-3 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-4">
                                                                    <Link key={basket?.id} title={basketName} passHref href="#" className="flex items-center justify-between w-full rounded-lg text-sky-500 hover:text-sky-600 dark:hover:bg-neutral-700 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50" onClick={(ev: any) => {
                                                                        ev.preventDefault()
                                                                        ev.stopPropagation()
                                                                        if (basket?.id && basket?.id !== Guid.empty) {
                                                                            setBasketId(basket?.id)
                                                                            openMiniBasket(basket)
                                                                        }
                                                                    }}>{basketName}</Link>
                                                                </td>
                                                                <td className="px-3 py-2 text-sm text-gray-500 whitespace-nowrap">{basket?.lineItems?.filter((item: any) => item?.price?.raw?.withTax > 0)?.length ?? 0}</td>
                                                                <td className="relative py-2 pl-3 pr-4 text-sm font-medium text-right whitespace-nowrap sm:pr-4">
                                                                    {!basket?.isLocked && (
                                                                        <div className='flex items-center justify-end flex-shrink-0 gap-4 capitalize text-neutral-500 dark:text-neutral-300'>
                                                                            <button className='px-2 py-1 text-xs text-black bg-white border border-gray-400 rounded-full hover:border-black hover:bg-black hover:text-white' onClick={(ev: any) => {
                                                                                ev.preventDefault()
                                                                                ev.stopPropagation()
                                                                                router.push(`/my-account/request-for-quote/${basket?.id}`)
                                                                            }}>
                                                                                {translate("label.b2b.createRFQText")}
                                                                            </button>
                                                                        </div>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        )
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="flex items-center justify-between gap-2 px-4 pt-3 pb-3 mt-4 border-t border-gray-200">
                                            {
                                                (!useExistingBasket && userCarts?.length > 0) && (
                                                    <div>
                                                        {/* <div onClick={() => setUseExistingBasket(true)} className='flex justify-center gap-1 m-4 cursor-pointer select-none text-sky-500'>Use Existing Basket</div> */}
                                                        <div onClick={() => {
                                                            closeModal();
                                                            openCreateBasketModal();
                                                        }} className='flex justify-center gap-1 cursor-pointer text-sky-500'>
                                                            <AddBasketIcon /> {translate('label.b2b.basket.createBasketLinkText')}
                                                        </div>
                                                    </div>
                                                )
                                            }
                                            <button onClick={() => { handleCloseModal() }} className="nc-Button !py-2 relative h-auto inline-flex items-center justify-center rounded-full transition-colors text-sm sm:text-base font-medium px-4 sm:py-3.5 sm:px-6 ttnc-ButtonPrimary disabled:bg-opacity-90 bg-white dark:bg-slate-100 hover:bg-white !text-black border border-gray-300 hover:!border-gray-600" >
                                                {translate('common.label.cancelText')}
                                            </button>
                                        </div>
                                    </>
                                    :
                                    <div className='flex flex-col justify-center w-full gap-4 py-20'>
                                        {
                                            (!useExistingBasket && userCarts?.length > 0) && (
                                                <>
                                                    <div className='text-xl font-normal text-center text-gray-300'>No Basket Available</div>
                                                    <div onClick={() => {
                                                        closeModal();
                                                        openCreateBasketModal();
                                                    }} className='flex justify-center gap-1 cursor-pointer text-sky-500'>
                                                       <AddBasketIcon /> {translate('label.b2b.basket.createBasketLinkText')}
                                                    </div>
                                                </>
                                            )
                                        }
                                    </div>
                                }
                                {
                                    userCarts?.length == 0 && (
                                        <div>
                                            <span className="text-xl font-normal select-none text-slate-300">{translate("label.basket.noBasketAvailableText")}</span>
                                            <div onClick={() => {
                                                handleCloseModal();
                                                openCreateBasketModal();
                                            }} className='flex justify-center gap-1 m-4 cursor-pointer text-sky-500'>
                                                <AddBasketIcon /> {translate('label.b2b.basket.createBasketLinkText')}
                                            </div>
                                        </div>
                                    )
                                }
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}

export default CreateRFQModal