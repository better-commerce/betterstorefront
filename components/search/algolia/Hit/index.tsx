// Base Imports
import React, { useEffect, useState } from 'react'

// Package Imports
import axios from 'axios'
import moment from 'moment'
import Link from 'next/link'
import Router from 'next/router'
import { Highlight, Snippet } from 'react-instantsearch'
import classNames from 'classnames'
import dynamic from 'next/dynamic'

// Component Imports
import SearchQuickView from '@components/product/QuickView/SearchQuickView'

// Other Import
import { useUI } from '@components/ui'
//import type { Hit } from 'instantsearch.js'
import { BTN_NOTIFY_ME, BTN_PRE_ORDER, GENERAL_ADD_TO_BASKET, IMG_PLACEHOLDER, QUICK_VIEW } from '@components/utils/textVariables'
import cartHandler from '@components/services/cart'
import { cartItemsValidateAddToCart, getAlgoliaSearchCurrencyLabel, getAlgoliaSearchListPriceColumn, getAlgoliaSearchPriceColumn, resetAlgoliaSearch, vatIncluded } from '@framework/utils/app-util'
import { MAX_ADD_TO_CART_LIMIT, Messages, NEXT_GET_PRODUCT_QUICK_VIEW } from '@components/utils/constants'
import { deliveryDateFormat, matchStrings, roundToDecimalPlaces } from '@framework/utils/parse-util'
import ProductTag from '@components/product/ProductTag'
import { isMobile } from 'react-device-detect'

const SimpleButton = dynamic(() => import('@components/ui/Button'))
const Button = dynamic(() => import('@components/ui/IndigoButton'))

type HitProps = {
  hit: any /*Hit*/
  maxBasketItemsCount: any
  handleClearSearch: any
}

const Hit = ({ hit, maxBasketItemsCount, handleClearSearch }: HitProps) => {
  const { user, basketId, cartItems, setCartItems, setAlert, openNotifyUser, setOverlayLoaderState, hideOverlayLoaderState } = useUI()
  const isIncludeVAT = vatIncluded()
  const [quantity, setQuantity] = useState(1)
  const [quickViewData, setQuickViewData] = useState(null)
  const priceColumn = getAlgoliaSearchPriceColumn(isIncludeVAT)
  const listPriceColumn = getAlgoliaSearchListPriceColumn(isIncludeVAT)
  const currencyLabel = getAlgoliaSearchCurrencyLabel()

  const buttonTitle = () => {
    let buttonConfig: any = {
      title: GENERAL_ADD_TO_BASKET,
      validateAction: async () => {
        const cartLineItem: any = cartItems?.lineItems?.find((o: any) => {
          if (matchStrings(o.productId, hit?.objectID, true)) {
            return o
          }
        })
        if (hit?.webstock === cartLineItem?.qty && !hit?.fulfilFromSupplier) {
          setAlert({
            type: 'error',
            msg: Messages.Errors['CART_ITEM_QTY_MAX_ADDED'],
          })
          return false
        }
        const isValid = cartItemsValidateAddToCart(cartItems, maxBasketItemsCount)
        if (!isValid) {
          setAlert({
            type: 'error',
            msg: Messages.Errors['CART_ITEM_QTY_LIMIT_EXCEEDED'],
          })
          return false
        }
        return isValid;
      },
      action: async () => {
        setOverlayLoaderState({ visible: true, message: 'Please wait...', })
        const result = await fetchProductQuickViewData(hit)
        const item = await cartHandler()?.addToCart(
          {
            basketId,
            productId: hit?.objectID,
            qty: quantity,
            manualUnitPrice: hit[priceColumn],
            stockCode: hit?.modelnumber,
            userId: user?.userId,
            isAssociated: user?.isAssociated,
          },
          'ADD',
          { result }
        )
        setCartItems(item)

        if (item?.length) {
          handleClearSearch()
        }
        hideOverlayLoaderState()
      },
      shortMessage: '',
    }
    if (hit?.webstock <= 0 && hit?.itemvisibleonwebsite) {
      buttonConfig.title = BTN_NOTIFY_ME
      buttonConfig.isNotifyMeEnabled = true
      buttonConfig.action = async () => handleNotification()
      buttonConfig.buttonType = 'button'
    } else if (!hit?.webstock && hit?.preorder) {
      buttonConfig.title = BTN_PRE_ORDER
      buttonConfig.isPreOrderEnabled = true
      buttonConfig.buttonType = 'button'
      buttonConfig.shortMessage = hit?.preordershortmessage
    }
    return buttonConfig
  }
  const buttonConfig = buttonTitle()

  const fetchProductQuickViewData = async (data: any) => {
    const slug = data?.weburl
    const { data: productQuickViewData }: any = await axios.post(
      NEXT_GET_PRODUCT_QUICK_VIEW,
      { slug: slug }
    )
    return productQuickViewData?.product
  }

  const handleQuickViewData = async (data: any) => {
    const quickViewData: any = {
      objectid: {
        raw: data?.id
      },
      weburl: {
        raw: data?.weburl
      },
      title: {
        raw: data?.title
      }
    }
    setQuickViewData(quickViewData)
  }
  const handleCloseQuickView = () => {
    setQuickViewData(null)
  }
  const handleNotification = () => {
    openNotifyUser(hit?.id)
  }

  const [etaDate, setEtaDate] = useState<any>('')

  useEffect(() => {
    if (hit?.leadtime >= 0) {
      const date = new Date()
      setEtaDate(date.setDate(date.getDate() + hit?.leadtime))
    }
  }, [hit])

  return (
    <div className={`${hit?.webstock ==0 ? 'hover:border-gray-200 border-gray-100' :'hover:border-orange-500 border-gray-200'} relative grid h-full grid-cols-1 p-4 mb-0 bg-white border rounded-md hit sm:grid-cols-1  group-hover:border-gray-700 snap-start hover:text-blue-600 group`}>
      <div className="relative z-10 flex items-center justify-between w-full">
        <ProductTag product={hit} />
        {isMobile ? null : (
          hit?.webstock < 11 && hit?.webstock > 0 &&
          <div className={`${hit?.webstock > 0 ? 'bg-yellow-300 text-black' : 'bg-red-500 text-white'} absolute right-0 px-2 py-1 text-xs font-semibold  rounded-md top-2`}>
            Only {hit?.webstock} left!
          </div>
        )}
      </div>
      <div className={`${hit?.webstock ==0 ? 'opacity-40 ' :''} mx-auto hit-imageURL`}>
        <Link legacyBehavior passHref href={`/${hit?.weburl}`}>
          <a href={`/${hit?.weburl}`} onClick={() => resetAlgoliaSearch()}>
            <img className='height-img-auto' alt="reset" src={hit?.imageurl || IMG_PLACEHOLDER} />
          </a>
        </Link>
      </div>
      <div className="pt-2 font-bold hit-price dark:text-black">
        {hit[currencyLabel]}{hit[priceColumn]}

        {(hit[listPriceColumn] > 0 && hit[listPriceColumn] != hit[priceColumn]) && (
          <span className="px-1 font-normal text-gray-400 line-through">{hit[currencyLabel]}{roundToDecimalPlaces(hit[listPriceColumn])}</span>
        )}

        <span className="pl-1 text-sm font-light text-right text-gray-400">{isIncludeVAT ? "inc. VAT" : "ex. VAT"}</span>
      </div>
      <div className="py-2 hit-content">
        <div className='flex flex-col'>
          <Link legacyBehavior passHref href={`/${hit?.weburl}`}>
            <a href={`/${hit?.weburl}`} onClick={() => resetAlgoliaSearch()}>
              <div className="font-semibold text-black font-16">
                {hit?.brand}
              </div>
              <div className="font-normal text-black font-14">
                <Highlight attribute="title" hit={hit} highlightedTagName="em" />
              </div>
            </a>
          </Link>

          {
            (hit?.averagerating ?? 0) >= 0 && (
              <div className="flex items-center gap-0 my-3">
                {[0, 1, 2, 3, 4].map((rating) => (
                  <i
                    key={rating}
                    className={classNames(
                      (hit?.averagerating ?? 0) > rating
                        ? 'sprite-red-star-filled'
                        : 'sprite-red-star',
                      'flex-shrink-0 sprite-icons relative -top-0.5'
                    )}
                  ></i>
                ))}
                <p className="pl-1 my-auto text-2xl font-light dark:text-black">
                  {hit?.averagerating ?? 0 > 0 ? hit?.averagerating : "0"}
                </p>
                {hit?.numberofreviews && (
                  <span className="text-xs font-normal text-gray-500">{`(${hit?.numberofreviews})`}</span>
                )}

              </div>
            )
          }

          {
            etaDate && (
              <div className="flex items-center justify-between w-full px-0 py-3 my-2 text-sm font-semibold text-left text-black border-t border-gray-200 h-9 product-name hover:text-gray-950">
                <span>
                  <>
                    Get it by{' '}
                    {deliveryDateFormat(etaDate)}
                  </>
                </span>
              </div>
            )
          }
          {!isMobile ? null : (
            <div className='flex justify-between gap-2'>
              <Button
                title={buttonConfig.title}
                action={buttonConfig.action}
                validateAction={buttonConfig.validateAction}
                type="button"
                buttonType={buttonConfig.buttonType || 'cart'}
              />
              <SimpleButton
                variant="slim"
                className="!p-1 flex-1 !bg-transparent btn-c btn-secondary font-14 uppercase"
                onClick={async () => await handleQuickViewData(hit)}
              >
                <span className="uppercase">{QUICK_VIEW}</span>
              </SimpleButton>
            </div>
          )}
          <div
            className={classNames(
              'mob-section-hide absolute flex flex-col button-position-absolute opacity-0 group-hover:opacity-100 gap-1 pr-0 mx-auto py-2 sm:group-hover:flex bottom-0 duration-300 bg-transparent rounded-md'
            )}
          >
            <SimpleButton
              variant="slim"
              className="!p-1 flex-1 !bg-transparent btn-c btn-secondary font-14 uppercase"
              onClick={async () => await handleQuickViewData(hit)}
            >
              <span className="uppercase">{QUICK_VIEW}</span>
            </SimpleButton>
            <div className="grid items-center w-full grid-cols-12 gap-1 justify-stretch">
              <div className="col-span-3">
                <button
                  className="w-full rounded "
                  onClick={(e: any) => {
                    setQuantity(e.target.value)
                  }}
                >
                  <select className="h-full py-3 px-2 w-full border-[1px] border-black rounded dark:bg-white dark:text-black">
                    {Array.from(Array(MAX_ADD_TO_CART_LIMIT).keys())
                      .map((x) => ({ id: x + 1, value: x + 1 }))
                      .map((quant: any) => (
                        <option value={quant.value} key={quant.id}>
                          {quant.value}
                        </option>
                      ))}
                  </select>
                </button>
              </div>
              <div className="col-span-9">
                <Button
                  title={buttonConfig.title}
                  action={buttonConfig.action}
                  validateAction={buttonConfig.validateAction}
                  type="button"
                  buttonType={buttonConfig.buttonType || 'cart'}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <SearchQuickView
        isQuickview={Boolean(quickViewData)}
        setQuickview={() => { }}
        productData={quickViewData}
        isQuickviewOpen={Boolean(quickViewData)}
        setQuickviewOpen={handleCloseQuickView}
        maxBasketItemsCount={maxBasketItemsCount}
      />
    </div>
  )
}

export default Hit