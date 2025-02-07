import React, { FC, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { CookieBanner } from '@schlomoh/react-cookieconsent'
import Router from 'next/router'
import Head from 'next/head'
import { CommerceProvider } from '@framework'
import { stringToBoolean } from '@framework/utils/parse-util'
import type { Page } from '@commerce/types/page'
import type { Category } from '@commerce/types/site'
import { useTranslation } from '@commerce/utils/use-translation'
import NextHead from 'next/head'
import SideMenu from '@components/account/MyAccountMenu'

const NotifyUserPopup = dynamic(() => import('@components/ui/NotifyPopup'))
const MainNav2Logged = dynamic(() => import('@components/Header/MainNav2Logged'))
const AlertRibbon = dynamic(() => import('@components/ui/AlertRibbon'))
const WishlistSidebarView = dynamic(() => import('@components/shared/Wishlist/WishlistSidebarView'))
const BulkAddSidebarView = dynamic(() => import('@components/SectionCheckoutJourney/bulk-add/BulkAddSidebarView'))
const CheckoutSidebarView = dynamic(() => import('@components/SectionCheckoutJourney/checkout/CheckoutSidebarView'))
const PaymentMethodView = dynamic(() => import('@components/SectionCheckoutJourney/checkout/PaymentMethodView'))
const ShippingView = dynamic(() => import('@components/SectionCheckoutJourney/checkout/ShippingView'))
const LoginSideBarView = dynamic(() => import('@components/shared/Login/LoginSideBarView'))
const Footer = dynamic(() => import('@components/shared/Footer/Footer'))
import { Sidebar, Modal, LoadingDots } from '@components/ui'
import { IDeviceInfo, useUI } from '@components/ui/context'
import { CURRENT_THEME, SITE_ORIGIN_URL } from '@components/utils/constants'
import { CartSidebarView } from '@components/SectionCheckoutJourney/cart'
import ProgressBar from '@components/ui/ProgressBar'
import MembershipBanner from '@components/membership/MyMembership/MembershipBanner'
import InteractiveDemoSideBar from '@components/InteractiveDemo'
const primaryButtonStyle = { backgroundColor: 'black' }
const secondaryButtonStyle = { backgroundColor: 'gray' }
const Content = () => {
  const translate = useTranslation()
  return (
    <>
      <h3></h3>
      <p>{translate('common.message.cookiesText')}</p>
    </>
  )
}
interface Props {
  children: any
  pageProps: {
    pages?: Page[]
    categories: Category[]
    navTree?: any
    reviewData: any
    featureToggle?: any
  }
  nav: []
  footer: []
  isLocationLoaded: boolean
  config: any
  keywords: []
  pluginConfig: []
}

const ModalView: FC<
  React.PropsWithChildren<{ modalView: string; closeModal(): any }>
> = ({ modalView, closeModal }) => {
  return (
    <Modal onClose={closeModal}>{modalView === 'NOTIFY_USER' && null}</Modal>
  )
}

const ModalUI: FC<React.PropsWithChildren<unknown>> = () => {
  const { displayModal, closeModal, modalView, notifyUser, productId } = useUI()
  if (notifyUser) return <NotifyUserPopup />
  if (displayModal)
    return <ModalView modalView={modalView} closeModal={closeModal} />
  return null
}

const SidebarView: FC<React.PropsWithChildren<{ sidebarView: string; closeSidebar(): any } & IExtraProps>> = ({ sidebarView, closeSidebar, deviceInfo, maxBasketItemsCount, config, pluginConfig = [] }) => {
  return (
    <Sidebar onClose={closeSidebar} deviceInfo={deviceInfo} maxBasketItemsCount={maxBasketItemsCount} >
      {sidebarView === 'CART_VIEW' && (<CartSidebarView deviceInfo={deviceInfo} maxBasketItemsCount={maxBasketItemsCount} config={config} />)}
      {sidebarView === 'LOGIN_SIDEBAR_VIEW' && <LoginSideBarView pluginConfig={pluginConfig} />}
      {sidebarView === 'BULK_ADD_VIEW' && <BulkAddSidebarView />}
      {sidebarView === 'WISHLIST_VIEW' && <WishlistSidebarView />}
      {sidebarView === 'CHECKOUT_VIEW' && <CheckoutSidebarView />}
      {sidebarView === 'PAYMENT_VIEW' && <PaymentMethodView />}
      {sidebarView === 'SHIPPING_VIEW' && <ShippingView />}
    </Sidebar>
  )
}

const SidebarUI: FC<React.PropsWithChildren<unknown & IExtraProps>> = ({ deviceInfo, maxBasketItemsCount, config, pluginConfig }: any) => {
  const { displaySidebar, closeSidebar, sidebarView } = useUI()
  return displaySidebar ? (
    <SidebarView sidebarView={sidebarView} closeSidebar={closeSidebar} deviceInfo={deviceInfo} maxBasketItemsCount={maxBasketItemsCount} config={config} pluginConfig={pluginConfig} />
  ) : null
}

export interface IExtraProps {
  readonly deviceInfo: IDeviceInfo
  readonly maxBasketItemsCount: number
  readonly isIncludeVAT?: boolean
  onIncludeVATChanged?: any
  keywords?: any
  config?: any
  pluginConfig?: any
  featureToggle?: any
}

const LayoutAccountWithoutNav: FC<Props & IExtraProps> = ({ children, config, pageProps: { categories = [], navTree, reviewData = {}, featureToggle = {}, ...pageProps }, keywords, isLocationLoaded, deviceInfo, maxBasketItemsCount = 0, nav, pluginConfig = [] }) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const { setIsCompared, myAccountActiveTab } = useUI()
  const { displayAlert, includeVAT, setIncludeVAT } = useUI()
  const isIncludeVAT = stringToBoolean(includeVAT)
  const [isIncludeVATState, setIsIncludeVATState] = useState<boolean>(isIncludeVAT)
  // const [isShow, setShow] = useState(true)
  const translate = useTranslation()
  const { user } = useUI()
  // const [myAccountActiveTab, setmyAccountActiveTab ]= useState(translate('label.myAccount.myDetailsHeadingText'))

  useEffect(() => {
    Router.events.on('routeChangeComplete', () => {
      setIsCompared('false')
    })

    if (!document.title) {
      document.title = document.location.host
    }

    return () => {
      Router.events.off('routeChangeComplete', () => { })
    }
  }, [])

  useEffect(() => {
    const handleStart = () => setIsLoading(true);
    const handleComplete = () => setIsLoading(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, []);

  const { locale = 'en-US', ...rest } = useRouter()

  const sortedData = navTree?.nav?.sort(
    (a: any, b: any) => a.displayOrder - b.displayOrder
  )
  const includeVATChanged = (value: boolean) => {
    setIncludeVAT(`${value}`)

    setTimeout(() => {
      setIsIncludeVATState(value)
    }, 50)
  }
  const isDemo = stringToBoolean(router?.query?.demo as string)
  const isDemoStoreCode = stringToBoolean(router?.query?.storecode ? '1': '0')
  const isInteractiveDemo = !isDemo? isDemoStoreCode : isDemo

  return (
    <>
      <Head>
        <link rel="apple-touch-icon" sizes="57x57" href={`/theme/${CURRENT_THEME}/favicon/apple-icon-57x57.png`} />
        <link rel="apple-touch-icon" sizes="60x60" href={`/theme/${CURRENT_THEME}/favicon/apple-icon-60x60.png`} />
        <link rel="apple-touch-icon" sizes="72x72" href={`/theme/${CURRENT_THEME}/favicon/apple-icon-72x72.png`} />
        <link rel="apple-touch-icon" sizes="76x76" href={`/theme/${CURRENT_THEME}/favicon/apple-icon-76x76.png`} />
        <link rel="apple-touch-icon" sizes="114x114" href={`/theme/${CURRENT_THEME}/favicon/apple-icon-114x114.png`} />
        <link rel="apple-touch-icon" sizes="120x120" href={`/theme/${CURRENT_THEME}/favicon/apple-icon-120x120.png`} />
        <link rel="apple-touch-icon" sizes="144x144" href={`/theme/${CURRENT_THEME}/favicon/apple-icon-144x144.png`} />
        <link rel="apple-touch-icon" sizes="152x152" href={`/theme/${CURRENT_THEME}/favicon/apple-icon-152x152.png`} />
        <link rel="apple-touch-icon" sizes="180x180" href={`/theme/${CURRENT_THEME}/favicon/apple-icon-180x180.png`} />
        <link rel="icon" type="image/png" sizes="192x192" href={`/theme/${CURRENT_THEME}/favicon/android-icon-192x192.png`} />
        <link rel="icon" type="image/png" sizes="32x32" href={`/theme/${CURRENT_THEME}/favicon/favicon-32x32.png`} />
        <link rel="icon" type="image/png" sizes="96x96" href={`/theme/${CURRENT_THEME}/favicon/favicon-96x96.png`} />
        <link rel="icon" type="image/png" sizes="16x16" href={`/theme/${CURRENT_THEME}/favicon/favicon-16x16.png`} />
        <link rel="icon" href={`/theme/${CURRENT_THEME}/favicon/favicon.ico`} />
      </Head>
      <CommerceProvider locale={locale}>
        {isLoading && <ProgressBar />}
        {isInteractiveDemo && <InteractiveDemoSideBar featureToggle={featureToggle} />}
        <div className={`text-base lg:pt-24 pt-12 border-b border-slate-200 bg-white dark:bg-white text-neutral-900 dark:text-neutral-200 theme-top`}>
          <MainNav2Logged onIncludeVATChanged={includeVATChanged} currencies={config?.currencies} config={sortedData} configSettings={config?.configSettings} languages={config?.languages} defaultLanguage={config?.defaultLanguage} defaultCountry={config?.defaultCountry} deviceInfo={deviceInfo} maxBasketItemsCount={maxBasketItemsCount} keywords={keywords} pluginConfig={pluginConfig} featureToggle={featureToggle} />
          {displayAlert && <AlertRibbon />}
          <>
            <NextHead>
              <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
              <link rel="canonical" id="canonical" href={SITE_ORIGIN_URL + router.asPath} />
              <title>{myAccountActiveTab}</title>
              <meta name="title" content={myAccountActiveTab} />
              <meta name="description" content={myAccountActiveTab} />
              <meta name="keywords" content={myAccountActiveTab} />
              <meta property="og:image" content="" />
              <meta property="og:title" content={myAccountActiveTab} key="ogtitle" />
              <meta property="og:description" content={myAccountActiveTab} key="ogdesc" />
            </NextHead>
            <MembershipBanner user={user} />
            <section className="container w-full pt-0 mt-0 sm:my-0 theme-account-container sm:pb-32">
              <div className='grid w-full grid-cols-1 gap-6 mx-auto sm:grid-cols-12 sm:gap-10'>
               <div className='pt-0 sm:col-span-12 sm:pt-0 z-1'>
                  {children}
                </div>
              </div>
            </section>
          </>
          <Footer navItems={navTree?.footer} />
          <ModalUI />
          <SidebarUI deviceInfo={deviceInfo} maxBasketItemsCount={maxBasketItemsCount} config={config} pluginConfig={pluginConfig} />
          <div className="cookie-bannner">
            <CookieBanner enableManagement managementButtonText="Manage Cookies" headingColor="white" managementContent={<Content />} cookieCategories={['analytics', 'advertisement']} infoContent={<Content />} primaryButtonStyle={primaryButtonStyle} secondaryButtonStyle={secondaryButtonStyle} />
          </div>
        </div>
      </CommerceProvider>
    </>
  );
}
export default LayoutAccountWithoutNav