import { FC } from 'react'
import Image from 'next/image'

const CategoryCollection: FC = () => {
   return (
      <>
         <div className='flex flex-col bg-gray-100 py-10 px-4'>
            <div className="px-4 flex flex-col justify-center sm:px-6 lg:px-0">
               <h2 className="heading-h2 sm:text-3xl text-xl font-bold text-left tracking-tight text-gray-900">
                  <span className='bg-gray-100'> What's New</span>
               </h2>
            </div>
            <div className='flex flex-col mt-10 grid sm:grid-cols-4 grid-cols-2 gap-6'>
               <div>
                  <div className='flex flex-1'>
                     <Image src="/assets/images/Whatsnew-section_popcorn.webp" layout='fixed' width={500} height={450}></Image>
                  </div>
                  <div className='flex flex-1'></div>
               </div>
               <div>
                  <div className='flex flex-1'>
                     <Image src="/assets/images/Whatsnew-section_raw.webp" layout='fixed' width={500} height={450}></Image>
                  </div>
                  <div className='flex flex-1'></div>
               </div>
               <div>
                  <div className='flex flex-1'>
                     <Image src="/assets/images/Whatsnew-section_popcorn.webp" layout='fixed' width={500} height={450}></Image>
                  </div>
                  <div className='flex flex-1'></div>
               </div>
               <div>
                  <div className='flex flex-1'>
                     <Image src="/assets/images/Whatsnew-section_raw.webp" layout='fixed' width={500} height={450}></Image>
                  </div>
                  <div className='flex flex-1'></div>
               </div>
            </div>
         </div>
      </>
   )
}

export default CategoryCollection;