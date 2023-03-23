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

interface Props {
  config: []
}

const Footer: FC<React.PropsWithChildren<Props>> = ({ config }) => {
  const router = useRouter()
  const [hasConfig, setHasConfig] = useState(false)
  useEffect(() => {
    setHasConfig(Boolean(config))
  }, [config])
  const handleRedirect = (path: string) => (path ? router.push(path) : {})

  return (
    <footer aria-labelledby="footer-heading" className="bg-gray-100 shadow-inner sm:h-96 sm:mt-10">
      <h2 id="footer-heading" className="sr-only">
        {GENERAL_FOOOTER}
      </h2>
      <div className="w-full px-4 mx-auto sm:w-4/5 sm:px-0 lg:px-0">
        <div className="py-20">
          <div className="grid grid-cols-1 md:grid-cols-12 md:grid-flow-col md:gap-x-8 md:gap-y-16 md:auto-rows-min">
            {/* Image section */}
            <div className="col-span-1 md:col-span-2 lg:row-start-1 lg:col-start-1 opacity-70">
              <Logo />
            </div>
            {/* Sitemap sections */}
            <div className="grid grid-cols-2 col-span-6 gap-8 mt-10 sm:grid-cols-3 md:mt-0 md:row-start-1 md:col-start-3 md:col-span-8 lg:col-start-2 lg:col-span-6">
              <div className="grid grid-cols-1 gap-y-12 sm:col-span-2 sm:grid-cols-2 sm:gap-x-8">
                
                <div>
                  <h3 className="font-bold text-gray-900 text-md">INFORMATION</h3>
                  <ul role="list" className="mt-6 space-y-6">
                    <li className="text-sm">
                      <h3 className="text-sm font-medium text-gray-900">Contact Us</h3>
                      <ul></ul>
                    </li>
                    <li className="text-sm">
                      <h3 className="text-sm font-medium text-gray-900">My Account</h3>
                      <ul></ul>
                    </li>
                    <li className="text-sm">
                      <h3 className="text-sm font-medium text-gray-900">About Us</h3>
                      <ul></ul>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-md">HELP</h3>
                  <ul role="list" className="mt-6 space-y-6">
                    <li className="text-sm">
                      <h3 className="text-sm font-medium text-gray-900">Support</h3>
                      <ul></ul>
                    </li>
                    <li className="text-sm">
                      <h3 className="text-sm font-medium text-gray-900">Cookie Policy</h3>
                      <ul></ul>
                    </li>
                    <li className="text-sm">
                      <h3 className="text-sm font-medium text-gray-900">Privacy Policy</h3>
                      <ul></ul>
                    </li>
                    <li className="text-sm">
                      <h3 className="text-sm font-medium text-gray-900">Terms and Conditions</h3>
                      <ul></ul>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            {/* Newsletter section */}
            <div className="mt-12 md:mt-0 md:row-start-2 md:col-start-3 md:col-span-8 lg:row-start-1 lg:col-start-7 lg:col-span-6">
              <h3 className="text-2xl font-bold text-black uppercase">
                {SIGN_UP_FOR_NEWSLETTER}
              </h3>
              <p className="mt-1 text-gray-900 text-md">
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
                  placeholder='Enter Email ID'
                  className="w-full min-w-0 px-4 py-4 text-gray-900 placeholder-gray-600 bg-white border border-gray-300 rounded-sm shadow-sm appearance-none focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
                <div className="flex-shrink-0 ml-4">
                  <button
                    type="submit"
                    className="flex items-center justify-center w-full px-6 py-4 font-medium text-white uppercase bg-black border border-transparent rounded-sm shadow-sm hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                  >
                    {BTN_SIGN_UP}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="py-10 text-center border-t border-gray-100">
          <p className="text-sm text-gray-500">
            &copy; {COPYRIGHT_FOOTER_INFO}
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
