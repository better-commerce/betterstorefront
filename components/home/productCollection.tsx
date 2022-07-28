import { FC } from 'react'
import Image from 'next/image'

import { ChevronRightIcon } from '@heroicons/react/solid'

const ProductCollection: FC = () => {
   return (
      <>
         <div className='flex flex-col bg-gray-100 py-10 px-4'>
            <div className="px-4 flex flex-col justify-center sm:px-6 lg:px-0">
               <h2 className="heading-h2 sm:text-3xl text-xl font-bold text-left tracking-tight text-gray-900">
                  <span className='bg-gray-100'> The 500-Day Warranty Collection</span>
               </h2>
            </div>
            <div className='flex flex-col mt-10 grid sm:grid-cols-6 grid-cols-2 gap-4'>
               <div className='relative'>
                  <div className='flex flex-1'>
                     <Image src="/assets/images/Shop-innerwear_VM_Polo.webp" layout='fixed' width={400} height={300}></Image>
                  </div>
                  <div className='flex flex-1 absolute bottom-5 left-4'>
                     <h3 className='text-white text-md font-bold'>Polo T-Shirt <ChevronRightIcon className='w-4 h-4 relative -top-0.5 text-red-400 inline-block'></ChevronRightIcon></h3>
                  </div>
               </div>
               <div className='relative'>
                  <div className='flex flex-1'>
                     <Image src="/assets/images/Shop-innerwear_VM_Tee.webp" layout='fixed' width={400} height={300}></Image>
                  </div>
                  <div className='flex flex-1 absolute bottom-5 left-4'>
                     <h3 className='text-white text-md font-bold'>Casual T-Shirt <ChevronRightIcon className='w-4 h-4 relative -top-0.5 text-red-400 inline-block'></ChevronRightIcon></h3>
                  </div>
               </div>
               <div className='relative'>
                  <div className='flex flex-1'>
                     <Image src="/assets/images/vest-Shop-Innerwear.webp" layout='fixed' width={400} height={300}></Image>
                  </div>
                  <div className='flex flex-1 absolute bottom-5 left-4'>
                     <h3 className='text-white text-md font-bold'>Neo-Skin Vests <ChevronRightIcon className='w-4 h-4 relative -top-0.5 text-red-400 inline-block'></ChevronRightIcon></h3>
                  </div>
               </div>
               <div className='relative'>
                  <div className='flex flex-1'>
                     <Image src="/assets/images/RAWEdge_outerwear-1.webp" layout='fixed' width={400} height={300}></Image>
                  </div>
                  <div className='flex flex-1 absolute bottom-5 left-4'>
                     <h3 className='text-white text-md font-bold'>Fluid T-Shirt <ChevronRightIcon className='w-4 h-4 relative -top-0.5 text-red-400 inline-block'></ChevronRightIcon></h3>
                  </div>
               </div>
               <div className='relative'>
                  <div className='flex flex-1'>
                     <Image src="/assets/images/Shop-category_VM_Shorts.webp" layout='fixed' width={400} height={300}></Image>
                  </div>
                  <div className='flex flex-1 absolute bottom-5 left-4'>
                     <h3 className='text-white text-md font-bold'>Casual Shorts <ChevronRightIcon className='w-4 h-4 relative -top-0.5 text-red-400 inline-block'></ChevronRightIcon></h3>
                  </div>
               </div>
               <div className='relative'>
                  <div className='flex flex-1'>
                     <Image src="/assets/images/polos.webp" layout='fixed' width={400} height={300}></Image>
                  </div>
                  <div className='flex flex-1 absolute bottom-5 left-4'>
                     <h3 className='text-white text-md font-bold'>Polo T-Shirt <ChevronRightIcon className='w-4 h-4 relative -top-0.5 text-red-400 inline-block'></ChevronRightIcon></h3>
                  </div>
               </div>
            </div>
         </div>
      </>
   )
}

export default ProductCollection;