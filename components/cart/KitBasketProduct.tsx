import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { PlusIcon, TrashIcon, } from '@heroicons/react/24/outline'
import Cookies from 'js-cookie'
import { generateUri } from '@commerce/utils/uri-util'
import { useUI } from '@components/ui'
import { GENERAL_REMOVE, IMG_PLACEHOLDER, } from '@components/utils/textVariables'
import { matchStrings } from '@framework/utils/parse-util'
import { isIncludeVATInPriceDisplay } from '@framework/utils/app-util'
import { cartItemQtyHandler } from './utils'
import { BASKET_TYPES, Cookie } from '@framework/utils/constants'
import { EmptyGuid } from '@components/utils/constants'
import { MinusIcon } from '@heroicons/react/24/solid'
const CART_ACTION_TYPES = { INCREASE: 'increase', DECREASE: 'decrease', DELETE: 'delete', }
export default function KitBasketProduct({ product, brandInfo, css, handleRedirectToPDP, handleClose, isIncludeVAT, discount, maxBasketItemsCount, }: any) {
  const [kitQty, setKitQty] = useState(1)
  const router: any = useRouter()
  const { setAlert, kitBasket, setKitBasket } = useUI()
  const [basketItem, setBasketItem] = useState<any>(undefined)
  const [basketLoading, setBasketLoading] = useState(false)
  const [isFreeItem, setIsFreeItem] = useState(false)

  useEffect(() => {
    setIsFreeItem(product?.price?.raw?.withTax < 1)
  }, [product])

  useEffect(() => {
    const item = kitBasket?.lineItems?.find((o: any) => matchStrings(o?.productId, product?.recordId, true) || matchStrings(o?.productId, product?.productId, true))
    setBasketItem(item)
  }, [kitBasket])

  useEffect(() => {
    setKitQty(+router.query?.kitQty || 1)
  }, [router?.query])

  const onUpdateKitBasket = (item: any, action: string = CART_ACTION_TYPES.INCREASE, selectQty?: number) => {
    if (basketLoading) return
    setBasketLoading(true)
    item.basketItemGroupData = {
      ...(item?.basketItemGroupData || {}),
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
    cartItemQtyHandler(item, kitBasket, action, { basketName: BASKET_TYPES.KIT }, (err, data) => {
      setBasketLoading(false)
      if (err) return setAlert(err)
      if (!data || data?.id === EmptyGuid) {
        Cookies.remove(Cookie.Key.KIT_BASKET_ID)
        setKitBasket(null)
      } else {
        setKitBasket(data)
      }
    })
  }
  const basketItemQty = basketItem?.qty / (basketItem?.basketItemGroupData?.kitQty * 1)
  if (isFreeItem) {
    return (
      <div key={product.id} className="p-4 border rounded bg-emerald-50 border-color-free border-emerald-400 sm:pr-2">
        <div className="grid items-start grid-cols-12 gap-4">
          <div className="col-span-3">
            <Link href={`/${product.slug}`}>
              <img width={80} height={80} style={css} src={generateUri(product.image, 'h=100&fm=webp') || IMG_PLACEHOLDER} alt={product.name} className="object-cover object-center w-full h-full" onClick={handleRedirectToPDP} />
            </Link>
          </div>
          <div className="col-span-6">
            <h5 onClick={handleClose} className="font-light font-12 dark:text-black" >
              <Link href={`/${product.slug}`}>{product.name}</Link>
            </h5>
          </div>
          <div className="col-span-3 text-right">
            <span className='flex flex-col font-semibold text-red-500'>FREE</span>
            <span className='flex flex-col font-semibold text-black'>Qty: {product?.qty}</span>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div key={product.id} className="p-4 border border-gray-200 rounded-md sm:pr-2" >
      <div className="grid items-start grid-cols-12 gap-4">
        <div className="col-span-3">
          <Link href={`/${product.slug}`}>
            <img width={80} height={80} style={css} src={generateUri(product.image, 'h=100&fm=webp') || IMG_PLACEHOLDER} alt={product.name} className="object-cover object-center w-full h-full" onClick={handleRedirectToPDP} />
          </Link>
        </div>
        <div className="col-span-6">
          <h5 onClick={handleClose} className="font-light font-12 dark:text-black" >
            <Link href={`/${product.slug}`}>{product.name}</Link>
          </h5>
        </div>
        <div className="col-span-3 text-right">
          <div className="flex flex-col font-semibold dark:text-black">
            <span> {isIncludeVATInPriceDisplay(isIncludeVAT, product) ? product.price?.formatted?.withTax : product.price?.formatted?.withoutTax} </span>
            {isIncludeVATInPriceDisplay(isIncludeVAT, product) ? (
              product?.listPrice?.raw?.withTax > 0 && product?.listPrice?.raw?.withTax > product?.price?.raw?.withTax && (
                <span className="px-1 font-normal text-gray-400 line-through"> {product?.listPrice?.formatted?.withTax} </span>
              )
            ) : (
              product?.listPrice?.raw?.withoutTax > 0 && product?.listPrice?.raw?.withoutTax > product?.price?.raw?.withoutTax && (
                <span className="px-1 font-normal text-gray-400 line-through"> {product?.listPrice?.formatted?.withoutTax} </span>
              )
            )}
          </div>
          <div className="items-end text-xs font-light text-right text-gray-400">
            {isIncludeVATInPriceDisplay(isIncludeVAT, product) ? 'inc. VAT' : 'ex. VAT'}
          </div>
        </div>
        <div className="col-span-12 mt-2">
          <div className="grid items-center grid-cols-6 col-span-12 gap-4 mt-2">
            <div className="flex items-center justify-between col-span-2 px-2 rounded-md border-blue hover:border-sky-600 hover:text-blue hover:font-bold dark:text-black">
              {basketItemQty <= 1 ? (
                <button onClick={() => onUpdateKitBasket(product, CART_ACTION_TYPES.DELETE)}>
                  <TrashIcon className="w-4 text-black stroke-2" title="Remove from Cart" />
                </button>
              ) : (
                <MinusIcon onClick={() => onUpdateKitBasket(product, CART_ACTION_TYPES.DECREASE)} className="w-4 cursor-pointer" />
              )}
              <span className="px-2 py-2 text-md">{product?.qty / kitQty}</span>
              <PlusIcon className="w-5 cursor-pointer" onClick={() => onUpdateKitBasket(product)} />
            </div>
            <div className="flex justify-end col-span-4 font-size-sm">
              <button type="button" className="text-red-500" onClick={() => onUpdateKitBasket(product, CART_ACTION_TYPES.DELETE)}><TrashIcon className='w-5 h-5'/></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}