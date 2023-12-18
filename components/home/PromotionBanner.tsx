import { generateUri } from '@commerce/utils/uri-util'
import { IMG_PLACEHOLDER } from '@components/utils/textVariables'
import Image from 'next/image'
import Link from 'next/link'

export default function PromotionBanner({ data, key, css }: any) {
  return (
    <div
      className="relative flex flex-col justify-center w-full text-center cursor-pointer"
      key={`full-banner-${key}`}
    >
      <Link href={data?.promotions_link} passHref legacyBehavior>
        <img
          src={generateUri(data?.promotions_image, 'h=800&fm=webp')||IMG_PLACEHOLDER}
          className="object-cover object-center w-full mob-img-height"
          alt={data?.promotions_title}
          width={2000}
          height={800}
          style={css}
        />
      </Link>
      <div className="absolute text-sm font-medium text-white top-1/2 right-24">
        {data?.promotions_title}
      </div>
    </div>
  )
}
