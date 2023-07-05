import { useState, useEffect, Fragment } from 'react'
import { Layout } from '@components/common'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import { Tab } from '@headlessui/react'
import { config } from '@components/utils/myAccount'
import COMPONENTS_MAP from '@components/account'
import withAuth from '@components/utils/withAuth'
import { useRouter } from 'next/router'
import Link from 'next/link'
import eventDispatcher from '@components/services/analytics/eventDispatcher'
import { EVENTS_MAP } from '@components/services/analytics/constants'
import useAnalytics from '@components/services/analytics/useAnalytics'
import { useUI } from '@components/ui/context'

import React from 'react'
import { Disclosure } from '@headlessui/react'
import { Transition } from '@headlessui/react'
import { matchStrings } from '@framework/utils/parse-util'
import axios from 'axios'
import {
  NEXT_REFERRAL_BY_EMAIL,
  NEXT_REFERRAL_CLICK_ON_INVITE,
  NEXT_REFERRAL_INFO,
  NEXT_REFERRAL_INVITE_SENT,
} from '@components/utils/constants'
import {
  INVITES_SENT ,
  CLICKS_ON_INVITES,
  SUCCESSFUL_INVITES,
  NO_INVITES,
  SHARE_IN_PERSON,
  SHARE_BY_EMAIL,
  SUCCESSFUL_INVITE,
} from '@components/utils/textVariables'
import { ChevronDownIcon, ChevronUpIcon, MinusCircleIcon, PlusCircleIcon } from '@heroicons/react/24/outline'
import Spinner from '@components/ui/Spinner'

const PAGE_SIZE = 10

function ReferralPage({ defaultView, isLoggedIn, deviceInfo }: any) {
  const { user, deleteUser, isGuestUser, displayDetailedOrder } = useUI()
  const router = useRouter()
  const [isShow, setShow] = useState(true)
  const [view, setView] = useState(defaultView)
  const { CustomerProfileViewed } = EVENTS_MAP.EVENT_TYPES
  const { Customer } = EVENTS_MAP.ENTITY_TYPES
  const [active, setActive] = useState(false)
  const [referralLink, setReferralLink] = useState('')
  const [referralOffers,setReferralOffers] = useState<any>(null)
  const [isLoading,setIsLoading] = useState(false)
  const [referralInfo,setReferralInfo] = useState({
    id: "",
    userId: "",
    name: "",
    slug: "",
    invitesSent: 0,
    clickOnInvites: 0,
    successfulInvites: 0
})

  const handleInviteSent = async (referralId:any)=>{
    let inviteInfo = await axios.post(NEXT_REFERRAL_INVITE_SENT,{referralId:referralInfo?.id})
    
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

useEffect(()=>{
  const getReferralOffers = async ()=>{
    let {data:referralProgram} = await axios.post(NEXT_REFERRAL_INFO)
    if(referralProgram?.referralDetails?.refereePromo){
      setReferralOffers(referralProgram?.referralDetails)
    }
  }
  getReferralOffers()
},[])

  useEffect(()=>{
    setIsLoading(true)
    const fetchReferralInfo = async ()=>{

        let {data:referralInfo} = await axios.post(NEXT_REFERRAL_BY_EMAIL,{email:user?.email})
        if(referralInfo?.referralDetails){
        setReferralInfo(referralInfo?.referralDetails)
        setIsLoading(false)
        }
    }
    fetchReferralInfo()
  },[])

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

          {isLoading?(
            <Spinner/>
          ):(
          <div
            className={`relative col-span-9 px-10 lg:col-span-8 md:col-span-8 border-l tabpanel-sm mob-tab-full ${
              isShow ? `` : ''
            }`}
          >
            <div className={'orders bg-white my-2 sm:my-6 pl-2'}>
              <h1 className='py-2  px-5 font-bold'>
                {referralInfo?.successfulInvites>0? referralInfo?.successfulInvites==1 ?`1 ${SUCCESSFUL_INVITE}`:`${referralInfo?.successfulInvites} ${SUCCESSFUL_INVITES}`:NO_INVITES}
              </h1>
              <div className='w-full border-t-[1px] mt-4 border-gray-300 border-b-[1px] '>
                <div className='border-b-[1px] border-gray-300 flex flex-row justify-between px-5 py-2'>
                    <p className='text-sm text-black font-semibold '>
                        {INVITES_SENT}                        
                    </p>
                    <p className='text-sm text-black font-semibold'>
                        {referralInfo?.invitesSent}
                    </p>
                </div>
                <div className='flex flex-row justify-between px-5 py-2'>
                    <p className='text-sm text-black font-semibold'>
                        {CLICKS_ON_INVITES}
                    </p>
                    <p className='text-sm text-black font-semibold'>
                        {referralInfo?.clickOnInvites}
                    </p>
                </div>
              </div>
              <Disclosure
                  defaultOpen={true}
                >
                  {({ open }) => (
                    <div className='border-b-[1px] border-gray-300 pt-2'>
                      <Disclosure.Button className="flex w-full justify-between px-5 py-2 text-sm font-medium text-left text-gray-500 focus-visible:ring-opacity-75 link-button">
                        <div className=' w-full flex flex-row justify-between items-center'>
                            <h2 className='text-sm text-black font-semibold capitalize'>
                                {SHARE_IN_PERSON}
                            </h2>
                            <span className='h-5 w-5 text-gray-500'>
                            {open?<ChevronUpIcon/>:<ChevronDownIcon/>}
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
                          <div className='px-0 text-sm'>
                            <p className='px-5'>
                              Just tell your friends to mention your name
                            </p>
                            <div className='px-5 my-4 text-sm'>
                                Your friends Enter:
                                <h2 className='text-black text-lg'>
                                    {user?.firstName+" "+ user?.lastName}
                                </h2>
                            </div>
                            <div className='px-5 flex justify-center items-center text-sm leading-relaxed '>
                            All they need to do to get their reward is to click on the Link asking if
they've Been referred by a friend? in the checkout and enter your name.
                            </div>
                          </div>
                        </Disclosure.Panel>
                      </Transition>
                    </div>
                  )}
                </Disclosure>
                <Disclosure
                  defaultOpen={false}
                >
                  {({ open }) => (
                    <div className='border-b-[1px] border-gray-300 pt-2'>
                      <Disclosure.Button className="flex w-full justify-between px-5 py-2 text-sm font-medium text-left text-gray-500 focus-visible:ring-opacity-75 link-button">
                        <div className=' w-full flex flex-row justify-between items-center'>
                            <h2 className='text-sm text-black font-semibold capitalize'>
                                {SHARE_BY_EMAIL}
                            </h2>
                            <span className='h-5 w-5 text-gray-500'>
                            {open?<ChevronUpIcon/>:<ChevronDownIcon/>}
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
                          <div className='px-5 py-2 text-sm'>
                            <p>
                            Share Referral by Email
                            </p>
                            <Link
                              href={`mailto:?body=${referralOffers?.refereePromo}, Just use the following link: ${referralLink}&subject=Your friend has sent you a gift!`}
                              className='font-bold'
                              onClick={handleInviteSent}
                              >
                              Click here to share Referral link by Email
                            </Link>
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
