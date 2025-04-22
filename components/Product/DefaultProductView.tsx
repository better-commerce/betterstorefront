import { useTranslation } from "@commerce/utils/use-translation";
import AccordionInfo from "@components/AccordionInfo";
import Prices from "@components/Prices";
import MyLocationIcon from "@components/shared/icons/MyLocationIcon";
import StockCheckModal from "@components/StoreLocator/StockCheckModal/StockCheckModal";
import { sanitizeRelativeUrl } from "@framework/utils/app-util";
import { HeartIcon, StarIcon } from "@heroicons/react/24/outline";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.min.css';
import DeliveryInfo from "./DeliveryInfo";
const QuantityBreak = dynamic(() => import('@components/Product/QuantiyBreak'))
const Button = dynamic(() => import('@components/ui/IndigoButton'))
const BuyNowButton = dynamic(() => import('@components/ui/BuyNowButton'))
const AvailableOffers = dynamic(() => import('@components/Product/AvailableOffers'))
export default function DefaultProductView({ product, detailsConfig, config, isEngravingAvailable, renderProductSpecification, isInWishList, handleWishList, buttonConfig, showMobileCaseButton, featureToggle, isMobile, onStoreStockCheck, setOpenStockCheckModal, showEngravingModal, selectedAttrData, renderSellableType, openStoreLocatorModal, promotions, deviceInfo, reviews, renderVariants, attrGroup, renderRelatedProducts, defaultDisplayMembership }: any) {
  const translate = useTranslation()
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold sm:text-2xl product-name-h2 dark:text-black">
          {product?.name}
        </h1>
        <div className="flex justify-start mt-5 space-x-4 rtl:justify-end sm:space-x-5 rtl:space-x-reverse">
          <Prices contentClass="py-1 px-2 md:py-1.5 md:px-3 text-lg font-semibold price-info" price={product?.price} listPrice={product?.listPrice} featureToggle={featureToggle} defaultDisplayMembership={defaultDisplayMembership} />
          {reviews?.review?.totalRecord > 0 &&
            <>
              <div className="flex w-64">
                <Link href={`#productReview`} className="flex text-sm font-medium" >
                  <StarIcon className="w-5 h-5 pb-[1px] text-yellow-400" />
                  <div className="ms-1.5 flex">
                    <span className='dark:text-black'>{reviews?.review?.ratingAverage}</span>
                    <span className="block mx-2 dark:text-black">·</span>
                    <span className="underline text-slate-600 dark:text-slate-600">
                      {reviews?.review?.totalRecord} {translate('common.label.reviews')}
                    </span>
                  </div>
                </Link>
              </div>
            </>
          }
        </div>
      </div>
      {attrGroup['product.relatedproducts']?.length > 0 &&
        <div className='flex w-full'>
          <Swiper slidesPerView={4.5} spaceBetween={6} className="mySwiper" >
            {attrGroup['product.relatedproducts'].map((item: any, index: number) => (
              <SwiperSlide key={index}>
                <div className='w-full p-2 py-3 text-xs border border-gray-300 rounded-xl hover:border-gray-400'>
                  <Link href={`/products${sanitizeRelativeUrl(item?.value)}`}> <span>{item?.fieldText}</span> </Link>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      }

      {renderRelatedProducts()}
      <div className="">{renderVariants()}</div>
      {product?.quantityBreakRules?.length > 0 &&
        <QuantityBreak product={product} rules={product?.quantityBreakRules} selectedAttrData={selectedAttrData} defaultDisplayMembership={defaultDisplayMembership} />
      }
      {promotions?.promotions?.availablePromotions?.length > 0 && (
        <AvailableOffers currency={product?.price} offers={promotions?.promotions} key={product?.id} product={product} />
      )}
      {
        openStoreLocatorModal && <StockCheckModal product={product} setOpenStockCheckModal={setOpenStockCheckModal} deviceInfo={deviceInfo} />
      }
      {featureToggle?.features?.enableStoreStockCheck &&
        <div className='flex flex-row w-full /!my-4 items-center gap-x-1 /justify-end'>
          <MyLocationIcon className='w-4 h-4' />
          <span className='cursor-pointer hover:underline dark:text-black' onClick={onStoreStockCheck}>{translate('label.store.checkStoreStockText')}</span>
        </div>
      }
      {renderSellableType()}
      {product?.preOrder?.isEnabled &&
        <div className='flex flex-col'>
          <h4 className='font-medium text-orange-500 tet-xl'>{product?.preOrder?.shortMessage}</h4>
        </div>
      }
      <div id="add-to-cart-button">
        {isMobile ? (
          <>
            {showMobileCaseButton && (
              <div className="fixed bottom-0 left-0 z-10 w-full bg-white border-t border-gray-200">
                <div className="container p-4 mx-auto max-w-7xl">
                  <div className="flex justify-end">
                    <Button title={buttonConfig.title} action={buttonConfig.action} buttonType={buttonConfig.type || 'cart'} />
                    <button type="button" onClick={handleWishList} className="flex items-center justify-center ml-4 border border-gray-300 rounded-full hover:bg-red-50 hover:text-pink hover:border-pink btn dark:text-black">
                      {isInWishList(selectedAttrData?.productId) ? (
                        <HeartIcon className="flex-shrink-0 w-6 h-6 text-pink" />
                      ) : (
                        <HeartIcon className="flex-shrink-0 w-6 h-6 dark:hover:text-pink" />
                      )}
                      <span className="sr-only"> {translate('label.product.addToFavoriteText')} </span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex rtl:space-x-reverse">
            {!isEngravingAvailable && (
              <div className="flex mt-6 sm:mt-4 !text-sm w-full add-green-btn">
                <Button title={buttonConfig.title} action={buttonConfig.action} buttonType={buttonConfig.type || 'cart'} />
                <button type="button" onClick={handleWishList} className="flex items-center justify-center ml-4 border border-gray-300 rounded-full hover:bg-red-50 hover:text-pink hover:border-pink btn dark:text-black">
                  {isInWishList(selectedAttrData?.productId) ? (
                    <HeartIcon className="flex-shrink-0 w-6 h-6 text-pink" />
                  ) : (
                    <HeartIcon className="flex-shrink-0 w-6 h-6 dark:hover:text-pink" />
                  )}
                  <span className="sr-only"> {translate('label.product.addToFavoriteText')} </span>
                </button>
              </div>
            )}

            {isEngravingAvailable && (
              <>
                <Button className="block py-3 sm:hidden" title={buttonConfig.title} action={buttonConfig.action} buttonType={buttonConfig.type || 'cart'} />
                <Button className="hidden sm:block " title={buttonConfig.title} action={buttonConfig.action} buttonType={buttonConfig.type || 'cart'} />
                <button className="flex items-center justify-center flex-1 max-w-xs px-8 py-3 font-medium text-white bg-gray-700 border border-transparent rounded-full sm:ml-4 hover:bg-pink focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-gray-500 sm:w-full" onClick={() => showEngravingModal(true)} >
                  {translate('label.product.engravingText')}
                </button>
                <button type="button" onClick={handleWishList} className="flex items-center justify-center w-12 h-12 px-4 py-2 ml-4 text-gray-500 bg-white border border-gray-300 rounded-full hover:bg-red-50 hover:text-pink sm:px-2 hover:border-pink" >
                  {isInWishList(selectedAttrData?.productId) ? (
                    <HeartIcon className="flex-shrink-0 w-6 h-6 text-red-700" />
                  ) : (
                    <HeartIcon className="flex-shrink-0 w-6 h-6" />
                  )}
                  <span className="sr-only"> {translate('label.product.addToFavoriteText')} </span>
                </button>
              </>
            )}
          </div>
        )}
      </div>
      <hr className=" border-slate-200 dark:border-slate-700"></hr>
      {!featureToggle?.features?.enableCustomToolWidget ? (
        <>
          {product && <AccordionInfo product={product} data={detailsConfig} />}
          {renderProductSpecification()}
        </>
      ) : (
        <></>
      )}
      <div className="flex-1 order-6 w-full sm:order-5 accordion-section">
        <DeliveryInfo product={product} grpData={attrGroup} config={config} />
      </div>
    </div>
  )
}