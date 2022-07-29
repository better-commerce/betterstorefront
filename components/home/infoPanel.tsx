import { FC } from 'react'
import Image from 'next/image'
import Link from '@components/ui/Link'
import { ChevronRightIcon } from '@heroicons/react/outline'

const Information: FC = () => {
   return (
      <>
         <div className='mt-10 flex items-center content-center px-4 grid sm:grid-cols-12 grid-cols-1 gap-6'>
            <div className='sm:col-span-3 bg-black p-6 h-full'>
               <div className='grid grid-cols-12'>
                  <div className='col-span-1'>
                     <Image src="/assets/images/tryon-icon.png" layout='fixed' width={40} height={40}></Image>
                  </div>
                  <div className='col-span-11 sm:pl-4 pl-8'>
                     <h4 className='text-white font-bold text-sm sm:text-lg mb-2'>Try On Guarantee On Innerwear</h4>
                     <p className='text-white font-regular text-sm mb-2'>Get your first pair. Don’t love it? It’s on us It’ll be on us.</p>
                     <Link href="/" passHref><a className='text-sm font-bold text-white text-right underline'>Know more <ChevronRightIcon className='w-3 h-3 text-white inline-block'></ChevronRightIcon></a></Link>
                  </div>
               </div>
            </div>
            <div className='sm:col-span-4 bg-black p-6 h-full'>
               <div className='grid grid-cols-12'>
               <div className='col-span-1'>
                     <Image src="/assets/images/easy-30-days-return-icon.png" layout='fixed' width={40} height={40}></Image>
                  </div>
                  <div className='col-span-11 sm:pl-4 pl-8'>
                     <h4 className='text-white font-bold text-sm sm:text-lg mb-2'>Easy 15-Days Returns And Exchange Available On Loungewear</h4>                    
                     <Link href="/" passHref><a className='text-sm font-bold text-white text-right underline'>Know more <ChevronRightIcon className='w-3 h-3 text-white inline-block'></ChevronRightIcon></a></Link>
                  </div>
               </div>

            </div>
            <div className='sm:col-span-5 bg-black p-6 h-full'>
               <div className='grid grid-cols-12'>
               <div className='col-span-1'>
                     <Image src="/assets/images/Free-shipping-icon.png" layout='fixed' width={60} height={40}></Image>
                  </div>
                  <div className='col-span-9 sm:pl-4 pl-8'>
                     <h4 className='text-white font-bold text-sm sm:text-lg mb-2'>Get Free Shipping</h4>
                     <p className='text-white font-regular text-sm mb-2'>For all orders above Rs. 600, we'll ship your product free of delivery charge. No matter where in India you are. No coupon code.</p>
                     <Link href="/" passHref><a className='text-sm font-bold text-white text-right underline'>Know more <ChevronRightIcon className='w-3 h-3 text-white inline-block'></ChevronRightIcon></a></Link>
                  </div>
               </div>

            </div>

         </div>
      </>
   )
}

export default Information;