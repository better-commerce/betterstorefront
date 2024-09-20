"use client";

import dynamic from "next/dynamic";
import { Popover, Transition } from "@headlessui/react";
import React, { useMemo, Fragment, useState, useEffect } from "react";
import Link from "next/link";
import useCart from '@components/services/cart'
import { getCurrentPage, isB2BUser } from "@framework/utils/app-util";
import { useUI, basketId as generateBasketId } from '@components/ui/context'
import { useTranslation } from '@commerce/utils/use-translation'
import { EmptyGuid, LoadingActionType, NEXT_CREATE_BASKET, NEXT_TRANSFER_BASKET, SITE_ORIGIN_URL } from "@components/utils/constants";
import axios from "axios";
import { matchStrings } from "@framework/utils/parse-util";
import { Guid } from "@commerce/types";
import { AlertType } from '@framework/utils/enums';
import { AddBasketIcon, TransferIcon } from '@components/shared/icons';
import { TrashIcon } from '@heroicons/react/24/outline';
import BasketList from "./BasketList";
import TransferBasket from "@components/TransferBasket";
import AnalyticsEventManager from "@components/services/analytics/AnalyticsEventManager";
import { AnalyticsEventType } from "@components/services/analytics";
import Router from "next/router";

const AddBasketModal = dynamic(() => import('@components/AddBasketModal'))
const DeleteBasketModal = dynamic(() => import('@components/DeleteBasketModal'))

export default function B2BBaskets() {
  const { getUserCarts, deleteCart, getCartItemsCount } = useCart()
  const { isGuestUser, user, basketId, cartItems, openCart, setAlert, setBasketId } = useUI()
  const b2bUser = useMemo(() => { return isB2BUser(user) }, [user])
  const translate = useTranslation()
  const [loadingAction, setLoadingAction] = useState(LoadingActionType.NONE)
  const [basketIdToDelete, setBasketIdToDelete] = useState<string>(Guid.empty)
  const [isCreateBasketModalOpen, setIsCreateBasketModalOpen] = useState<boolean>(false)
  const [isTransferBasketModalOpen, setIsTransferBasketModalOpen] = useState<boolean>(false)
  const [isDeleteBasketModalOpen, setIsDeleteBasketModalOpen] = useState<boolean>(false)
  const [basketItemsCount, setBasketItemsCount] = useState(0)
  const [userCarts, setUserCarts] = useState<any>()
  let currentPage = getCurrentPage()

  const viewCart = (cartItems: any) => {
    if (currentPage) {
      if (typeof window !== 'undefined') {
        debugger
        const extras = { originalLocation: SITE_ORIGIN_URL + Router.asPath }
        AnalyticsEventManager.dispatch(AnalyticsEventType.VIEW_BASKET, { ...{ ...extras }, cartItems, currentPage, itemListName: 'Cart', itemIsBundleItem: false })
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
      head: <AddBasketIcon />,
      onClick: (ev: any) => {
        ev.preventDefault()
        ev.stopPropagation()
        openCreateBasketModal()
      },
      enabled: true
    },
    // {
    //   id: 'transferBasket',
    //   href: '#',
    //   title: translate('label.b2b.basket.transferBasketLinkText'),
    //   className: 'max-w-xs text-black text-left flex-1 op-75 py-3 px-2 flex font-medium sm:w-full',
    //   head: <TransferIcon />,
    //   onClick: (ev: any) => {
    //     ev.preventDefault();
    //     ev.stopPropagation();
    //     openTransferBasketModal();
    //   },
    //   enabled: true,
    // },
    {
      id: 'deleteBasket',
      href: '#',
      title: translate('label.b2b.basket.deleteBasketLinkText'),
      className: 'max-w-xs text-black text-left flex-1 op-75 py-3 px-2 flex font-medium sm:w-full',
      head: <TrashIcon className='w-6 h-6' />,
      onClick: (ev: any) => {
        ev.preventDefault()
        ev.stopPropagation()
      },
      enabled: false
    },
    // {
    //   id: 'listBasket',
    //   href: '#',
    //   title: translate('label.b2b.basket.listBasketsHeadingText'),
    //   className: 'max-w-xs text-black text-left flex-1 op-75 py-3 px-2 flex font-medium sm:w-full',
    //   head: null,
    //   onClick: (ev: any) => {
    //     ev.preventDefault()
    //     ev.stopPropagation()
    //   },
    //   enabled: true
    // },
  ]

  const getBaskets = async (userId: string) => {
    const userCarts = await getUserCarts({ userId })
    setUserCarts(userCarts)
  }

  useEffect(()=>{
    if(user?.userId && user?.userId !== Guid.empty){
      getBaskets(user?.userId)
    }
  },[cartItems?.lineItems?.length])

  const handleCreateBasket = async (basketName: string) => {
    if (basketName) {
      setLoadingAction(LoadingActionType.CREATE_BASKET)

      const newBasketId = generateBasketId(true)
      const { data }: any = await axios.post(NEXT_CREATE_BASKET, { basketId: newBasketId, basketName, userId: user?.userId })
      setLoadingAction(LoadingActionType.NONE)

      if (data?.recordId !== EmptyGuid) {
        setBasketId(data?.recordId)
        closeCreateBasketModal()
        setAlert({ type: AlertType.SUCCESS, msg: data?.message })
        if (!isGuestUser && user?.userId && user?.userId !== Guid.empty) {
          getBaskets(user?.userId)
        }
      } else {
        setAlert({ type: AlertType.ERROR, msg: data?.message || translate('common.message.requestCouldNotProcessErrorMsg') })
      }
    }
  }

  const handleTransferBasket = async (basketId: string, transitUserId: string) => {
    setLoadingAction(LoadingActionType.TRANSFER_BASKET)
    const payload = {
      basketId,
      transitUserId,
      currentUserId: user?.userId,
      companyId: user?.companyId,
    }
    const { data }: any = await axios.post(NEXT_TRANSFER_BASKET, payload)
    setLoadingAction(LoadingActionType.NONE)

    if (data?.recordId !== EmptyGuid) {
      closeTransferBasketModal()
      setAlert({ type: AlertType.SUCCESS, msg: data?.message })
      if (!isGuestUser && user?.userId && user?.userId !== Guid.empty) {
        getBaskets(user?.userId)
      }
    } else {
      setAlert({ type: AlertType.ERROR, msg: data?.message || translate('common.message.requestCouldNotProcessErrorMsg') })
    }
  }
  const deleteBasket = async (basketId: string) => {
    if (basketId && basketId !== Guid.empty) {
      setBasketIdToDelete(basketId)
    }
  }
  const openCreateBasketModal = () => setIsCreateBasketModalOpen(true)
  const closeCreateBasketModal = () => {
    if (loadingAction === LoadingActionType.CREATE_BASKET) return
    setLoadingAction(LoadingActionType.NONE)
    setIsCreateBasketModalOpen(!isCreateBasketModalOpen)
  }

  const openTransferBasketModal = () => setIsTransferBasketModalOpen(true)

  const closeTransferBasketModal = () => {
    setLoadingAction(LoadingActionType.NONE)
    setIsTransferBasketModalOpen(!isTransferBasketModalOpen)
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
    const getBasketCount = async () => {
      const count = await getCartItemsCount({ basketId })
      if (count > 0) {
        setBasketItemsCount(count)
      }
      else {
        setBasketItemsCount(0)
      }
    }

    if (basketId && basketId !== Guid.empty) {
      getBasketCount()
    }
  }, [basketId, cartItems?.lineItems?.length])

  useEffect(() => {
    if (basketIdToDelete !== Guid.empty) {
      openDeleteBasketModal()
    }
  }, [basketIdToDelete])

  return (
    <>
      {b2bUser ? (
        <>
          <div className="relative grid grid-cols-1 gap-6 bg-white dark:bg-neutral-800 py-7">
            {
              b2bBasketConfig?.filter((item: any) => item?.enabled)?.map((item: any) => {
                if (item?.id === 'listBasket' && !userCarts?.length) {
                  return
                }

                return (
                  <Link key={item?.title} title={item?.id} passHref href="#" className={`flex items-center p-2 -m-3 transition duration-150 ease-in-out rounded-lg dark:hover:bg-neutral-700 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50 ${!item?.head ? '!cursor-default hover:!bg-transparent' : ''}`} onClick={(ev: any) => {
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
                      </p>
                    </div>
                  </Link>
                )
              })
            }
          </div>
          <div className="flex flex-col gap-2 -mx-2">
            {(userCarts?.length > 0) && (
              <BasketList baskets={userCarts} openMiniBasket={openMiniBasket} deleteBasket={deleteBasket} openTransferBasketModal={openTransferBasketModal} />
            )}
          </div>
        </>
      ) : (
        <Popover.Button onClick={() => openMiniBasket(cartItems)} className={`group w-10 h-10 sm:w-12 sm:h-12 hover:bg-slate-100 dark:hover:bg-slate-100 rounded-full inline-flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 relative`}>
          {basketItemsCount > 0 && (
            <div className="w-3.5 h-3.5 flex items-center justify-center bg-primary-500 absolute top-1.5 right-1.5 rounded-full text-[10px] leading-none text-white font-medium">
              {basketItemsCount}
            </div>
          )}
          <span className="sr-only">{translate('label.basket.itemsCartViewBagText')}</span>
          <img alt="" src="/images/cartIcon.svg" className="w-6 h-6" />
        </Popover.Button>
      )}
      <AddBasketModal isOpen={isCreateBasketModalOpen} closeModal={closeCreateBasketModal} loadingAction={loadingAction} handleCreateBasket={handleCreateBasket} setLoadingAction={setLoadingAction} />
      <TransferBasket isOpen={isTransferBasketModalOpen} userCarts={userCarts} closeModal={closeTransferBasketModal} loadingAction={loadingAction} handleTransferBasket={handleTransferBasket} setLoadingAction={setLoadingAction} />
      <DeleteBasketModal isOpen={isDeleteBasketModalOpen} closeModal={closeDeleteBasketModal} loadingAction={loadingAction} handleDeleteBasket={handleDeleteBasket} setLoadingAction={setLoadingAction} />
    </>
  );
}
