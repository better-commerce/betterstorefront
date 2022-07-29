import { FC } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRightIcon } from '@heroicons/react/solid'

const ProductCollection = ({ data }: any) => {
   return (
      <>
         <div className='flex flex-col bg-gray-100 sm:py-10 py-4 px-4'>
            <div className="px-0 flex flex-col justify-center sm:px-0 lg:px-0">
               <h2 className="heading-h2 sm:text-3xl text-xl font-bold text-left tracking-tight text-gray-900">
                  <span className='bg-gray-100'>{data["Heading-headingTitle"]}</span>
               </h2>
            </div>
            <div className='flex flex-col sm:mt-10 mt-4 grid sm:grid-cols-6 grid-cols-2 gap-4'>
               {data["productCollection"].slice(0, 12).map((product?: any, ipx?:number) => (
                  <>
                     <div className='relative' key={ipx}>
                        <div className='image-container sm:block hidden'>
                           <Link href={product.slug} passHref><a className='flex flex-1'>
                              <Image src={product.image} layout='fixed' width={400} height={300}></Image>
                           </a>
                           </Link>
                        </div>
                        <div className='image-container sm:hidden block'>
                           <Link href={product.slug} passHref><a className='flex flex-1'>
                              <Image src={product.image} layout='fixed' width={200} height={170}></Image>
                           </a>
                           </Link>
                        </div>
                        <div className='flex flex-1 absolute bottom-0 left-0 p-2 bg-black-transparent w-full'>
                           <Link href={product.slug} passHref><a className='text-white sm:text-sm text-xs font-medium'>{product.name} <ChevronRightIcon className='w-4 h-4 relative -top-0.5 text-red-400 inline-block'></ChevronRightIcon></a>
                           </Link>
                        </div>
                     </div>
                  </>
               ))}

            </div>
         </div>
      </>
   )
}

export default ProductCollection;