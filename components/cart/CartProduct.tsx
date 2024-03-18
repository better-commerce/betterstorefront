import { Fragment, useEffect, useState } from 'react'
import axios from 'axios'
import { generateUri } from '@commerce/utils/uri-util'
import { LoadingDots, useUI } from '@components/ui'
import { HeartIcon, TrashIcon } from '@heroicons/react/24/outline'
import {
  EmptyGuid,
  MAX_ADD_TO_CART_LIMIT,
  Messages,
  NEXT_CREATE_WISHLIST,
  NEXT_GET_ADDON_PRODUCTS,
} from '@components/utils/constants'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import CartAddonsSidebar from './Addons/CartAddonsSidebar'
import { deliveryDateFormat, matchStrings, stringFormat, tryParseJson} from '@framework/utils/parse-util'
import { cartItemsValidateAddToCart } from '@framework/utils/app-util'
import { useTranslation } from '@commerce/utils/use-translation'
import { IMG_PLACEHOLDER } from '@components/utils/textVariables'

export default function CartProduct({
  product,
  css,
  isIncludeVAT,
  isMobile,
  // key,
  handleToggleOpenSizeChangeModal,
  handleItem,
  getLineItemSizeWithoutSlug,
  deviceInfo,
  maxBasketItemsCount,
  slaDate,
  openModal = () => { },
  setItemClicked,
  reValidateData,
  soldOutMessage,
}: any) {
  const {
    addToWishlist,
    openWishlist,
    setSidebarView,
    closeSidebar,
    cartItems,
    openLoginSideBar,
    user,
    isGuestUser,
    setAlert,
  } = useUI()
  const [loadingWishlist, setLoadingWishlist] = useState(false)
  const [isAddonProducts, setAddonProducts] = useState([])
  const [isModalClose, setModalClose] = useState(false)
  const [qtyClicked, setQtyClicked] = useState(false)
  const [qty, setQty] = useState(product?.qty)
  const [validQty, setValidQty] = useState(true)
  const getUserId = () => {
    return user?.userId && user?.userId != EmptyGuid
      ? user?.userId
      : cartItems?.userId
  }
  const translate = useTranslation()
  const openWishlistAfter = () => {
    setTimeout(() => openWishlist(), 1000)
  }

  const enableHtmlScroll = () => {
    const element: any = document.getElementsByTagName('html')[0]
    element.classList.add('overlow-y-auto-p')
  }

  const insertToLocalWishlist = (product: any) => {
    addToWishlist(product)
    // setIsLoading({ action: 'move-wishlist', state: true })
    handleItem(product, 'delete')
    // setMovedProducts((prev: any) => [...prev, { product: product, msg: MOVED_TO_WISHLIST }])
    // setIsLoading({ action: '', state: false })
    // setAlert({ type: 'success', msg: ADDED_TO_WISH })
    // openWishlist()
    openWishlistAfter()
  }

  const handleWishList = async (product: any | Array<any>) => {
    let itemClicked = product
    const objUser = localStorage.getItem('user')
    if (!objUser || isGuestUser) {
      openLoginSideBar()
      return
    }
    if (objUser) {
      const createWishlist = async (product: any) => {
        setLoadingWishlist(true)
        try {
          await axios.post(NEXT_CREATE_WISHLIST, {
            id: getUserId(),
            productId: itemClicked?.length
              ? product?.productId.toLowerCase()
              : itemClicked?.productId.toLowerCase(),
            flag: true,
          })
          insertToLocalWishlist(product)
          setLoadingWishlist(false)
        } catch (error) {
          setLoadingWishlist(false)
          console.log(error, 'error')
        }
      }

      if (itemClicked && itemClicked?.length) {
        itemClicked?.forEach((product: any) => {
          createWishlist(product)
        })
      } else if (itemClicked?.productId) {
        createWishlist(product)
      }
    } else {
      closeSidebar()
      setSidebarView('LOGIN_VIEW')
      enableHtmlScroll()
    }
  }

  const fetchAddonsProduct = async () =>{
    const { data: relatedProducts } = await axios.get(NEXT_GET_ADDON_PRODUCTS, {
      params: { productId: product?.productId || product?.recordId },
    })
    if(relatedProducts){
      setAddonProducts(relatedProducts)
    }
  }

  useEffect(() => {
    fetchAddonsProduct()
  }, [])

  const EtaDate = new Date()
  EtaDate.setDate(EtaDate.getDate() + slaDate)

  const addonProducts = isAddonProducts?.filter(
    (x: any) => x?.relatedType == 'ADDONS'
  ) || []
  const closeModal = () => {
    setModalClose(false)
  }

  const voltageAttr: any = tryParseJson(product?.attributesJson)
  const electricVoltAttrLength = voltageAttr?.Attributes?.filter(
    (x: any) => x?.FieldCode == 'electrical.voltage'
  )

  let productNameWithVoltageAttr: any = product?.name?.toLowerCase()
  productNameWithVoltageAttr = electricVoltAttrLength?.length > 0
    ? electricVoltAttrLength?.map((volt: any, vId: number) => (
      <span key={`voltage-${vId}`}>
        {product.name?.toLowerCase()}{' '}
        <span className="p-0.5 text-xs font-bold text-black bg-white border border-gray-500 rounded">
          {volt?.ValueText}
        </span>
      </span>
    ))
    : (productNameWithVoltageAttr = product?.name?.toLowerCase())

  function handleChangeQuantity(qty: any) {
    setQty(qty)
  }

  function handleSubmitQty(e: any, quant:any) {
    if (e?.target?.value > 0 || quant) {
      e?.preventDefault();
      const isValid = cartItemsValidateAddToCart(
        cartItems, 
        maxBasketItemsCount,
        quant ? quant - product?.qty : qty - product?.qty,
      )
      if (isValid) {
        handleItem(product, 'select', quant ? quant : qty)
        return;
      }
      else {
        setQty(product?.qty)
        setValidQty(false)
        setAlert({
          type: 'error',
          msg: stringFormat(translate('common.message.basket.maxBasketItemsCountErrorMsg'), { maxBasketItemsCount }),
        })
      }
    }
    else{
      setQty(product?.qty)
      setValidQty(false)
      setAlert({
        type: 'error',
        msg: Messages.Errors['CART_QUANTITY'],
      })
    }
  }

  return (
    <Fragment key={product?.id}>
      <div
        className="grid items-start grid-cols-12 gap-2 p-4 mb-2 bg-white rounded-sm border-gray-light group hover:border-gray-200 hover:bg-gray-50 sm:mb-2"
        key={`cart-items-${product?.id}`}
      >
        <div className="flex items-center justify-center col-span-2">
          <img
            style={css}
            width={140}
            height={180}
            src={generateUri(product.image, 'h=200&fm=webp') || IMG_PLACEHOLDER}
            alt={product.name ||"product-image"}
            className="object-cover object-center \w-16 rounded-lg sm:\w-28 image"
          />
        </div>
        <div className="flex flex-col col-span-10 sm:col-span-7">
          {isMobile && (
            <div className="flex justify-between">
              <div className="mt-0 font-semibold text-black font-14 font-Inter">
                {isIncludeVAT
                  ? product.price?.formatted?.withTax
                  : product.price?.formatted?.withoutTax}
                {product.listPrice?.raw.withTax > 0 &&
                  product.listPrice?.raw.withTax >
                  product.price?.raw?.withTax && (
                  <span className="px-2 text-sm text-gray-400 line-through">
                    {isIncludeVAT
                      ? product.listPrice.formatted?.withTax
                      : product.listPrice.formatted?.withoutTax}
                  </span>
                )}
              </div>
              <div className="items-end text-xs font-light text-left text-gray-400 sm:text-right">
                {isIncludeVAT ? translate('label.orderSummary.incVATText') : translate('label.orderSummary.excVATText')}
              </div>
            </div>
          )}
          <div className="flex-1">
            <Link href={`/${product.slug}`}>
              <span className="font-light text-black font-18 font-Inter">
                {productNameWithVoltageAttr}
              </span>
            </Link>
          </div>
          {isMobile ? null : (
            <div className="flex items-center flex-1 gap-0 mt-2">
              {slaDate > 0 && (
                <span className="mx-0 text-xs font-semibold text-black sm:mx-0 font-Inter">
                  {translate('label.basket.getItByText')}{' '}{deliveryDateFormat(EtaDate)}
                </span>
              )}
            </div>
          )}
          <div className="flex-1">
            {product?.variantProducts?.length > 0 ? (
              <div
                role="button"
                onClick={handleToggleOpenSizeChangeModal.bind(null, product)}
              >
                <div className="border w-[fit-content] flex items-center mt-3 py-2 px-2">
                  <div className="mr-1 text-sm text-gray-700">
                    Size:{' '}
                    <span className="font-semibold text-black uppercase">
                      {getLineItemSizeWithoutSlug(product)}
                    </span>
                  </div>
                  <ChevronDownIcon className="w-4 h-4 text-black" />
                </div>
              </div>
            ) : (
              <div></div>
            )}
          </div>
        </div>
        {isMobile ? null : (
          <div className="col-span-10 text-left sm:text-right sm:col-span-3">
            <div className="flex flex-col mt-0 font-semibold text-black font-18 font-Inter">
              {product.price?.raw?.withTax == '0' ? (
                <>
                  <span>
                    {isIncludeVAT
                      ? product.price?.formatted?.withTax
                      : product.price?.formatted?.withoutTax}
                  </span>
                </>
              ) : (
                <>
                  <span>
                    {isIncludeVAT
                      ? product.price?.formatted?.withTax
                      : product.price?.formatted?.withoutTax}
                  </span>
                </>
              )}

              {product.listPrice?.raw.withTax > 0 &&
                product.listPrice?.raw.withTax > product.price?.raw?.withTax && (
                <span className="px-0 text-sm font-normal text-gray-400 line-through">
                  {isIncludeVAT
                    ? product.listPrice.formatted?.withTax
                    : product.listPrice.formatted?.withoutTax}
                </span>
              )}
            </div>
            <div className="items-end text-xs font-light text-left text-gray-400 sm:text-right">
              {isIncludeVAT ? translate('label.orderSummary.incVATText') : translate('label.orderSummary.excVATText')}
            </div>
          </div>
        )}

        {isMobile && (
          <>
            <div className="flex justify-between w-full col-span-12 px-2 py-2 mt-1 border-gray-200 border-y">
              <div>
                {slaDate > 0 && (
                  <span className="mx-0 text-xs font-semibold text-black sm:mx-6 font-Inter">
                    {translate('label.basket.getItByText')}{' '}{deliveryDateFormat(EtaDate)}
                  </span>
                )}
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => handleWishList(product)}
                  className="flex items-center justify-center"
                  disabled={loadingWishlist}
                >
                  {loadingWishlist ? (
                    <i className="flex m-0">
                      <LoadingDots />
                    </i>
                  ) : (
                    <span className="sprite-icons sprite-heart-black-sm"></span>
                  )}
                </button>
              </div>
            </div>
          </>
        )}
        <div className="grid items-center grid-cols-1 col-span-12 gap-2 sm:justify-between sm:grid-cols-12">
          <div className="sm:col-span-2">
            {reValidateData?.message != null && soldOutMessage != '' && (
               matchStrings(soldOutMessage, "sold out", true) ? (
                <div className="flex flex-col">
                  <>
                    <div className="flex items-center text-xs font-semibold text-left text-red-500">
                      <span className="relative">
                        <img
                          alt="Sold Out"
                          src="/assets/images/not-shipped-edd.svg"
                          width={20}
                          height={20}
                          className="relative inline-block mr-2"
                        />
                      </span>
                      <span className="">{soldOutMessage}</span>
                    </div>
                  </>
                </div>
              ) : matchStrings(soldOutMessage, "price changed", true) && (
                <div className="col-span-12 items-center w-full">
                  <div className="flex text-xs font-semibold text-center text-gray-500 bg-gray-100 border border-gray-100 rounded p-1 w-full justify-center">
                    {soldOutMessage}
                  </div>
                </div>
              )
            )}
          </div>
          <div className="sm:col-span-5">
            {' '}
            {addonProducts?.length > 0 && <button
              type="button"
              onClick={() => setModalClose(true)}
              className="relative btn-primary btn-sml btn-addon"
            >
              <span className="relative pl-6">
                <span className="absolute left-0 top-2/4 -translate-y-2/4 line-height-0">
                  <i className="sprite-icons sprite-plus-filled-small invert-icon"></i>
                </span>
                {translate('label.basket.addOnText')}
              </span>
            </button>}
          </div>
          <div className="grid w-full gap-2 sm:flex sm:justify-end sm:col-span-5">
            <div className="grid grid-cols-3 gap-2 sm:flex sm:justify-end">

              {/* dropdown box start */}
              <div className="relative custom-select">
                {(!qtyClicked || !validQty) && <span className='absolute p-1 bg-white top-1 left-4 dark:text-black'>{product?.qty}</span>}
                <select
                  onChange={(e: any) => {
                    setQtyClicked(true)
                    handleSubmitQty(null, e?.target?.value);
                    // handleItem(product, 'select', e.target.value)
                  }}
                  className="h-10 px-4 py-2 col-span-1 sm:w-20 w-full dark:bg-white text-brand-blue border-[1px] border-brand-blue rounded-[5px] dark:text-black"
                  value={product?.qty}
                >
                  {Array.from(Array(MAX_ADD_TO_CART_LIMIT).keys())
                    .map((x) => ({ id: x + 1, value: x + 1 }))
                    .map((quant: any) => (
                      <option className='dark:text-black'
                        //selected={quant.value === product?.qty}
                        value={quant.value}
                        key={quant.id}
                      > {quant.value}</option>
                    ))}
                </select>
              </div>
              {isMobile ? null : (
                <button
                  type="button"
                  onClick={() => handleWishList(product)}
                  className="sm:h-10 sm:w-10 min-w-40 w-full col-span-2 btn-primary btn-sm sm:btn-none uppercase font-semibold border-[1px] rounded border-brand-blue group-hover:border-gray-900 group-hover:bg-gray-900 flex items-center justify-center disabled:cursor-not-allowed disabled:opacity-70"
                  disabled={loadingWishlist}
                >
                  {loadingWishlist ? (
                    <i className="flex m-0">
                      <LoadingDots />
                    </i>
                  ) : (
                    <HeartIcon className='h-6 w-6'/>
                  )}
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  setItemClicked(product)
                  openModal()
                }}
                className="sm:h-10 sm:w-10 min-w-40 w-full col-span-2 btn-primary sm:btn-none btn-sm uppercase font-semibold border-[1px] rounded border-brand-blue group-hover:border-gray-900 group-hover:bg-gray-900 flex items-center justify-center ipad-btn-primary"
              >
                {isMobile ? (
                  <>{translate('common.label.removeText')}</>
                ) : (
                 <TrashIcon className='h-6 w-6'/>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      <CartAddonsSidebar
        addonProducts={addonProducts}
        isModalClose={isModalClose}
        closeModal={closeModal}
        deviceInfo={deviceInfo}
        maxBasketItemsCount={maxBasketItemsCount}
      />
    </Fragment>
  )
}
