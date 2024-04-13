"use client";

import dynamic from "next/dynamic";
import { Popover, Transition } from "@headlessui/react";
import React, { useMemo, Fragment, useState, useEffect } from "react";
import Link from "next/link";
import useCart from '@components/services/cart'
import { getCurrentPage, isB2BUser } from "@framework/utils/app-util";
import { recordGA4Event } from "@components/services/analytics/ga4";
import { useUI, basketId as generateBasketId } from '@components/ui/context'
import { useTranslation } from '@commerce/utils/use-translation'
import { LoadingActionType, NEXT_CREATE_BASKET } from "@components/utils/constants";
import axios from "axios";
import { matchStrings } from "@framework/utils/parse-util";
import { Guid } from "@commerce/types";

const BasketList = dynamic(() => import('@components/Header/BasketList'))
const AddBasketModal = dynamic(() => import('@components/AddBasketModal'))
const DeleteBasketModal = dynamic(() => import('@components/DeleteBasketModal'))

export default function CartDropdown() {
  const { getUserCarts, deleteCart } = useCart()
  const { isGuestUser, user, basketId, cartItems, openCart } = useUI()
  const b2bUser = useMemo(() => { return isB2BUser(user) }, [user])
  const translate = useTranslation()
  const [loadingAction, setLoadingAction] = useState(LoadingActionType.NONE)
  const [basketIdToDelete, setBasketIdToDelete] = useState<string>(Guid.empty)
  const [isCreateBasketModalOpen, setIsCreateBasketModalOpen] = useState<boolean>(false)
  const [isDeleteBasketModalOpen, setIsDeleteBasketModalOpen] = useState<boolean>(false)
  const [userCarts, setUserCarts] = useState<any>()
  let currentPage = getCurrentPage()

  const viewCart = (cartItems: any) => {
    if (currentPage) {
      if (typeof window !== 'undefined') {
        recordGA4Event(window, 'view_cart', {
          ecommerce: {
            items: cartItems?.lineItems?.map((items: any, itemId: number) => ({
              item_name: items?.name,
              item_id: items?.sku,
              price: items?.price?.raw?.withTax,
              item_brand: items?.brand,
              item_category2: items?.categoryItems?.length ? items?.categoryItems[1]?.categoryName : '',
              item_variant: items?.colorName,
              item_list_name: items?.categoryItems?.length ? items?.categoryItems[0]?.categoryName : '',
              item_list_id: '',
              index: itemId,
              quantity: items?.qty,
              item_var_id: items?.stockCode,
            })),
            current_page: currentPage,
          },
        })
      }
    }
  }

  const openMiniBasket = (basket: any) => {
    viewCart(basket);
    openCart();
  }

  const handleDeleteBasket = async () => {
    await deleteCart({ basketId: basketIdToDelete })
    if (!isGuestUser && user?.userId && user?.userId !== Guid.empty) {
      getBaskets(user?.userId)
    }
    closeDeleteBasketModal()
  }

  const b2bBasketConfig: any = [
    {
      id: 'createBasket',
      href: '#',
      title: translate('label.b2b.basket.createBasketLinkText'),
      className: 'max-w-xs text-black text-left flex-1 font-medium py-3 px-2 flex sm:w-full',
      head: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
          <g id="surface1">
            <path d="M 3.4375 5.375 L 7.417969 5.375 L 7.417969 4.5625 C 7.417969 3.308594 7.933594 2.167969 8.757812 1.339844 C 9.585938 0.515625 10.726562 0 11.984375 0 C 13.238281 0 14.382812 0.515625 15.207031 1.339844 C 16.035156 2.167969 16.546875 3.308594 16.546875 4.5625 L 16.546875 5.375 L 20.5625 5.375 C 20.804688 5.375 21.023438 5.472656 21.179688 5.632812 L 21.222656 5.679688 C 21.355469 5.835938 21.4375 6.035156 21.4375 6.25 L 21.4375 20.863281 C 21.4375 21.722656 21.085938 22.507812 20.515625 23.078125 C 19.945312 23.644531 19.160156 24 18.300781 24 L 5.699219 24 C 4.839844 24 4.054688 23.644531 3.484375 23.078125 C 2.914062 22.507812 2.5625 21.726562 2.5625 20.863281 L 2.5625 6.25 C 2.5625 6.007812 2.660156 5.789062 2.820312 5.632812 C 2.976562 5.472656 3.195312 5.375 3.4375 5.375 Z M 11.402344 12.976562 C 11.402344 12.644531 11.667969 12.375 12 12.375 C 12.332031 12.375 12.597656 12.644531 12.597656 12.976562 L 12.597656 14.910156 L 14.53125 14.910156 C 14.863281 14.910156 15.128906 15.175781 15.128906 15.507812 C 15.128906 15.835938 14.863281 16.105469 14.53125 16.105469 L 12.597656 16.105469 L 12.597656 18.039062 C 12.597656 18.371094 12.332031 18.636719 12 18.636719 C 11.667969 18.636719 11.402344 18.371094 11.402344 18.039062 L 11.402344 16.105469 L 9.46875 16.105469 C 9.136719 16.105469 8.871094 15.835938 8.871094 15.507812 C 8.871094 15.175781 9.136719 14.910156 9.46875 14.910156 L 11.402344 14.910156 Z M 8.53125 5.375 L 15.433594 5.375 L 15.433594 4.5625 C 15.433594 3.617188 15.046875 2.753906 14.421875 2.128906 C 13.796875 1.5 12.933594 1.113281 11.984375 1.113281 C 11.035156 1.113281 10.171875 1.5 9.546875 2.128906 C 8.921875 2.753906 8.53125 3.617188 8.53125 4.5625 Z M 7.417969 7.535156 L 7.417969 6.488281 L 3.675781 6.488281 L 3.675781 20.863281 C 3.675781 21.417969 3.902344 21.921875 4.269531 22.289062 C 4.636719 22.660156 5.144531 22.886719 5.699219 22.886719 L 18.300781 22.886719 C 18.855469 22.886719 19.359375 22.65625 19.726562 22.289062 C 20.09375 21.921875 20.324219 21.417969 20.324219 20.863281 L 20.324219 6.488281 L 16.546875 6.488281 L 16.546875 7.546875 C 16.960938 7.753906 17.246094 8.183594 17.246094 8.679688 C 17.246094 9.382812 16.675781 9.949219 15.972656 9.949219 C 15.269531 9.949219 14.699219 9.382812 14.699219 8.679688 C 14.699219 8.167969 15 7.730469 15.433594 7.527344 L 15.433594 6.488281 L 8.53125 6.488281 L 8.53125 7.539062 C 8.953125 7.746094 9.242188 8.179688 9.242188 8.679688 C 9.242188 9.382812 8.675781 9.949219 7.972656 9.949219 C 7.269531 9.949219 6.699219 9.382812 6.699219 8.679688 C 6.699219 8.175781 6.992188 7.738281 7.417969 7.535156 Z M 7.417969 7.535156 " />
          </g>
        </svg>
      ),
      onClick: (ev: any) => {
        ev.preventDefault()
        ev.stopPropagation()
        openCreateBasketModal()
      },
      enabled: true
    },
    {
      id: 'deleteBasket',
      href: '#',
      title: translate('label.b2b.basket.deleteBasketLinkText'),
      className: 'max-w-xs text-black text-left flex-1 op-75 py-3 px-2 flex font-medium sm:w-full',
      head: (
        <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
          width="24.000000px" height="24.000000px" viewBox="0 0 24.000000 24.000000"
          preserveAspectRatio="xMidYMid meet">
          <g transform="translate(0.000000,24.000000) scale(0.100000,-0.100000)"
            fill="#000000" stroke="none">
            <path d="M84 215 c-9 -14 -25 -25 -36 -25 -17 0 -19 -7 -16 -92 l3 -93 85 0
          85 0 3 93 c3 85 1 92 -16 92 -11 0 -27 11 -36 25 -9 14 -25 25 -36 25 -11 0
          -27 -11 -36 -25z m50 9 c28 -11 18 -34 -14 -34 -18 0 -30 5 -30 13 0 25 15 32
          44 21z m16 -66 c0 -10 5 -18 10 -18 6 0 10 9 10 20 0 13 5 18 15 13 13 -4 15
          -20 13 -82 l-3 -76 -75 0 -75 0 -3 78 c-2 64 0 77 13 77 8 0 15 -7 15 -15 0
          -8 5 -15 10 -15 6 0 10 8 10 18 0 12 8 17 30 17 22 0 30 -5 30 -17z"/>
            <path d="M103 83 c9 -2 25 -2 35 0 9 3 1 5 -18 5 -19 0 -27 -2 -17 -5z" />
          </g>
        </svg>
      ),
      onClick: (ev: any) => {
        ev.preventDefault()
        ev.stopPropagation()
      },
      enabled: false
    },
    {
      id: 'listBasket',
      href: '#',
      title: translate('label.b2b.basket.listBasketsHeadingText'),
      className: 'max-w-xs text-black text-left flex-1 op-75 py-3 px-2 flex font-medium sm:w-full',
      head: null,
      onClick: (ev: any) => {
        ev.preventDefault()
        ev.stopPropagation()
      },
      enabled: true
    },
  ]

  const getBaskets = async (userId: string) => {
    const userCarts = await getUserCarts({ userId })
    setUserCarts(userCarts)
  }

  const handleCreateBasket = async (basketName: string) => {
    if (basketName) {
      const oldBasketId = JSON.parse(JSON.stringify(basketId))
      setLoadingAction(LoadingActionType.CREATE_BASKET)
      const newBasketId = generateBasketId(true)
      const { data: createBasketResult }: any = await axios.post(NEXT_CREATE_BASKET, { basketId: newBasketId, basketName, })
      if (createBasketResult?.message && matchStrings(createBasketResult?.message, "Product Added Successfully", true)) {
        closeCreateBasketModal()

        if (!isGuestUser && user?.userId && user?.userId !== Guid.empty) {
          getBaskets(user?.userId)
        }
      } else {
        setLoadingAction(LoadingActionType.NONE)
      }
      //console.log(createBasketResult)
    }
  }
  const deleteBasket = async (basketId: string) => {
    if (basketId && basketId !== Guid.empty) {
      setBasketIdToDelete(basketId)
    }
  }
  const openCreateBasketModal = () => setIsCreateBasketModalOpen(true)
  const closeCreateBasketModal = () => {
    setLoadingAction(LoadingActionType.NONE)
    setIsCreateBasketModalOpen(!isCreateBasketModalOpen)
  }

  const openDeleteBasketModal = () => setIsDeleteBasketModalOpen(true)
  const closeDeleteBasketModal = () => {
    setLoadingAction(LoadingActionType.NONE)
    setIsDeleteBasketModalOpen(!isDeleteBasketModalOpen)
    setBasketIdToDelete(Guid.empty)
  }

  useEffect(() => {

    if (!isGuestUser && user?.userId && user?.userId !== Guid.empty) {
      getBaskets(user?.userId)
    }
  }, [user?.userId])

  useEffect(() => {
    if (basketIdToDelete !== Guid.empty) {
      openDeleteBasketModal()
    }
  }, [basketIdToDelete])

  return (
    <>
      <Popover className="relative">
        {({ open, close }) => (
          <>
            {b2bUser ? (
              <>
                <Popover.Button className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none flex items-center justify-center`} >
                  <>
                    {/*{cartItems?.lineItems?.length > 0 && (
                    <div className="w-3.5 h-3.5 flex items-center justify-center bg-primary-500 absolute top-1.5 right-1.5 rounded-full text-[10px] leading-none text-white font-medium">
                      {cartItems?.lineItems?.length}
                    </div>
                  )}*/}
                    <img src="/images/cartIcon.svg" className="w-6 h-6" />
                  </>

                </Popover.Button>
                <Transition as={Fragment} enter="transition ease-out duration-200" enterFrom="opacity-0 translate-y-1" enterTo="opacity-100 translate-y-0" leave="transition ease-in duration-150" leaveFrom="opacity-100 translate-y-0" leaveTo="opacity-0 translate-y-1" >
                  <Popover.Panel className="absolute z-10 w-screen max-w-[260px] px-4 mt-3.5 -right-10 sm:right-0 sm:px-0">
                    <div className="overflow-hidden shadow-lg rounded-3xl ring-1 ring-black ring-opacity-5">
                      <div className="relative grid grid-cols-1 gap-6 px-6 bg-white dark:bg-neutral-800 py-7">
                        {
                          b2bBasketConfig?.filter((item: any) => item?.enabled)?.map((item: any) => {

                            if (item?.id === 'listBasket' && !userCarts?.length) {
                              return
                            }

                            return (
                              <Link key={item?.title} title={item?.id} passHref href="#" className="flex items-center p-2 -m-3 transition duration-150 ease-in-out rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50" onClick={(ev: any) => {
                                if (item?.onClick) {
                                  item?.onClick(ev)
                                }

                                if (item?.id !== 'listBasket') {
                                  close()
                                }
                              }}>
                                {item?.head && (
                                  <div className={`flex items-center justify-center flex-shrink-0 capitalize text-neutral-500 dark:text-neutral-300 ${item?.id === 'deleteBasket' ? '' : ''}`}>
                                    {item?.head}
                                  </div>
                                )}

                                <div className={item?.head ? 'ml-4' : ''}>
                                  <p className="text-sm font-medium capitalize">
                                    {item?.title}
                                    {/*{item?.id === 'listBasket' && (
                                      <div className="w-6 h-6 flex items-center justify-center bg-primary-500  rounded-full text-[14px] leading-none text-white font-medium">
                                        {userCarts?.length}
                                      </div>
                                    )}*/}
                                  </p>
                                </div>
                              </Link>
                            )
                          })
                        }

                        {
                          (userCarts?.length > 0) && (
                            <BasketList baskets={userCarts} openMiniBasket={openMiniBasket} deleteBasket={deleteBasket} />
                          )
                        }
                      </div>
                    </div>
                  </Popover.Panel>
                </Transition>
              </>
            ) : (
              <Popover.Button onClick={() => openMiniBasket(cartItems)} className={` ${open ? "" : "text-opacity-90"} group w-10 h-10 sm:w-12 sm:h-12 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full inline-flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 relative`}>
                {cartItems?.lineItems?.length > 0 && (
                  <div className="w-3.5 h-3.5 flex items-center justify-center bg-primary-500 absolute top-1.5 right-1.5 rounded-full text-[10px] leading-none text-white font-medium">
                    {cartItems?.lineItems?.length}
                  </div>
                )}
                <span className="sr-only">{translate('label.basket.itemsCartViewBagText')}</span>
                <img src="/images/cartIcon.svg" className="w-6 h-6" />
              </Popover.Button>
            )}
          </>
        )}
      </Popover>

      <AddBasketModal isOpen={isCreateBasketModalOpen} closeModal={closeCreateBasketModal} loadingAction={loadingAction} handleCreateBasket={handleCreateBasket} setLoadingAction={setLoadingAction} />
      <DeleteBasketModal isOpen={isDeleteBasketModalOpen} closeModal={closeDeleteBasketModal} loadingAction={loadingAction} handleDeleteBasket={handleDeleteBasket} setLoadingAction={setLoadingAction} />
    </>
  );
}
