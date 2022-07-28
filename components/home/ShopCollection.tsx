import { FC } from 'react'
import Image from 'next/image'

const ShopCollection: FC = () => {
   return (
      <>
         <div className='flex flex-col py-10 px-4'>
            <div className="px-4 flex flex-col justify-center sm:px-6 lg:px-0">
               <h2 className="heading-h2 sm:text-3xl text-xl font-bold text-left tracking-tight text-gray-900">
                  <span className='bg-white'>Shop Collection</span>
               </h2>
            </div>
            <div className='flex flex-col mt-10 grid sm:grid-cols-4 grid-cols-2 gap-6'>
            <div>
                  <div className='flex flex-1'>
                     <Image src="/assets/images/500-day-opt-2.webp" layout='fixed' width={500} height={450}></Image>
                  </div>
                  <div className='flex flex-1'></div>
               </div>
               <div>
                  <div className='flex flex-1'>
                     <Image src="/assets/images/breeeze-boxers-desktop.webp" layout='fixed' width={500} height={450}></Image>
                  </div>
                  <div className='flex flex-1'></div>
               </div>
               <div>
                  <div className='flex flex-1'>
                     <Image src="/assets/images/500-day-opt-2.webp" layout='fixed' width={500} height={450}></Image>
                  </div>
                  <div className='flex flex-1'></div>
               </div>
               <div>
                  <div className='flex flex-1'>
                     <Image src="/assets/images/breeeze-boxers-desktop.webp" layout='fixed' width={500} height={450}></Image>
                  </div>
                  <div className='flex flex-1'></div>
               </div>
            </div>
         </div>
      </>
   )
}

export default ShopCollection;