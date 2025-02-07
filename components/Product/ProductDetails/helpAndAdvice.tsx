import React from 'react'
import { PRODUCT_HELP_AND_ADVICE } from '@components/utils/textVariables'
import { LIVE_CHAT_TIME } from '@components/utils/constants'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { Disclosure } from '@headlessui/react'
import { helpline } from './helplineConfig'

const HelpAndAdvice = ({ deviceInfo, product, allFaqs = [] }: any) => {
  const { isMobile } = deviceInfo
  const DeliveryFaqs = allFaqs?.filter((x: any) => x?.categoryName === 'Delivery')
  const clickChatButton = () => {
    const chatElem = document.querySelector('div[data-puzzel-chat] > section > button') as HTMLButtonElement
    if (chatElem) {
      chatElem.click()
    }
    else {
      // Tooltip text
      const tooltipText = "Live Chat will be available Mon-Fri 7:30-17:30 (Sat 8:00-16:30)";

      // Create tooltip element
      const tooltipElem = document.createElement('div');
      tooltipElem.className = 'tooltip';
      tooltipElem.textContent = tooltipText;
      // Append tooltip to the body
      document.body.appendChild(tooltipElem);
      // Remove the tooltip after a certain time (e.g., 3 seconds)
      setTimeout(() => {
        document.body.removeChild(tooltipElem);
      }, 5000);
    }
  }
  return (
    <>
      <h2 className="mb-2 font-semibold text-left text-black uppercase sm:px-0 md:px-0 lg:px-0 font-18 2xl:px-0 mob-font-18 dark:text-black">
        {PRODUCT_HELP_AND_ADVICE} <span className='hidden sm:inline-block'>{' '} of {product}</span>
      </h2>
      <div className="flex flex-col md:flex-row md:gap-20 md:justify-between block-ipad-sm">
        <div className="md:w-2/3 sm-w-full">
          {DeliveryFaqs?.map((el: any, idx: any) => (
            <div className="w-full mx-auto" key={idx}>
              <Disclosure>
                {({ open }) => (
                  <>
                    <Disclosure.Button className="flex items-center justify-between w-full py-4 font-semibold leading-5 text-left border-b border-black font-14 lg:font-18 label-text-clr-tan focus:outline-none">
                      <span className="font-semibold text-black uppercase dark:text-black mob-width-text-90">{el?.question}</span>
                      <i className={`${open ? 'rotate-180 transform' : ''} sprite-dropdown sprite-icons right-2`}></i>
                    </Disclosure.Button>
                    <Disclosure.Panel className="py-4 text-sm text-black font-14 lg:font-18 dark:text-black">{el?.answer}</Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            </div>
          ))}
        </div>
        <div className="md:w-1/3 sm-w-full ipad-mt-5">
          <div className="mt-3 mb-5 md:mt-0">
            <h4 className="font-semibold text-black dark:text-black mob-font-18">Still have questions?</h4>
            <p className="mt-4 text-xs text-black md:text-sm dark:text-black">
              If you have any questions or need any further assistance, feel free to contact us. Our friendly and knowledgeable customer service team is ready to help you. You can reach us by phone, email, or chat.
            </p>
          </div>
          <div>
            <div className="grid grid-cols-12 gap-2 py-4 text-xs font-semibold border-b border-gray-300 md:text-sm">
              <div className="flex flex-col col-span-9 md:col-span-6 md:flex-row md:items-center">
                <span className="text-black dark:text-black">Live Chat</span>
                {isMobile && (
                  <span className="font-normal text-gray-500 dark:text-black text-sm-span">{LIVE_CHAT_TIME}</span>
                )}
              </div>
              <div className="flex justify-end col-span-3 md:col-span-6 md:justify-between md:pl-2 ipad-justify-end">
                {!isMobile && (
                  <span className="font-normal text-gray-500 dark:text-black text-sm-span">{LIVE_CHAT_TIME}</span>
                )}
                <button className="flex items-center px-1 text-xs border border-black rounded-md cursor-pointer live-chat md:text-sm dark:text-black font-sm-btn" onClick={clickChatButton}>Open chat</button>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-2 py-4 text-xs font-semibold border-b border-gray-300 md:text-sm">
              <div className="flex flex-col col-span-9 md:col-span-6 md:flex-row md:items-center">
                <span className="text-black dark:text-black">Text: 07312 277 226</span>
                {isMobile && (
                  <span className="font-normal text-gray-500 dark:text-black text-sm-span">{LIVE_CHAT_TIME}</span>
                )}
              </div>
              <div className="flex justify-end col-span-3 md:col-span-6 md:justify-between md:pl-2 ipad-justify-end">
                {!isMobile && (
                  <span className="font-normal text-gray-500 dark:text-black text-sm-span">{LIVE_CHAT_TIME}</span>
                )}
                <a className="flex items-center px-2 text-xs border border-black rounded-md md:text-sm dark:text-black font-sm-btn" href="sms:07312277226">Text us</a>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-2 py-4 text-xs font-semibold border-b border-gray-300 md:text-sm">
              <div className="flex flex-col col-span-9 md:col-span-6 md:flex-row md:items-center">
                <span className="text-black dark:text-black">Call: 01303 852692</span>
                {isMobile && (
                  <span className="font-normal text-gray-500 dark:text-black text-sm-span">{LIVE_CHAT_TIME}</span>
                )}
              </div>
              <div className="flex justify-end col-span-3 md:col-span-6 md:justify-between md:pl-2 ipad-justify-end">
                {!isMobile && (
                  <span className="font-normal text-gray-500 dark:text-black text-sm-span">{LIVE_CHAT_TIME}</span>
                )}
                <a href='tel:01303852692' className="flex items-center px-1 text-xs border border-black rounded-md cursor-pointer md:text-sm dark:text-black font-sm-btn">Call us</a>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-2 py-4 text-xs font-semibold border-b border-gray-300 md:text-sm">
              <div className="flex flex-col col-span-9 md:col-span-6 md:flex-row md:items-center">
                <span className="text-black dark:text-black">Email</span>
                {isMobile && (
                  <span className="font-normal text-gray-500 dark:text-black text-sm-span">{LIVE_CHAT_TIME}</span>
                )}
              </div>
              <div className="flex justify-end col-span-3 md:col-span-6 md:justify-between md:pl-2 ipad-justify-end">
                {!isMobile && (
                  <span className="font-normal text-gray-500 dark:text-black text-sm-span">{LIVE_CHAT_TIME}</span>
                )}
                <a
                  href="/contact"
                  className="flex items-center px-1 text-xs text-black border border-black rounded-md cursor-pointer md:text-sm dark:text-black font-sm-btn"
                  target="_blank"
                  rel="noreferrer"
                >
                  Email us
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default HelpAndAdvice