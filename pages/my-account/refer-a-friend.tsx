import { useState, useEffect, Fragment } from 'react'
import { Layout } from '@components/common'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import { config } from '@components/utils/myAccount'
import withAuth from '@components/utils/withAuth'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { EVENTS_MAP } from '@components/services/analytics/constants'
import useAnalytics from '@components/services/analytics/useAnalytics'
import { useUI } from '@components/ui/context'
import React from 'react'
import { Disclosure } from '@headlessui/react'
import { Transition } from '@headlessui/react'
import axios from 'axios'
import {
  NEXT_REFERRAL_BY_EMAIL,
  NEXT_REFERRAL_CLICK_ON_INVITE,
  NEXT_REFERRAL_INFO,
  NEXT_REFERRAL_INVITE_SENT,
  NEXT_REFERRAL_VOUCHERS,
} from '@components/utils/constants'
import {
  INVITES_SENT,
  CLICKS_ON_INVITES,
  SUCCESSFUL_INVITES,
  NO_INVITES,
  SHARE_IN_PERSON,
  SHARE_BY_EMAIL,
  SUCCESSFUL_INVITE,
  VOUCHERS_EARNED,
  VOUCHERS_NOT_EARNED,
  CLICK_TO_SHARE_BY_EMAIL,
} from '@components/utils/textVariables'
import {
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline'
import Spinner from '@components/ui/Spinner'


function ReferralPage({ defaultView, isLoggedIn, deviceInfo }: any) {
  const { user, deleteUser, isGuestUser, displayDetailedOrder } = useUI()
  const router = useRouter()
  const [isShow, setShow] = useState(true)
  const [view, setView] = useState(defaultView)
  const { CustomerProfileViewed } = EVENTS_MAP.EVENT_TYPES
  const { Customer } = EVENTS_MAP.ENTITY_TYPES
  const [active, setActive] = useState(false)
  const [referralLink, setReferralLink] = useState('')
  const [referralOffers, setReferralOffers] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [vouchersEarned, setVouchersEarned] = useState<any>(null)
  const [referralInfo, setReferralInfo] = useState({
    id: '',
    userId: '',
    name: '',
    slug: '',
    invitesSent: 0,
    clickOnInvites: 0,
    successfulInvites: 0,
  })

  const REFERRAL_CODE_INSTRUCTIONS = <><p className="px-5">
  Just tell your friends to mention your Referral Code
</p></>

  const REFERRAL_INSTRUCTIONS = <> All they need to do to get their reward is to
  click on the Link asking if they've <b>Been referred
  by a friend?</b> in the checkout and enter Referral
  Code.</>

  const handleInviteSent = async (referralId: any) => {
    let inviteInfo = await axios.post(NEXT_REFERRAL_INVITE_SENT, {
      referralId: referralInfo?.id,
    })
  }

  const dateConverter = (dateString: any) => {
    let date = new Date(dateString)
    return date.toLocaleDateString()
  }
  const handleVouchers = async (userId: any) => {
    let { data: referralVouchers } = await axios.post(NEXT_REFERRAL_VOUCHERS, {
      userId: userId,
    })
    let sampleObj =  [
      {
          "refereeUserId": "ae8e8681-2326-ee11-833f-000d3a25433a",
          "refereeUserName": "referee@bettercommerce.io",
          "refereeFirstName": null,
          "refereeLastName": null,
          "refereePhoneNo": null,
          "refereeEmail": "referee@bettercommerce.io",
          "refereeOrderStatusText": "Approved",
          "refereeOrderStatus": 3,
          "promotionId": "f7480179-ec0b-4985-8b3e-7b97a19d5aa4",
          "promoName": "20% Off Sale",
          "voucherCode": "ZFEMDRC2KWORJHXM",
          "validFrom": "2023-07-19T11:06:12.25",
          "validTo": "2023-07-30T11:06:12.263",
          "claimedOn": "0001-01-01T00:00:00"
      },
      {
          "refereeUserId": "ec5ae61c-2726-ee11-833f-000d3a25433a",
          "refereeUserName": "referee2@bettercommerce.io",
          "refereeFirstName": null,
          "refereeLastName": null,
          "refereePhoneNo": null,
          "refereeEmail": "referee2@bettercommerce.io",
          "refereeOrderStatusText": "Approved",
          "refereeOrderStatus": 3,
          "promotionId": "f7480179-ec0b-4985-8b3e-7b97a19d5aa4",
          "promoName": "20% Off Sale",
          "voucherCode": "BCJCG9QCGHNT48Z2",
          "validFrom": "2023-07-20T11:28:50.613",
          "validTo": "2023-07-30T11:28:50.62",
          "claimedOn": "0001-01-01T00:00:00"
      },
      {
          "refereeUserId": "04c5177a-2926-ee11-833f-000d3a25433a",
          "refereeUserName": "referee4@bettercommerce.io",
          "refereeFirstName": null,
          "refereeLastName": null,
          "refereePhoneNo": null,
          "refereeEmail": "referee4@bettercommerce.io",
          "refereeOrderStatusText": "Approved",
          "refereeOrderStatus": 3,
          "promotionId": "f7480179-ec0b-4985-8b3e-7b97a19d5aa4",
          "promoName": "20% Off Sale",
          "voucherCode": "KPTOE4HJHYF9P3Z7",
          "validFrom": "2023-07-19T11:06:12.25",
          "validTo": "2023-07-30T11:45:03.34",
          "claimedOn": "0001-01-01T00:00:00"
      },
      {
          "refereeUserId": "3072e9b0-2a26-ee11-833f-000d3a25433a",
          "refereeUserName": "referee5@bettercommerce.io",
          "refereeFirstName": null,
          "refereeLastName": null,
          "refereePhoneNo": null,
          "refereeEmail": "referee5@bettercommerce.io",
          "refereeOrderStatusText": "Approved",
          "refereeOrderStatus": 3,
          "promotionId": "f7480179-ec0b-4985-8b3e-7b97a19d5aa4",
          "promoName": "20% Off Sale",
          "voucherCode": "KQF3GOZ8O3HXAA3Q",
          "validFrom": "2023-07-19T11:54:21.783",
          "validTo": "2023-07-21T11:54:21.787",
          "claimedOn": "0001-01-01T00:00:00"
      },
      {
          "refereeUserId": "b9baff1e-ce26-ee11-8341-000d3a25433a",
          "refereeUserName": "referee6@bettercommerce.io",
          "refereeFirstName": null,
          "refereeLastName": null,
          "refereePhoneNo": null,
          "refereeEmail": "referee6@bettercommerce.io",
          "refereeOrderStatusText": "Approved",
          "refereeOrderStatus": 3,
          "promotionId": "f7480179-ec0b-4985-8b3e-7b97a19d5aa4",
          "promoName": "20% Off Sale",
          "voucherCode": "GY47V8H6R627V24O",
          "validFrom": "2023-07-20T07:26:09.747",
          "validTo": "2023-07-22T07:26:09.753",
          "claimedOn": "0001-01-01T00:00:00"
      },
      {
          "refereeUserId": "cc2cfe0c-d326-ee11-8341-000d3a25433a",
          "refereeUserName": "referee7@bettercommerce.io",
          "refereeFirstName": null,
          "refereeLastName": null,
          "refereePhoneNo": null,
          "refereeEmail": "referee7@bettercommerce.io",
          "refereeOrderStatusText": "Approved",
          "refereeOrderStatus": 3,
          "promotionId": "f7480179-ec0b-4985-8b3e-7b97a19d5aa4",
          "promoName": "20% Off Sale",
          "voucherCode": "78EQDHTGOK6M3M2H",
          "validFrom": "2023-07-20T08:09:24.36",
          "validTo": "2023-07-22T08:09:24.37",
          "claimedOn": "0001-01-01T00:00:00"
      },
      {
          "refereeUserId": "12b4e95e-df26-ee11-8341-000d3a25433a",
          "refereeUserName": "referee8@bettercommerce.io",
          "refereeFirstName": null,
          "refereeLastName": null,
          "refereePhoneNo": null,
          "refereeEmail": "referee8@bettercommerce.io",
          "refereeOrderStatusText": "Dispatch",
          "refereeOrderStatus": 9,
          "promotionId": "f7480179-ec0b-4985-8b3e-7b97a19d5aa4",
          "promoName": "20% Off Sale",
          "voucherCode": "",
          "validFrom": "2023-07-20T09:30:12.457",
          "validTo": "2023-07-22T09:30:12.46",
          "claimedOn": "0001-01-01T00:00:00"
      },
      {
          "refereeUserId": "b9045c73-e426-ee11-8341-000d3a25433a",
          "refereeUserName": "referee9@bettercommerce.io",
          "refereeFirstName": "etrerter",
          "refereeLastName": "tretert",
          "refereePhoneNo": "3453453453",
          "refereeEmail": "referee9@bettercommerce.io",
          "refereeOrderStatusText": "CancelledByStore",
          "refereeOrderStatus": 102,
          "promotionId": "f7480179-ec0b-4985-8b3e-7b97a19d5aa4",
          "promoName": "20% Off Sale",
          "voucherCode": "",
          "validFrom": "2023-07-19T11:06:12.25",
          "validTo": "2023-08-13T10:12:19.52",
          "claimedOn": "0001-01-01T00:00:00"
      },
      {
          "refereeUserId": "3942646c-be27-ee11-8343-000d3a25433a",
          "refereeUserName": "referee12@bettercommerce.io",
          "refereeFirstName": "asdasdasd",
          "refereeLastName": "sadasd",
          "refereePhoneNo": "2342342342",
          "refereeEmail": "referee12@bettercommerce.io",
          "refereeOrderStatusText": "Approved",
          "refereeOrderStatus": 3,
          "promotionId": "f7480179-ec0b-4985-8b3e-7b97a19d5aa4",
          "promoName": "20% Off Sale",
          "voucherCode": "",
          "validFrom": "0001-01-01T00:00:00",
          "validTo": "2023-08-14T12:04:21.167",
          "claimedOn": "0001-01-01T00:00:00"
      },
      {
          "refereeUserId": "0482b322-c227-ee11-8343-000d3a25433a",
          "refereeUserName": "referee14@bettercommerce.io",
          "refereeFirstName": null,
          "refereeLastName": null,
          "refereePhoneNo": null,
          "refereeEmail": "referee14@bettercommerce.io",
          "refereeOrderStatusText": "Approved",
          "refereeOrderStatus": 3,
          "promotionId": "f7480179-ec0b-4985-8b3e-7b97a19d5aa4",
          "promoName": "20% Off Sale",
          "voucherCode": "CHEVYYA367ZJ88G2",
          "validFrom": "2023-07-21T12:31:37.12",
          "validTo": "2023-08-12T12:31:37.13",
          "claimedOn": "2023-07-21T12:35:31.397"
      }
  ]
   
    setVouchersEarned(sampleObj)

    if (referralVouchers?.referralDetails) {
      // setVouchersEarned(referralVouchers?.referralDetails)
    }
  }

  useEffect(() => {
    if (typeof window !== undefined) {
      const hostname =
        typeof window !== 'undefined' && window.location.hostname
          ? window.location.hostname
          : ''
      setReferralLink(
        'https://' + hostname + '/?referral-code=' + (referralInfo?.slug || '')
      )
    }
  }, [referralInfo?.slug])

  useEffect(() => {
    const getReferralOffers = async () => {
      let { data: referralProgram } = await axios.post(NEXT_REFERRAL_INFO)
      if (referralProgram?.referralDetails?.refereePromo) {
        setReferralOffers(referralProgram?.referralDetails)
      }
    }
    getReferralOffers()
  }, [])

  useEffect(() => {
    setIsLoading(true)
    const fetchReferralInfo = async () => {
      let { data: referralInfo } = await axios.post(NEXT_REFERRAL_BY_EMAIL, {
        email: user?.email,
      })
      if (referralInfo?.referralDetails) {
        setReferralInfo(referralInfo?.referralDetails)
        handleVouchers(referralInfo?.referralDetails?.userId)
        setIsLoading(false)
      }
    }
    fetchReferralInfo()
  }, [])

  useEffect(() => {
    if (isGuestUser) {
      router.push('/')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (router.query.view && view !== router.query.view) {
      setView(router.query.view)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.asPath])

  let loggedInEventData: any = {
    eventType: CustomerProfileViewed,
  }

  if (user && user.userId) {
    loggedInEventData = {
      ...loggedInEventData,
      entity: JSON.stringify({
        email: user.email,
        dateOfBirth: user.yearOfBirth,
        gender: user.gender,
        id: user.userId,
        name: user.firstName + user.lastName,
        postCode: user.postCode,
      }),
      entityId: user.userId,
      entityName: user.firstName + user.lastName,
      entityType: Customer,
    }
  }

  const handleClick = () => {
    setActive(!active)
  }
  useAnalytics(CustomerProfileViewed, loggedInEventData)

  return (
    <section className="relative pb-10 text-gray-900">
      <div className="w-full px-0 mx-auto sm:container sm:px-0 lg:px-0">
        <div className="grid w-full grid-cols-12 px-4 sm:px-2 sm:pr-0 main-account-grid">
          <div className="col-span-3 border-r border-gray-200 md:pl-12 sm:pl-6 tab-list-sm sm:pt-10 mob-hidden">
            <div className="sticky left-0 z-10 flex flex-col top-36">
              {config.map((item: any, idx: number) => (
                <>
                  <div
                    key={`my-acc-${idx}`}
                    // href="#"
                    className={`hover:bg-white hover:text-indigo-600 border border-transparent text-md leading-3 font-medium text-gray-900 rounded-md focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60"}`}
                  >
                    <span className="pr-2 leading-none align-middle acc-mob-icon-i sm:absolute top-2/4 -translate-y-2/4">
                      <i
                        className={
                          item.text.toLowerCase() + ' ' + 'sprite-icon'
                        }
                      ></i>
                    </span>

                    {item.text == 'Refer a Friend' ? (
                      <>
                        <div
                          key={`my-acc-${idx}`}
                          className={`relative ring-opacity-60 border-b border-slate-300 sm:border-0 cursor-pointer ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2  w-full text-14  leading-5 text-left pl-2 ${
                            item.text == 'Refer a Friend'
                              ? 'bg-gray-200 text-black font-semibold border-l-4 sm:border-b-0 sm:border-l-4 sm:border-black opacity-full'
                              : 'font-medium'
                          }`}
                        >
                          <span className="pr-2 leading-none align-middle acc-mob-icon-i sm:absolute top-2/4 -translate-y-2/4">
                            <i
                              className={
                                item.text.toLowerCase() + ' ' + 'sprite-icon'
                              }
                            ></i>
                          </span>
                          <Link
                            shallow={true}
                            href={item.href}
                            passHref
                            onClick={() => {
                              handleClick
                              setShow(false)
                            }}
                            className="inline-block w-full h-full py-4 text-sm text-primary"
                          >
                            <span className="inline-block text-black sm:hidden dark:text-black">
                              {item.mtext}
                            </span>
                            <span
                              className={`hidden sm:inline-block text-black dark:text-black ${
                                item.text == 'Refer a Friend' && 'font-display'
                              }`}
                            >
                              {item.text}
                            </span>
                          </Link>
                        </div>
                      </>
                    ) : (
                      <>
                        <Link
                          shallow={true}
                          href={item.href}
                          passHref
                          onClick={() => {
                            handleClick
                          }}
                          className="inline-block w-full h-full py-4 pl-2 text-sm transition text-primary hover:bg-gray-100"
                        >
                          <span className="inline-block text-black sm:hidden dark:text-black">
                            {item.mtext}
                          </span>
                          <span
                            className={`hidden sm:inline-block text-black dark:text-black ${
                              item.text == 'Refer a Friend' && 'font-display'
                            }`}
                          >
                            {item.text}
                          </span>
                        </Link>
                      </>
                    )}
                  </div>
                </>
              ))}
            </div>
          </div>

          {isLoading ? (
            <Spinner />
          ) : (
            <div
              className={`relative col-span-9 px-10 lg:col-span-8 md:col-span-8 border-l tabpanel-sm mob-tab-full ${
                isShow ? `` : ''
              }`}
            >
              <div className={'orders bg-white my-2 sm:my-6 pl-2'}>
                <h1 className="py-2  px-5 font-bold">
                  {referralInfo?.successfulInvites > 0
                    ? referralInfo?.successfulInvites == 1
                      ? `1 ${SUCCESSFUL_INVITE}`
                      : `${referralInfo?.successfulInvites} ${SUCCESSFUL_INVITES}`
                    : NO_INVITES}
                </h1>
                <div className="w-full border-t-[1px] mt-4 border-gray-300 border-b-[1px] ">
                  <div className="border-b-[1px] border-gray-300 flex flex-row justify-between px-5 py-2">
                    <p className="text-sm text-black font-semibold ">
                      {INVITES_SENT}
                    </p>
                    <p className="text-sm text-black font-semibold">
                      {referralInfo?.invitesSent}
                    </p>
                  </div>
                  <div className="flex flex-row justify-between px-5 py-2">
                    <p className="text-sm text-black font-semibold">
                      {CLICKS_ON_INVITES}
                    </p>
                    <p className="text-sm text-black font-semibold">
                      {referralInfo?.clickOnInvites}
                    </p>
                  </div>
                </div>
                {/* Tell them in person section */}
                <Disclosure defaultOpen={true}>
                  {({ open }) => (
                    <div className="border-b-[1px] border-gray-300 pt-2">
                      <Disclosure.Button className="flex w-full justify-between px-5 py-2 text-sm font-medium text-left text-gray-500 focus-visible:ring-opacity-75 link-button">
                        <div className=" w-full flex flex-row justify-between items-center">
                          <h2 className="text-sm text-black font-semibold capitalize">
                            {SHARE_IN_PERSON}
                          </h2>
                          <span className="h-5 w-5 text-gray-500">
                            {open ? <ChevronUpIcon /> : <ChevronDownIcon />}
                          </span>
                        </div>
                      </Disclosure.Button>
                      <Transition
                        enter="transition duration-100 ease-out"
                        enterFrom="transform scale-95 opacity-0"
                        enterTo="transform scale-100 opacity-100"
                        leave="transition duration-75 ease-out"
                        leaveFrom="transform scale-100 opacity-100"
                        leaveTo="transform scale-95 opacity-0"
                      >
                        <Disclosure.Panel className="px-0 pt-4 pb-2 text-sm text-gray-800">
                          <div className="px-0 text-sm">
                            {REFERRAL_CODE_INSTRUCTIONS}
                            <div className="px-5 my-4 text-sm">
                              Your friends Enter:
                              <h2 className="text-black text-lg">
                                {referralInfo?.slug}{' '}
                                {/* {user?.firstName+" "+ user?.lastName} */}
                              </h2>
                            </div>
                            <div className="px-5 text-sm leading-relaxed ">
                             {REFERRAL_INSTRUCTIONS}
                            </div>
                          </div>
                        </Disclosure.Panel>
                      </Transition>
                    </div>
                  )}
                </Disclosure>
                {/* Share by email section */}
                <Disclosure defaultOpen={false}>
                  {({ open }) => (
                    <div className="border-b-[1px] border-gray-300 pt-2">
                      <Disclosure.Button className="flex w-full justify-between px-5 py-2 text-sm font-medium text-left text-gray-500 focus-visible:ring-opacity-75 link-button">
                        <div className=" w-full flex flex-row justify-between items-center">
                          <h2 className="text-sm text-black font-semibold capitalize">
                            {SHARE_BY_EMAIL}
                          </h2>
                          <span className="h-5 w-5 text-gray-500">
                            {open ? <ChevronUpIcon /> : <ChevronDownIcon />}
                          </span>
                        </div>
                      </Disclosure.Button>
                      <Transition
                        enter="transition duration-100 ease-out"
                        enterFrom="transform scale-95 opacity-0"
                        enterTo="transform scale-100 opacity-100"
                        leave="transition duration-75 ease-out"
                        leaveFrom="transform scale-100 opacity-100"
                        leaveTo="transform scale-95 opacity-0"
                      >
                        <Disclosure.Panel className="px-0 pt-4 pb-2 text-sm text-gray-800">
                          <div className="px-5 py-2 text-sm">
                            <p>Share Referral by Email</p>
                            <Link
                              href={`mailto:?body=${referralOffers?.refereePromo}, Just use the following link: ${referralLink}&subject=Your friend has sent you a gift!`}
                              className="font-bold"
                              onClick={handleInviteSent}
                            >
                              {CLICK_TO_SHARE_BY_EMAIL}
                            </Link>
                          </div>
                        </Disclosure.Panel>
                      </Transition>
                    </div>
                  )}
                </Disclosure>
                {/* Vouchers Earned Section */}
                <Disclosure defaultOpen={false}>
                  {({ open }) => (
                    <div className="border-b-[1px] border-gray-300 pt-2">
                      <Disclosure.Button className="flex w-full justify-between px-5 py-2 text-sm font-medium text-left text-gray-500 focus-visible:ring-opacity-75 link-button">
                        <div className=" w-full flex flex-row justify-between items-center">
                          <h2 className="text-sm text-black font-semibold capitalize">
                            {VOUCHERS_EARNED}
                          </h2>
                          <span className="h-5 w-5 text-gray-500">
                            {open ? <ChevronUpIcon /> : <ChevronDownIcon />}
                          </span>
                        </div>
                      </Disclosure.Button>
                      <Transition
                        enter="transition duration-100 ease-out"
                        enterFrom="transform scale-95 opacity-0"
                        enterTo="transform scale-100 opacity-100"
                        leave="transition duration-75 ease-out"
                        leaveFrom="transform scale-100 opacity-100"
                        leaveTo="transform scale-95 opacity-0"
                      >
                        <Disclosure.Panel className="px-0 pt-4 pb-2 text-sm text-gray-800">
                          <div className="px-5 py-2 text-sm">
                            {vouchersEarned?.length > 0 ? (
                              <div className="flex flex-col">
                                <table>
                                  <thead>
                                    <tr>
                                      <th>Referral</th>
                                      <th>Voucher Code</th>
                                      <th>Offer</th>
                                      <th>Valid From</th>
                                      <th>Valid Till</th>
                                      <th>Claimed On</th>
                                    </tr>
                                  </thead>
                                  <tbody className="">
                                    {vouchersEarned?.map(
                                      (voucher: any, Idx: any) => {
                                        return (
                                          <tr key={Idx} className="">
                                            <td className='text-center flex flex-col'>
                                              <span> //todo Format voucher table according to new response
                                                {voucher?.refereeFirstName+" " + voucher?.refereeLastName}
                                              </span>
                                              <span>
                                              {voucher?.refereeUserName}
                                              </span>
                                            </td>
                                            <td className="text-center">
                                              {voucher?.voucherCode}
                                            </td>
                                            <td className="text-center">
                                              {voucher?.promoName}
                                            </td>
                                            <td className="text-center">
                                              {dateConverter(
                                                voucher?.validFrom
                                              )}
                                            </td>
                                            <td className="text-center">
                                              {dateConverter(
                                                voucher?.validTo
                                              )}
                                            </td>
                                            <td className="text-center">
                                              {voucher?.claimedOn!=="0001-01-01T00:00:00" && dateConverter(
                                                voucher?.claimedOn
                                              )}
                                              {voucher?.claimedOn==="0001-01-01T00:00:00" && (
                                                "Not Claimed"
                                              )

                                              }
                                            </td>

                                          </tr>
                                        )
                                      }
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            ) : (
                              <p>{VOUCHERS_NOT_EARNED}</p>
                            )}
                          </div>
                        </Disclosure.Panel>
                      </Transition>
                    </div>
                  )}
                </Disclosure>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

ReferralPage.Layout = Layout

const PAGE_TYPE = PAGE_TYPES.Page

export async function getServerSideProps(context: any) {
  const defaultIndex =
    config.findIndex((element: any) => element.props === context.query.view) ||
    0
  return {
    props: { defaultView: defaultIndex },
  }
}

export default withDataLayer(withAuth(ReferralPage), PAGE_TYPE, true)
