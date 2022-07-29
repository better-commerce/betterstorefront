import { FC } from 'react'
import Image from 'next/image'

const ShopCollection = ({ data }: any) => {

   return (
      <>
         <div className='flex flex-col bg-gray-100 sm:py-10 py-0 sm:pb-0 pb-4 px-4'>
            <div className="px-0 flex flex-col justify-center sm:px-0 lg:px-0">
               <h2 className="heading-h2 sm:text-3xl text-xl font-bold text-left tracking-tight text-gray-900">
                  <span className='bg-gray-100'>{data["Heading-headingTitle"]}</span>
               </h2>
            </div>
            <div className='flex flex-col sm:mt-10 mt-4 grid sm:grid-cols-4 grid-cols-2 gap-4'>
               {data["categoryImageList"].map((cate?: any) => (
                  <div>
                     <div className='flex flex-1'>
                        <div className='image-container'>
                           <Image src={cate.image} alt={data["Heading-headingTitle"]} layout='fill' className='image'></Image>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </>
   )
}

export default ShopCollection;