import { Fragment, useState } from 'react'
import { Dialog, RadioGroup, Transition } from '@headlessui/react'
import { XIcon } from '@heroicons/react/outline'
import { StarIcon } from '@heroicons/react/solid'
import { GENERAL_CLOSE, GENERAL_DELIVERY_RETURN } from '@components/utils/textVariables'

export default function DeliveryInstruction(){
      const [open, setOpen] = useState(false)
      return(
            <>
                  <button
                        type="button"
                        className="text-md font-semibold text-gray-600 my-6"
                        onClick={() => setOpen(true)}
                  >
                        <span className="sr-only">{GENERAL_CLOSE}</span>
                        <span>{GENERAL_DELIVERY_RETURN}</span>
                  </button>
                  <Transition.Root show={open} as={Fragment}>
                        <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" onClose={setOpen}>
                              <div className="flex min-h-screen text-center md:block md:px-2 lg:px-4" style={{ fontSize: 0 }}>
                                    <Transition.Child
                                          as={Fragment}
                                          enter="ease-out duration-300"
                                          enterFrom="opacity-0"
                                          enterTo="opacity-100"
                                          leave="ease-in duration-200"
                                          leaveFrom="opacity-100"
                                          leaveTo="opacity-0"
                                    >
                                          <Dialog.Overlay className="hidden fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity md:block" />
                                    </Transition.Child>

                                    {/* This element is to trick the browser into centering the modal contents. */}
                                    <span className="hidden md:inline-block md:align-middle md:h-screen" aria-hidden="true">
                                          &#8203;
                                    </span>
                                    <Transition.Child
                                          as={Fragment}
                                          enter="ease-out duration-300"
                                          enterFrom="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
                                          enterTo="opacity-100 translate-y-0 md:scale-100"
                                          leave="ease-in duration-200"
                                          leaveFrom="opacity-100 translate-y-0 md:scale-100"
                                          leaveTo="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
                                    >
                                          <div className="flex rounded-lg bg-white text-base shadow-2xl pb-10 px-10 text-left transform transition w-full md:inline-block md:max-w-2xl md:px-10 md:my-8 md:align-middle lg:max-w-4xl">
                                                <div className="w-full relative flex items-center bg-white px-4 pt-14 pb-8  sm:px-6 sm:pt-8 md:p-6 lg:p-8">
                                                      <button
                                                            type="button"
                                                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 sm:top-8 sm:right-6 md:top-6 md:right-6 lg:top-8 lg:right-8"
                                                            onClick={() => setOpen(false)}
                                                      >
                                                            <span className="sr-only">Close</span>
                                                            <XIcon className="h-6 w-6" aria-hidden="true" />
                                                      </button>                             
                                                </div>
                                                <div className='flex flex-col max-modal-panel'>
                                                      <h2 className='font-bold text-4xl text-gray-700 mb-3'>delivery options:</h2>
                                                      <p className='font-normal text-sm mb-3'>You will be able to select your delivery method at our checkout.</p>
                                                      <p className='font-bold text-black text-lg mb-2'>uk delivery options</p>
                                                      <p className='font-normal text-gray-600 text-sm mb-2'><b>UK Economy Delivery (charged returns) -</b> £1.99. Deliveries take 3-5 working days & are delivered between 8am - 9pm (excludes Weekends & Bank Holidays). Returns fees will be deducted from your refund at £2.99 per order. This charge is applied per return, if you return multiple orders in one parcel you’ll be charged per order. If you paid for the order by credit/debit card or PayPal, any charges will be deducted from your refund. If you paid for the order by Klarna/Clearpay/Afterpay, any charges will remain as a balance on the relevant account which must be paid in accordance with the relevant service terms and conditions.</p>
                                                      <p className='font-normal text-gray-600 text-sm mb-2'><b>Standard Delivery -</b> £3.99. Deliveries take 3 working days and are delivered between 8am - 9pm (excludes Weekends & Bank Holidays).</p>
                                                      <p className='font-normal text-gray-600 text-sm mb-2'><b>Next Day Delivery-</b> £6.99. Order before 11pm to receive your order tomorrow. Orders made after 11pm will be delivered the day after (excludes Sundays & Bank Holidays). Deliveries are made anytime between 8am - 9pm. Postcode restrictions apply.</p>
                                                      <p className='font-normal text-gray-600 text-sm mb-2'><b>Click & Collect -</b> £3.99. Order before 11pm to receive your order in up to 2 working days (excludes Weekends & Bank Holidays) at your choice of our collection point partners; toYou at ASDA and Hermes Parcel Shop. Or get 24/7 access to self-serve lockers located across the UK with InPost. All lockers are contact-free and outdoors. You will receive an e-mail or sms confirmation when your order is ready to collect.</p>
                                                      <p className='font-normal text-gray-600 text-sm mb-2'><b>Evening Next Day Delivery -</b> Unavailable. Order before midnight to receive your order the following evening (excludes Sundays & Bank Holidays). Deliveries are made anytime between 6pm - 10pm. Postcode restrictions apply.</p>
                                                      <p className='font-normal text-gray-600 text-sm mb-2'><b>Friday Delivery -</b> £6.99. Order before 11pm Thursday to receive your items on Friday. Orders made after 11pm Thursday will be delivered the following Friday. Postcode restrictions apply.</p>
                                                      <p className='font-normal text-gray-600 text-sm mb-2'><b>Saturday Delivery -</b> £6.99. Order before 11pm Friday to receive your items on Saturday. Orders made after 11pm Friday will be delivery the following Saturday. Postcode restrictions apply.</p>
                                                      <p className='font-normal text-gray-600 text-sm mb-2'><b>Sunday Delivery -</b> £6.99. Order before 11pm Saturday to receive your items on Sunday. Orders made after 11pm Saturday will be delivered the following Sunday. Postcode restrictions apply.</p>
                                                      <p className='font-bold text-black text-lg mb-2'>international delivery options</p>
                                                      <p className='font-normal text-gray-600 text-sm mb-2'><b>International Delivery -</b>£15. Deliveries can take 8-16 working days (excluding weekends and bank holidays) This delivery option is for Andorra, Bahrain, Bermuda, Brazil, Bulgaria, China, Cyprus, India, Japan, Jordan, Korea, Republic of Kuwait, Lebanon, Malta, Mexico, Monaco, New Caledonia, Norfolk Island, Qatar, Romania, San Marino, Saudi Arabia, Singapore, Taiwan, U.S. Minor Outlying Islands, Vietnam. A full list of countries we deliver to can be found here.</p>
                                                      <h2 className='font-bold text-4xl text-gray-700 mb-3'>returns:</h2>
                                                      <p className='font-normal text-gray-600 text-sm mb-2'>You may return your item(s) back to us within <b>14 days</b> of receipt for a refund provided it is in its original, unused condition. We will issue a full refund excluding the original delivery charge. Please note it may take up to <b>10 working days</b> from the date we receive your items back to process your refund.</p>
                                                      <p className='font-normal text-gray-600 text-sm mb-2'>Any items which are found to have make-up stains on the garment will not be refunded. Please note we cannot refund any grooming products, pierced jewellery, underwear or swimwear (if the hygiene seal has been removed) for health and hygiene reasons. Shoes must be tried on indoors and must not show any signs on wear.</p>
                                                      <p className='font-normal text-gray-600 text-sm mb-2'>Check out our full returns policy for more details.</p>
                                                </div> 
                                                
                                          </div>
                                    </Transition.Child>
                              </div>
                        </Dialog>
                  </Transition.Root>
            </>
      )
}