import { FC } from 'react'
import Image from 'next/image'
import Link from '@components/ui/Link'
import { ChevronRightIcon } from '@heroicons/react/outline'

const FashionIdea = ({ data }: any) => {
   debugger;
   return (
      <>
         <div className='mt-10 flex items-center content-center px-4 grid sm:grid-cols-12 grid-cols-2 gap-6'>
            <div className='sm:col-span-5'>
               <div className='flex flex-1'>
                  <Image src={data["infoBannerImage"].image} layout='fixed' width={800} height={700}></Image>
               </div>
            </div>
            <div className='sm:col-span-7 text-right'>
               <h3 className='heading-h3 mb-6'>
                  <span className='bg-white'>{data["Heading-headingTitle"]}</span>
               </h3>
               <p className='text-right text-md font-medium text-black mb-2 sm:max-w-3xl ml-auto' dangerouslySetInnerHTML={{ __html: data["infoBannerDescription"] || '' }}></p>
               <Link href="/" passHref><a className='text-sm font-bold text-black text-right underline'>Know more <ChevronRightIcon className='w-3 h-3 text-black inline-block'></ChevronRightIcon></a></Link>
            </div>
         </div>
      </>
   )
}

export default FashionIdea;