import { useRef, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import Link from 'next/link'
import { IMG_PLACEHOLDER } from '@components/utils/textVariables'
import { generateUri } from '@commerce/utils/uri-util'
import AddToBasket from '@components/cart/AddToBasket'
import { useUI } from '@components/ui'
import { stringToBoolean } from '@framework/utils/parse-util'
import { isIncludeVATInPriceDisplay } from '@framework/utils/app-util'
import { ChevronLeft, ChevronRight } from '@components/icons'
function BrandProduct({ product, hideTier = false, brandInfo }: any) {
  const { includeVAT } = useUI()
  const isIncludeVAT = stringToBoolean(includeVAT)
  const { tierName, products } = product
  const swiperRef: any = useRef(null)
  const [selectedCat, setSelectedCat] = useState({ categoryId: product?.categoryId, category: product?.categoryName, tierId: product?.tierId, tier: product?.tierName })
  const css = { maxWidth: '100%', height: 'auto' }
  return (
    <div className="mb-6 overflow-hidden">
      <div className="flex justify-between gap-1 mb-2 lg:gap-3 ">
        {!hideTier ? (
          <h3 className="my-2 text-lg font-medium sm:text-2xl dark:text-black">{tierName}</h3>
        ) : (
          <h3 className="my-2 text-lg font-medium sm:text-2xl dark:text-black">Add To Kit</h3>
        )}
        {products?.length > 2 && 
          <div className="flex gap-4">
            <button onClick={() => swiperRef.current.swiper.slidePrev()} className="flex items-center justify-center w-10 h-10 border border-gray-200 rounded arrow-container hover:border-black" >
              <ChevronLeft className="text-black w-7 h-7" />
            </button>
            <button onClick={() => swiperRef.current.swiper.slideNext()} className="flex items-center justify-center w-10 h-10 border border-gray-200 rounded arrow-container hover:border-black" >
              <ChevronRight className="text-black w-7 h-7" />
            </button>
          </div>
        }
      </div>
      <Swiper spaceBetween={10} navigation={false} ref={swiperRef} loop={true} breakpoints={{ 320: { slidesPerView: 1, }, 640: { slidesPerView: 2, }, 768: { slidesPerView: 2, }, 1200: { slidesPerView: 2, }, 1400: { slidesPerView: 3, }, 1700: { slidesPerView: 4, }, }}>
        {products?.map((prod: any) => (
          <SwiperSlide key={prod?.recordId} className="bg-transparent rounded-md" >
            <div className="relative grid grid-cols-1 p-4 bg-white border rounded-md hover:border-orange-500 sm:grid-cols-1 shadow-gray-200 group prod-group">
              <div className="relative flex-1">
                <Link href={`/${prod?.slug}`} passHref legacyBehavior>
                  <a href={`/${prod?.slug}`}>
                    <img id={`${prod?.productId ?? prod?.recordId}-1`} src={generateUri(prod?.image, 'h=350&fm=webp') || IMG_PLACEHOLDER} alt={prod?.name} className="object-cover object-center w-full h-full sm:h-full min-h-image height-img-auto" style={css} width={400} height={500} loading="lazy" />
                  </a>
                </Link>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between w-full px-0 text-xs font-semibold text-left text-black sm:mt-1 sm:text-sm p-font-size">
                  <div>
                    {isIncludeVATInPriceDisplay(isIncludeVAT, product) ? prod?.price?.formatted?.withTax : prod?.price?.formatted?.withoutTax}
                    {isIncludeVATInPriceDisplay(isIncludeVAT, product) ? (
                      prod?.listPrice?.raw?.withTax > 0 && prod?.listPrice?.raw?.withTax > prod?.price?.raw?.withTax && (
                        <span className="px-1 font-normal text-gray-400 line-through"> {prod?.listPrice?.formatted?.withTax} </span>
                      )
                    ) : (
                      prod?.listPrice?.raw?.withoutTax > 0 && prod?.listPrice?.raw?.withoutTax > prod?.price?.raw?.withoutTax && (
                        <span className="px-1 font-normal text-gray-400 line-through"> {prod?.listPrice?.formatted?.withoutTax} </span>
                      )
                    )}
                  </div>
                  <div className="items-end text-xs font-light text-right text-gray-400">
                    {isIncludeVATInPriceDisplay(isIncludeVAT, product) ? 'inc. VAT' : 'ex. VAT'}
                  </div>
                </div>
                <div className="flex justify-between w-full px-0 mt-2 mb-1 font-medium text-left text-black capitalize font-14 product-name hover:text-gray-950 min-prod-name-height light-font-weight prod-name-block">
                  {prod?.name}
                </div>
                <div className='flex flex-col w-full add-mob-visible'>
                  <AddToBasket product={prod} brandInfo={brandInfo} selectedCat={selectedCat} />
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
export default BrandProduct