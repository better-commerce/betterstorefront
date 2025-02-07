import { useCallback, useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { isEqual, size, sumBy } from 'lodash'
import { useRouter } from 'next/router'
import Cookies from 'js-cookie'

//
import { LoadingDots, useUI } from '@components/ui'
import { EmptyGuid, NEXT_BULK_ADD_TO_CART, NEXT_GET_BASKET_PROMOS } from '@components/utils/constants'
import KitBasketProduct from '../KitBasketProduct'
import { maxBasketItemsCount } from '@framework/utils/app-util'
import { GENERAL_KIT_TO_BASKET } from '@components/utils/textVariables'
import { AlertType } from '@framework/utils/enums'
import { Messages } from '@components/utils/constants'
import { matchStrings, stringToBoolean } from '@framework/utils/parse-util'
import { BASKET_PROMO_TYPES, Cookie } from '@framework/utils/constants'
import useCart from '@components/services/cart'

function KitCartSidebar({ brandInfo, config, deviceInfo }: any) {
  const router: any = useRouter()
  const { setCartItems, openCart, kitCartLoaded, setKitCartLoaded, setAlert, includeVAT, kitBasket, setKitBasket } = useUI()
  const isIncludeVAT = stringToBoolean(includeVAT)
  const { getCart } = useCart()
  const [kitBasketPromos, setKitBasketPromos] = useState<any>(null)
  const [brandDetails, setBrandDetails] = useState(brandInfo)
  const previousKitBasket = useRef(kitBasket?.lineItems?.length || 0);

  const getKitBasketPromos = useCallback(async (basketId: string) => {
    if (!basketId || basketId === EmptyGuid) return
    setKitBasketPromos(null)
    const { data: kitBasketPromos } = await axios.get(NEXT_GET_BASKET_PROMOS, {
      params: { basketId: basketId },
    })
    let promos = []
    if (kitBasketPromos?.availablePromotions) {
      promos = kitBasketPromos?.availablePromotions?.filter((o: any) => o?.promoType === BASKET_PROMO_TYPES.KIT)
    }
    if (kitBasketPromos?.applicablePromotions) {
      promos = [
        ...promos,
        ...(kitBasketPromos?.applicablePromotions?.filter((o: any) => o?.promoType === BASKET_PROMO_TYPES.KIT) || [])
      ]
    }
    // filter by brand and platform value
    promos = promos?.filter((promo: any) => {
      const isBrandMatches = matchStrings(promo?.additionalInfo8, brandInfo?.brandName, true)
      const isPlatformMatches = matchStrings(promo?.additionalInfo9, brandInfo?.platformName, true)
      return (isBrandMatches && isPlatformMatches) && promo
    })
    setKitBasketPromos(promos)
  }, [kitBasket])

  useEffect(() => {
    getKitBasketPromos(router?.query?.basketItemGroupId)
  }, [kitBasket])

  const onBulkUpdateKitBasket = async () => {
    try {
      setKitCartLoaded(true)
      const basketId = Cookies.get(Cookie.Key.BASKET_ID)
      const kitBasketId = Cookies.get(Cookie.Key.KIT_BASKET_ID)
      let hasItemAlreadyAdded = false
      const bulkUpdatePayload: any = { basketId, products: [], }
      const basket = await getCart({ basketId })
      const basketItems = basket?.lineItems?.filter((item: any) => {
        if (router.query?.basketItemGroupId) {
          return matchStrings(item?.basketItemGroupId, router.query?.basketItemGroupId, true)
        } else if (kitBasketId) {
          return matchStrings(item?.basketItemGroupId, kitBasketId, true)
        }
      })
      const kitBasketItems = kitBasket?.lineItems?.filter((item: any) => {
        if (router.query?.basketItemGroupId) {
          return matchStrings(item?.basketItemGroupId, router.query?.basketItemGroupId, true)
        } else if (kitBasketId) {
          return matchStrings(item?.basketItemGroupId, kitBasketId, true)
        }
      })

      const mapBasketItemIds = basketItems?.map((o: any) => o?.productId)
      const mapKitBasketItemIds = kitBasketItems?.map((o: any) => o?.productId)

      const basketItemIdsAndQty = basketItems?.reduce((acc: any, cur: any) => {
        if (cur?.productId) acc[cur?.productId] = cur?.qty
        return acc
      }, {})
      const kitBasketItemIdsAndQty = kitBasketItems?.reduce((acc: any, cur: any) => {
        if (cur?.productId) acc[cur?.productId] = cur?.qty
        return acc
      }, {})

      // check if same kit basket items have already added in basket
      if (isEqual(basketItemIdsAndQty, kitBasketItemIdsAndQty)) {
        hasItemAlreadyAdded = true
      }
      /**
       * Remove kit basket with kitBasketId
       */
      bulkUpdatePayload.basketId = kitBasketId
      kitBasketItems?.forEach((item: any) => {
        bulkUpdatePayload.products.push({
          qty: 0, // qty should be "0"
          productId: item?.productId,
          name: item?.name,
          stockCode: item?.stockCode,
          manualUnitPrice: item?.price?.raw?.withoutTax,
          displayOrder: item?.displayOrder,
          basketItemGroupId: item?.basketItemGroupId,
          basketItemGroupData: item?.basketItemGroupData,
        })
      })
      const removeKitBasketRes = await axios.post(NEXT_BULK_ADD_TO_CART, {
        data: bulkUpdatePayload,
        basketId: kitBasketId,
      })

      if (!hasItemAlreadyAdded) {
        /**
         * Add kit basket items into basket with basketId
         */
        bulkUpdatePayload.basketId = basketId
        bulkUpdatePayload.products = []
        kitBasketItems?.forEach((item: any) => {
          let qty = item?.qty
          if (mapBasketItemIds?.includes(item?.productId)) {
            if (basketItemIdsAndQty?.[item?.productId] === qty) {
              return
            } else {
              qty = qty - basketItemIdsAndQty?.[item?.productId]
            }
          }
          bulkUpdatePayload.products.push({
            productId: item?.productId,
            name: item?.name,
            stockCode: item?.stockCode,
            manualUnitPrice: item?.price?.raw?.withoutTax,
            qty,
            displayOrder: item?.displayOrder,
            basketItemGroupId: item?.basketItemGroupId,
            basketItemGroupData: item?.basketItemGroupData,
          })
        })

        /**
         * Update deleted kit basket items
         */
        const deletedItemIdsArr = mapBasketItemIds?.filter((o: any) => !mapKitBasketItemIds?.includes(o))
        if (deletedItemIdsArr?.length) {
          basketItems?.forEach((item: any) => {
            if (deletedItemIdsArr.includes(item?.productId)) {
              bulkUpdatePayload.products.push({
                productId: item?.productId,
                name: item?.name,
                stockCode: item?.stockCode,
                manualUnitPrice: item?.price?.raw?.withoutTax,
                qty: 0,
                displayOrder: item?.displayOrder,
                basketItemGroupId: item?.basketItemGroupId,
                basketItemGroupData: item?.basketItemGroupData,
              })
            }
          })
        }
        const { data: newCart }: any = await axios.post(NEXT_BULK_ADD_TO_CART, {
          data: bulkUpdatePayload,
          basketId,
        })
        setCartItems(newCart)
      }

      openCart()
      setKitCartLoaded(false)
      setKitBasket(null)
      Cookies.remove(Cookie.Key.KIT_BASKET_ID)
      setTimeout(() => {
        router.push('/kit')
      }, 800)
    } catch (error) {
      // console.log(error)
      setKitCartLoaded(false)
    }
  }

  const [isActiveKit, setKitActive] = useState(false)

  const kitViewClass = () => {
    setKitActive(!isActiveKit)
  }

  const isEmptyKitBasket = !kitBasket || kitBasket?.lineItems?.length < 1 || size(kitBasket) < 1

  useEffect(() => {
    const currentLineItemCount = kitBasket?.lineItems?.length || 0;
    if (currentLineItemCount === 0 || previousKitBasket.current !== currentLineItemCount) {
      setBrandDetails(brandInfo);
    }
    previousKitBasket.current = currentLineItemCount;
  }, [brandInfo, kitBasket]);

  const renderPromo = (appliedPromo: any, kitPromos: any) => {
    const appliedKitPromo = kitPromos?.find((o: any) => matchStrings(o?.code, appliedPromo?.promoCode))
    return (
      <div className="flex flex-wrap overflow-hidden">
        <div className='flex-[1_0_50%]'>
          <p className='text-lg'>You've saved</p>
          <p className='font-bold font-24'>{appliedPromo?.discountAmt?.formatted?.withTax}</p>
        </div>
        <div className='flex-[1_0_50%] relative'>
          {appliedKitPromo && (
            <>
              <span className='block absolute left-0 top-1/2 -translate-y-1/2 h-[55%] w-[1px] bg-emerald-500'></span>
              <div className='grid place-items-center'>
                <div className="progress-circle over50">
                  <span className='block -mt-2'>{appliedKitPromo?.croSuccessMessage}</span>
                  <span className='block mt-4'>OFF</span>
                  <div className="left-half-clipper">
                    <div className="first50-bar"></div>
                    <div className="value-bar"></div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        <div className='flex-[1_0_100%]'>
          {appliedKitPromo && (
            <p className='mt-0'>{appliedKitPromo?.additionalInfo6}</p>
          )}
          <p className='mt-0 text-md'>Promo applied: {appliedPromo?.promoCode}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={'flex-1 w-full pb-3 pt-1 kit-basket top-28 shadow-outline-normal kit-basket-height mob-kit-basket ' + (isActiveKit ? 'open-kit-mob' : null)} >
      <div className="flex flex-col justify-between h-full">
        <div className="w-full px-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="dark:text-black font-16 m-font-14">
              {brandDetails?.brandName} {brandDetails?.platformName} Kit{' '}
              <span className="font-medium text-black font-12">
                ({sumBy(kitBasket?.lineItems, 'qty')} Items)
              </span>
            </h3>
          </div>
        </div>
        <div className={`flex flex-1 flex-col w-full text-center overflow-y-auto mob-hidden ${isEmptyKitBasket ? 'items-center justify-center' : ''}`}>
          {isEmptyKitBasket ? (
            <>
              <i className="mx-auto mb-6 sprite-icons icon-empty-bag"></i>
              <h5 className="text-lg font-semibold opacity-70 dark:text-black">
                Nothing in kit
              </h5>
              <h5 className="opacity-70 dark:text-black">
                Add products to begin building your kit
              </h5>
            </>
          ) : (
            <>
              <div className="flex flex-col gap-2 px-4 mt-4 text-left max-kit-panel sm:px-4">
                {kitBasket?.promotionsApplied?.length > 0 ? kitBasket?.promotionsApplied.map((promo: any, idx: number) => (
                  <div key={idx} className="border rounded border-emerald-500 m-offer-info bg-emerald-100 text-emerald-500 min-h-[150px] p-3 offer-m-sec text-secondary-full-opacity">
                    {renderPromo(promo, kitBasketPromos)}
                  </div>
                )) : kitBasketPromos?.map((promo: any, idx: number) => (
                  <div key={idx} className='relative px-2 py-1 font-semibold border rounded border-emerald-500 m-offer-info bg-emerald-100 text-emerald-500 offer-m-sec text-secondary-full-opacity'>
                    {promo?.croMessage}
                  </div>
                ))}
                {kitBasket?.lineItems?.sort((a: any, b: any) => b.displayOrder - a.displayOrder)?.map((product: any, productIdx: number) => (
                  <KitBasketProduct key={productIdx} product={product} brandInfo={brandInfo} css={{ maxWidth: '100%', height: 'auto' }} isIncludeVAT={isIncludeVAT} openModal={() => { }} setItemClicked={() => { }} maxBasketItemsCount={maxBasketItemsCount(config)} />
                ))}
              </div>
            </>
          )}
        </div>
        <div className="w-full text-center">
          <div className="flex flex-col items-center justify-between px-4">
            <div className="flex justify-between w-full my-0 sm:my-1">
              <div className='flex justify-start text-left'>
                <h2 className="mb-0 font-semibold capitalize font-20 m-font-16 dark:text-black">
                  Total{' '}<span className="text-gray-500 capitalize font-14 m-font-14">{isIncludeVAT ? 'inc. VAT' : 'ex. VAT'}</span>
                </h2>
              </div>
              <h6 className="text-lg font-semibold m-font-16 dark:text-black">
                {isIncludeVAT ? kitBasket?.grandTotal?.formatted?.withTax : kitBasket?.grandTotal?.formatted?.withoutTax}
                <span className='hidden view-mob-visible'>
                  <span
                    className="pl-3 underline view-span dark:text-black font-14 m-font-14"
                    onClick={kitViewClass}
                  >
                    View Kit
                  </span>
                  <span
                    className="hidden pl-3 underline hide-span font-14 m-font-14"
                    onClick={kitViewClass}
                  >
                    Hide kit
                  </span>
                </span>
              </h6>
            </div>
            <button
              className="w-full btn-secondary btn bottom-1 disabled:cursor-not-allowed disabled:opacity-70"
              onClick={onBulkUpdateKitBasket}
              disabled={kitCartLoaded || isEmptyKitBasket}
            >
              {kitCartLoaded ? <LoadingDots /> : GENERAL_KIT_TO_BASKET}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default KitCartSidebar
