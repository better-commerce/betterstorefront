import Link from 'next/link'
import { generateUri } from '@commerce/utils/uri-util'
import { IMG_PLACEHOLDER } from '@components/utils/textVariables'
import { IDeviceInfo } from '@components/ui/context'
import { useState } from 'react'
import { sanitizeRelativeUrl } from '@framework/utils/app-util'
interface IBrandCollectionProps {
  readonly data: any
  readonly deviceInfo: IDeviceInfo
}
const ImageCollection: React.FC<IBrandCollectionProps> = ({ data, deviceInfo }: IBrandCollectionProps) => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  return (
    <section className='container px-0  mx-auto my-4'>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.map((data: any, index: number) => (
          <div key={index}>
            <Link style={{  transform: hoveredCard === index ? "translateY(-8px)" : "translateY(0)",  boxShadow: hoveredCard === index ? "0 10px 15px -3px rgba(0, 0, 0, 0.1)" : "none"   }}
              onMouseEnter={() => setHoveredCard(index)}onMouseLeave={() => setHoveredCard(null)} className="bg-white border border-[#e0e0e0] rounded-md p-6 flex flex-col items-center relative overflow-hidden transition-transform duration-300 ease-in-out"  href={sanitizeRelativeUrl(`/${data?.brandlist_link}`)} >    
              <div className="relative w-full h-48 flex justify-center items-center mb-4">      
                {/* image */}
                <img src={generateUri(data?.brandlist_image,'w=192&fm=webp') || IMG_PLACEHOLDER} alt={data?.brandlist_title} className="relative z-10 max-h-full max-w-full object-contain" />
              </div>   
              {data?.brandlist_title && (<div className="bg-[#ACD4FF] text-black py-2 px-6 w-full text-center font-semibold tracking-wide text-base uppercase mb-4"> {data?.brandlist_title}</div> )}       
              {data?.brandlist_subtitle && (<p className="text-center text-gray-700 mb-6 min-h-[50px]">{data?.brandlist_subtitle}</p> )}             
              {data?.brandlist_buttontext && (<button className="btn-c rounded-md btn-primary button-primary text-white py-2 px-6 transition-colors duration-200"> {data?.brandlist_buttontext} </button> )}
            </Link>
          </div>
        ))}
      </div>
    </section>
  )
}

export default ImageCollection