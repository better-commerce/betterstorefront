import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { MinusIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import cn from 'classnames'
import Cookies from 'js-cookie'

//
import { useUI } from '@components/ui'
import { GENERAL_ADD_TO_KIT } from '@components/utils/textVariables'
import { matchStrings } from '@framework/utils/parse-util'
import ButtonNotifyMe from '@components/Product/ButtonNotifyMe'
import { cartItemQtyHandler } from './utils'
import { BASKET_TYPES, Cookie } from '@framework/utils/constants'
import { EmptyGuid } from '@components/utils/constants'

const maxBasketItemsCount = 60
const CART_ACTION_TYPES = {
  INCREASE: 'increase',
  DECREASE: 'decrease',
  DELETE: 'delete',
}

function AddToBasket({ product, brandInfo, selectedCat }: any) {
  const [kitQty, setKitQty] = useState(1)
  const { setAlert, kitBasket, setKitBasket } = useUI()
  const router = useRouter()
  const [basketItem, setBasketItem] = useState<any>(undefined)
  const [basketLoading, setBasketLoading] = useState(false)
  
  useEffect(() => {
    const item = kitBasket?.lineItems?.find((o: any) => matchStrings(o?.productId, product?.recordId, true) || matchStrings(o?.productId, product?.productId, true))
    setBasketItem(item)
  }, [kitBasket])

  useEffect(() => {
    setKitQty(+router.query?.kitQty! || 1)
  }, [router.query])

  const handleSelectItemQty = (e: any, product: any) => {
    const selectQty: number = +e.target.value
    onUpdateKitBasket(product, CART_ACTION_TYPES.INCREASE, selectQty)
  }

  const isOutOfStock = (product: any) => {
    return product?.currentStock < 1 && !product?.flags?.sellWithoutInventory
  }

  const onUpdateKitBasket = (item: any, action: string = CART_ACTION_TYPES.INCREASE, selectQty?: number) => {
    if (basketLoading) return
    setBasketLoading(true)
    item.basketItemGroupData = {
      ...(selectedCat || {}),
      brand: brandInfo?.brandName,
      brandId: brandInfo?.brandId,
      platform: brandInfo?.platformName,
      platformId: brandInfo?.platformId,
      image: brandInfo?.brandImgUrl,
      kitQty,
    }
    item.qty = basketItem?.qty
    if (selectQty) {
      item.selectQty = selectQty
    } else {
      item.selectQty = 0
    }
    cartItemQtyHandler(item, kitBasket, action, { basketName: BASKET_TYPES.KIT }, (err:any, data:any) => {
      setBasketLoading(false)
      if (err) return setAlert(err)
      if (!data || data?.id === EmptyGuid) {
        Cookies.remove(Cookie.Key.KIT_BASKET_ID)
        setKitBasket(null)
      } else {
        setKitBasket(data)
      }
      const url = new URL(window.location.origin + router.asPath)
      if (!router.query?.basketItemGroupId) {
        router.replace({ pathname: url.pathname, query: { ...router.query, basketItemGroupId: data?.id }, }, undefined, { shallow: true });
      }
    })
  }

  const basketItemQty = basketItem?.qty / (basketItem?.basketItemGroupData?.kitQty * 1)

  return (
    <div className={cn('w-full h-full', {
      'animate-pulse opacity-90 pointer-events-none': basketLoading,
    })}>
      {!basketItem || basketItemQty === 0 ? (
        <>
          {isOutOfStock(product) ? (
            <ButtonNotifyMe
              product={product}
              className="w-full sm:block btn-secondary"
            />
          ) : (
            <button
              onClick={() => onUpdateKitBasket(product)}
              className="w-full sm:block btn btn-secondary"
            >
              {GENERAL_ADD_TO_KIT}
            </button>
          )}
        </>
      ) : (
        <div className="overflow-hidden flex gap-4 items-center w-full !p-0 btn-secondary h-full">
          <span className="flex items-center h-full px-4 py-1 select-none">
            Added
          </span>
          <div className="flex items-center justify-between flex-1 col-span-2 px-2 text-black rounded-md hover:text-blue">
            {basketItemQty === 1 ? (
              <button onClick={() => onUpdateKitBasket(product, CART_ACTION_TYPES.DELETE)}>
                <TrashIcon
                  className="w-5 h-5 text-white stroke-2"
                  title="Remove from Cart"
                />
              </button>
            ) : (
              <button onClick={() => onUpdateKitBasket(product, CART_ACTION_TYPES.DECREASE)}>
                <MinusIcon
                  className="w-5 h-5 text-white stroke-2"
                  title="Decrease quantity in Cart"
                />
              </button>
            )}
            <span className="relative inline-block py-2 mx-5 rounded text-md custom-select">
              <select
                value={basketItemQty}
                className="w-20 px-2 py-1 text-black border border-gray-200 rounded-sm dark:bg-white dark:text-black"
                onChange={(e) => handleSelectItemQty(e, product)}
                name="qty"
              >
                {Array(maxBasketItemsCount)
                  .fill('')
                  ?.map((o: any, idx: number) => (
                    <option key={idx} value={idx + 1}>
                      {idx + 1}
                    </option>
                  ))}
              </select>
            </span>
            <button
              onClick={() => onUpdateKitBasket(product)}
              disabled={basketItemQty === maxBasketItemsCount}
            >
              <PlusIcon
                className="w-5 h-5 text-white stroke-2"
                title="Increase quantity in Cart"
              />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AddToBasket
