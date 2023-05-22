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
  SIGN_UP_TEXT
} from '@components/utils/textVariables'
import { getCurrentPage } from '@framework/utils/app-util'
import { recordGA4Event } from '@components/services/analytics/ga4'
import useDevice from '@commerce/utils/use-device'
import { IExtraProps } from '../Layout/Layout'

interface Props {
  config: []
}

const Footer: FC<Props & IExtraProps> = ({ config, deviceInfo }) => {
  const router = useRouter()
  const [hasConfig, setHasConfig] = useState(false)
  const { isMobile, isIPadorTablet } = deviceInfo;

  let deviceCheck = ""
  if (isMobile || isIPadorTablet) {
    deviceCheck = "Mobile"
  } else {
    deviceCheck = "Desktop"
  }

  useEffect(() => {
    setHasConfig(Boolean(config))
  }, [config])
  const handleRedirect = (path: string) => (path ? router.push(path) : {})

  function footerClick(detail: any) {
    let currentPage = getCurrentPage()
    if (currentPage) {
      if (typeof window !== "undefined") {
        recordGA4Event(window, 'footer_query_click', {
          device: deviceCheck,
          page_clicked_on: currentPage,
          click_detail: detail,
        });
      }
    }
  }
  return (
    <footer aria-labelledby="footer-heading" className="pt-10 bg-gray-100 shadow-inner sm:h-96 sm:pt-16 sm:mt-2">
      <div className="container grid grid-cols-1 mx-auto sm:grid-cols-12">
        <div className='sm:col-span-1'>
          <Logo />
        </div>
        <div className='sm:col-span-3' onClick={() => footerClick("INFORMATION")}>
          <h3 className="font-bold text-gray-900 text-md">INFORMATION</h3>
          <ul role="list" className="mt-3 space-y-3">
            <li className="text-sm font-medium text-gray-900">Contact Us</li>
            <li className="text-sm font-medium text-gray-900">My Account</li>
            <li className="text-sm font-medium text-gray-900">About Us</li>
          </ul>
        </div>
        <div className='sm:col-span-3' onClick={() => footerClick("HELP")}>
          <h3 className="font-bold text-gray-900 text-md">HELP</h3>
          <ul role="list" className="mt-3 space-y-3">
            <li className="text-sm font-medium text-gray-900">Support</li>
            <li className="text-sm font-medium text-gray-900">Cookie Policy</li>
            <li className="text-sm font-medium text-gray-900">Privacy Policy</li>
            <li className="text-sm font-medium text-gray-900">Terms and Conditions</li>
          </ul>
        </div>
        <div className='sm:col-span-5'>
          <h3 className="text-2xl font-bold text-black uppercase">{SIGN_UP_FOR_NEWSLETTER}</h3>
          <p className="mt-1 text-gray-900 text-md">{SIGN_UP_TEXT}</p>
          <form className="flex mt-6 sm:max-w-md">
            <label htmlFor="email-address" className="sr-only">{GENERAL_EMAIL_ADDRESS}</label>
            <input id="email-address" type="text" autoComplete="email" required placeholder='Enter Email ID'
              className="w-full min-w-0 px-4 py-4 text-gray-900 placeholder-gray-600 bg-white border border-gray-300 rounded-sm shadow-sm appearance-none focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
            <div className="flex-shrink-0 ml-4">
              <button type="submit" className="flex items-center justify-center w-full px-6 py-4 font-medium text-white uppercase bg-black border border-transparent rounded-sm shadow-sm hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
                {BTN_SIGN_UP}
              </button>
            </div>
          </form>
        </div>
        <div className='justify-center text-center border-t border-white sm:col-span-12 sm:pt-6 sm:mt-10'>
          <p className="text-sm font-semibold text-black">&copy; {COPYRIGHT_FOOTER_INFO}</p>
        </div>
      </div>
      <h2 id="footer-heading" className="sr-only">{GENERAL_FOOOTER}</h2>
    </footer>
  )
}

export default Footer
