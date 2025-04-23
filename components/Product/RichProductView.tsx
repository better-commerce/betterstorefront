import Link from "next/link";
import ReviewBadge from "./ReviewBadge";
import PricesWithDiscount from '@components/PricesWithDiscount'
import { ChevronRightIcon } from '@heroicons/react/24/outline'
import { sanitizeRelativeUrl } from "@framework/utils/app-util";
import StockCheckModal from "@components/StoreLocator/StockCheckModal/StockCheckModal";
import LongDescription from "./LongDescription";
import Prices from "@components/Prices";
import dynamic from "next/dynamic";
import MyLocationIcon from "@components/shared/icons/MyLocationIcon";
import { useTranslation } from "@commerce/utils/use-translation";
const QuantityBreak = dynamic(() => import('@components/Product/QuantiyBreak'))
const Button = dynamic(() => import('@components/ui/IndigoButton'))
const BuyNowButton = dynamic(() => import('@components/ui/BuyNowButton'))
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.min.css';
import { HeartIcon } from "@heroicons/react/24/outline";
const UsedProductCard = dynamic(() => import('@components/Product/UsedProductCard'))
export default function RichProductView({ product, selectedOption, isGuestUser, handleWishList, isInWishList, maxBasketItemsCount, isEngravingAvailable, user, showMobileCaseButton, quantity, buttonConfig, setQuantity, setSelectedOption, usedProduct, attrGroup, createProductInterest, featureToggle, defaultDisplayMembership, deviceInfo, selectedAttrData, renderRelatedProducts, renderVariants, showEngravingModal, renderSellableType, setOpenStockCheckModal, openStoreLocatorModal, onStoreStockCheck, isMobile }: any) {
  const translate = useTranslation()
  return (
    <div className='flex gap-6 flex-mob-col'>
      <div className='w-full lg:w-[60%]'>
        <div className="space-y-4">
          <div>
            {product?.condition === 'pre-launch' &&
              <h3 className='text-sm font-semibold text-black uppercase'>{product?.brand}</h3>
            }
            <h1 className="mb-2 text-xl font-semibold heading sm:text-2xl product-name-h2 dark:text-black">
              {selectedOption === "new" ? product?.name : usedProduct?.at(0)?.name}
            </h1>
            {product?.condition != 'pre-launch' && <div className="flex flex-col gap-3">
              <ReviewBadge reviewCountdata={product?.reviewCount} ratingdata={product?.rating} />
            </div>}
            <div className="flex justify-start mt-5 space-x-4 rtl:justify-end sm:space-x-5 rtl:space-x-reverse">
              {selectedOption === "new" && product?.condition != 'pre-launch' && (
                <>
                  <PricesWithDiscount contentClass="py-1 px-2 md:py-1.5 md:px-3 text-lg font-semibold price-info" price={product?.price} listPrice={product?.listPrice} featureToggle={featureToggle} defaultDisplayMembership={defaultDisplayMembership} />
                </>
              )}
              {selectedOption === "used" && product?.condition != 'pre-launch' && (
                <>
                  <PricesWithDiscount contentClass="py-1 px-2 md:py-1.5 md:px-3 text-lg font-semibold price-info" price={usedProduct?.at(0)?.price} listPrice={usedProduct?.at(0)?.listPrice} featureToggle={featureToggle} defaultDisplayMembership={defaultDisplayMembership} />
                </>
              )}
            </div>
            {selectedOption === "used" && product?.condition != 'pre-launch' && (
              <div className='w-full my-3'>
                <div className="max-w-lg bg-[#EAEDF5] rounded-lg p-4 flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100">
                      <img src="/theme/camera/image/approved-icon.svg" alt="approved Icon" />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <h3 className="font-semibold text-black text-body-small">Park-Approved</h3>
                    <p className="text-[#1E1E1E] font-medium text-x-small">
                      This item has been inspected, tested, and approved by our experts for quality and performance.{" "}
                      <a href="#" className="font-semibold link-clr primary-text-blue">
                        Learn more
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            )}
            {/* <div className="w-full max-w-3xl my-4 border shadow-sm rounded-xl bg-background">
                    <div className="flex items-center gap-3 px-3 py-2 bg-gray-100">
                      <div className="bg-gray-100 rounded-full">
                        <CreditCardIcon className="w-4 h-4 text-black" />
                      </div>
                      <h2 className="text-sm font-semibold text-gray-800">{product?.brand} Cashback</h2>
                    </div>

                    <div className="px-3 py-2 pb-4 mt-2 space-y-1 ">
                      <div className="flex items-baseline">
                        <h3 className="text-sm font-medium text-gray-800">Effective price: </h3>
                        <span className="ml-2 text-sm font-bold text-red-700">£1,749.00</span>
                      </div>

                      <p className="text-sm font-medium text-gray-800">after £400 cashback</p>

                      <div className="pt-2 mt-8">
                        <p className="text-sm text-gray-800">
                          Cashback applies if product ordered within the offer period, even if out of stock.{" "}
                          <a href="#" className="text-blue-600 hover:underline link-clr">How to redeem?</a>
                        </p>
                      </div>
                    </div>
                  </div> */}
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
          {
            openStoreLocatorModal && <StockCheckModal product={product} setOpenStockCheckModal={setOpenStockCheckModal} deviceInfo={deviceInfo} />
          }
          {renderSellableType()}
          {product?.condition != 'pre-launch' ? <div className='flex short-descriptionc'>
            <LongDescription data={selectedOption === "new" ? product?.shortDescription : usedProduct?.at(0)?.shortDescription || product?.shortDescription} heading="" />
          </div> :
            <div
              className="text-sm text-gray-800 description-html"
              dangerouslySetInnerHTML={{ __html: product?.shortDescription }}
            />
          }
        </div>
      </div>
      <div className='w-full lg:w-[40%]'>
        <div className="w-full p-0 border rounded-lg shadow-md">
          {/* New Product Option */}
          {product?.condition != 'pre-launch' ? (
            <>
              <div className={`p-4 mb-4 ${selectedOption === "new" ? "bg-transparent" : "bg-nonactive"}`}>

                <label className="flex items-center justify-between gap-2 cursor-pointer">
                  <input type="radio" name="product" value="new" checked={selectedOption === "new"} onChange={() => setSelectedOption("new")} className="hidden" />
                  <span className="font-semibold">Buy new</span>
                  <span className={`w-5 h-5 border rounded-full flex items-center justify-center mr-2 ${selectedOption === "new" ? "border-blue-600 active-radio" : "border-gray-400"}`}>
                    {selectedOption === "new" && <span className="w-3 h-3 bg-blue-600 rounded-full"></span>}
                  </span>
                </label>
                <div className='mt-3 space-y-3'>
                  <Prices contentClass="py-1 px-2 md:py-1.5 md:px-3 text-lg font-semibold price-info" price={product?.price} listPrice={product?.listPrice} featureToggle={featureToggle} defaultDisplayMembership={defaultDisplayMembership} />
                  {/* <p className="text-sm text-gray-600">Or <strong>£138.33</strong> per month for <strong>36 months</strong> plus deposit £449.90. <a href="#" className="text-color-primary-blue">Details.</a></p>
                    <p className="text-sm font-normal text-black">FREE next day delivery.</p> */}
                </div>
                {selectedOption === "new" && (
                  <div className="mt-2 space-y-2">
                    {featureToggle?.features?.enableStoreStockCheck &&
                      <div className='flex flex-row w-full /!my-4 items-center gap-x-1 /justify-end'>
                        <MyLocationIcon className='w-4 h-4' />
                        <span className='cursor-pointer hover:underline dark:text-black' onClick={onStoreStockCheck}>{translate('label.store.checkStoreStockText')}</span>
                      </div>
                    }
                    <div className="mb-3 flex  pl-2 items-center border border-[#D9D9D9] bg-[#F5F5F5] rounded-md">
                      <span className='pr-1'>Quantity:</span>
                      <select id="quantity" className="w-full p-2 bg-transparent border-none focus:border-0 focus-none" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))}>
                        {[...Array(10).keys()].map((num) => (
                          <option key={num + 1} value={num + 1}> {num + 1} </option>
                        ))}
                      </select>
                    </div>
                    <div id="add-to-cart-button" className='blue-add-btn'>
                      {isMobile ? (
                        showMobileCaseButton && (
                          <div className="fixed bottom-0 left-0 z-10 w-full bg-white border-t border-gray-200">
                            <div className="container p-4 mx-auto max-w-7xl">
                              <div className="flex justify-end">
                                <Button title={buttonConfig.title} action={buttonConfig.action} buttonType={buttonConfig.type || 'cart'} />
                              </div>
                            </div>
                          </div>
                        )
                      ) : (
                        <div className="flex w-full rtl:space-x-reverse">
                          {!isEngravingAvailable && product?.condition != 'pre-launch' && (
                            <div className="flex mt-6 sm:mt-4 !text-sm w-full add-green-btn">
                              <Button title={buttonConfig.title} action={buttonConfig.action} buttonType={buttonConfig.type || 'cart'} />
                            </div>
                          )}

                          {isEngravingAvailable && product?.condition != 'pre-launch' && (
                            <>
                              <div className='flex flex-col w-full gap-y-2 add-green-btn'>
                                <Button className="block py-3 sm:hidden add-green-btn nc-button" title={buttonConfig.title} action={buttonConfig.action} buttonType={buttonConfig.type || 'cart'} />
                                <Button className="hidden sm:block " title={buttonConfig.title} action={buttonConfig.action} buttonType={buttonConfig.type || 'cart'} />
                                <button className="flex items-center justify-center flex-1 max-w-xs px-8 py-3 font-medium text-white bg-gray-700 border border-transparent rounded-full hover:bg-pink focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-gray-500 sm:w-full" onClick={() => showEngravingModal(true)} >
                                  {translate('label.product.engravingText')}
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                      {!isGuestUser && user?.userId && product?.condition != 'pre-launch' &&
                        <>
                          <div className="flex mt-6 sm:mt-4 !text-sm w-full buy-btn">
                            <BuyNowButton title="Buy Now" action={buttonConfig.action} buttonType={buttonConfig.type || 'cart'} />
                          </div>
                        </>
                      }
                    </div>
                    {/* <div className='w-full pt-3'>
                        <div className='flex flex-row gap-2 sm:grid sm:grid-cols-2'>
                          <h4 className='text-xs'>Dispatches from</h4>
                          <p className='text-xs text-black'>London Store</p>
                        </div>
                        <div className='flex flex-row gap-2 sm:grid sm:grid-cols-2'>
                          <h4 className='text-xs'>Returns</h4>
                          <p className='text-xs text-color-primary-blue'>Returnable within 30 days of receipt</p>
                        </div>
                        <div className='flex flex-row gap-2 sm:grid sm:grid-cols-2'>
                          <h4 className='text-xs'>Payment</h4>
                          <p className='text-xs text-color-primary-blue'>Secure transaction</p>
                        </div>
                        <div className='flex flex-row gap-2 sm:grid sm:grid-cols-2'>
                          <h4 className='text-xs'>Support</h4>
                          <p className='text-xs text-color-primary-blue'>Product support included</p>
                        </div>
                      </div> */}
                    {product?.condition != 'pre-launch' && <div className='w-full'>
                      <button type="button" onClick={handleWishList} className="flex rounded-md items-center justify-center w-full h-auto px-4 py-2 text-[#767676] bg-white border border-[#767676] hover:bg-red-50 hover:text-pink sm:px-2 hover:border-pink" >
                        {isInWishList(selectedAttrData?.productId) ? (
                          <HeartIcon className="flex-shrink-0 w-4 h-4 mr-2 font-semibold text-red-700" />
                        ) : (
                          <HeartIcon className="flex-shrink-0 w-3 h-3 mr-2 font-semibold text-black" />)}
                        <span className='text-xs font-semibold text-black'> Add to Wishlist </span>
                      </button>
                    </div>}
                  </div>
                )}
              </div>
              {/* Used Product Option */}
              {usedProduct?.length > 0 && (
                <div className={`p-4 ${selectedOption === "used" ? "bg-transparent" : "bg-nonactive"}`}>
                  <label className="flex items-center justify-between gap-2 cursor-pointer">
                    <input type="radio" name="product" value="used" checked={selectedOption === "used"} onChange={() => setSelectedOption("used")} className="hidden" />
                    <span className="font-semibold">Save with used - Like New</span>
                    <span className={`w-5 h-5 border rounded-full flex items-center justify-center mr-2 ${selectedOption === "used" ? "border-blue-600 active-radio" : "border-gray-400"}`}>
                      {selectedOption === "used" && <span className="w-3 h-3 bg-blue-600 rounded-full"></span>}
                    </span>
                  </label>
                  <div className='mt-3 space-y-2'>
                    <Prices contentClass="py-1 px-2 md:py-1.5 md:px-3 text-lg font-semibold price-info" price={usedProduct?.[0]?.price} listPrice={usedProduct?.[0]?.listPrice} featureToggle={featureToggle} defaultDisplayMembership={defaultDisplayMembership} />
                    {/* <p className="text-sm text-gray-600">Or <strong>£138.33</strong> per month for <strong>36 months</strong> plus deposit £449.90. <a href="#" className="text-color-primary-blue">Details.</a></p>
                      <p className="text-sm font-normal text-black">FREE next day delivery.</p> */}
                  </div>
                  {selectedOption === "used" && (
                    <>
                      {featureToggle?.features?.enableStoreStockCheck &&
                        <div className='flex flex-row w-full mt-3 /!my-4 items-center gap-x-1 /justify-end'>
                          <MyLocationIcon className='w-4 h-4' />
                          <span className='cursor-pointer hover:underline dark:text-black' onClick={onStoreStockCheck}>{translate('label.store.checkStoreStockText')}</span>
                        </div>
                      }
                      <UsedProductCard products={usedProduct[0]} maxBasketItemsCount={maxBasketItemsCount} deviceInfo={deviceInfo} featureToggle={featureToggle} />
                    </>
                  )}
                </div>
              )}
            </>
          ) : (
            <>
              <div className={`p-4 flex flex-col bg-nonactive justify-center text-center`}>
                <label className="flex items-center justify-between">
                  <span className="justify-center w-full px-6 py-2 font-normal text-center text-white uppercase bg-orange-500 rounded-full text-x-small">Pre Launch</span>
                </label>
                {selectedOption === "new" && (
                  <div className="mt-2 space-y-2">
                    {product?.currentStock > 0 ? (
                      <p className="font-semibold text-green-600">In stock</p>
                    ) : (
                      <p className="text-sm font-semibold text-red-600">Not for sale now</p>
                    )}
                  </div>
                )}
                <span className='mt-4 mb-3 text-xs font-normal text-gray-700 sm:mt-12'>If you'd like to know more about this product, simply click <span className='font-semibold text-black'>"I'm Interested"</span> and we'll notify you about the launch and its features.</span>
                <button className="flex items-center justify-center flex-1 uppercase font-semibold max-w-xs px-8 py-2 text-[#2D4D9C] bg-[#ACD4FF] hover:bg-[#2D4D9C] hover:text-[#ACD4FF] border border-transparent rounded-2xl sm:w-full" onClick={() => createProductInterest()} >
                  I'm Interested
                </button>
              </div>
            </>
          )}
        </div>
        {usedProduct?.length > 1 && (
          <div className="max-w-md mx-auto mt-4">
            <div className="border border-[#757575] rounded-md bg-white px-6 py-6 flex justify-between items-center shadow-sm min-h-40">
              <div className="text-sm font-semibold leading-snug text-black">
                {usedProduct?.length - 1} other Used {product?.name}
              </div>
              <button
                onClick={() => {
                  document.getElementById('usedSection')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="p-2 transition rounded-full group hover:bg-gray-100"
              >
                <ChevronRightIcon className="w-6 h-6 text-black" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}