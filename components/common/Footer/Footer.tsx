import { FC, useEffect, useState } from 'react'
import Link from 'next/link'
import type { Page } from '@commerce/types/page'
import { Logo } from '@components/ui'
import config from './config'
import { useRouter } from 'next/router'
import {
  BTN_SIGN_UP,
  COPYRIGHT_FOOTER_INFO,
  GENERAL_EMAIL_ADDRESS,
  GENERAL_FOOOTER,
  SIGN_UP_FOR_NEWSLETTER,
  SIGN_UP_TEXT,
} from '@components/utils/textVariables'
import { getCurrentPage } from '@framework/utils/app-util'
import { recordGA4Event } from '@components/services/analytics/ga4'
import { IExtraProps } from '../Layout/Layout'

interface Props {
  config: []
}

const Footer: FC<Props & IExtraProps> = ({
  config,
  deviceInfo,
  maxBasketItemsCount,
}) => {
  const router = useRouter()
  const [hasConfig, setHasConfig] = useState(false)
  const { isMobile, isIPadorTablet } = deviceInfo

  let deviceCheck = ''
  if (isMobile || isIPadorTablet) {
    deviceCheck = 'Mobile'
  } else {
    deviceCheck = 'Desktop'
  }

  useEffect(() => {
    setHasConfig(Boolean(config))
  }, [config])
  const handleRedirect = (path: string) => (path ? router.push(path) : {})

  function footerClick(detail: any) {
    let currentPage = getCurrentPage()
    if (currentPage) {
      if (typeof window !== 'undefined') {
        recordGA4Event(window, 'footer_query_click', {
          device: deviceCheck,
          page_clicked_on: currentPage,
          click_detail: detail,
        })
      }
    }
  }
  return (
    <footer
      aria-labelledby="footer-heading"
      className="py-8 pt-10 bg-gray-100 shadow-inner px-4 sm:px-0 sm:h-96 sm:pt-16 sm:mt-2 bg-footer-color"
    >
      <h3 id="footer-heading" className="sr-only">
        {GENERAL_FOOOTER}
      </h3>
      <div className="container grid grid-cols-1 mx-auto sm:grid-cols-12">
        <div className="sm:col-span-1">
          <Logo />
        </div>
        <div
          className="sm:col-span-3"
          onClick={() => footerClick('INFORMATION')}
        >
          <h4 className="font-bold text-gray-900 my-4 sm:my-0 text-footer-clr">
            INFORMATION
          </h4>
          <ul role="list" className="mt-3 space-y-3">
            <li className="text-sm font-medium text-gray-900 text-footer-clr f-footer-weight">
              Contact Us
            </li>
            <li className="text-sm font-medium text-gray-900 text-footer-clr f-footer-weight ">
              My Account
            </li>
            <li className="text-sm font-medium text-gray-900 text-footer-clr  f-footer-weight">
              About Us
            </li>
          </ul>
        </div>
        <div className="sm:col-span-3" onClick={() => footerClick('HELP')}>
          <h4 className="font-bold text-gray-900 my-4 sm:my-0 text-footer-clr ">HELP</h4>
          <ul role="list" className="mt-3 space-y-3">
            <li className="text-sm font-medium text-gray-900 text-footer-clr  f-footer-weight">
              Support
            </li>
            <li className="text-sm font-medium text-gray-900 text-footer-clr f-footer-weight">
              Cookie Policy
            </li>
            <li className="text-sm font-medium text-gray-900 text-footer-clr f-footer-weight">
              Privacy Policy
            </li>
            <li className="text-sm font-medium text-gray-900 text-footer-clr f-footer-weight">
              Terms and Conditions
            </li>
          </ul>
        </div>
        <div className="sm:col-span-5">
          <h4 className="font-bold text-black uppercase my-4 sm:my-0 text-footer-clr ">
            {SIGN_UP_FOR_NEWSLETTER}
          </h4>
          <p className="mt-1 text-gray-900 text-md text-footer-clr ">
            {SIGN_UP_TEXT}
          </p>
          <form className="flex mt-6 sm:max-w-md">
            <label htmlFor="email-address" className="sr-only">
              {GENERAL_EMAIL_ADDRESS}
            </label>
            <input
              id="email-address"
              type="text"
              autoComplete="email"
              required
              placeholder="Enter Email ID"
              className="w-full min-w-0 px-4 py-4 text-gray-900 placeholder-gray-600 bg-white border border-gray-300 rounded-sm shadow-sm appearance-none focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
            <div className="flex-shrink-0 ml-4">
              <button
                type="submit"
                className="flex items-center justify-center w-full px-6 py-4 font-medium uppercase btn-secondary h-full"
              >
                {BTN_SIGN_UP}
              </button>
            </div>
          </form>
        </div>
        <div className="justify-center text-center border-t border-white sm:col-span-12 sm:pt-6 mt-10 sm:mt-10">
          <p className="font-semibold text-black my-4 sm:my-0 text-footer-clr ">
            &copy; {COPYRIGHT_FOOTER_INFO}
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
