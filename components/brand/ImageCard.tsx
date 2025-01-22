import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore, {Pagination } from 'swiper'
import 'swiper/css'
import 'swiper/css/navigation'
import Link from 'next/link'
import { resolve } from 'url'

//
import { EmptyString } from '@components/utils/constants'

interface IImageCardProps {
  readonly data: any
}

const ImageCard: React.FC<IImageCardProps> = ({ data }: IImageCardProps) => {
  return (
    <>
      <div className="py-4 container-ffx desktop-pagination-hide">
        <Swiper modules={[Pagination]}spaceBetween={10} slidesPerView={1.4} navigation={false}  pagination={{ clickable: true }} loop={true} centeredSlides={false}
          breakpoints={{
            320: { slidesPerView: 1, loop: true, centeredSlides: true },
            640: { slidesPerView: 1, loop: true, centeredSlides: true },
            768: { slidesPerView: 2, centeredSlides: false },
            1024: { slidesPerView: 3 },
          }}
          className="mySwiper">
          {data?.map((feature: any, ffdx: number) => (
            <SwiperSlide key={`featured-brand-${ffdx}`} className="height-auto-slide">
              <div className="flex flex-col w-full h-full overflow-hidden shadow-lg">
                <div className="flex-shrink-0 f-image-container">
                  <img src={feature?.imagecardinfo_image} className="object-fill object-center w-full" alt="Image" width={240} height={160} />
                </div>
                <div className="flex flex-col justify-between flex-1 p-3 pb-8 text-left sm:pb-6 sm:p-6 bg-blue-web">
                  <div className="flex-1">
                    <div className="block mt-2">
                      <h3 className="font-semibold text-white">{feature?.imagecardinfo_title}</h3>
                      <div className="mt-3 mb-8 overflow-hidden text-white font-18 pc-font-18 mob-font-14" dangerouslySetInnerHTML={{ __html: feature?.imagecardinfo_description }}></div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-y-2 sm:grid sm:grid-cols-2 sm:gap-4 sm:w-11/12">
                    {feature?.imagecardinfo_redbuttonlink != '' ? (
                      <>
                        <Link href={resolve("/", (feature?.imagecardinfo_redbuttonlink || EmptyString))} className="text-center uppercase btn-secondary font-14 sm-font-12">{feature?.imagecardinfo_redbuttontext}</Link>
                      </>
                    ) : (
                      <></>
                    )}
                    {feature?.imagecardinfo_whitebuttonlink != '' ? (
                      <>
                        <Link href={resolve("/", (feature?.imagecardinfo_whitebuttonlink || EmptyString))} className="text-center uppercase btn-primary-white font-14 sm-font-12">{feature?.imagecardinfo_whitebuttontext}</Link>
                      </>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  )
}

export default ImageCard