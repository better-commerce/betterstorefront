import { FC } from 'react'
import Image from 'next/image'
import Link from '@components/ui/Link'
import { ChevronRightIcon } from '@heroicons/react/outline'

const FashionIdea: FC = () => {
   return (
      <>
         <div className='mt-10 flex items-center content-center px-4 grid sm:grid-cols-12 grid-cols-2 gap-6'>
            <div className='sm:col-span-5'>
               <div className='flex flex-1'>
                  <Image src="/assets/images/fashion-that-thinks-D-1.jpg" layout='fixed' width={800} height={700}></Image>
               </div>
               <div className='flex flex-1'></div>
            </div>
            <div className='sm:col-span-7 text-right'>
               <h3 className='heading-h3 mb-6'>
                  <span className='bg-white'>A great idea for fashion</span>
               </h3>
               <p className='text-right text-md font-medium text-black mb-2 sm:max-w-3xl ml-auto'>We think, hence we are. With our thoughts we make the world. DaMENSCH is in pursuit of doing more to redefine comfort through thoughtful innovation in fashion. To make you feel comfortable, capable, and at ease, you need fashion that thinks for you.</p>
               <Link href="/" passHref><a className='text-sm font-bold text-black text-right underline'>Know more <ChevronRightIcon className='w-3 h-3 text-black inline-block'></ChevronRightIcon></a></Link>
            </div>
         </div>
      </>
   )
}

export default FashionIdea;