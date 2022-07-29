import Image from 'next/image'

const OfferZone = ({ data }: any) => {
   return (
      <>
         <div className='flex flex-col bg-white sm:py-10 py-0 sm:pb-0 pb-4 px-4' key={data["Heading-headingTitle"]}>
            <div className="px-0 flex flex-col justify-center sm:px-0 lg:px-0">
               <h2 className="heading-h2 sm:text-3xl text-xl font-bold text-left tracking-tight text-gray-900">
                  <span className='bg-white'> {data["Heading-headingTitle"]}</span>
               </h2>
            </div>
            <div className='flex flex-col sm:mt-10 mt-2 grid sm:grid-cols-1 grid-cols-1 gap-6'>
               {data["categoryImageList"].map((cate?: any, offeridx?:number) => (
                  <div key={offeridx}>
                     <div className='flex flex-col'>
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

export default OfferZone;