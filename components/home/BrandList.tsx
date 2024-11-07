import Link from 'next/link'
import { generateUri } from '@commerce/utils/uri-util'
import { IMG_PLACEHOLDER } from '@components/utils/textVariables'
interface IBrandListProps {
  readonly data: any
  readonly info: any
}

const BrandList: React.FC<IBrandListProps> = ({ data = [], info }: IBrandListProps) => {
  return (
    data && data?.length > 0 &&
    <section className="py-12 bg-tan-color">
      <div className="container grid grid-cols-1 gap-0 mx-auto sm:overflow-hidden sm:grid-cols-12">
        {info?.map((brandInfo: any, brandIdx: number) => (
          <div className="flex flex-col justify-center h-full col-span-5 b-heading-sec" key={`brand-${brandIdx}`}>
            <h2 className="mb-4 font-semibold sm:mb-8 dark:text-black mob-font-14">
              {brandInfo?.brandheading_heading}
            </h2>
            <Link href={brandInfo?.brandheading_buttonlink || '/'} passHref legacyBehavior>
              <div className="block">
                <a className="hidden uppercase cursor-pointer btn-primary-blue font-14 sm:inline-block"> {brandInfo?.brandheading_buttontext} </a>
              </div>
            </Link>
          </div>
        ))}
        <div className="h-full col-span-7 brand-img">
          <div className="grid grid-cols-3 mb-4 sm:mb-0">
            {
              (data && Array.isArray(data) && data?.length > 0) && (
                <>
                  {data?.map((brandLogo: any, logoIdx: number) => (
                    <Link href={brandLogo?.brandlist_link || '/'} passHref legacyBehavior key={`logo-${logoIdx}`}>
                      <a className="logo-container-section-list">
                        <img src={generateUri(brandLogo?.brandlist_image?.toLowerCase(), 'fm=webp&h=70') || IMG_PLACEHOLDER} className="object-cover object-center w-full" alt="brandLogo" width={100} height={30} loading="lazy" />
                      </a>
                    </Link>
                  ))}
                </>
              )
            }
          </div>
        </div>
        {info?.map((brandInfo: any, infoIdx: number) => (
          <div className="block b-heading-sec" key={`info-${infoIdx}`}>
            <Link href={brandInfo?.brandheading_buttonlink || '/'} passHref legacyBehavior>
              <a className="inline-block uppercase btn-primary-blue font-14 desk-hidden">
                {brandInfo?.brandheading_buttontext}
              </a>
            </Link>
          </div>
        ))}
      </div>
    </section>

  )
}

export default BrandList