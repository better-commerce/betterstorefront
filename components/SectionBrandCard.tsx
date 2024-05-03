import { generateUri } from "@commerce/utils/uri-util"
import { IMG_PLACEHOLDER } from "./utils/textVariables"
import Link from "next/link"
import { ChevronRightIcon } from "@heroicons/react/24/outline"

const SectionBrandCard = ({ data, key }: any) => {
  return (
    <div className='flex items-center justify-between' key={key}>
      <div>
        <h2 className='mb-4 text-3xl font-semibold md:text-4xl'>{data?.brand_brandname}</h2>
        <div className='max-w-full mb-3 text-sm font-normal leading-relaxed text-gray-600 sm:max-w-96' dangerouslySetInnerHTML={{ __html: data?.brand_branddescription }}></div>
        <Link href={data?.brand_link} passHref>
          <span className="mt-3 text-sm font-medium text-black underline">Shop Now <ChevronRightIcon className="inline-block w-3 h-3" /></span>
        </Link>
      </div>
      <div className='flex gap-4'>
        {data?.brand_images?.map((img: any, imgIdx: number) => (
          <div key={`img-${imgIdx}`} className="bg-white shadow-xl rounded-xl">
            <img src={generateUri(img, 'h=300&fm=webp') || IMG_PLACEHOLDER} alt={data?.brand_brandname} className='rounded-xl'></img>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SectionBrandCard