// Base Imports
import React, { FC, Fragment, useEffect, useState } from 'react'

// Package Imports
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Dialog, Transition } from '@headlessui/react'

// Model Imports
import { IBulkAddData } from '.'

// Component Imports
import { CSVForm } from './CSVForm'
import { GridForm } from './GridForm'
import { AddToBasketButton } from './AddToBasketButon'
import { useUI } from '@components/ui/context'
import useDataSubmit from '@commerce/utils/use-data-submit'

// Other Imports
import { Guid } from '@commerce/types'
import cartHandler from '@components/services/cart'
import {
  CLOSE_PANEL,
  GENERAL_ADD_TO_BASKET,
  GENERAL_BULK_ORDER_PAD,
  GENERAL_COPY_AND_PASTE,
  GENERAL_LINE_BY_LINE,
} from '@components/utils/textVariables'
import { stringToNumber } from '@framework/utils/parse-util'
import { Messages, PageActions } from '@components/utils/constants'
import { resetSubmitData, submitData } from '@framework/utils/app-util'

const BulkAddSidebarView: FC = () => {
  const [bulkOrderSidebarOpen, setBulkOrderSidebarOpen] = useState(false)
  const {
    user,
    basketId,
    setCartItems,
    displaySidebar,
    openCart,
    closeSidebar,
  } = useUI()
  const { state: submitState, dispatch: submitDispatch } = useDataSubmit()
  const [isLineByLine, setIsLineByLine] = useState<boolean>(true)

  /**
   * Transforms input to basket line input for API endpoint.
   * @param data
   * @returns
   */
  const basketLine = (
    data: Array<{ stockCode: string; quantity: string }>
  ): Array<any> => {
    return data.map((x: { stockCode: string; quantity: string }) => {
      return {
        productId: Guid.empty,
        stockCode: x.stockCode,
        parentProductId: Guid.empty,
        qty: stringToNumber(x.quantity),
      }
    })
  }

  /**
   * Line by line submit event handler.
   * @param data
   */
  const onGridSubmit = async (data: IBulkAddData) => {
    submitData(submitDispatch, PageActions.BulkOrder.ADD_TO_CART)
    if (data && data.orderPads && data.orderPads.length) {
      const values = data.orderPads.filter(
        (x: { stockCode: string; quantity: string }) => {
          return x.stockCode && x.quantity
        }
      )

      if (values && values?.length) {
        await onAddToCart(values)
      }
    }
    resetSubmitData(submitDispatch)
  }

  /**
   * CSV submit event handler.
   * @param data
   */
  const onCSVSubmit = async (data: any) => {
    submitData(submitDispatch, PageActions.BulkOrder.ADD_TO_CART)
    if (data && data.data && data.data.trim().length) {
      const value = data.data.trim()
      const regExp = new RegExp(
        Messages.Validations.RegularExpressions.CSV_DATA
      )
      const matches: RegExpMatchArray | null = value.trim().match(regExp)
      let csvData = new Array<{ stockCode: string; quantity: string }>()
      if (matches && matches.length) {
        matches.forEach((m) => {
          const row = m.split(',')
          csvData.push({
            stockCode: row[0],
            quantity: row[1],
          })
        })
      }

      if (csvData && csvData.length) {
        await onAddToCart(csvData)
      }
    }
    resetSubmitData(submitDispatch)
  }

  /**
   * Add to cart event handler.
   * @param data
   */
  const onAddToCart = async (
    data: Array<{ stockCode: string; quantity: string }>
  ) => {
    const items = basketLine(data)
    if (items && items.length) {
      const item = await cartHandler().bulkAddToCart(
        user.userId,
        basketId,
        user.isAssociated,
        'ADD',
        items
      )
      if (item) {
        handleClose()
        setCartItems(item)
        setTimeout(() => {
          openCart()
        }, 750)
      }
    }
  }

  const handleClose = () => {
    setTimeout(() => closeSidebar(), 500)
    setBulkOrderSidebarOpen(false)
  }

  const addToBasketBtn = (
    <AddToBasketButton
      cssClass=""
      submitState={submitState}
      source={PageActions.BulkOrder.ADD_TO_CART}
      buttonText={GENERAL_ADD_TO_BASKET}
    />
  )

  useEffect(() => {
    setTimeout(() => setBulkOrderSidebarOpen(displaySidebar), 250)
  }, [displaySidebar])

  return (
    <Transition.Root show={bulkOrderSidebarOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 overflow-hidden z-99"
        onClose={handleClose}
      >
        <div className="absolute inset-0 overflow-hidden z-99">
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="" />
          </Transition.Child>

          <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-500 sm:duration-700"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-500 sm:duration-700"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <div className="w-screen max-w-md">
                <div className="flex flex-col h-full overflow-y-scroll bg-white shadow-xl">
                  <div className="flex-1 px-0 py-6 overflow-x-hidden overflow-y-auto sm:px-0">
                    {/* Dialog title */}
                    <div className="flex items-start justify-between pb-3 border-b">
                      <Dialog.Title className="pl-6 text-lg font-medium text-gray-900">
                        {GENERAL_BULK_ORDER_PAD}
                      </Dialog.Title>
                      <div className="flex">
                        {isLineByLine ? (
                          <button
                            className="flex justify-center px-6 py-2 mr-3 text-sm font-medium text-black uppercase transition bg-white border border-black rounded hover:opacity-75"
                            onClick={() => setIsLineByLine(false)}
                          >
                            {GENERAL_COPY_AND_PASTE}
                          </button>
                        ) : (
                          <button
                            className="flex justify-center px-6 py-2 mr-3 text-sm font-medium text-black uppercase transition bg-white border border-black rounded hover:opacity-75"
                            onClick={() => setIsLineByLine(true)}
                          >
                            {GENERAL_LINE_BY_LINE}
                          </button>
                        )}

                        <button
                          type="button"
                          className="p-2 -m-2 text-gray-400 hover:text-gray-500"
                          onClick={handleClose}
                        >
                          <span className="sr-only">{CLOSE_PANEL}</span>
                          <XMarkIcon className="w-6 h-6" aria-hidden="true" />
                        </button>
                      </div>
                    </div>

                    {/*LINE BY LINE PANEL*/}
                    {isLineByLine && (
                      <div className="flex flex-col px-6 pb-24">
                        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                            <GridForm
                              onGridSubmit={onGridSubmit}
                              addToBasketBtn={addToBasketBtn}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/*COPY AND PASTE PANEL*/}
                    {!isLineByLine && (
                      <div className="flex flex-col px-6 mt-4">
                        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                            <CSVForm
                              onCSVSubmit={onCSVSubmit}
                              addToBasketBtn={addToBasketBtn}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default BulkAddSidebarView
