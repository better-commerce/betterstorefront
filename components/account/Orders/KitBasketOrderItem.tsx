import { Fragment, useEffect, useState } from 'react'
import sumBy from 'lodash/sumBy'
import { Disclosure } from '@headlessui/react'
import { IMG_PLACEHOLDER } from '@components/utils/textVariables'
import { generateUri } from '@commerce/utils/uri-util'
import { useUI } from '@components/ui'
import { roundToDecimalPlaces, stringToBoolean } from '@framework/utils/parse-util'
import KitOrderItems from './KitOrderItem'

const KitBasketOrderItem = ({ orderItem, openHelpModal }: any) => {
  const { includeVAT, currency } = useUI()
  const isIncludeVAT = stringToBoolean(includeVAT)
  const [brandInfo, setBrandInfo] = useState<any>({})
  const [kitQty, setKitQty] = useState<any>(0)
  const [totalKitPriceWithTax, setTotalKitPriceWithTax] = useState('0.00')
  const [totalKitPriceWithoutTax, setTotalKitPriceWithoutTax] = useState('0.00')
  const currencySymbol = orderItem[0].price?.currencySymbol
  useEffect(() => {
    if (orderItem?.length < 1) return

    let orderItemGroupData: any = {}
    let orderItemGroupId = ''

    let orderData = orderItem

    if (orderItem[0] && orderItem[0].product) {
      // check for different data source (ThankYou page)
      orderItemGroupData = orderItem[0].product.orderItemGroupData
      orderItemGroupId = orderItem[0].product.orderItemGroupId
      orderData = orderItem?.map((o: any) => o.product)
    } else {
      orderItemGroupData = orderItem[0].orderItemGroupData
      orderItemGroupId = orderItem[0].orderItemGroupId
    }

    // set kit brand info
    setBrandInfo({
      ...orderItemGroupData,
      orderItemGroupId,
    })
    // set kit qty
    const kitQty = orderItemGroupData?.kitQty || 0
    setKitQty(kitQty)
    // set total kit price amount
    setTotalKitPriceWithTax(
      roundToDecimalPlaces(
        sumBy(orderData, (o: any) => {
          return o.price.raw.withTax * o.qty
        }) / kitQty
      )
    )
    setTotalKitPriceWithoutTax(
      roundToDecimalPlaces(
        sumBy(orderData, (o: any) => {
          return o.price.raw.withoutTax * o.qty
        }) / kitQty
      )
    )
  }, [orderItem])

  return (
    <div className="p-2 mb-4 border border-gray-300 rounded-md bg-sky-50">
      <div className="flex items-center gap-4">
        <div className='p-2 bg-gray-200 rounded'>
          <img width={80} height={80} src={generateUri(brandInfo?.image, 'h=100&fm=webp') || IMG_PLACEHOLDER} alt={brandInfo?.brand || "brand"} className="object-contain object-center" />
        </div>
        <div className='w-full remove-cancel-thank-you'>
          <div className="flex justify-between w-full">
            <h5 className="font-medium text-left text-black font-16 dark:text-black">
              {brandInfo?.brand} {brandInfo?.platform} Custom Kit
            </h5>
            <span className="justify-end font-semibold text-black font-18 dark:text-black">
              {currencySymbol}{isIncludeVAT ? totalKitPriceWithTax : totalKitPriceWithoutTax}
            </span>
          </div>
        </div>
      </div>

      {/* kit products and edit view */}
      <div>
        <Disclosure defaultOpen={true}>
          {({ open }) => (
            <>
              <div className="flex items-center justify-between font-semibold">
                <p className='uppercase dark:text-black'>Kit items ({orderItem?.length})</p>
                <Disclosure.Button className="py-2">
                  <p className="!py-0 border-b-2 border-red-500 dark:text-black">
                    {open ? 'Hide' : 'View'}
                  </p>
                </Disclosure.Button>
              </div>
              <Disclosure.Panel className="text-gray-500">
                {orderItem?.map((item: any, idx: number) => (
                  <Fragment key={`order-items-${idx}`}>
                    {item?.statusDisplay !== "Cancelled" &&
                      <KitOrderItems orderItem={item?.product || item} isKitOrderItem={true} openHelpModal={openHelpModal} />
                    }
                  </Fragment>
                ))}
                {orderItem?.map((item: any, idx: number) => (
                  <Fragment key={`order-items-${idx}`}>
                    {item?.statusDisplay === "Cancelled" &&
                      <KitOrderItems orderItem={item?.product || item} isKitOrderItem={true} openHelpModal={openHelpModal} />
                    }
                  </Fragment>
                ))}
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>
    </div>
  )
}

export default KitBasketOrderItem
