"use client";

import { Popover, Transition } from "@headlessui/react";
import { avatarImgs } from "@components/common/Header/fakeData";
import { Fragment } from "react";
import Link from "next/link";
import Avatar from "../shared/Avatar/Avatar";
import { getCurrentPage, getEnabledSocialLogins } from "@framework/utils/app-util";
import { useUI } from "@components/ui";
import { Guid } from "@commerce/types";
import Router from 'next/router'
import { signOut } from "next-auth/react";
import { SocialMediaType } from "@components/utils/constants";
import { useTranslation } from "@commerce/utils/use-translation";

export default function AvatarDropdown({ pluginConfig = [] }) {
  const translate = useTranslation()
  const SOCIAL_LOGINS_ENABLED = getEnabledSocialLogins(pluginConfig)
  const socialLogins: Array<string> = SOCIAL_LOGINS_ENABLED.split(',')
  const { isGuestUser, user, deleteUser } = useUI()
  const socialMediaConfigs = [
    {
        type: SocialMediaType.GOOGLE,
        title: translate('label.login.googleLoginText'),
        className: 'items-center max-w-xs text-black text-left flex-1 op-75 py-3 px-2 flex font-medium sm:w-full',
        head: (
            <svg xmlns="http://www.w3.org/2000/svg" className="inline-block w-4 h-4 mr-1 rounded google-plus-logo" fill="currentColor" viewBox="0 0 24 24">
                {' '}
                <path d="M7 11v2.4h3.97c-.16 1.029-1.2 3.02-3.97 3.02-2.39 0-4.34-1.979-4.34-4.42 0-2.44 1.95-4.42 4.34-4.42 1.36 0 2.27.58 2.79 1.08l1.9-1.83c-1.22-1.14-2.8-1.83-4.69-1.83-3.87 0-7 3.13-7 7s3.13 7 7 7c4.04 0 6.721-2.84 6.721-6.84 0-.46-.051-.81-.111-1.16h-6.61zm0 0 17 2h-3v3h-2v-3h-3v-2h3v-3h2v3h3v2z" fillRule="evenodd" clipRule="evenodd" />{' '}
            </svg>
        )
    },
    {
        type: SocialMediaType.FACEBOOK,
        title: translate('label.login.facebookLoginText'),
        className: 'items-center max-w-xs text-black text-left flex-1 op-75 py-3 px-2 flex font-medium sm:w-full',
        head: (
            <svg xmlns="http://www.w3.org/2000/svg" className="inline-block w-4 h-4 mr-1 rounded fb-logo" fill="currentColor" viewBox="0 0 24 24">
                {' '}
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />{' '}
            </svg>
        )
    },
    {
        type: SocialMediaType.APPLE,
        title:  translate('label.login.appleLoginText'),
        className: 'items-center max-w-xs text-black text-left flex-1 op-75 py-3 px-2 flex font-medium sm:w-full',
        head: (
            <svg xmlns="http://www.w3.org/2000/svg" className="inline-block w-4 h-4 mr-1 rounded apple-logo" width="4" height="4" viewBox="0 0 496.255 608.728">
                {' '}
                <path d="M273.81 52.973C313.806.257 369.41 0 369.41 0s8.271 49.562-31.463 97.306c-42.426 50.98-90.649 42.638-90.649 42.638s-9.055-40.094 26.512-86.971zM252.385 174.662c20.576 0 58.764-28.284 108.471-28.284 85.562 0 119.222 60.883 119.222 60.883s-65.833 33.659-65.833 115.331c0 92.133 82.01 123.885 82.01 123.885s-57.328 161.357-134.762 161.357c-35.565 0-63.215-23.967-100.688-23.967-38.188 0-76.084 24.861-100.766 24.861C89.33 608.73 0 455.666 0 332.628c0-121.052 75.612-184.554 146.533-184.554 46.105 0 81.883 26.588 105.852 26.588z" />{' '}
            </svg>
        )
    }
 ];

  const accountDropDownConfigUnauthorized: any = [
    { 
      href: '/my-account/login', 
      title:  translate('label.login.loginBtnText'), 
      className: 'max-w-xs text-black text-left flex-1 font-medium py-3 px-2 flex sm:w-full', 
      head: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" >
          <path d="M12.1601 10.87C12.0601 10.86 11.9401 10.86 11.8301 10.87C9.45006 10.79 7.56006 8.84 7.56006 6.44C7.56006 3.99 9.54006 2 12.0001 2C14.4501 2 16.4401 3.99 16.4401 6.44C16.4301 8.84 14.5401 10.79 12.1601 10.87Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M7.15997 14.56C4.73997 16.18 4.73997 18.82 7.15997 20.43C9.90997 22.27 14.42 22.27 17.17 20.43C19.59 18.81 19.59 16.17 17.17 14.56C14.43 12.73 9.91997 12.73 7.15997 14.56Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ), 
      tail: null, 
    },
    { 
      href: '/my-account/register', 
      title: translate('common.label.registerText'), 
      className: 'max-w-xs text-black text-left flex-1 op-75 py-3 px-2 flex font-medium sm:w-full', 
      head:(
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" >
          <path d="M12.1601 10.87C12.0601 10.86 11.9401 10.86 11.8301 10.87C9.45006 10.79 7.56006 8.84 7.56006 6.44C7.56006 3.99 9.54006 2 12.0001 2C14.4501 2 16.4401 3.99 16.4401 6.44C16.4301 8.84 14.5401 10.79 12.1601 10.87Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M7.15997 14.56C4.73997 16.18 4.73997 18.82 7.15997 20.43C9.90997 22.27 14.42 22.27 17.17 20.43C19.59 18.81 19.59 16.17 17.17 14.56C14.43 12.73 9.91997 12.73 7.15997 14.56Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
       ), 
       tail: null, 
    },  
  ]

  socialMediaConfigs?.forEach(socialMediaConfig => {
    if (socialLogins?.includes(socialMediaConfig?.type)) {
        accountDropDownConfigUnauthorized?.push({
            href: `/my-account/login/social/${socialMediaConfig?.type}`,
            title: socialMediaConfig?.title,
            className: socialMediaConfig?.className,
            head: socialMediaConfig?.head,
            tail: null
        });
    }
  });
  let currentPage = getCurrentPage()
  const accountDropDownConfigAuthorized: any = [
    {
      href: '/my-account',
      title: translate('common.label.myAccountText'),
      className: 'text-left p-2 cursor-pointer',
      head: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" >
          <path d="M12.1601 10.87C12.0601 10.86 11.9401 10.86 11.8301 10.87C9.45006 10.79 7.56006 8.84 7.56006 6.44C7.56006 3.99 9.54006 2 12.0001 2C14.4501 2 16.4401 3.99 16.4401 6.44C16.4301 8.84 14.5401 10.79 12.1601 10.87Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M7.15997 14.56C4.73997 16.18 4.73997 18.82 7.15997 20.43C9.90997 22.27 14.42 22.27 17.17 20.43C19.59 18.81 19.59 16.17 17.17 14.56C14.43 12.73 9.91997 12.73 7.15997 14.56Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      href: user?.companyId !== Guid?.empty ? '/my-account/my-company?tab=orders' : '/my-account/orders',
      title: translate('label.order.myOrdersText'),
      className: 'text-left p-2 cursor-pointer',
      head: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" >
          <path d="M8 12.2H15" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M8 16.2H12.38" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M10 6H14C16 6 16 5 16 4C16 2 15 2 14 2H10C9 2 8 2 8 4C8 6 9 6 10 6Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M16 4.02002C19.33 4.20002 21 5.43002 21 10V16C21 20 20 22 15 22H9C4 22 3 20 3 16V10C3 5.44002 4.67 4.20002 8 4.02002" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      href: '/my-account/wishlist',
      title: translate('label.wishlist.wishlistText'),
      className: 'text-left p-2 cursor-pointer',
      head: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" >
          <path d="M12.62 20.81C12.28 20.93 11.72 20.93 11.38 20.81C8.48 19.82 2 15.69 2 8.68998C2 5.59998 4.49 3.09998 7.56 3.09998C9.38 3.09998 10.99 3.97998 12 5.33998C13.01 3.97998 14.63 3.09998 16.44 3.09998C19.51 3.09998 22 5.59998 22 8.68998C22 15.69 15.52 19.82 12.62 20.81Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      href: '/',
      title: translate('common.label.logOutText'),
      className: 'text-left p-2 cursor-pointer text-red-600',
      head: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" >
          <path d="M8.90002 7.55999C9.21002 3.95999 11.06 2.48999 15.11 2.48999H15.24C19.71 2.48999 21.5 4.27999 21.5 8.74999V15.27C21.5 19.74 19.71 21.53 15.24 21.53H15.11C11.09 21.53 9.24002 20.08 8.91002 16.54" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M15 12H3.62" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M5.85 8.6499L2.5 11.9999L5.85 15.3499" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      onClick: async () => {
        deleteUser({ router: Router })
        if (user?.socialData?.socialMediaType) {
          await signOut()
        }
      },
    },
  ]
  let accountDropdownConfig = accountDropDownConfigUnauthorized
  let title = !isGuestUser ? user?.userId ? (translate('common.label.hiText') + `, ${user?.firstName}`): translate('label.common.myAccountText') : ''
  if (!isGuestUser && user.userId) {
    accountDropdownConfig = accountDropDownConfigAuthorized
  }
  return (
    <div className="AvatarDropdown ">
      <Popover className="relative">
        {({ open, close }) => (
          <>
            <Popover.Button className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none flex items-center justify-center`} >
              <svg className="w-6 h-6 " viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" >
                <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M20.5899 22C20.5899 18.13 16.7399 15 11.9999 15C7.25991 15 3.40991 18.13 3.40991 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Popover.Button>
            <Transition as={Fragment} enter="transition ease-out duration-200" enterFrom="opacity-0 translate-y-1" enterTo="opacity-100 translate-y-0" leave="transition ease-in duration-150" leaveFrom="opacity-100 translate-y-0" leaveTo="opacity-0 translate-y-1" >
              <Popover.Panel className="absolute z-10 w-screen max-w-[260px] px-4 mt-3.5 -right-10 sm:right-0 sm:px-0">
                <div className="overflow-hidden shadow-lg rounded-3xl ring-1 ring-black ring-opacity-5">
                  <div className="relative grid grid-cols-1 gap-6 px-6 bg-white dark:bg-neutral-800 py-7">
                    <div className="flex items-center space-x-3">
                      <img className="w-10 h-10 text-lg rounded-full"  alt={title} src={`/assets/user-avatar.png`} />
                      <div className="flex-grow">
                        <h4 className="font-semibold">{title}</h4>
                      </div>
                    </div>

                    <div className="w-full border-b border-neutral-200 dark:border-neutral-700" />
                    {accountDropdownConfig?.map((item: any, idx: number) => (
                      <>
                        <Link key={idx} title={item?.title} passHref href={item?.href} className="flex items-center p-2 -m-3 transition duration-150 ease-in-out rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50" onClick={(ev: any) => { if (item?.onClick) item?.onClick(ev); close() }}>
                          <div className="flex items-center justify-center flex-shrink-0 text-neutral-500 dark:text-neutral-300">
                            {item?.head ?? null}
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium ">{item?.title}</p>
                          </div>
                        </Link>
                      </>
                    ))}
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
  );
}
