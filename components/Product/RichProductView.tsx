import Link from "next/link";
import ReviewBadge from "./ReviewBadge";
import PricesWithDiscount from '@components/PricesWithDiscount'
import ParkPoint from '@components/ParkPoint'
import { ChevronRightIcon, InformationCircleIcon } from '@heroicons/react/24/outline'
import { sanitizeRelativeUrl } from "@framework/utils/app-util";
import StockCheckModal from "@components/StoreLocator/StockCheckModal/StockCheckModal";
import LongDescription from "./LongDescription";
import Prices from "@components/Prices";
import dynamic from "next/dynamic";
import MyLocationIcon from "@components/shared/icons/MyLocationIcon";
import { useTranslation } from "@commerce/utils/use-translation";
import { useUI } from '@components/ui';
const QuantityBreak = dynamic(() => import('@components/Product/QuantiyBreak'))
const Button = dynamic(() => import('@components/ui/IndigoButton'))
const BuyNowButton = dynamic(() => import('@components/ui/BuyNowButton'))
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.min.css';
import { HeartIcon } from "@heroicons/react/24/outline";
import KitPrice from "@components/KitPrice";
import { CURRENT_THEME, NEXT_STOCK_CHECK } from "@components/utils/constants";
import { Fragment, useState } from "react";
import { AxiosRequestConfig } from "axios";
import { RequestMethod } from "bc-payments-sdk/dist/constants";
import { callApi } from "@framework/utils/api-util";
import { Dialog, Transition } from "@headlessui/react";
import ButtonClose from "@components/shared/ButtonClose/ButtonClose";
import Loader from "@components/Loader";
import StickyBar from './StickyBar'
const UsedProductCard = dynamic(() => import('@components/Product/UsedProductCard'))
const AvailableOffers = dynamic(() => import('@components/Product/EffectiveAvailableOffers'))
import cartHandler from '@components/services/cart';
import { basketId as getBasketId } from '@components/ui/context';
export default function RichProductView({ product, selectedOption, isGuestUser, cashbackAmount, cashbackDescription, handleWishList, isInWishList, promotions, maxBasketItemsCount, isEngravingAvailable, user, showMobileCaseButton, quantity, buttonConfig, setQuantity, setSelectedOption, usedProduct, attrGroup, createProductInterest, featureToggle, defaultDisplayMembership, deviceInfo, selectedAttrData, renderRelatedProducts, renderVariants, showEngravingModal, renderSellableType, setOpenStockCheckModal, openStoreLocatorModal, onStoreStockCheck, isMobile, weloveAttribute, buyingProducts, showStickyBar, stickyBarOnAddToBasket }: any) {
  const translate = useTranslation()
  const [stockCheckModalOpen, setStockCheckModel] = useState(false)
  const [loading, setLoading] = useState(false);
  const [stockCheckData, setStockCheckData] = useState<any>([])
  const { openCart, setCartItems } = useUI();
  const stockCheck = async ({ stockCode }: any) => {
    try {
      setLoading(true); // ✅ Show loader
      const config: AxiosRequestConfig = {
        url: NEXT_STOCK_CHECK,
        method: RequestMethod.POST,
        data: { StockCode: stockCode }
      };
      const stockResult = await callApi(config);
      setStockCheckData(stockResult.data);
      setStockCheckModel(true);
    } catch (error) {
      console.error('Stock check failed', error);
    } finally {
      setLoading(false); // ✅ Hide loader in all cases
    }
  };


  const setStockCheckClose = () => {
    setStockCheckModel(false);
  }
  const groupedInventoryItems = () => {
    const groupedByCenter: any = {};
    stockCheckData.forEach((item: any) => {
      if (!groupedByCenter[item.DeliveryCenterName]) {
        groupedByCenter[item.DeliveryCenterName] = {
          centerCode: item.DeliveryCenterCode,
          items: []
        };
      }
      groupedByCenter[item.DeliveryCenterName].items.push(item);
    });

    // Get unique inventory types across all items
    const inventoryTypes = Array.from(new Set(stockCheckData.map((item: any) => item.InventoryType)));
    return { centers: groupedByCenter, types: inventoryTypes };
  };

  const grouped = stockCheckData.reduce((acc: any, item: any) => {
    const name = item.DeliveryCenterName;
    acc[name] = (acc[name] || 0) + item.StockOnHand;
    return acc;
  }, {} as Record<string, number>);

  const deliveryCenters = Object.keys(grouped);

  const bestPrice = promotions?.promotions?.bestAvailablePromotion?.additionalInfo10

  // Always use the correct used product (default to first)
  const selectedUsedProduct = usedProduct?.[0];

  const handleAddNewProductToBasket = async () => {
    if (buttonConfig.action) {
      await buttonConfig.action();
      openCart();
    }
  };

  const handleAddUsedProductToBasket = async () => {
    const used = selectedUsedProduct;
    if (!used) return;
    const item = await cartHandler().addToCart({
      basketId: getBasketId(),
      productId: used.recordId,
      qty: 1,
      manualUnitPrice: used?.price?.raw?.withoutTax,
      stockCode: used?.stockCode,
      userId: user?.userId,
      isAssociated: user?.isAssociated,
    }, 'ADD', { data: used });
    setCartItems(item);
    openCart();
  };
  const getStockMessageColor = (message = '') => {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('pre-order')) return 'text-sky-600'; // blue
    if (lowerMessage.includes('in stock')) return 'text-emerald-500'; // green
    if (lowerMessage.includes('hurry') || lowerMessage.includes('last one')) return 'text-emerald-500'; // green
    if (lowerMessage.includes('out of stock')) return 'text-red-500'; // red
    if (lowerMessage.includes('awaiting stock') || lowerMessage.includes('expected')) return 'text-yellow-500'; // yellow
    if (lowerMessage.includes('short supply')) return 'text-yellow-500'; // yellow

    return 'text-gray-600'; // default
  };
  return (
    <>
      <div className='flex gap-6 flex-mob-col'>
        {loading && <Loader />}
        <div className='w-full lg:w-[60%]'>
          <div className="space-y-4">
            <div>
              {product?.condition === 'pre-launch' &&
                <h3 className='text-sm font-semibold text-black uppercase'>{product?.brand}</h3>
              }
              <h1 className="mb-2 text-xl font-semibold heading sm:text-2xl product-name-h2 dark:text-black">
                {selectedOption === "new" ? product?.name : selectedUsedProduct?.name}
              </h1>
              {product?.condition != 'pre-launch' && <div className="flex flex-col gap-3">
                <ReviewBadge reviewCountdata={product?.reviewCount} ratingdata={product?.rating} />
              </div>}
              <div className="flex justify-start mt-5 space-x-4 rtl:justify-end sm:space-x-5 rtl:space-x-reverse">
                {selectedOption === "new" && product?.condition != 'pre-launch' && (
                  <>
                    <PricesWithDiscount contentClass="py-1  px-2 md:py-1.5 md:px-3 text-lg font-semibold price-info" price={product?.price} listPrice={product?.listPrice} featureToggle={featureToggle} defaultDisplayMembership={defaultDisplayMembership} />
                  </>
                )}
                {selectedOption === "used" && product?.condition != 'pre-launch' && (
                  <>
                    <PricesWithDiscount contentClass="py-1 px-2 md:py-1.5 md:px-3 text-lg font-semibold price-info" price={selectedUsedProduct?.price} listPrice={selectedUsedProduct?.listPrice} featureToggle={featureToggle} defaultDisplayMembership={defaultDisplayMembership} />
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
              {cashbackAmount && <div className="w-full max-w-3xl my-4 border shadow-sm rounded-xl bg-background">
                <div className="flex items-center gap-3 px-3 py-2 justify-between bg-[#EAEDF5]">
                  <h2 className="text-sm font-semibold text-[#1E1E1E]">Effective price <span className="hidden opacity-0">{bestPrice}----{JSON.stringify(promotions?.promotions?.bestAvailablePromotion)}</span>
                    <span className="block text-xs italic font-normal text-gray-500">after <strong>{product?.price?.currencySymbol}{cashbackAmount}</strong> cashback and voucher</span>
                  </h2>
                  {selectedOption === "used" ? <span className="ml-2 text-xl font-bold text-red-700">{product?.price?.currencySymbol}{(bestPrice ? selectedUsedProduct?.price?.raw?.withTax - cashbackAmount : selectedUsedProduct?.price?.raw?.withTax - cashbackAmount)?.toFixed(2)}</span> :
                    <span className="ml-2 text-xl font-bold text-red-700">{product?.price?.currencySymbol}{(bestPrice ? bestPrice - cashbackAmount : product?.price?.raw?.withTax - cashbackAmount)?.toFixed(2)}</span>
                  }
                </div>

                <div className="flex w-full gap-2 px-3 py-2 pb-4 mt-2">
                  <div className="mt-[1px]">
                    <InformationCircleIcon className="w-5 h-5 text-[#1E1E1E]" />
                  </div>
                  <div className="text-sm font-medium text-[#757575] link-para" dangerouslySetInnerHTML={{ __html: cashbackDescription }}></div>
                </div>
              </div>}
              {promotions?.promotions?.availablePromotions?.length > 0 && (
                <div className="flex w-full">
                  <AvailableOffers currency={product?.price} offers={promotions?.promotions} key={product?.id} />
                </div>
              )}
              {selectedOption === "new" && product?.condition != 'pre-launch' && (
                <>
                  <div className="flex items-center w-full my-3 gap-x-2">
                    <img src="/theme/camera/image/pc-point-icon.svg" alt="icon" />
                    <p className="text-xs text-black">Earn <ParkPoint price={product?.price} listPrice={product?.listPrice} featureToggle={featureToggle} defaultDisplayMembership={defaultDisplayMembership} /> Park Points. <a href="#" className="font-semibold link-clr primary-text-blue">Details</a></p>
                  </div>
                  {buyingProducts?.length > 0 && (
                    <div className="w-full">
                      <h1 className="mb-2 text-sm text-gray-700">
                        Configuration: <span className="font-semibold text-black">{product?.name}</span>
                      </h1>
                      <div className="grid grid-cols-1 gap-4 mb-2 md:grid-cols-3">
                        <div className="pt-2 relative rounded-md border-2 text-center bg-[#F5F5F5] justify-center transition-all hover:border-blue-500/50 flex flex-col active-clr">
                          <h2 className="text-sm font-medium text-black leading-tight mb-1 px-3 flex justify-center items-center sm:min-h-[135px]">
                            {product?.name}
                          </h2>
                          <p className="text-xs py-2 bottom-0 relative text-[#757575] font-semibold border-t w-full">
                            {product?.stockAvailabilityMessage && (
                              <p className={`text-xs block ${getStockMessageColor(product.stockAvailabilityMessage)}`}>{product?.stockAvailabilityMessage}</p>
                            )}
                            <KitPrice price={product?.price} listPrice={product?.listPrice} featureToggle={featureToggle} defaultDisplayMembership={defaultDisplayMembership} />
                          </p>
                        </div>
                        {buyingProducts?.map((item: any, index: number) => (
                          <Link
                            key={index}
                            href={sanitizeRelativeUrl(`/${item?.slug}`)}
                            className="pt-2 border-2 relative text-center rounded-md bg-[#F5F5F5] border-[#757575] justify-center transition-all hover:border-blue-500/50 flex flex-col hover-link-clr"
                          >
                            <h2 className="text-sm font-medium text-black leading-tight mb-1 px-3 flex justify-center items-center sm:min-h-[135px]">
                              {item?.name}
                            </h2>
                            <p className="text-xs py-2 bottom-0 relative text-[#757575] font-semibold border-t border-[#D9D9D9] w-full">
                              {item?.stockAvailabilityMessage && (
                                <p className={`text-xs block ${getStockMessageColor(product.stockAvailabilityMessage)}`}>{product?.stockAvailabilityMessage}</p>
                              )}
                              <KitPrice price={item?.price} listPrice={item?.listPrice} featureToggle={featureToggle} defaultDisplayMembership={defaultDisplayMembership} />
                            </p>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
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
              <LongDescription data={selectedOption === "new" ? product?.shortDescription : selectedUsedProduct?.shortDescription || product?.shortDescription} heading="" />
            </div> :
              <div
                className="text-sm text-gray-800 description-html"
                dangerouslySetInnerHTML={{ __html: product?.shortDescription }}
              />
            }
            {weloveAttribute && (
              <div className="w-full make-section ul-li-html bg-[#EAEDF5] p-2 rounded-md">
                <h4 className="mb-2 text-sm font-semibold txt-black">We Love</h4>
                <LongDescription data={weloveAttribute?.value} heading="" />
              </div>
            )}
          </div>
        </div>
        <div className='w-full lg:w-[40%] pdp-info-sticky'>
          <div className="w-full p-0 border rounded-lg shadow-md">
            {/* New Product Option */}
            {product?.condition != 'pre-launch' ? (
              <>
                <div className={`p-4 mb-4 ${selectedOption === "new" ? "bg-transparent" : "bg-nonactive"}`}>

                  <label className={`flex items-center justify-between gap-2 cursor-pointer ${usedProduct?.length > 0 ? "visible-label-new" : "hide-label-new"}`}>
                    <input type="radio" name="product" value="new" checked={selectedOption === "new"} onChange={() => setSelectedOption("new")} className="hidden" />
                    <span className="font-semibold">Buy new</span>
                    <span className={`w-5 h-5 border rounded-full flex items-center justify-center mr-2 ${selectedOption === "new" ? "border-blue-600 active-radio" : "border-gray-400"}`}>
                      {selectedOption === "new" && <span className="w-3 h-3 bg-blue-600 rounded-full"></span>}
                    </span>
                  </label>
                  {/* <div className='mt-3 space-y-3'>
                    <Prices cashbackAmount={cashbackAmount} contentClass="py-1 px-2 md:py-1.5 md:px-3 text-lg font-semibold price-info" price={product?.price} listPrice={product?.listPrice} featureToggle={featureToggle} defaultDisplayMembership={defaultDisplayMembership} />
                  </div> */}
                  {selectedOption === "new" && (
                    <div className="mt-2 space-y-2">
                      {featureToggle?.features?.enableStoreStockCheck &&
                        <div className='flex flex-row w-full /!my-4 items-center gap-x-1 /justify-end'>
                          <MyLocationIcon className='w-4 h-4' />
                          <span
                            className='cursor-pointer hover:underline dark:text-black'
                            onClick={() => stockCheck({ stockCode: product?.stockCode })}
                          >
                            {loading ? 'Checking...' : translate('label.store.checkStoreStockText')}
                          </span>
                        </div>
                      }
                      {product?.stockAvailabilityMessage && (
                        <p className={`text-xs block ${getStockMessageColor(product.stockAvailabilityMessage)}`}>{product?.stockAvailabilityMessage}</p>
                      )}

                      {/* <div className="mb-3 flex  pl-2 items-center border border-[#D9D9D9] bg-[#F5F5F5] rounded-md">
                        <span className='pr-1'>Quantity:</span>
                        <select id="quantity" className="w-full p-2 bg-transparent border-none focus:border-0 focus-none" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))}>
                          {[...Array(10).keys()].map((num) => (
                            <option key={num + 1} value={num + 1}> {num + 1} </option>
                          ))}
                        </select>
                      </div> */}
                      <div id="add-to-cart-button" className='blue-add-btn'>
                        {isMobile ? (
                          showMobileCaseButton && (
                            <div className="fixed bottom-0 left-0 z-10 w-full bg-white border-t border-gray-200">
                              <div className="container p-4 mx-auto max-w-7xl blue-add-btn">
                                <div className="flex justify-end add-green-btn">
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
                              <BuyNowButton
                                title="Buy Now"
                                action={buttonConfig.action}
                                buttonType={buttonConfig.type || 'cart'}
                                disabled={selectedAttrData?.currentStock <= 0 && !product?.preOrder?.isEnabled && !product?.flags?.sellWithoutInventory}
                              />
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
                        <button type="button" onClick={handleWishList} className="flex rounded-md items-center justify-center group w-full h-auto px-4 py-2 text-[#767676] bg-white hover:text-pink sm:px-2 hover:border-pink" >
                          {isInWishList(selectedAttrData?.productId) ? (
                            <HeartIcon className="flex-shrink-0 w-4 h-4 mr-2 font-semibold text-red-700" />
                          ) : (
                            <HeartIcon className="flex-shrink-0 w-3 h-3 mr-2 font-semibold text-black group-hover:text-red-700" />)}
                          <span className='text-xs font-semibold text-black group-hover:text-red-700'> Add to Wishlist </span>
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
                      <span className="font-semibold w-[82%]">Save with used - Like New</span>
                      <span className={`w-5 h-5 border rounded-full flex items-center justify-center mr-2 ${selectedOption === "used" ? "border-blue-600 active-radio" : "border-gray-400"}`}>
                        {selectedOption === "used" && <span className="w-3 h-3 bg-blue-600 rounded-full"></span>}
                      </span>
                    </label>
                    {selectedOption === "used" && (
                      <>
                        {featureToggle?.features?.enableStoreStockCheck &&
                          <div className='flex flex-row w-full mt-3 /!my-4 items-center gap-x-1 /justify-end'>
                            <MyLocationIcon className='w-4 h-4' />
                            <span className='cursor-pointer hover:underline dark:text-black' onClick={onStoreStockCheck}>{translate('label.store.checkStoreStockText')}</span>
                          </div>
                        }
                        {product?.stockAvailabilityMessage && (
                          <p className={`text-xs block ${getStockMessageColor(product.stockAvailabilityMessage)}`}>{product?.stockAvailabilityMessage}</p>
                        )}
                        <UsedProductCard products={selectedUsedProduct} maxBasketItemsCount={maxBasketItemsCount} deviceInfo={deviceInfo} featureToggle={featureToggle} />
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
                      {product?.stockAvailabilityMessage && (
                        <p className={`text-xs block ${getStockMessageColor(product.stockAvailabilityMessage)}`}>{product?.stockAvailabilityMessage}</p>
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
      {showStickyBar && (
        <StickyBar
          name={selectedOption === "new" ? product?.name : selectedUsedProduct?.name}
          sellPrice={selectedOption === "new" ? product?.price?.formatted?.withTax : selectedUsedProduct?.price?.formatted?.withTax}
          wasPrice={selectedOption === "new" ? product?.listPrice?.formatted?.withTax : selectedUsedProduct?.listPrice?.formatted?.withTax}
          effectivePrice={cashbackAmount ? (
            selectedOption === "used"
              ? `${product?.price?.currencySymbol}${((promotions?.promotions?.bestAvailablePromotion?.additionalInfo10 ? selectedUsedProduct?.price?.raw?.withTax - cashbackAmount : selectedUsedProduct?.price?.raw?.withTax - cashbackAmount)?.toFixed(2))}`
              : `${product?.price?.currencySymbol}${((promotions?.promotions?.bestAvailablePromotion?.additionalInfo10 ? promotions?.promotions?.bestAvailablePromotion?.additionalInfo10 - cashbackAmount : product?.price?.raw?.withTax - cashbackAmount)?.toFixed(2))}`
          ) : undefined}
          onAddToBasket={selectedOption === "new" ? handleAddNewProductToBasket : handleAddUsedProductToBasket}
          isEngravingAvailable={isEngravingAvailable}
          product={product}
          buttonConfig={buttonConfig}
          showEngravingModal={showEngravingModal}
          isMobile={isMobile}
        />
      )}
      <Transition appear show={stockCheckModalOpen} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 z-50 cart-z-index-9999" onClose={setStockCheckClose} >
          <div className="flex items-stretch justify-center h-full text-center md:items-center md:px-4">
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0" >
              <Dialog.Overlay className="fixed inset-0 bg-black/40 dark:bg-black/70" />
            </Transition.Child>
            {/* This element is to trick the browser into centering the modal contents. */}
            <span className="inline-block align-middle" aria-hidden="true">
              &#8203;
            </span>
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95" >
              <div className="relative inline-flex w-full max-w-2xl max-h-full xl:py-8 z-[99999]">
                <div className="flex flex-1 w-full max-h-full p-4 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl dark:bg-white lg:rounded-2xl dark:border dark:border-slate-700 dark:text-slate-100" >
                  <span className="absolute z-50 end-3 top-3">
                    <ButtonClose onClick={setStockCheckClose} />
                  </span>
                  <div className="flex-1 overflow-y-auto hiddenScrollbar">
                    <div className="">
                      <div className="flex flex-col w-full pb-3 mb-5 border-b border-gray-200">
                        <h3 className="text-xl font-semibold text-black">Available inventory in stores</h3>
                      </div>
                      {stockCheckData?.length > 0 ? (
                        <table className="w-full text-sm border table-auto">
                          <thead>
                            <tr>
                              {deliveryCenters.map(center => (
                                <th key={center} className="px-4 py-2 font-bold text-center bg-gray-100 border">
                                  {center}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              {deliveryCenters.map(center => (
                                <td key={center} className="px-4 py-2 text-center border">
                                  {grouped[center]}
                                </td>
                              ))}
                            </tr>
                          </tbody>
                        </table>
                      ) : (
                        <div className="py-2 text-xl text-left text-gray-400">No inventory found for this product</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}