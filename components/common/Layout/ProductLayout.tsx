import React, { FC, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { CookieBanner } from '@schlomoh/react-cookieconsent'
import Router from 'next/router'
import Head from 'next/head'
import { CommerceProvider } from '@framework'
import type { Page } from '@commerce/types/page'
import type { Category } from '@commerce/types/site'
import { IDeviceInfo, useUI } from '@components/ui/context'
import { CURRENT_THEME } from '@components/utils/constants'
import { stringToBoolean } from '@framework/utils/parse-util'
import { WishlistSidebarView } from '@components/wishlist'
import { Sidebar, Modal, LoadingDots } from '@components/ui'
import LoginSideBarView from '@components/account/Login/LoginSideBarView'
import { useTranslation } from '@commerce/utils/use-translation'
const BulkAddSidebarView = dynamic(() => import('@components/bulk-add/BulkAddSidebarView'))
const LoginSidebarView = dynamic(() => import('@components/account/Login/LoginSideBarView'))
const MainNav2Logged = dynamic(() => import('@components/Header/MainNav2Logged'))
const ShippingView = dynamic(() => import('@components/SectionCheckoutJourney/checkout/ShippingView'))
const CartSidebarView = dynamic(() => import('@components/cart/CartSidebarView'))
const PaymentMethodView = dynamic(() => import('@components/SectionCheckoutJourney/checkout/PaymentMethodView'))
const CheckoutSidebarView = dynamic(() => import('@components/SectionCheckoutJourney/checkout/CheckoutSidebarView'))
const NotifyUserPopup = dynamic(() => import('@components/ui/NotifyPopup'))
const ProgressBar = dynamic(() => import('@components/ui/ProgressBar'))
const FooterClean = dynamic(() => import('@components/common/Footer/FooterClean'))
const AlertRibbon = dynamic(() => import('@components/ui/AlertRibbon'))
const Loading = () => (
  <div className="fixed z-50 flex items-center justify-center p-3 text-center w-80 h-80">
    <LoadingDots />
  </div>
)
const primaryButtonStyle = { backgroundColor: 'black' }
const secondaryButtonStyle = { backgroundColor: 'gray' }
const Content = () => {
  const translate = useTranslation()
  return (
  <>
    <h3></h3>
    <p>{translate('common.message.cookiesText')}</p>
  </>
)}
interface Props {
  children: any
  pageProps: {
    pages?: Page[]
    categories: Category[]
    navTree?: any
    reviewData: any
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
}

const Layout: FC<Props & IExtraProps> = ({ children, config, pageProps: { categories = [], navTree, reviewData = {}, ...pageProps }, keywords, isLocationLoaded, deviceInfo, maxBasketItemsCount = 0, nav, pluginConfig = []  }) => {
  const [isLoading, setIsLoading] = useState(false)
  const { setIsCompared } = useUI()
  const { displayAlert, includeVAT, setIncludeVAT } = useUI()
  const isIncludeVAT = stringToBoolean(includeVAT)
  const [isIncludeVATState, setIsIncludeVATState] = useState<boolean>(isIncludeVAT)

  useEffect(() => {
    Router.events.on('routeChangeStart', () => setIsLoading(true))
    Router.events.on('routeChangeComplete', () => {
      setIsLoading(false)
      setIsCompared('false')
    })

    if (!document.title) {
      document.title = document.location.host
    }

    return () => {
      Router.events.off('routeChangeStart', () => { })
      Router.events.off('routeChangeComplete', () => { })
    }
  }, [])

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
        <link rel="stylesheet" href={`/assets/css/image-gallery.css`} />
      </Head>
      <CommerceProvider locale={locale}>
        {isLoading && <ProgressBar />}
        <div className={`text-base sm:pt-20 pt-16 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-200`}>
          <MainNav2Logged onIncludeVATChanged={includeVATChanged} currencies={config?.currencies} config={sortedData} configSettings={config?.configSettings} languages={config?.languages} defaultLanguage={config?.defaultLanguage} defaultCountry={config?.defaultCountry} deviceInfo={deviceInfo} maxBasketItemsCount={maxBasketItemsCount} keywords={keywords} pluginConfig={pluginConfig} />
          {displayAlert && <AlertRibbon />}
          {children}
          <FooterClean navItems={navTree?.footer} />
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
export default Layout