// Base Imports
import React, { FC, Fragment, useState } from 'react'

// Package Imports
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Dialog, Transition } from '@headlessui/react'

// Model Imports
import { IBulkAddData } from '.'

// Component Imports
import { CSVForm } from './CSVForm'
import { GridForm } from './GridForm'
import { AddToBasketButton } from './AddToBasketButon'

// Other Imports
import { Guid } from '@commerce/types'
import { useUI } from '@components/ui/context'
import cartHandler from '@components/services/cart'
import {
  CLOSE_PANEL,
  GENERAL_ADD_TO_BASKET,
  GENERAL_BULK_ORDER_PAD,
  GENERAL_COPY_AND_PASTE,
  GENERAL_LINE_BY_LINE,
} from '@components/utils/textVariables'
import { stringToNumber } from '@framework/utils/parse-util'
import { Messages } from '@components/utils/constants'

const BulkAddSidebarView: FC = () => {
  const { user, basketId, setCartItems, openCart, closeSidebar } = useUI()
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
    if (data && data.orderPads && data.orderPads.length) {
      const values = data.orderPads.filter(
        (x: { stockCode: string; quantity: string }) => {
          return x.stockCode && x.quantity
        }
      )

      if (values && values.length) {
        await onAddToCart(values)
      }
    }
  }

  /**
   * CSV submit event handler.
   * @param data
   */
  const onCSVSubmit = async (data: any) => {
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
        closeSidebar()
        setCartItems(item)
        setTimeout(() => {
          openCart()
        }, 50)
      }
    }
  }

  const handleClose = () => closeSidebar()

  const addToBasketBtn = (
    <AddToBasketButton buttonText={GENERAL_ADD_TO_BASKET} />
  )

  return (
    <Transition.Root show={true} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 overflow-hidden z-50 overflow-x-hidden"
        onClose={handleClose}
      >
        <div className="absolute inset-0 overflow-hidden">
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

          <div className="fixed inset-y-0 right-0 pl-0 max-w-full flex overflow-x-hidden">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-500 sm:duration-700"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-500 sm:duration-700"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <div className="w-screen max-w-md relative overflow-x-hidden">
                <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll overflow-x-hidden">
                  <div className="flex-1 py-6 overflow-y-auto px-0 sm:px-0 overflow-x-hidden">
                    {/* Dialog title */}
                    <div className="flex items-start justify-between border-b pb-3">
                      <Dialog.Title className="text-lg font-medium text-gray-900 pl-6">
                        {GENERAL_BULK_ORDER_PAD}
                      </Dialog.Title>
                      <div className="flex">
                        {isLineByLine ? (
                          <button
                            className="flex justify-center px-6 mr-3 text-sm items-center py-2 border border-transparent rounded-sm shadow-sm font-medium text-white bg-black hover:bg-gray-900 "
                            onClick={() => setIsLineByLine(false)}
                          >
                            {GENERAL_COPY_AND_PASTE}
                          </button>
                        ) : (
                          <button
                            className="flex justify-center px-6 mr-3 text-sm items-center py-2 border border-transparent rounded-sm shadow-sm font-medium text-white bg-black hover:bg-gray-900 "
                            onClick={() => setIsLineByLine(true)}
                          >
                            {GENERAL_LINE_BY_LINE}
                          </button>
                        )}

                        <button
                          type="button"
                          className="-m-2 p-2 text-gray-400 hover:text-gray-500"
                          onClick={handleClose}
                        >
                          <span className="sr-only">{CLOSE_PANEL}</span>
                          <XMarkIcon className="h-6 w-6" aria-hidden="true" />
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
                      <div className="flex flex-col mt-4 px-6">
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
