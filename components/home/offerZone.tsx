import { FC } from 'react'
import Image from 'next/image'

const OfferZone = ({ data }: any) => {
   return (
      <>
         <div className='flex flex-col bg-white py-10 px-4'>
            <div className="px-4 flex flex-col justify-center sm:px-6 lg:px-0">
               <h2 className="heading-h2 sm:text-3xl text-xl font-bold text-left tracking-tight text-gray-900">
                  <span className='bg-white'> {data["Heading-headingTitle"]}</span>
               </h2>
            </div>
            <div className='flex flex-col sm:mt-10 mt-2 grid sm:grid-cols-1 grid-cols-1 gap-6'>
               {data["categoryImageList"].map((cate?: any) => (
                  <div>
                     <div className='flex flex-col'>
                        <Image src={cate.image} layout='intrinsic' width={2000} height={500}></Image>
                     </div>
                  </div>
               ))}
            </div>
         </div>         
      </>
   )
}

export default OfferZone;