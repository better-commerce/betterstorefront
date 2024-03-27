import { useEffect, useState } from 'react'
import { Disclosure } from '@headlessui/react'
import sumBy from 'lodash/sumBy'
import Link from 'next/link'
import { TrashIcon } from '@heroicons/react/24/outline'
import axios from 'axios'

//
import { generateUri } from '@commerce/utils/uri-util'
import { IMG_PLACEHOLDER } from '@new-components/utils/textVariables'
import { NEXT_BULK_ADD_TO_CART } from '@new-components/utils/constants'
import { LoadingDots, useUI } from '@new-components/ui'
import { matchStrings, stringToBoolean } from '@framework/utils/parse-util'
import { useTranslation } from '@commerce/utils/use-translation'

const maxKitBasketItemsCount = 5

export default function BasketGroupProduct({
  products,
  closeSidebar = () => { },
  openModal,
  setItemClicked,
}: any) {
  const translate = useTranslation()
  const { basketId, setCartItems, cartItems, kitCartLoaded, setKitCartLoaded, includeVAT, currency, openBasketRemoveItemView } = useUI()
  const isIncludeVAT = stringToBoolean(includeVAT)
  const [brandInfo, setBrandInfo] = useState<any>({})
  const [totalKitPriceWithTax, setTotalKitPriceWithTax] = useState('0.00')
  const [totalKitPriceWithoutTax, setTotalKitPriceWithoutTax] = useState('0.00')
  const [kitQty, setKitQty] = useState<any>(0)
  const [cartLineItems, setCartLineItems] = useState<any>(null)

  useEffect(() => {
    if (products?.length < 1) return
    // set kit brand info
    setBrandInfo({
      ...products[0].basketItemGroupData,
      basketItemGroupId: products[0].basketItemGroupId,
    })
    // set kit qty
    const kitQty = products[0].basketItemGroupData.kitQty
    setKitQty(kitQty)
    // set total kit price amount
    setTotalKitPriceWithTax(
      (
        sumBy(products, (o: any) => {
          return o.price.raw.withTax * o.qty
        }) / kitQty
      ).toFixed(2)
    )
    setTotalKitPriceWithoutTax(
      (
        sumBy(products, (o: any) => {
          return o.price.raw.withoutTax * o.qty
        }) / kitQty
      ).toFixed(2)
    )
  }, [products])

  const handleChangeKitQty = (e: any) => {
    const qtyVal = +e.target.value
    handleUpdateBulkCart(qtyVal)
  }

  useEffect(() => {
    const items = cartItems?.lineItems?.filter((o: any) =>
      matchStrings(o.basketItemGroupId, brandInfo?.basketItemGroupId, true)
    )
    setCartLineItems(items)
  }, [cartItems, brandInfo?.basketItemGroupId])

  const handleUpdateBulkCart = async (kitQtyVal: number) => {
    if (kitCartLoaded) return
    try {
      setKitCartLoaded(true)
      const bulkAddPayload: any = {
        basketId,
        products: [],
      }
      cartLineItems?.forEach((o: any) => {
        const dbQty = kitQtyVal > 0 ? (o.qty / kitQty) * kitQtyVal - o.qty : 0
        bulkAddPayload.products.push({
          productId: o.recordId || o.productId,
          stockCode: o.stockCode,
          displayOrder: o.displayOrder,
          qty: dbQty,
          basketItemGroupId: o.basketItemGroupId,
          basketItemGroupData: {
            ...o.basketItemGroupData,
            kitQty: kitQtyVal,
          },
        })
      })
      const { data: newCart }: any = await axios.post(NEXT_BULK_ADD_TO_CART, {
        data: bulkAddPayload,
      })
      setCartItems(newCart)
      setKitQty(kitQty)
      setKitCartLoaded(false)
    } catch (error) {
      setKitCartLoaded(false)
      // console.log(error)
    }
  }

  return (
    <div className="p-2 mb-2 bg-white border border-gray-200 rounded-md sm:pr-2">
      <div className="grid items-start grid-cols-12 gap-4">
        <div className="col-span-3">
          <img
            width={80}
            height={80}
            src={
              generateUri(brandInfo?.image, 'h=100&fm=webp') || IMG_PLACEHOLDER
            }
            alt={brandInfo?.brand}
            className="object-cover object-center w-full h-full"
          />
        </div>
        <div className="col-span-9">
          <div className="flex justify-between">
            <h5 className="box-border pr-4 font-14 dark:text-black">
              {brandInfo?.brand} {brandInfo?.platform}{translate('label.basket.customKitText')}
            </h5>
            <span className='dark:text-black'>
              {currency?.currencySymbol}
              {isIncludeVAT ? totalKitPriceWithTax : totalKitPriceWithoutTax}
            </span>
          </div>
          <div className="flex items-center justify-end mt-4 show-on-checkout">
            <div className='justify-end'><span className='flex flex-col font-semibold text-black'>{translate('common.label.qtyText')}{' '}{kitQty}</span></div>
          </div>
          <div className="flex items-center justify-between mt-4 hide-on-checkout">
            <select
              value={kitQty}
              className="w-20 px-2 py-2 border dark:bg-white dark:text-black"
              onChange={handleChangeKitQty}
              disabled={kitCartLoaded}
            >
              {Array(maxKitBasketItemsCount)
                .fill('')
                .map((o: any, idx: number) => (
                  <option key={idx} value={idx + 1}>
                    {idx + 1}
                  </option>
                ))}
            </select>
            <div>
              <span
                className="block p-2 cursor-pointer"
                title={translate('label.basket.removeKitText')}
                onClick={() => {
                  openModal()
                  setItemClicked(products)
                }}
              >
                <TrashIcon className="w-5 h-5 text-black stroke-2" />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* kit products and edit view */}
      <div>
        <Disclosure defaultOpen={false}>
          {({ open }) => (
            <>
              <div className="flex items-center justify-between pb-1 font-semibold dark:text-black">
                <span className='font-bold text-black uppercase'>
                  {translate('label.basket.kitItemsText')}({products?.length})
                  {kitCartLoaded && (
                    <span className="ml-2">
                      <LoadingDots />
                    </span>
                  )}
                </span>
                <Disclosure.Button className="py-2">
                  <span className="border-b-2 border-red-500">
                    {open ? translate('common.label.hideText') : translate('common.label.viewText')}
                  </span>
                </Disclosure.Button>
              </div>
              <Disclosure.Panel className="pt-3 text-gray-500 border-t border-gray-300">
                {products?.map((product: any) => (
                  <div key={product.productId} className="grid items-center grid-cols-12 pb-2 mb-2 border-b border-gray-300 border-dashed">
                    <div className='items-center justify-center flex-1 w-8 h-8 col-span-1 pt-1 font-semibold text-center text-white bg-orange-600 rounded-full'>
                      <span>{product.qty / kitQty}</span>
                    </div>
                    <div className='col-span-8 pl-3 text-black font-14'>{product.name}</div>
                    <div className='justify-end col-span-3 font-semibold text-right text-black font-14'>
                      {isIncludeVAT ? product?.price?.formatted?.withTax : product?.price?.formatted?.withoutTax}
                    </div>
                  </div>
                ))}
                <Link
                  href={`/kit/brand/${brandInfo?.brand}?platform=${brandInfo?.platform}&basketItemGroupId=${brandInfo?.basketItemGroupId}&mode=edit&kitQty=${kitQty}`}
                  className="block w-full p-2 mt-4 font-semibold text-center text-black uppercase bg-white border border-gray-400 rounded hover:border-orange-600 hover:text-orange-600"
                  onClick={closeSidebar}
                >
                 {translate('label.kitBuilder.editMyKitBtnText')}
                </Link>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>
    </div>
  )
}
