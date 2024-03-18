import { Guid } from '@commerce/types'
import { useTranslation } from '@commerce/utils/use-translation'
import { useUI } from '@components/ui'
import { NEXT_REFERRAL_INFO } from '@components/utils/constants'
import { useConfig } from '@components/utils/myAccount'
import { stringToBoolean } from '@framework/utils/parse-util'
import axios from 'axios'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

function SideMenu({ handleClick, setShow, currentOption }: any) {
  const config = useConfig();
  const translate = useTranslation()
  const { user, referralProgramActive } = useUI()
  let isB2B = user?.companyId !== Guid.empty
  let newConfig: any = []
  if (config && typeof window !== 'undefined') {
    const hasMyCompany = config.some(
      (item: any) => item?.props === 'my-company'
    )
    const hasReferral = config.some(
      (item:any)=> item?.props ==='refer-a-friend'
    )
    newConfig = [...config]
    if (isB2B) {
      let i = newConfig.length
      if(referralProgramActive){
        if (!hasReferral){
          newConfig.push( {
            type: 'tab',
            text: translate('label.myAccount.referAFriendText'),
            mtext: translate('label.myAccount.referAFriendText'),
            props: 'refer-a-friend',
            href:"/my-account/refer-a-friend"
          })
        }
      }
      while (i--) {
        if (
          newConfig[i]?.props === 'address-book' ||
          newConfig[i]?.props === 'orders'
        ) {
          newConfig.splice(i, 1)
        }
      }
    }
    if (!isB2B) {
      if(referralProgramActive){
        if (!hasReferral){
          newConfig = [...config]
          newConfig.push( {
            type: 'tab',
            text: translate('label.myAccount.referAFriendText'),
            mtext: translate('label.myAccount.referAFriendText'),
            props: 'refer-a-friend',
            href:"/my-account/refer-a-friend"
          })
        }
      } else {
        newConfig = [...config]
      }
    } else if (!hasMyCompany) {
      newConfig.push({
        type: 'tab',
        text: translate('label.myAccount.myCompanyText'),
        mtext: translate('label.myAccount.myCompanyText'),
        props: 'my-company',
        href: '/my-account/my-company',
      })
    } 
  }
  return (
    <div className="col-span-3 border-r border-gray-200 md:pl-2 sm:pl-2 tab-list-sm sm:pt-10 mob-hidden">
      <div className="sticky left-0 z-10 flex flex-col top-36">
        {newConfig.map((item: any, idx: number) => (
          <>
            <div
              key={`my-acc-${idx}`}
              // href="#"
              className={`hover:bg-white hover:text-indigo-600 border border-transparent text-md leading-3 font-medium text-gray-900 rounded-md focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60"}`}
            >
              <span className="pr-2 leading-none align-middle acc-mob-icon-i sm:absolute top-2/4 -translate-y-2/4">
                <i
                  className={item.text.toLowerCase() + ' ' + 'sprite-icon'}
                ></i>
              </span>
              {item.text == currentOption ? (
                <>
                  <div
                    key={`my-acc-${idx}`}
                    className={`relative ring-opacity-60 border-b border-slate-300 sm:border-0 cursor-pointer ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2  w-full text-14  leading-5 text-left pl-2 ${
                      item.text == currentOption
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
                          item.text == 'My Company' && 'font-display'
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
                        item.text == 'My Company' && 'font-display'
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
  )
}

export default SideMenu
