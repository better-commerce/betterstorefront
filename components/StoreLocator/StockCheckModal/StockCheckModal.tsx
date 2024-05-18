// Base Imports
import React, { Fragment, useState } from 'react'
import axios from 'axios'

// Component Imports
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import StockCheckSection from './StockCheckSection'
import StoreListSection from './StoreListSection'

// Other Imports
import { cartItemsValidateAddToCart, logError } from '@framework/utils/app-util'
import { NEXT_GET_PRODUCT_AVAILABILITY_BY_POSTCODE } from '@components/utils/constants'
import { useUI } from '@components/ui'
import { useTranslation } from '@commerce/utils/use-translation'
import cartHandler from '@components/services/cart'
import { matchStrings, stringFormat } from '@framework/utils/parse-util'

const StockCheckModal = ({
  product,
  setOpenStockCheckModal,
  deviceInfo
}: any) => {
  const [openStoreList, setOpenStoreList] = useState(false)
  const [storeList, setStoreList] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const { basketId, user, setCartItems, cartItems, maxBasketItemsCount, setAlert } = useUI()
  const translate = useTranslation()

  const buttonTitle = () => {
    let buttonConfig: any = {
      title: translate('label.basket.addToBagText'),
      validateAction: async () => {
        const cartLineItem: any = cartItems?.lineItems?.find((o: any) => {
          if (matchStrings(o.productId, product?.recordId, true) || matchStrings(o.productId, product?.productId, true)) {
            return o
          }
        })
        if (product?.currentStock === cartLineItem?.qty && !product?.fulfilFromSupplier && !product?.flags?.sellWithoutInventory) {
          setAlert({ type: 'error', msg: translate('common.message.cartItemMaxAddedErrorMsg'), })
          return false
        }
        const isValid = cartItemsValidateAddToCart(cartItems, maxBasketItemsCount)
        if (!isValid) {
          setAlert({ type: 'error', msg: stringFormat(translate('common.message.basket.maxBasketItemsCountErrorMsg'), { maxBasketItemsCount }), })
        }
        return isValid
      },
      action: async () => {
        const item = await cartHandler()?.addToCart(
          {
            basketId,
            productId: product?.recordId,
            qty: 1,
            manualUnitPrice: product?.price?.raw?.withoutTax,
            stockCode: product?.stockCode,
            userId: user?.userId,
            isAssociated: user?.isAssociated,
          },
          'ADD',
          { product }
        )
        setCartItems(item)
      },
      shortMessage: '',
    }
    if (!product?.currentStock && product?.preOrder?.isEnabled) {
      buttonConfig.title = translate('label.product.preOrderText')
      buttonConfig.isPreOrderEnabled = true
      buttonConfig.buttonType = 'button'
      buttonConfig.shortMessage = product?.preOrder?.shortMessage
    }
    return buttonConfig
  }
  const buttonConfig = buttonTitle();

  const fetchStoreList = async (payload: any) => {
    try {
      const response = await axios.post(NEXT_GET_PRODUCT_AVAILABILITY_BY_POSTCODE, payload);
      const responseData = response?.data || [];
      return responseData;
    } catch (error) {
      logError(error)
      return [];
    }
  }

  const onSubmit = async ({
    postCode
  }: any) => {
    setIsLoading(true)
    const payload = {
      stockCode: product?.stockCode,
      postCode: postCode
    }
    const storeList = await fetchStoreList(payload);
    if( storeList?.length ) {
      setIsLoading(false)
      setStoreList(storeList)
      setOpenStoreList(true);
    }
    else {
      setIsLoading(false)
      setAlert({ type: 'error', msg: translate('common.message.noStoresErrorMsg'), })
    }
  }

  return (
    <Transition.Root show={true} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 overflow-x-hidden overflow-y-auto z-999" onClose={() => setOpenStockCheckModal(false)}>
        <div className="absolute inset-0 overflow-hidden z-999">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="w-full h-screen bg-black opacity-50" onClick={() => setOpenStockCheckModal(false)} />
          </Transition.Child>

          <div className="fixed inset-0 flex items-center justify-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="relative w-screen max-w-xl p-2 quickview-screen">
                <div className="flex flex-col w-full h-full rounded-md shadow-xl bg-gray-50">
                  {openStoreList ? (
                    <StoreListSection buttonConfig={buttonConfig} product={product} storeList={storeList} deviceInfo={deviceInfo} />
                  ) : (
                    <StockCheckSection onSubmit={onSubmit} isLoading={isLoading} />
                  )}
                  <XMarkIcon className="absolute right-0 w-8 h-8 top-5 right-5 hover:cursor-pointer" onClick={() => setOpenStockCheckModal(false)} />
                </div>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default StockCheckModal