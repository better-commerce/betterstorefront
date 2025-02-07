import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation, Pagination } from 'swiper'
import Link from 'next/link'
import { generateUri } from '@commerce/utils/uri-util'
import { IMG_PLACEHOLDER } from '@components/utils/textVariables'
import { IDeviceInfo } from '@components/ui/context'
interface ICategoryListProps {
  readonly data: any
  readonly deviceInfo: IDeviceInfo
}
const CategoryList: React.FC<ICategoryListProps> = ({ data, deviceInfo }: ICategoryListProps) => {
  const { isMobile } = deviceInfo
  return (
    <section className='kit-mobile-next-none'>
      <Swiper modules={[Autoplay, Pagination, Navigation]} spaceBetween={0} slidesPerView={1.4} navigation={true} loop={true} centeredSlides={false} breakpoints={{ 320: { slidesPerView: 1.4, loop: true, centeredSlides: true }, 640: { slidesPerView: 1.4, loop: true, centeredSlides: true }, 768: { slidesPerView: 3, centeredSlides: false }, 1024: { slidesPerView: 6, loop: true, centeredSlides: false, allowTouchMove: isMobile }, }} className="mySwiper">
        {data?.map((category: any, categoryIdx: number) => (
          <SwiperSlide key={`category-${categoryIdx}`} className="intial-width">
          <div>
           <Link title={category?.category_buttontext} href={category?.category_link || '/'} passHref>
            <div className="relative group cat-hover">
              <div className="absolute top-0 left-0 right-0 w-full h-full bg-transparent hover-bg"></div>
              <img src={generateUri(category?.category_image, 'fm=webp&h=200') || IMG_PLACEHOLDER} className="object-cover object-center w-full max-height-211" alt={category?.category_buttontext} width={240} height={160} loading="lazy" />
              <div className="w-full sm:absolute sm:top-2/4 sm:-translate-y-2/4 sm:left-2/4 sm:-translate-x-2/4">
                <p className="uppercase btn-primary-white slider-btn font-14 desk-width-200">{category?.category_buttontext}</p>
              </div>
            </div>
           </Link>
           </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}
export default CategoryList