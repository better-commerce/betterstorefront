import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import Image from 'next/image'
import 'swiper/css'
import 'swiper/css/navigation'
import SwiperCore, { Navigation } from 'swiper'
import { GENERAL_ADD_TO_BASKET, GENERAL_ENGRAVING, IMG_PLACEHOLDER, ITEM_TYPE_ADDON } from '@components/utils/textVariables'
import { generateUri } from '@commerce/utils/uri-util'
import { useUI } from '@components/ui'
import { useState } from 'react'
import cartHandler from '@components/services/cart'
import Engraving from '../Engraving'
import { round } from 'lodash'
import QuickViewModal from '@components/product/QuickView/ProductQuickView'
import { getCurrentPage } from '@framework/utils/app-util'
import { recordGA4Event } from '@components/services/analytics/ga4'
import ProductCard from '../ProductCard/ProductCard'

export default function RelatedProductWithGroup({ products,productPerColumn }: any) {
    var settings = {
        fade: false,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 8000,
        centerMode: false,
        dots: true,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    initialSlide: 1,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    }
    const [isQuickview, setQuickview] = useState(undefined)
    const [isQuickviewOpen, setQuickviewOpen] = useState(false)
    const [isEngravingOpen, showEngravingModal] = useState(false)
    let currentPage = getCurrentPage();

    const { basketId, setCartItems, user } = useUI()

    const computeRelatedItems = () => {
        const relatedProductsClone = [...products]
        const tempArr: any = {}

        products.reduce((acc: any, obj: any) => {
            acc.forEach((item: any) => {
                if (item.stockCode === obj.stockCode) {
                    if (!tempArr[item.relatedTypeCode]) {
                        tempArr[item.relatedTypeCode] = { relatedProducts: [] }
                        tempArr[item.relatedTypeCode] = {
                            ...tempArr[item.relatedTypeCode],
                            ...item,
                        }
                    }
                    tempArr[item.relatedTypeCode]['relatedProducts'] = [
                        ...tempArr[item.relatedTypeCode].relatedProducts,
                        obj,
                    ]
                }
            })
            return acc
        }, relatedProductsClone)

        return tempArr
    }

    const computedItems = computeRelatedItems()

    const addToCart = (product: any) => {
        const asyncAddToCart = async () => {
            const item = await cartHandler().addToCart(
                {
                    basketId: basketId,
                    productId: product.recordId,
                    qty: 1,
                    manualUnitPrice: product.price.raw.withTax,
                    stockCode: product.stockCode,
                    userId: user.userId,
                    isAssociated: user.isAssociated,
                },
                'ADD',
                { product }
            )
            setCartItems(item)
        }
        asyncAddToCart()
    }
    const onViewApiKey = (product: any, pid: number) => {
        setQuickview(product)
        setQuickviewOpen(true)

        if (currentPage) {
            if (typeof window !== "undefined") {
              recordGA4Event(window, 'popup_view', {
                product_name: product?.name,
                category: product?.classification?.mainCategoryName,
                page: window.location.href,
                position: pid + 1,
                color: product?.variantGroupCode,
                price: product?.price?.raw?.withTax,
                current_page: currentPage,
              })
            }
          }
      
          if (currentPage) {
            if (typeof window !== "undefined") {
              recordGA4Event(window, 'quick_view_click', {
                ecommerce: {
                  items: {
                    product_name: product?.name,
                    position: pid + 1,
                    product_price: product?.price?.raw?.withTax,
                    color: product?.variantGroupCode,
                    category: product?.classification?.mainCategoryName,
                    current_page: currentPage,
                    header: 'You May Also Like',
                  },
                },
              })
            }
          }
    }
    const css = { maxWidth: '100%', height: 'auto' }
    return (
        <div className="container mx-auto">
            <div className="relative">
                <Swiper
                    slidesPerView={1}
                    spaceBetween={2}
                    navigation={true}
                    loop={true}
                    breakpoints={{
                        640: {
                            slidesPerView: 1,
                        },
                        768: {
                            slidesPerView: productPerColumn,
                        },
                        1024: {
                            slidesPerView: productPerColumn,
                        },
                    }}
                >
                    <div
                        role="list"
                        className="grid grid-cols-1 mt-8 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8"
                    >
                        {products?.map((product: any, pId: number) => {
                            const saving = product?.listPrice?.raw?.withTax - product?.price?.raw?.withTax;
                            const discount = round((saving / product?.listPrice?.raw?.withTax) * 100, 0);
                            const isEngravingAvailable = product.stockCode === ITEM_TYPE_ADDON
                            return (
                                <>
                                    <SwiperSlide key={pId} className='p-[1px]'>
                                        {/* <div className="relative w-full overflow-hidden group aspect-w-1 aspect-h-1 hover:opacity-75">
                                            <div className='image-container'>
                                                <Link href={`/${product.slug}`} passHref>
                                                    <Image
                                                        priority
                                                        src={generateUri(product.image, 'h=500&fm=webp') || IMG_PLACEHOLDER}
                                                        alt={product.name}
                                                        className="object-cover object-center w-full h-full sm:h-full related-min-h-image"
                                                        style={css}
                                                        width={200}
                                                        height={100}
                                                    />
                                                </Link>
                                                <button
                                                    type="button"
                                                    className="absolute z-10 w-11/12 px-4 py-2 mx-2 text-sm text-white bg-black rounded-md opacity-0 left-1 bg-opacity-60 focus:opacity-0 group-hover:opacity-100 bottom-2"
                                                    onClick={() => onViewApiKey(product, pId)}
                                                >
                                                    Quick View
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex flex-col justify-start w-full mt-4 text-left">
                                            <h3 className="font-mono text-sm font-semibold text-gray-900">
                                                <Link href={`/${product.slug}`} passHref>{product.name}</Link>
                                            </h3>
                                        </div>
                                        <div className="flex flex-col justify-start w-full text-left">
                                            <p className="mt-1 text-sm font-bold text-left text-gray-900 sm:mt-1">
                                                {product?.price?.formatted?.withTax}
                                                {product?.listPrice?.raw?.withTax > 0 && product?.listPrice?.raw?.withTax != product?.price?.raw?.withTax &&
                                                    <>
                                                        <span className='px-2 text-sm font-normal text-gray-400 line-through'>{product?.listPrice?.formatted?.withTax}</span>
                                                        <span className='text-sm font-semibold text-red-600'>{discount}% Off</span>
                                                    </>
                                                }
                                            </p>
                                        </div> */}
                                        <ProductCard product={product} hideWishlistCTA={true} />
                                    </SwiperSlide>
                                </>
                            )
                        })}
                    </div>
                </Swiper>
            </div>
            <QuickViewModal
                isQuikview={isQuickview}
                setQuickview={setQuickview}
                productData={isQuickview}
                isQuickviewOpen={isQuickviewOpen}
                setQuickviewOpen={setQuickviewOpen}
            />
        </div>
    )
}