import { DeviceIdKey, DocumentTypes, NEXT_DOWNLOAD_PDF, NEXT_GET_CART, QuoteStatus, SessionIdCookieKey, } from '@components/utils/constants'
import { isMobile } from 'react-device-detect'
import Spinner from '@components/ui/Spinner'
import { useUI } from '@components/ui/context'
import cartHandler from '@components/services/cart'
import 'swiper/css'
import 'swiper/css/navigation'
import { uniq } from 'lodash'
import { useEffect, useRef, useState } from 'react'
import { getCurrency, maxBasketItemsCount, notFoundRedirect } from '@framework/utils/app-util'
import axios from 'axios'
import { Disclosure, Transition, Dialog } from '@headlessui/react'
import { Fragment, useReducer } from 'react'
import { LoadingDots } from '@components/ui'
import { ChevronDownIcon, ChevronRightIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { matchStrings, tryParseJson } from '@framework/utils/parse-util'
import { getCurrentPage, vatIncluded } from '@framework/utils/app-util'
import { CheckoutStepType, LoadingActionType, NEXT_BASKET_VALIDATE, } from '@components/utils/constants'
import Router, { useRouter } from 'next/router'
import { stringToBoolean } from '@framework/utils/parse-util'
import CartProduct from '@components/cart/CartProduct'
import { Cookie } from '@framework/utils/constants'
import DefaultButton from '@components/ui/IndigoButton'
import { Guid } from '@commerce/types'
import { setItem } from '@components/utils/localStorage'
import { v4 as uuid_v4 } from 'uuid'
import Cookies from 'js-cookie'
import setSessionIdCookie, { getExpiry, getMinutesInDays } from '@components/utils/setSessionId'
import DataLayerInstance from '@components/utils/dataLayer'
import { useTranslation } from '@commerce/utils/use-translation'
import { AnalyticsEventType } from '@components/services/analytics'
import useAnalytics from '@components/services/analytics/useAnalytics'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import withAuth from '@components/utils/withAuth'
import LayoutAccount from '@components/Layout/LayoutAccount'
import { GetServerSideProps } from 'next'
import { IPagePropsProvider } from '@framework/contracts/page-props/IPagePropsProvider'
import { PagePropType, getPagePropType } from '@framework/page-props'
import Link from 'next/link'
import { stringFormat } from "@framework/utils/parse-util";
import B2BQuoteComments from '@components/account/B2BQuoteComments'
import { isB2BUser } from '@framework/utils/app-util';
import { generateDocPDF } from '@components/utils/order'

const QuoteDetail: any = ({ quoteId, quoteData, config, location, }: any) => {
  const { recordAnalytics } = useAnalytics()
  const router: any = useRouter();
  quoteId = router?.query?.quoteId?.[0];
  const translate = useTranslation()
  const isBrowser = typeof window !== 'undefined'
  const INITIAL_STATE = {
    step: CheckoutStepType.NONE,
    editStep: CheckoutStepType.NONE,
    contactDetails: null,
    isDeliveryMethodSelected: false,
    deliveryType: '',
    splitDeliveryItems: [],
    onShippingPlansUpdated: () => { },
    geoData: location,
    appConfig: config,
    isShippingInformationCompleted: false,
    isPaymentInformationCompleted: false,
    shippingInformation: null,
    billingInformation: null,
    deliveryMethod: null,
    addresses: [],
    isSameAddress: true,
    selectedPaymentMethod: null,
    isTriggerPayment: false,
    shippingMethod: null,
    storeId: '',
    isCNC: false,
    error: '',
    orderResponse: {},
    showStripe: false,
    isPaymentIntent: isBrowser
      && new URLSearchParams(window.location.search).get(
        'payment_intent_client_secret'
      ),
    isPaymentWidgetActive: false,
  }

  interface stateInterface {
    step: number
    editStep: number
    contactDetails: any
    deliveryType: any
    splitDeliveryItems: any
    onShippingPlansUpdated: any
    geoData: any
    appConfig: any
    isDeliveryMethodSelected: boolean
    isShippingInformationCompleted: boolean
    isPaymentInformationCompleted: boolean
    shippingInformation: any
    billingInformation: any
    deliveryMethod: any
    addresses: any
    isSameAddress: boolean
    selectedPaymentMethod: any
    isTriggerPayment: boolean
    shippingMethod: any
    storeId: string
    isCNC: boolean
    error: string
    orderResponse: any
    showStripe: boolean
    isPaymentIntent: boolean
    isPaymentWidgetActive: boolean
  }

  interface actionInterface {
    type?: string
    payload?: any
  }

  function reducer(state: stateInterface, { type, payload }: actionInterface) {
    switch (type) {
      case 'SET_STEP': {
        return {
          ...state,
          step: payload,
        }
      }
      case 'SET_EDIT_STEP': {
        return {
          ...state,
          editStep: payload,
        }
      }
      case 'SET_CONTACT_DETAILS': {
        return {
          ...state,
          contactDetails: payload,
        }
      }
      case 'SET_SHIPPING_METHOD': {
        return {
          ...state,
          shippingMethod: payload,
        }
      }
      case 'SET_DELIVERY_TYPE': {
        return {
          ...state,
          deliveryType: payload,
        }
      }
      case 'IS_CNC': {
        return {
          ...state,
          storeId: payload,
          isCNC: !state.isCNC,
        }
      }
      case 'SET_PAYMENT_METHOD': {
        return {
          ...state,
          selectedPaymentMethod: payload,
        }
      }
      case 'TRIGGER_SELECTED_PAYMENT_METHOD': {
        return {
          ...state,
          isTriggerPayment: payload,
        }
      }
      case 'TOGGLE_DELIVERY_METHOD': {
        return {
          ...state,
          isDeliveryMethodSelected: !state.isDeliveryMethodSelected,
          deliveryMethod: payload || state.deliveryMethod,
        }
      }
      case 'TOGGLE_SHIPPING': {
        return {
          ...state,
          isShippingInformationCompleted: payload,
          //isShippingInformationCompleted: !state.isShippingInformationCompleted,
        }
      }
      case 'TOGGLE_PAYMENT': {
        return {
          ...state,
          isPaymentInformationCompleted: payload,
        }
      }
      case 'SET_SHIPPING_INFORMATION': {
        return {
          ...state,
          shippingInformation: payload,
        }
      }
      case 'SET_BILLING_INFORMATION': {
        return {
          ...state,
          billingInformation: payload,
        }
      }
      case 'SET_SAME_ADDRESS': {
        return {
          ...state,
          isSameAddress: !state.isSameAddress,
        }
      }
      case 'SET_ERROR': {
        return {
          ...state,
          error: payload,
        }
      }
      case 'SET_ORDER_RESPONSE': {
        return {
          ...state,
          orderResponse: payload,
        }
      }
      case 'TRIGGER_STRIPE': {
        return {
          ...state,
          showStripe: payload,
        }
      }
      case 'SET_PAYMENT_INTENT': {
        return {
          ...state,
          isPaymentIntent: payload,
        }
      }
      case 'TRIGGER_PAYMENT_WIDGET': {
        return {
          ...state,
          isPaymentWidgetActive: payload,
        }
      }
      default: {
        return state
      }
    }
  }

  const [state, dispatch] = useReducer(reducer, INITIAL_STATE)

  const allowSplitShipping =
    stringToBoolean(
      config?.configSettings
        ?.find((x: any) => x.configType === 'DomainSettings')
        ?.configKeys?.find((x: any) => x.key === 'DomainSettings.EnableOmniOms')
        ?.value || ''
    ) &&
    stringToBoolean(
      config?.configSettings
        ?.find((x: any) => x.configType === 'OrderSettings')
        ?.configKeys?.find(
          (x: any) => x.key === 'OrderSettings.EnabledPartialDelivery'
        )?.value || ''
    )
  const { uiContext, setAlert, setOverlayLoaderState, hideOverlayLoaderState } = useUI()
  const { setCartItems, cartItems, isPaymentLink, user, isGuestUser, basketId, referralProgramActive, setIsSplitDelivery, openLoginSideBar, isSplitDelivery, resetKitCart } = useUI()
  const { addToCart } = cartHandler()
  const [openSizeChangeModal, setOpenSizeChangeModal] = useState(false)
  // const [quantity,setQuantity] = useState<any>(1)
  const [selectedProductOnSizeChange, setSelectedProductOnSizeChange] = useState(null)
  const [isOpen, setIsOpen] = useState(false)
  const [loadingAction, setLoadingAction] = useState(LoadingActionType.NONE)
  const [itemClicked, setItemClicked] = useState<any | Array<any>>()
  const [reValidateData, setBasketReValidate] = useState<any>([])
  const [reValidateFlag, setRevalidateFlag] = useState(false)
  const [quoteViewData, setQuoteViewData] = useState<any>(undefined)
  const [groupedPromotions, setGroupedPromotions] = useState<any>({
    appliedPromos: null,
    autoAppliedPromos: null,
  })
  const [itemCategories, setItemCategories] = useState<any>([])
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const currencyCode = getCurrency()
  let currentPage = getCurrentPage()


  const handleWishlist = () => {
    try {
      const viewWishlist = () => {
        if (currentPage) {
          if (typeof window !== 'undefined') {
            //debugger
            recordAnalytics(AnalyticsEventType.VIEW_WISHLIST, { header: 'Quote Detail', currentPage, })
          }
        }
      }
      const objUser = localStorage.getItem('user')
      if (!objUser || isGuestUser) {
        //  setAlert({ type: 'success', msg:" Please Login "})
        openLoginSideBar()
        return
      }
      if (objUser) {
        router.push('/my-account/wishlist')
      }
    } catch (error) {
      //console.log(error)
    }
  }

  const handleToggleOpenSizeChangeModal = async (product?: any) => {
    // toggle open/close modal
    setOpenSizeChangeModal(!openSizeChangeModal)

    if (product) {
      // on open modal
      setSelectedProductOnSizeChange(product)
    } else {
      // on close modal
      setSelectedProductOnSizeChange(null)
    }
  }
  let firstProductId = ''
  if (quoteViewData?.lineItems?.length > 0) {
    firstProductId = quoteViewData?.lineItems?.length
      ? quoteViewData?.lineItems?.filter((x: any, idx: number) => idx == 0)[0]
        ?.productId
      : ''
  }

  const fetchBasketReValidate = async () => {
    const { data: reValidate }: any = await axios.post(NEXT_BASKET_VALIDATE, {
      basketId: basketId,
    })

    setBasketReValidate(reValidate?.result)
    const validationMessage: any = tryParseJson(reValidate?.result?.message) || []
    if (validationMessage?.length) {
      setRevalidateFlag(true)
    }
    return reValidate?.result
  }

  const handleItem = (
    product: any,
    type = 'increase',
    selectQuantity: number = 1
  ) => {
    const asyncHandleItem = async (product: any) => {
      let data: any = {
        basketId,
        productId: product.id,
        stockCode: product.stockCode,
        manualUnitPrice: product.manualUnitPrice,
        displayOrder: product.displayOrderta,
        qty: -1,
      }
      // add prop 'basketItemGroupData' for removing Kit items
      if (product.basketItemGroupData) {
        data.basketItemGroupData = product.basketItemGroupData
      }
      // add prop 'basketItemGroupId' for removing Kit items
      if (product.basketItemGroupId) {
        data.basketItemGroupId = product.basketItemGroupId
      }
      if (type === 'increase') {
        data.qty = 1
      }
      if (type === 'delete') {
        data.qty = 0
        quoteViewData.lineItems = quoteViewData.lineItems.filter(
          (item: { id: any }) => item.id !== product.id
        )
        if (isOpen && type === 'delete') {
          setLoadingAction(LoadingActionType.NONE)
          closeModal()
        }
      }
      if (type === 'select') {
        if (product?.qty !== selectQuantity) {
          //increase or decrease quantity by finding difference between values
          data.qty = selectQuantity - product?.qty
        }
      }
      try {
        const item = await addToCart(data, type, { product })
        if (isSplitDelivery) {
          //
        } else {
          //
        }
      } catch (error) {
        //console.log(error)
      }
    }
    if (product && product?.length) {
      product?.forEach((product: any) => {
        asyncHandleItem(product)
        setBasketReValidate([])
      })
      resetKitCart()
    } else if (product?.productId) {
      asyncHandleItem(product)
    }
  }


  const isIncludeVAT = vatIncluded()
  const css = { maxWidth: '100%', height: 'auto' }

  const getLineItemSizeWithoutSlug = (product: any) => {
    const productData: any = tryParseJson(product?.attributesJson || {})
    return productData?.Size
  }
  let absPath = ''
  if (typeof window !== 'undefined') {
    absPath = window?.location?.href
  }


  const openModal = () => {
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
  }
  const fetchQuoteDetail = (quoteId: any) => {
    const loadView = async (quoteId: any) => {
      setIsLoading(true);
      const { data: quoteDetails }: any = await axios.post(`${NEXT_GET_CART}?basketId=${quoteId}`)
      if (quoteDetails?.quoteInfo?.companyId && quoteDetails?.quoteInfo?.companyId !== user?.companyId) {
        router.push('/my-account');
        return;
      }
      setIsLoading(false);
      setQuoteViewData(quoteDetails)
    }
    if (quoteId) loadView(quoteId)
  }

  const setDeviceIdCookie = () => {
    if (!Cookies.get(DeviceIdKey)) {
      const deviceId = uuid_v4()
      Cookies.set(DeviceIdKey, deviceId, {
        expires: getExpiry(getMinutesInDays(365)),
      })
      DataLayerInstance.setItemInDataLayer(DeviceIdKey, deviceId)
    } else {
      DataLayerInstance.setItemInDataLayer(DeviceIdKey, Cookies.get(DeviceIdKey))
    }
  }

  const onPlaceOrder = async () => {
    if (quoteViewData?.id && quoteViewData?.id !== Guid.empty) {
      Cookies.remove(SessionIdCookieKey)
      Cookies.remove(DeviceIdKey)
      setItem('cartItems', { lineItems: [] })
      Cookies.set(Cookie.Key.BASKET_ID, quoteViewData?.id, {
        expires: getExpiry(getMinutesInDays(365)),
      })
      setSessionIdCookie()
      setDeviceIdCookie()
      setCartItems(quoteViewData)
      Router.push('/checkout')
    }
  }

  useEffect(() => {
    const mapUniqCategories = uniq(
      cartItems?.lineItems
        ?.map((o: any) => o?.categoryItems?.map((x: any) => x?.categoryName))
        .flat()
    )
    setItemCategories(mapUniqCategories)
  }, [cartItems])

  useEffect(() => {
    setGroupedPromotions({
      appliedPromos: quoteViewData?.promotionsApplied?.filter((o: any) => !o.autoApply) || [],
      autoAppliedPromos: quoteViewData?.promotionsApplied?.filter((o: any) => o.autoApply) || [],
    })
  }, [quoteId])

  useEffect(() => {
    if (!isB2BUser(user)) {
      router.push('/');
      return
    }
    const quoteId = router.query?.quoteId[0]
    if (quoteId) {
      fetchQuoteDetail(quoteId)
    }
  }, [router.query])

  if (isLoading) {
    return (
      <Spinner />
    )
  }

  async function downloadPdf(quoteViewData: any) {
    setOverlayLoaderState({ visible: true, message: 'Generating Pdf...', })
    const res: any = await axios.post(NEXT_DOWNLOAD_PDF, {
      id: quoteViewData?.id,
      documentType: DocumentTypes.QUOTE
    })
    if (res?.data) {
      generateDocPDF(res?.data?.base64Pdf, res?.data?.fileName);
    } else {
      console.log('PDF not found')
    }
    hideOverlayLoaderState()
  }
  return (
    <>
      <ol role="list" className="flex items-center space-x-0 sm:space-x-0 sm:mb-4 sm:px-0 md:px-0 lg:px-0 2xl:px-0">
        <li className='flex items-center text-10-mob sm:text-sm'>
          <Link href="/my-account/my-company/quotes" passHref>
            <span className="font-light hover:text-gray-900 dark:text-slate-500 text-slate-500" > Quotes </span>
          </Link>
        </li>
        <li className='flex items-center text-10-mob sm:text-sm'>
          <span className="inline-block mx-1 font-normal hover:text-gray-900 dark:text-black" >
            <ChevronRightIcon className='w-3 h-3'></ChevronRightIcon>
          </span>
        </li>
        <li className="flex items-center text-10-mob sm:text-sm" >
          <span className={`font-semibold hover:text-gray-900 capitalize dark:text-black`} >
            {quoteViewData?.quoteInfo?.customQuoteNo}
          </span>
        </li>
      </ol>
      <div className="flex-1 rounded-xl">
        {!quoteViewData ? (<Spinner />) : (
          <>
            <div className='flex justify-between w-full'>
              <h1 className="flex items-center gap-1 text-xl font-normal sm:text-2xl dark:text-black justify-normal">
                {quoteViewData?.quoteInfo?.customQuoteNo} {quoteViewData?.quoteInfo?.rfqNumber !== "" && <Link className='text-sm font-semibold text-sky-500' href={`/my-account/request-for-quote/rfq/${quoteViewData?.quoteInfo?.rfqId}`}>({`RFQ#: ${quoteViewData?.quoteInfo?.rfqNumber}`})</Link>}
              </h1>
              <div className='flex items-center justify-end gap-4'>
                <div>
                  {
                    quoteViewData?.quoteInfo?.status == QuoteStatus.ABANDONED ?
                    <span className='px-3 py-1 text-xs text-red-600 bg-red-200 border border-red-400 rounded-full'>Abandoned</span> :
                    quoteViewData?.quoteInfo?.status == QuoteStatus.CANCELLED ?
                    <span className='px-3 py-1 text-xs text-red-600 bg-red-200 border border-red-400 rounded-full'>Cancelled</span> :
                    quoteViewData?.quoteInfo?.status == QuoteStatus.CONVERTED ?
                    <span className='px-3 py-1 text-xs border rounded-full text-emerald-600 bg-emerald-200 border-emerald-400'>Converted</span> :
                    quoteViewData?.quoteInfo?.status == QuoteStatus.DRAFT ?
                    <span className='px-3 py-1 text-xs text-gray-600 bg-gray-200 border border-gray-400 rounded-full'>Draft</span> :
                    quoteViewData?.quoteInfo?.status == QuoteStatus.NOT_QUOTE ?
                    <span className='px-3 py-1 text-xs text-gray-600 bg-gray-100 border border-gray-400 rounded-full'>Not Quote</span> :
                    quoteViewData?.quoteInfo?.status == QuoteStatus.PAYMENT_LINK_SENT ?
                    <span className='px-3 py-1 text-xs border rounded-full text-sky-600 bg-sky-200 border-sky-400'>Payment Link Sent</span> :
                    quoteViewData?.quoteInfo?.status == QuoteStatus.QUOTE_SENT ?
                    <span className='px-3 py-1 text-xs text-purple-600 bg-purple-100 border border-purple-400 rounded-full'>Quote Sent</span> : ''
                  }
                </div>
                <button onClick={() => downloadPdf(quoteViewData)} className="flex items-center justify-center">
                  <img src="/images/pdf-new.png" className="w-5 h-5" alt="PDF" />
                </button>
              </div>
            </div>
            <div className='grid grid-cols-1 gap-4 py-4 sm:grid-cols-12 max-panel-mobile'>
              <div className='flex-1 overflow-y-auto sm:col-span-8 rounded-xl hiddenScrollbar'>
                <div className='grid grid-cols-1 gap-2 max-panel-desktop hide-addon-button'>
                  {quoteViewData?.lineItems?.map((product: any, productIdx: number) => {
                    let soldOutMessage = ''
                    if (reValidateData?.message != null) {
                      soldOutMessage = reValidateData?.message?.includes(product.stockCode)
                    }
                    const slaData: any = tryParseJson(product?.attributesJson)
                    const slaDate = slaData?.FulfilFromWarehouseDays
                    const voltageAttr: any = tryParseJson(product?.attributesJson)
                    const electricVoltAttrLength = voltageAttr?.Attributes?.filter((x: any) => x?.FieldCode == 'electrical.voltage')
                    let productNameWithVoltageAttr: any = product?.name?.toLowerCase()
                    productNameWithVoltageAttr = electricVoltAttrLength?.length > 0 ? electricVoltAttrLength?.map((volt: any, vId: number) => (
                      <span key={`voltage-${vId}`}>
                        {product.name?.toLowerCase()}{' '}
                        <span className="p-0.5 text-xs font-bold text-black bg-white border border-gray-500 rounded">{volt?.ValueText}</span>
                      </span>
                    )) : (productNameWithVoltageAttr = product?.name?.toLowerCase())
                    const getLineItemSizeWithoutSlug = (product: any) => {
                      const productData: any = tryParseJson(product?.attributesJson || {})
                      return productData?.Size
                    }
                    const EtaDate = new Date()
                    EtaDate.setDate(EtaDate.getDate() + slaDate)
                    return (
                      <Fragment key={`quote-detail-${productIdx}`}>
                        <CartProduct
                          product={product}
                          css={css}
                          isIncludeVAT={isIncludeVAT}
                          isMobile={isMobile}
                          handleToggleOpenSizeChangeModal={handleToggleOpenSizeChangeModal}
                          slaDate={slaDate}
                          handleItem={handleItem}
                          getLineItemSizeWithoutSlug={getLineItemSizeWithoutSlug}
                          deviceInfo={[]}
                          maxBasketItemsCount={maxBasketItemsCount(config)}
                          openModal={openModal}
                          setItemClicked={setItemClicked}
                          reValidateData={reValidateData}
                          soldOutMessage={soldOutMessage}
                          setBasketReValidate={setBasketReValidate}
                          resetKitCart={resetKitCart}
                          addToCart={addToCart}
                          setQuoteViewData={setQuoteViewData}
                        />
                      </Fragment>
                    )
                  })}
                </div>
                <div className="grid grid-cols-2 gap-4 mt-1">
                  <div className='flex flex-col gap-0 p-4 border border-gray-200'>
                    <h4 className='mb-4 font-semibold text-black uppercase font-16'>{translate('label.addressBook.BillingAddressHeadingText')}</h4>
                    <span className='font-semibold font-14'>{quoteViewData?.billingAddress?.firstName}, {quoteViewData?.billingAddress?.lastName}</span>
                    <span>{quoteViewData?.billingAddress?.address1}</span>
                    <span>{quoteViewData?.billingAddress?.address2}</span>
                    <span>{quoteViewData?.billingAddress?.city}, {quoteViewData?.billingAddress?.state}</span>
                    <span>{quoteViewData?.billingAddress?.countryCode}, {quoteViewData?.billingAddress?.postCode}</span>
                  </div>
                  <div className='flex flex-col gap-0 p-4 border border-gray-200'>
                    <h4 className='mb-4 font-semibold text-black uppercase font-16'>{translate('label.addressBook.shippingAddressHeadingText')}</h4>
                    <span className='font-semibold font-14'>{quoteViewData?.shippingAddress?.firstName}, {quoteViewData?.shippingAddress?.lastName}</span>
                    <span>{quoteViewData?.shippingAddress?.address1}</span>
                    <span>{quoteViewData?.shippingAddress?.address2}</span>
                    <span>{quoteViewData?.shippingAddress?.city}, {quoteViewData?.shippingAddress?.state}</span>
                    <span>{quoteViewData?.shippingAddress?.countryCode}, {quoteViewData?.shippingAddress?.postCode}</span>
                  </div>
                </div>
                <div className={`grid grid-cols-2 gap-4 mt-4`}>
                  {quoteViewData?.deliveryInstruction != "" &&
                    <div className='flex flex-col gap-0 p-4 border border-gray-200'>
                      <h4 className='mb-4 font-semibold text-black uppercase font-16'>Delivery Instruction</h4>
                      <p>{quoteViewData?.deliveryInstruction}</p>
                    </div>
                  }
                  {quoteViewData?.notes?.length > 0 &&
                    <div className='flex flex-col border border-gray-200 divide-y divide-gray-200'>
                      <h4 className='px-2 pt-2 mb-2 font-semibold text-black uppercase font-16'>Notes</h4>
                      {quoteViewData?.notes?.map((item: any, itemIdx: number) => (
                        <div className='flex flex-col w-full px-2 py-1 text-sm font-normal text-black' key={`notes-${itemIdx}`}>{item?.noteText}</div>
                      ))}
                    </div>
                  }
                </div>
                <B2BQuoteComments quoteId={quoteId} fetchQuoteDetail={fetchQuoteDetail} />
              </div>
              <div className='sm:col-span-4'>
                <>
                  <section aria-labelledby="summary-heading" className="p-4 px-4 mt-0 top-20 bg-slate-100 rounded-2xl md:sticky sm:mt-0 sm:px-6 lg:px-6 lg:mt-0 lg:col-span-4">
                    <h4 id="summary-heading" className="mb-4 font-semibold text-black uppercase font-xl">{translate('label.quotes.quoteSummaryText')}</h4>
                    <Disclosure defaultOpen>
                      {({ open }) => (
                        <>
                          <Disclosure.Button className="flex items-center justify-between w-full gap-2 px-0 py-2 text-sm font-medium text-left text-black uppercase bg-transparent">
                            <span>{translate('common.label.viewDetailsText')}</span>
                            <ChevronDownIcon className={`${open ? 'rotate-180 transform' : ''} w-5 h-5`} />
                          </Disclosure.Button>
                          <Disclosure.Panel className="px-0 pt-0 pb-2">
                            <dl className="mt-2 space-y-2 sm:space-y-0">
                              <div className="flex items-center justify-between py-3 border-gray-200 border-y">
                                <dt className="text-sm text-black">
                                  {isIncludeVAT ? translate('label.orderSummary.subTotalVATIncText') : translate('label.orderSummary.subTotalVATExText')}
                                </dt>
                                <dd className="font-semibold text-black text-md">
                                  {isIncludeVAT ? quoteViewData?.subTotal?.formatted?.withTax : quoteViewData?.subTotal?.formatted?.withoutTax}
                                </dd>
                              </div>
                              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                                <dt className="flex items-center text-sm text-black">
                                  <span>{translate('label.orderSummary.shippingText')}</span>
                                </dt>
                                <dd className="font-semibold text-black text-md">
                                  {isIncludeVAT ? quoteViewData?.shippingCharge?.formatted?.withTax : quoteViewData?.shippingCharge?.formatted?.withoutTax}
                                </dd>
                              </div>
                              {groupedPromotions?.autoAppliedPromos?.length > 0 && (
                                <div className="flex items-center justify-between py-3 border-b border-gray-200 sm:pt-1">
                                  <dt className="flex flex-col items-start text-sm text-black">
                                    <span className="block text-xs">
                                      {translate('label.orderSummary.discountText')} </span>
                                    {groupedPromotions?.autoAppliedPromos?.map(
                                      (promo: any, promoId: number) => {
                                        return (
                                          <span className="font-normal" key={promoId}> {promo?.name} </span>
                                        )
                                      })
                                    }
                                  </dt>
                                  {groupedPromotions?.autoAppliedPromos?.map(
                                    (promo: any, idx: number) => (
                                      <dd key={idx} className="font-semibold text-black text-md">
                                        <p>{'-'} {isIncludeVAT ? promo?.discountAmt?.formatted?.withTax : promo?.discountAmt?.formatted?.withoutTax}</p>
                                      </dd>
                                    )
                                  )}
                                </div>
                              )}
                              {groupedPromotions?.appliedPromos?.length > 0 && (
                                <div className="flex items-center justify-between pt-2 pb-2 border-b border-gray-200 sm:pt-1">
                                  <dt className="flex flex-col items-start text-sm text-black">
                                    <span className="block text-xs"> {translate('label.basket.promoCodeText')} </span>
                                    {groupedPromotions?.appliedPromos?.map(
                                      (promo: any, promoId: number) => (
                                        <span className="font-normal" key={promoId}> {promo?.promoCode} </span>
                                      )
                                    )}
                                  </dt>
                                  {groupedPromotions?.appliedPromos?.map(
                                    (promo: any, idx: number) => (
                                      <dd key={idx} className="font-semibold text-black text-md">
                                        <p> {'-'} {isIncludeVAT ? promo?.discountAmt?.formatted?.withTax : promo?.discountAmt?.formatted?.withoutTax} </p>
                                      </dd>
                                    )
                                  )}
                                </div>
                              )}
                              <div className="flex items-center justify-between pt-2 sm:pt-3">
                                <dt className="flex items-center text-sm text-black"> <span>{translate('label.orderSummary.taxesText')}</span> </dt>
                                <dd className="font-semibold text-black text-md"> {quoteViewData?.grandTotal?.formatted?.tax} </dd>
                              </div>
                            </dl>
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                    <div className="flex items-center justify-between py-2 my-3 text-gray-900 border-y">
                      <dt className="text-lg font-semibold text-black">{translate('label.orderSummary.totalText')}</dt>
                      <dd className="text-xl font-semibold text-black">
                        {quoteViewData?.grandTotal?.formatted?.withTax}
                      </dd>
                    </div>
                    {quoteViewData?.quoteInfo?.status != QuoteStatus.CONVERTED && quoteViewData?.quoteInfo?.status != QuoteStatus.CANCELLED && quoteViewData?.quoteInfo?.status != QuoteStatus.ABANDONED &&
                      <div className="flex flex-col w-full my-4">
                        <DefaultButton buttonType="button" action={async () => onPlaceOrder()} title="Place Order" />
                      </div>
                    }
                  </section>
                </>
              </div>
            </div>
          </>
        )}
      </div>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          open={isOpen}
          className="relative z-9999"
          onClose={closeModal}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-30"
            leave="ease-in duration-300"
            leaveFrom="opacity-30"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black " />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-full p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="transition duration-100 ease-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
              >
                <Dialog.Panel className="items-center w-full max-w-lg p-4 pb-6 overflow-hidden text-left align-middle transition-all transform bg-white border-2 border-gray-200 rounded-md shadow-xl">
                  <Dialog.Title
                    as="div"
                    className="flex items-center justify-between w-full px-6 py-3 font-semibold leading-6 text-gray-900 uppercase font-18 xsm:text-md"
                  >
                    {translate('label.orderSummary.loseDeliveryText')} {loadingAction === LoadingActionType.NONE && (
                      <XMarkIcon
                        className="w-8 h-8 text-black border border-black rounded-md cursor-pointer hover:text-orange-500 hover:border-orange-500"
                        onClick={closeModal}
                      ></XMarkIcon>
                    )}
                  </Dialog.Title>
                  {/* <hr className="w-full my-2 shadow-md "></hr> */}
                  <p className="px-6 pb-2 text-sm font-normal text-black">
                    {translate('label.orderSummary.loseFreeDeliveryConfirmText')} </p>
                  <div className="flex items-center justify-start w-full gap-4 px-6 mt-2">
                    <button
                      onClick={() => {
                        setLoadingAction(LoadingActionType.REMOVE_ITEM)
                        handleItem(itemClicked, 'delete')
                      }}
                      className="btn-primary btn"
                    >
                      {loadingAction === LoadingActionType.REMOVE_ITEM ? (
                        <>{LoadingDots}</>
                      ) : (
                        <>{translate('common.label.removeText')}</>
                      )}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const { locale } = context;
  if (matchStrings(locale, context?.query?.quoteId[0])) {
    return notFoundRedirect();
  }
  const props: IPagePropsProvider = getPagePropType({ type: PagePropType.COMMON })
  const pageProps = await props.getPageProps({ cookies: context?.req?.cookies })

  return {
    props: {
      ...pageProps,
    }
  }
}

QuoteDetail.LayoutAccount = LayoutAccount;
export default withDataLayer(withAuth(QuoteDetail), PAGE_TYPES.RequestQuote, true, LayoutAccount);