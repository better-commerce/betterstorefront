/* This example requires Tailwind CSS v2.0+ */
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useUI } from '@components/ui/context'
import Link from 'next/link'
import axios from 'axios'
import { Transition, Dialog } from '@headlessui/react'
import {
  ChatBubbleLeftEllipsisIcon,
  EnvelopeIcon,
  LinkIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { Fragment } from 'react'
import { CLOSE_PANEL } from '@components/utils/textVariables'
import {
  NEXT_GET_ORDER,
  NEXT_REFERRAL_ADD_USER_REFEREE,
  NEXT_REFERRAL_BY_EMAIL,
  NEXT_REFERRAL_BY_USERID,
  NEXT_REFERRAL_BY_USERNAME,
  NEXT_REFERRAL_CLICK_ON_INVITE,
  NEXT_REFERRAL_INVITE_SENT,
  NEXT_REFERRAL_SEARCH,
  NEXT_REFERRAL_INFO,
} from '@components/utils/constants'
import { Button, LoadingDots } from '@components/ui'
import { removeItem } from '@components/utils/localStorage'
import {
  BTN_BACK_TO_HOME,
  GENERAL_ADDRESSES,
  GENERAL_BILLING_ADDRESS,
  GENERAL_DELIVERED_BY,
  GENERAL_DELIVERY_ADDRESS,
  GENERAL_ITEMS,
  GENERAL_ON_THE_WAY,
  GENERAL_ORDER_WILL_BE_WITH_YOU_SOON,
  GENERAL_PAYMENT,
  GENERAL_PAYMENT_METHOD,
  GENERAL_PRICE,
  GENERAL_QUANTITY,
  GENERAL_SHIPPING,
  GENERAL_SHIPPING_ADDRESS,
  GENERAL_SHIPPING_METHOD,
  GENERAL_SUMMARY,
  GENERAL_TAX,
  GENERAL_THANK_YOU,
  GENERAL_TOTAL,
  GENERAL_YOUR_ORDER,
  IMG_PLACEHOLDER,
  LOADING_YOUR_ORDERS,
  NO_ORDER_PROVIDED,
  SUBTOTAL_EXCLUDING_TAX,
  SUBTOTAL_INCLUDING_TAX,
  YOUR_INFORMATION,
} from '@components/utils/textVariables'
import {
  ELEM_ATTR,
  ORDER_CONFIRMATION_AFTER_PROGRESS_BAR_ELEM_SELECTORS,
} from '@framework/content/use-content-snippet'
import Image from 'next/image'
import { generateUri } from '@commerce/utils/uri-util'
import { LocalStorage } from '@components/utils/payment-constants'
import { vatIncluded } from '@framework/utils/app-util'
import classNames from 'classnames'

export default function OrderConfirmation() {
  const [order, setOrderData] = useState<any>()
  const [isLoading, setIsLoading] = useState(true)
  const [isReferModalOpen, setIsReferModalOpen] = useState(false)
  const [shareReferralView, setShareReferralView] = useState(false)
  const [referralObj, setReferralObj] = useState({
    id: '',
    userId: '',
    name: '',
    slug: '',
    invitesSent: 0,
    clickOnInvites: 0,
    successfulInvites: 0,
  })
  const [copied, setCopied] = useState(false)
  let referralLink=''
  if(typeof window !== undefined ){
    const hostname = typeof window !== 'undefined' && window.location.hostname ? window.location.hostname : '';
    referralLink = hostname + '/?referral-code=' + (referralObj?.slug || '')
  }


  const handleCopyClick = async () => {
    try {
      await navigator.clipboard.writeText(referralLink)
      setCopied(true)
    } catch (error) {
      console.error('Failed to copy link:', error)
    }
  }
  const { setOrderId, orderId, user, setGuestUser, setIsGuestUser } = useUI()
  const isIncludeVAT = vatIncluded()
  const router = useRouter()
  useEffect(() => {
    const fetchOrder = async () => {
      const { data }: any = await axios.post(NEXT_GET_ORDER, {
        id: orderId,
      })
      setOrderData(data.order)
      setIsLoading(false)
    }
    removeItem(LocalStorage.Key.ORDER_RESPONSE)
    removeItem(LocalStorage.Key.ORDER_PAYMENT)
    setGuestUser({})
    setIsGuestUser(false)
    if (orderId) fetchOrder()
    if (!orderId) setIsLoading(false)
    return function cleanup() {
      setOrderId('')
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const setModelClose = () => {
    setIsReferModalOpen(false)
  }

  const handleReferralByEmail = async (e: any) => {
    // setIsReferModalOpen(true)
    let { data: data } = await axios.post(NEXT_REFERRAL_BY_EMAIL, {
      email: user.email,
    })
    setReferralObj(data?.referralDetails)
    // console.log('data in handle by email: ', data)
  }

  const handleReferralInfo = async (e: any) => {
    let { data: data } = await axios.get(NEXT_REFERRAL_INFO)
    console.log('data in referral Info ', data)
    if (data?.referralDetails?.referrerPromo) {
      setIsReferModalOpen(true)
      handleReferralByEmail(e)
    }
  }

  if (isLoading) {
    return (
      <main className="px-4 pt-16 pb-24 bg-white sm:px-6 sm:pt-24 lg:px-8 lg:py-32">
        <h2 className="w-full text-5xl font-extrabold text-center text-gray-600 uppercase tracking-light">
          {LOADING_YOUR_ORDERS}
        </h2>
        <div className="flex items-center justify-center w-full mt-10 text-gray-900">
          <LoadingDots />
        </div>
      </main>
    )
  }
  const css = { maxWidth: '100%', height: 'auto' }
  return (
    <>
      <main className="px-4 pt-6 pb-24 bg-gray-50 sm:px-6 sm:pt-6 lg:px-8 lg:py-2">
        <div className="max-w-3xl p-4 mx-auto bg-white rounded-md shadow-lg">
          <div className="max-w-xl">
            <p className="text-sm font-semibold tracking-wide text-indigo-600 uppercase">
              {order?.orderNo ? GENERAL_THANK_YOU : null}
            </p>
            <h1 className="mt-2 font-bold tracking-tight text-black uppercase">
              {order?.orderNo ? GENERAL_ON_THE_WAY : NO_ORDER_PROVIDED}
            </h1>
            {order?.orderNo ? (
              <p className="mt-2 text-black">
                {GENERAL_YOUR_ORDER}{' '}
                <span className="font-bold text-black">{order?.orderNo}</span>{' '}
                {GENERAL_ORDER_WILL_BE_WITH_YOU_SOON}
              </p>
            ) : null}
          </div>

          {order?.orderNo ? (
            <section
              aria-labelledby="order-heading"
              className="mt-10 border-t border-gray-200"
            >
              <h2 id="order-heading" className="sr-only">
                {GENERAL_YOUR_ORDER}
              </h2>

              <h3 className="sr-only">{GENERAL_ITEMS}</h3>
              {order?.items?.map((product: any) => (
                <>
                  <div
                    key={product.id}
                    className="flex py-10 space-x-6 border-b border-gray-200"
                  >
                    <div className="flex-shrink-0 w-24 h-24 overflow-hidden border border-gray-200 rounded-md">
                      <Image
                        style={css}
                        src={
                          generateUri(product.image, 'h=200&fm=webp') ||
                          IMG_PLACEHOLDER
                        }
                        width={200}
                        height={200}
                        alt={product.name}
                        className="flex-none object-cover object-center w-20 h-20 bg-gray-100 rounded-lg sm:w-40 sm:h-40"
                      ></Image>
                    </div>
                    <div className="flex flex-col flex-auto">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          <Link href={`/${product.slug}`}>{product.name}</Link>
                        </h4>
                        <p className="mr-1 text-sm text-gray-700 font-medium">
                          Size:{' '}
                          <span className="uppercase">{product.size}</span>
                        </p>
                      </div>
                      <div className="flex items-end mt-2">
                        <dl className="flex space-x-4 text-sm divide-x divide-gray-200 sm:space-x-6">
                          <div className="flex">
                            <dt className="font-medium text-gray-900">
                              {GENERAL_QUANTITY}
                            </dt>
                            <dd className="ml-2 text-gray-700">
                              {product.qty}
                            </dd>
                          </div>
                          <div className="flex pl-4 sm:pl-6">
                            <dt className="font-medium text-gray-900">
                              {GENERAL_PRICE}
                            </dt>
                            <dd className="ml-2 text-gray-700">
                              {product.price.formatted.withTax}
                            </dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                  </div>

                  <div
                    dangerouslySetInnerHTML={{
                      __html: product.shortDescription,
                    }}
                    className="mt-10 mb-10 text-sm text-gray-500 topspace lg:pl-5 sm:pl-2"
                  />
                </>
              ))}

              <div className="border-t border-gray-200 lg:pl-5 sm:pl-2 ">
                <h3 className="sr-only">{YOUR_INFORMATION}</h3>

                <h4 className="sr-only">{GENERAL_ADDRESSES}</h4>
                <dl className="grid grid-cols-2 py-10 text-sm gap-x-6">
                  <div>
                    <dt className="font-medium text-gray-900">
                      {/* {GENERAL_SHIPPING_ADDRESS} */}
                      {GENERAL_DELIVERY_ADDRESS}
                    </dt>
                    <dd className="mt-2 text-gray-700">
                      <address className="not-italic">
                        <span className="block">{`${order?.shippingAddress.firstName} ${order?.shippingAddress.lastName}`}</span>
                        <span className="block">{`${order?.shippingAddress?.phoneNo}`}</span>
                        <span className="block">{`${order?.shippingAddress?.address1}`}</span>
                        <span className="block">{`${order?.shippingAddress?.address2}`}</span>
                        <span className="block">{`${order?.shippingAddress?.city} ${order?.shippingAddress?.countryCode} ${order?.shippingAddress?.postCode}`}</span>
                      </address>
                    </dd>
                  </div>
                  {/* <div>
                    <dt className="font-medium text-gray-900">
                      {GENERAL_BILLING_ADDRESS}
                    </dt>
                    <dd className="mt-2 text-gray-700">
                      <address className="not-italic">
                        <span className="block">{`${order?.billingAddress?.firstName} ${order?.billingAddress?.lastName}`}</span>
                        <span className="block">{`${order?.shippingAddress?.phoneNo}`}</span>
                        <span className="block">{`${order?.billingAddress?.address1}`}</span>
                        <span className="block">{`${order?.billingAddress?.address2}`}</span>
                        <span className="block">{`${order?.billingAddress?.city} ${order?.billingAddress?.countryCode} ${order?.billingAddress?.postCode}`}</span>
                      </address>
                    </dd>
                  </div> */}
                </dl>

                <h4 className="sr-only">{GENERAL_PAYMENT}</h4>
                <dl className="grid grid-cols-2 py-10 text-sm border-t border-gray-200 gap-x-6">
                  {order?.payments && (
                    <div>
                      <dt className="font-medium text-gray-900">
                        {GENERAL_PAYMENT_METHOD}
                      </dt>
                      <dd className="mt-2 text-gray-700">
                        <p>{order?.payments[0]?.paymentMethod}</p>
                        {/* <p>{order?.payments[0]?.paymentGateway}</p> */}
                      </dd>
                    </div>
                  )}
                  <div>
                    <dt className="font-medium text-gray-900">
                      {GENERAL_SHIPPING_METHOD}
                    </dt>
                    <dd className="mt-2 text-gray-700">
                      <p>{order?.shipping?.displayName}</p>
                      <p>
                        {GENERAL_DELIVERED_BY}:{' '}
                        {new Date(
                          order?.shipping?.expectedDeliveryDate
                        ).toLocaleDateString()}
                      </p>
                    </dd>
                  </div>
                </dl>

                <h3 className="sr-only">{GENERAL_SUMMARY}</h3>

                <dl className="pt-10 space-y-6 text-sm border-t border-gray-200">
                  <div className="flex justify-between">
                    <dt className="font-medium text-gray-900">
                      {isIncludeVAT
                        ? SUBTOTAL_INCLUDING_TAX
                        : SUBTOTAL_EXCLUDING_TAX}
                    </dt>
                    <dd className="text-gray-700">
                      {isIncludeVAT
                        ? order?.subTotal?.formatted?.withTax
                        : order?.subTotal?.formatted?.withoutTax}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium text-gray-900">
                      {GENERAL_SHIPPING}
                    </dt>
                    <dd className="text-gray-700">
                      {isIncludeVAT
                        ? order?.shippingCharge.formatted?.withTax
                        : order?.shippingCharge.formatted?.withoutTax}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium text-gray-900">{GENERAL_TAX}</dt>
                    <dd className="text-gray-700">
                      {order?.grandTotal.formatted?.tax}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-lg font-bold text-gray-900">
                      {GENERAL_TOTAL}
                    </dt>
                    <dd className="text-lg font-bold text-gray-900">
                      {isIncludeVAT
                        ? order?.grandTotal?.formatted?.withTax
                        : order?.grandTotal?.formatted?.withTax}
                    </dd>
                  </div>
                </dl>
              </div>
            </section>
          ) : null}
          <div className="max-w-xl mt-5 text-center">
            <Link href={`/`} passHref>
              <span className="p-3 font-medium btn-primary">
                {BTN_BACK_TO_HOME}
              </span>
            </Link>
          </div>
        </div>
      </main>

      {/* Placeholder for order confirmation after progress bar snippet */}
      <div
        className={`${ELEM_ATTR}${ORDER_CONFIRMATION_AFTER_PROGRESS_BAR_ELEM_SELECTORS[0]}`}
      ></div>
      <Transition.Root show={isReferModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 overflow-hidden z-999"
          onClose={() => setModelClose()}
        >
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
              <Dialog.Overlay
                className="w-full h-screen bg-black opacity-50"
                onClick={() => setModelClose()}
              />
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
                <div className="w-screen max-w-xl">
                  <div className="flex flex-col h-full overflow-y-auto rounded shadow-xl bg-gray-50">
                    <div className="flex-1 px-0 overflow-y-auto">
                      <div className="sticky top-0 z-10 flex items-start justify-between w-full px-6 py-4 border-b shadow bg-indigo-50">
                        <Dialog.Title className="text-lg font-medium text-gray-900">
                          Refer a Friend
                        </Dialog.Title>
                        <div className="flex items-center ml-3 h-7">
                          <button
                            type="button"
                            className="p-2 -m-2 text-gray-400 hover:text-gray-500"
                            onClick={() => setModelClose()}
                          >
                            <span className="sr-only">{CLOSE_PANEL}</span>
                            <XMarkIcon className="w-6 h-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                      <div className="\py-2 mt-2 sm:px-0 flex flex-row">
                        {/*Referal Program Info view*/}
                        {shareReferralView ? (
                          <div className="my-20 flex w-full flex-col justify-center items-center">
                            <h3 className="px-5 text-center">
                              {referralObj.name} {'Invite now using:'}
                            </h3>
                            <div className="flex flex-row justify-center items-center">
                              <span className="h-5 w-5 mx-2 my-2 text-black">
                                <ChatBubbleLeftEllipsisIcon />
                              </span>
                              <span className="h-5 w-5 mx-2 my-2 text-black">
                                <EnvelopeIcon />
                              </span>
                              <span className="h-5 w-5 mx-2 my-2 text-black">
                                <LinkIcon />
                              </span>
                            </div>
                            <p className="px-5 text-center">
                              Tell your friends to enter your name like this at
                              Checkout
                            </p>
                            <h2 className="mx-2 text-lg">{referralObj?.name}</h2>
                            <Button className="my-3" onClick={() => {}}>
                              Tell them in person
                            </Button>
                            {referralObj?.slug && (
                              <div className="\w-full flex flex-col border-[1px] items-center justify-center border-black px-2 py-2">
                                <p className='w-full text-left'>or share a link:</p>
                                <div className="w-full flex items-center justify-between">
                                  <p className="mx-1 truncate">{referralLink}</p>
                                  <Button
                                    className="h-4 !text-[10px]"
                                    onClick={handleCopyClick}
                                  >
                                    {copied ? 'COPIED' : 'COPY LINK'}
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div
                            className={classNames(
                              'my-20 flex w-full flex-col justify-center items-center'
                            )}
                          >
                            <h2 className="px-5 text-center">
                              Treat a friend to $20 off and get $20 OFF when you
                              spend over $100 yourself
                            </h2>
                            <p className="px-5 text-center">
                              Our refer-a-friend programme is managed by Mention
                              Me who will process your data and send you
                              referral service emails.
                            </p>
                            <Button
                              className="my-3"
                              onClick={() => {
                                setShareReferralView(true)
                              }}
                            >
                              GET £20 OFF
                            </Button>
                          </div>
                        )}
                        <div className="flex w-full">
                          <Image
                          src={'/assets/images/refer-a-friend.jpg'}
                          alt='banner'
                          height={700}
                          width={480}
                          className='object-cover'
                          >
                          </Image>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  )
}
