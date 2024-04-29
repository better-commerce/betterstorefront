// Base Imports
import React, { Fragment, useState } from 'react'
import axios from 'axios'

// Component Imports
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import StockCheckSection from './StockCheckSection'
import StoreListSection from './StoreListSection'

// Other Imports
import { logError } from '@framework/utils/app-util'
import { NEXT_GET_PRODUCT_AVAILABILITY_BY_POSTCODE } from '@components/utils/constants'
import { useUI } from '@components/ui'
import { useTranslation } from '@commerce/utils/use-translation'
import cartHandler from '@components/services/cart'

const StockCheckModal = ({
  product,
  setOpenStockCheckModal,
  deviceInfo
}: any) => {
  const [openStoreList, setOpenStoreList] = useState(false)
  const [storeList, setStoreList] = useState([])
  const { basketId, user, setCartItems } = useUI()

  const translate = useTranslation()

  const buttonTitle = () => {
    let buttonConfig: any = {
      title: translate('label.basket.addToBagText'),
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
        setOpenStockCheckModal(false)
      },
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
    const payload = {
      stockCode: product?.stockCode,
      postCode: postCode
    }
    const res = await fetchStoreList(payload);
    setStoreList(res)
    setOpenStoreList(true);
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
                <div className="flex flex-col h-full rounded-md shadow-xl w-full bg-gray-50 p-4">
                  {openStoreList ? (
                    <StoreListSection buttonConfig={buttonConfig} product={product} storeList={storeList} deviceInfo={deviceInfo} />
                  ) : (
                    <StockCheckSection onSubmit={onSubmit} />
                  )}
                  <XMarkIcon
                    className="absolute m-4 right-0 top-0 h-4 w-4 hover:cursor-pointer"
                    onClick={() => setOpenStockCheckModal(false)}
                  />
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