import Link from 'next/link'
import Image from 'next/legacy/image'
import { PlusIcon } from '@heroicons/react/24/outline'
import { EyeIcon } from '@heroicons/react/24/outline'
import PromotionInput from '@components/cart/PromotionInput'
import Engraving from '@components/product/Engraving'
import classNames from 'classnames'
import { Disclosure, Transition } from '@headlessui/react'
import { ChevronUpIcon } from '@heroicons/react/24/outline'
import {
  GENERAL_DISCOUNT,
  GENERAL_ORDER_SUMMARY,
  GENERAL_PRICE_LABEL_RRP,
  GENERAL_SHIPPING,
  GENERAL_TAX,
  GENERAL_TOTAL,
  IMG_PLACEHOLDER,
  ITEMS_IN_YOUR_CART,
  SUBTOTAL_EXCLUDING_TAX,
  SUBTOTAL_INCLUDING_TAX,
} from '@components/utils/textVariables'
import { useState } from 'react'
import { tryParseJson } from '@framework/utils/parse-util'
import { ShoppingCartIcon } from '@heroicons/react/24/outline'
import { vatIncluded } from '@framework/utils/app-util'
let PERSONALISED_TEXT = ''
let PERSONALIZATION = ''

export default function Summary({
  cart,
  handleItem,
  confirmOrder,
  basketPromos,
  cartItems,
  getBasketPromos,
  isShippingDisabled,
}: any) {
  const [isEngravingOpen, setIsEngravingOpen] = useState(false)
  const [selectedEngravingProduct, setSelectedEngravingProduct] = useState(null)

  const handleToggleEngravingModal = (product?: any) => {
    if (product) setSelectedEngravingProduct(product)
    setIsEngravingOpen(!isEngravingOpen)
  }
  const isIncludeVAT = vatIncluded()

  function getProductVariantDetailsByName(productName: string) {
    const details = {
      name: '',
      color: '',
      size: '',
    }

    if (productName) {
      console.log('productName', JSON.stringify(productName))
      const productNameArrStr = productName.split(' ')
      details.name = productNameArrStr
        .slice(0, productNameArrStr.length - 3)
        .join(' ')
      details.color = productNameArrStr[productNameArrStr.length - 3]
      details.size = productNameArrStr[productNameArrStr.length - 2]
    }

    return details
  }

  const getLineItemSizeWithoutSlug = (product: any) => {
    const productData: any = tryParseJson(product?.attributesJson || {})
    return productData?.Size
  }

  return (
    <div className="top-0 mt-0 lg:mt-0 md:sticky">
      <div className="w-full px-0 pt-0">
        <div className="w-full mx-auto bg-white">
          <Disclosure>
            {({ open }) => (
              <>
                <Disclosure.Button
                  className={classNames(
                    'text-lg font-bold text-gray-900 uppercase w-full text-left mobile-view-on border border-gray-200 bg-white shadow p-5',
                    {
                      'mb-3': !open,
                    }
                  )}
                >
                  <div className="flex w-full px-3 justify-left">
                    <div className="flex text-initial">
                      <h2 className="align-middle text-md img-sumry-view">
                        {/* <Image
                          className="align-middle"
                          height={22}
                          width={22}
                          src="/image/bas1.png"
                          alt="logo"
                        ></Image> */}
                        <ShoppingCartIcon className="w-4 h-4" />
                        <span className="ml-3 link-button !text-base">
                          {GENERAL_ORDER_SUMMARY}
                        </span>
                      </h2>
                    </div>
                    <div className="mobile-view-on">
                      <ChevronUpIcon
                        className={`${
                          !open ? 'rotate-180 transform' : ''
                        } h-5 w-5 mt-1 ml-1 text-gray-900`}
                      />
                    </div>
                    <div className="flex-1 font-bold text-right xsm:w-full">
                      {isIncludeVAT
                        ? cart.grandTotal?.formatted?.withTax
                        : cart.grandTotal?.formatted?.withoutTax}
                    </div>
                  </div>
                </Disclosure.Button>
                <Disclosure.Panel className="w-full p-6 pb-2 mb-3 text-sm text-gray-500 bg-white border border-gray-200 shadow desk-disclouser-view-hide">
                  <div className="mt-0 bg-white">
                    {/* <h2 className="px-5 py-4 mb-3 text-lg font-bold text-gray-900 uppercase bg-gray-200 border-b rounded-t-md">{GENERAL_ORDER_SUMMARY}</h2> */}
                    <h3 className="sr-only">{ITEMS_IN_YOUR_CART}</h3>
                    <ul role="list" className="divide-y divide-gray-200">
                      {cart.lineItems?.map((product: any) => {
                        let personalization = ''
                        if (product?.customInfo1 != '') {
                          const message = JSON.parse(product?.customInfo1)
                          personalization = message?.formatted?.data?.Message
                        }
                        return (
                          <li key={product.id} className="flex">
                            {cart.lineItems.map((val: any) => {
                              if (val.customInfo1 !== '') {
                                PERSONALISED_TEXT = personalization
                              }
                              if (val.name !== '') {
                                PERSONALIZATION = val.name
                              }
                            })}
                            <div className="flex-shrink-0">
                              <Link href={`/${product.slug}`}>
                                <Image
                                  layout="fixed"
                                  width={80}
                                  height={100}
                                  src={`${product.image}` || IMG_PLACEHOLDER}
                                  alt={product.name}
                                  className="object-cover w-full h-full"
                                ></Image>
                              </Link>
                            </div>

                            <div className="flex flex-col flex-1 ml-6">
                              <div className="flex">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between text-sm">
                                    <Link
                                      href={`/${product.slug}`}
                                      className="inline-block font-bold text-gray-900 uppercase hover:text-gray-800 hover:underline"
                                    >
                                      <p>{product?.name}</p>
                                    </Link>
                                    <p className="inline-block text-sm font-medium text-gray-900">
                                      {isIncludeVAT
                                        ? product.price?.formatted?.withTax
                                        : product.price?.formatted?.withoutTax}
                                      {product.listPrice?.raw.withTax > 0 &&
                                      product.listPrice?.raw.withTax !=
                                        product.price?.raw?.withTax ? (
                                        <span className="px-2 text-sm text-red-400 line-through">
                                          {GENERAL_PRICE_LABEL_RRP}{' '}
                                          {isIncludeVAT
                                            ? product.listPrice.formatted
                                                ?.withTax
                                            : product.listPrice.formatted
                                                ?.withoutTax}
                                        </span>
                                      ) : null}
                                    </p>
                                  </div>
                                  <p className="font-normal text-gray-700 text-ms">
                                    Size {getLineItemSizeWithoutSlug(product)}
                                  </p>
                                  {product?.children?.map(
                                    (child: any, childId: number) => {
                                      const message = JSON.parse(
                                        child.customInfo1
                                      )
                                      const customMsg =
                                        message?.formatted?.data?.Message
                                      const customCol =
                                        message?.formatted?.data?.Colour
                                      const customFont =
                                        message?.formatted?.data?.Font
                                      const customPos =
                                        message?.formatted?.data?.Position

                                      return (
                                        <>
                                          <div
                                            className="flex justify-between mt-1"
                                            key={childId}
                                          >
                                            <div>
                                              <p className="text-sm text-gray-900">
                                                {child.name}
                                              </p>
                                            </div>
                                            <label className="text-sm text-gray-900">
                                              <PlusIcon
                                                className="inline-block -mt-1"
                                                style={{
                                                  width: '0.85rem',
                                                  height: '0.85rem',
                                                }}
                                              />
                                              {isIncludeVAT
                                                ? child?.price?.formatted
                                                    ?.withTax
                                                : child?.price?.formatted
                                                    ?.withoutTax}
                                            </label>
                                          </div>
                                          <div className="text-gray-700 text-ms">
                                            <span
                                              title="Message"
                                              className={classNames({
                                                'font-rubikBubblesMerged':
                                                  customFont ===
                                                  'rubikBubblesMerged',
                                                'font-YeonSungRegularMerged':
                                                  customFont ===
                                                  'YeonSungRegularMerged',
                                                'font-KSTM1Merged':
                                                  customFont === 'KSTM1Merged',
                                                'font-Cantarell-RegularMergedSymbols':
                                                  customFont ===
                                                  'Cantarell-RegularMergedSymbols',
                                              })}
                                            >
                                              {customMsg}
                                            </span>
                                            {' | '}
                                            <span
                                              className="align-middle cursor-pointer"
                                              onClick={() =>
                                                handleToggleEngravingModal(
                                                  product
                                                )
                                              }
                                              title="View Personalisation"
                                            >
                                              <EyeIcon className="inline-block w-4 h-4 -mt-3 text-gray-900 hover:text-gray-400" />
                                            </span>
                                            {/* <span 
                                title="Colour"
                                className='inline-block w-4 h-4 border border-gray-300' 
                                style={{
                                  backgroundColor: customCol,
                                  verticalAlign: 'sub',
                                }}
                              />{' | '}
                              <span title='Font'>
                                {customFont}
                              </span>{' | '}
                              <span title='Font'>
                                {customPos}
                              </span> */}
                                          </div>
                                        </>
                                      )
                                    }
                                  )}
                                </div>
                              </div>
                            </div>
                          </li>
                        )
                      })}
                    </ul>
                    <hr></hr>
                    <div className="pt-2 mx-4 ">
                      <Disclosure
                        defaultOpen={cart.promotionsApplied?.length > 0}
                      >
                        {({ open }) => (
                          <>
                            <Disclosure.Button className="flex justify-between py-2 text-sm font-medium text-left underline rounded-lg text-green focus-visible:ring-opacity-75 link-button">
                              <span>Apply Promo?</span>
                            </Disclosure.Button>
                            <Transition
                              enter="transition duration-100 ease-out"
                              enterFrom="transform scale-95 opacity-0"
                              enterTo="transform scale-100 opacity-100"
                              leave="transition duration-75 ease-out"
                              leaveFrom="transform scale-100 opacity-100"
                              leaveTo="transform scale-95 opacity-0"
                            >
                              <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                                <PromotionInput
                                  basketPromos={basketPromos}
                                  items={cartItems}
                                  getBasketPromoses={getBasketPromos}
                                />
                              </Disclosure.Panel>
                            </Transition>
                          </>
                        )}
                      </Disclosure>
                    </div>
                    <dl className="px-4 py-2 space-y-2 border-gray-200 sm:px-6">
                      <div className="flex items-center justify-between">
                        <dt className="text-sm text-gray-900">
                          {isIncludeVAT
                            ? SUBTOTAL_INCLUDING_TAX
                            : SUBTOTAL_EXCLUDING_TAX}
                        </dt>
                        <dd className="text-gray-900 text-md">
                          {isIncludeVAT
                            ? cart.subTotal?.formatted?.withTax
                            : cart.subTotal?.formatted?.withoutTax}
                        </dd>
                      </div>
                      {isShippingDisabled ? null : (
                        <div className="flex items-center justify-between">
                          <dt className="text-sm text-gray-900">
                            {GENERAL_SHIPPING}
                          </dt>
                          <dd className="text-gray-900 text-md">
                            {isIncludeVAT
                              ? cart.shippingCharge?.formatted?.withTax
                              : cart.shippingCharge?.formatted?.withoutTax}
                          </dd>
                        </div>
                      )}
                      {cart.promotionsApplied?.length > 0 && (
                        <div className="flex items-center justify-between pt-2">
                          <dt className="text-sm text-gray-900">
                            <span>{GENERAL_DISCOUNT}</span>
                          </dt>
                          <dd className="text-red-500 text-md">
                            <p>
                              {'-'}
                              {isIncludeVAT
                                ? cart.discount?.formatted?.withTax
                                : cart.discount?.formatted?.withoutTax}
                            </p>
                          </dd>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <dt className="text-sm text-gray-900">{GENERAL_TAX}</dt>
                        <dd className="text-gray-900 text-md">
                          {cart.grandTotal?.formatted?.tax}
                        </dd>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t">
                        <dt className="text-xl font-semibold text-gray-900 link-button">
                          {GENERAL_TOTAL}
                        </dt>
                        <dd className="text-xl font-semibold text-gray-900">
                          {isIncludeVAT
                            ? cart.grandTotal?.formatted?.withTax
                            : cart.grandTotal?.formatted?.withoutTax}
                        </dd>
                      </div>
                    </dl>

                    {/* <div className="px-4 py-6 border-t border-gray-200 sm:px-6">
          <button
            type="button"
            onClick={confirmOrder}
            className="w-full px-4 py-3 font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500"
          >
            {GENERAL_CONFIRM_ORDER}
          </button>
        </div> */}

                    {/* read-only engraving modal */}
                    {selectedEngravingProduct && (
                      <Engraving
                        show={isEngravingOpen}
                        showEngravingModal={setIsEngravingOpen}
                        product={selectedEngravingProduct}
                        handleToggleDialog={handleToggleEngravingModal}
                        readOnly={true}
                      />
                    )}
                  </div>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
          {/* /////////hide data */}
          <div className="mt-0 bg-white border border-gray-200 shadow-sm deskdataonmobile hideipad">
            <h4 className="px-5 py-4 mb-3 font-bold text-gray-900 uppercase bg-gray-200 border-b bg-nav !mt-0">
              {GENERAL_ORDER_SUMMARY}
            </h4>

            <div className="mt-0 bg-white shadow-sm deskdataonmobile">
              {/* <h2 className="px-5 py-4 mb-3 text-lg font-bold text-gray-900 uppercase bg-gray-200 border-b rounded-t-md">{GENERAL_ORDER_SUMMARY}</h2> */}
              <h3 className="sr-only">{ITEMS_IN_YOUR_CART}</h3>
              <ul role="list" className="divide-y divide-gray-200">
                {cart.lineItems?.map((product: any) => {
                  let personalization = ''
                  if (product?.customInfo1 != '') {
                    const message = JSON.parse(product?.customInfo1)
                    personalization = message?.formatted?.data?.Message
                  }
                  return (
                    <li key={product.id} className="flex px-4 py-3 sm:px-6">
                      {cart.lineItems.map((val: any) => {
                        if (val.customInfo1 !== '') {
                          PERSONALISED_TEXT = personalization
                        }
                        if (val.name !== '') {
                          PERSONALIZATION = val.name
                        }
                      })}
                      <div className="flex-shrink-0">
                        <Link
                          href={`/${product.slug}`}
                          className="inline-block font-medium text-gray-700 hover:text-gray-800 hover:underline"
                        >
                          <Image
                            layout="fixed"
                            width={80}
                            height={100}
                            src={`${product.image}` || IMG_PLACEHOLDER}
                            alt={product.name}
                            className="object-cover w-full h-full"
                          ></Image>
                        </Link>
                      </div>

                      <div className="flex flex-col flex-1 ml-6">
                        <div className="flex">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between text-sm">
                              <Link
                                href={`/${product.slug}`}
                                className="inline-block font-bold text-gray-700 uppercase hover:text-gray-800 hover:underline"
                              >
                                <p>{product?.name}</p>
                              </Link>
                              <p className="inline-block text-sm font-bold text-gray-700 uppercase">
                                {isIncludeVAT
                                  ? product.price?.formatted?.withTax
                                  : product.price?.formatted?.withoutTax}
                                {product.listPrice?.raw.withTax > 0 &&
                                product.listPrice?.raw.withTax !=
                                  product.price?.raw?.withTax ? (
                                  <span className="px-2 text-sm text-red-400 line-through">
                                    {GENERAL_PRICE_LABEL_RRP}{' '}
                                    {isIncludeVAT
                                      ? product.listPrice?.formatted?.withTax
                                      : product.listPrice?.formatted
                                          ?.withoutTax}
                                  </span>
                                ) : null}
                              </p>
                            </div>
                            <p className="font-normal text-gray-700 text-ms">
                              Size {getLineItemSizeWithoutSlug(product)}
                            </p>
                            <div>{}</div>
                            {product?.children?.map(
                              (child: any, childId: number) => {
                                const customInfo1: any = tryParseJson(
                                  child.customInfo1
                                )
                                const customInfo1FormattedData =
                                  customInfo1?.formatted?.data || null
                                const personalizationFont = `font-${customInfo1FormattedData?.Font}`

                                return (
                                  <>
                                    <div
                                      className="flex justify-between mt-1"
                                      key={childId}
                                    >
                                      <div>
                                        <p className="text-sm text-gray-900">
                                          {child.name}
                                        </p>
                                      </div>
                                      <label className="text-sm text-gray-900">
                                        <PlusIcon
                                          className="inline-block -mt-1"
                                          style={{
                                            width: '0.85rem',
                                            height: '0.85rem',
                                          }}
                                        />
                                        {isIncludeVAT
                                          ? child?.price?.formatted?.withTax
                                          : child?.price?.formatted?.withoutTax}
                                      </label>
                                    </div>
                                    {customInfo1FormattedData && (
                                      <div className="text-gray-700 text-ms">
                                        <span
                                          title="Message"
                                          className={personalizationFont}
                                        >
                                          {customInfo1FormattedData?.Message}
                                        </span>
                                        {' | '}
                                        <span
                                          className="align-middle cursor-pointer"
                                          onClick={() =>
                                            handleToggleEngravingModal(product)
                                          }
                                          title="View Personalisation"
                                        >
                                          <EyeIcon className="inline-block w-4 h-4 -mt-3 text-gray-900 hover:text-gray-400" />
                                        </span>
                                      </div>
                                    )}
                                  </>
                                )
                              }
                            )}
                          </div>
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
              <hr className=""></hr>
              <div className="mx-6 mt-2 ">
                <Disclosure defaultOpen={cart.promotionsApplied?.length > 0}>
                  {({ open }) => (
                    <>
                      <Disclosure.Button className="flex justify-between py-2 text-sm font-medium text-left underline rounded-lg opacity-75 text-green focus-visible:ring- link-button">
                        <span>Apply Promo?</span>
                      </Disclosure.Button>
                      <Transition
                        enter="transition duration-100 ease-out"
                        enterFrom="transform scale-95 opacity-0"
                        enterTo="transform scale-100 opacity-100"
                        leave="transition duration-75 ease-out"
                        leaveFrom="transform scale-100 opacity-100"
                        leaveTo="transform scale-95 opacity-0"
                      >
                        <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                          <PromotionInput
                            basketPromos={basketPromos}
                            items={cartItems}
                            getBasketPromoses={getBasketPromos}
                          />
                        </Disclosure.Panel>
                      </Transition>
                    </>
                  )}
                </Disclosure>
              </div>
              <dl className="px-4 py-2 space-y-2 border-gray-200 sm:px-6">
                <div className="flex items-center justify-between font-semibold text-black text-md">
                  <dt>
                    {isIncludeVAT
                      ? SUBTOTAL_INCLUDING_TAX
                      : SUBTOTAL_EXCLUDING_TAX}
                  </dt>
                  <dd>
                    {isIncludeVAT
                      ? cart.subTotal?.formatted?.withTax
                      : cart.subTotal?.formatted?.withoutTax}
                  </dd>
                </div>
                {isShippingDisabled ? null : (
                  <div className="flex items-center justify-between text-sm text-gray-900">
                    <dt>{GENERAL_SHIPPING}</dt>
                    <dd>
                      {isIncludeVAT
                        ? cart.shippingCharge?.formatted?.withTax
                        : cart.shippingCharge?.formatted?.withoutTax}
                    </dd>
                  </div>
                )}
                {cart.promotionsApplied?.length > 0 && (
                  <div className="flex items-center justify-between">
                    <dt className="text-sm text-gray-900">
                      <span>{GENERAL_DISCOUNT}</span>
                    </dt>
                    <dd className="text-red-500 text-md">
                      <p>
                        {'-'}
                        {isIncludeVAT
                          ? cart.discount?.formatted?.withTax
                          : cart.discount?.formatted?.withoutTax}
                      </p>
                    </dd>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-gray-900">{GENERAL_TAX}</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {cart.grandTotal?.formatted?.tax}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-lg font-bold text-gray-900 uppercase">
                    {GENERAL_TOTAL}
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {isIncludeVAT
                      ? cart.grandTotal?.formatted?.withTax
                      : cart.grandTotal?.formatted?.withoutTax}
                  </dd>
                </div>
              </dl>
              {/* read-only engraving modal */}
              {selectedEngravingProduct && (
                <Engraving
                  show={isEngravingOpen}
                  showEngravingModal={setIsEngravingOpen}
                  product={selectedEngravingProduct}
                  handleToggleDialog={handleToggleEngravingModal}
                  readOnly={true}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
