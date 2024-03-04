import cn from 'classnames'
import React, { FC, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { CommerceProvider } from '@framework'
import { IDeviceInfo, useUI } from '@components/ui/context'
import type { Page } from '@commerce/types/page'
import { Navbar, Footer } from '@components/common'
import type { Category } from '@commerce/types/site'
import { WishlistSidebarView } from '@components/wishlist'
import { CookieBanner } from '@schlomoh/react-cookieconsent'
import { Sidebar, Modal, LoadingDots } from '@components/ui'
import s from './Layout.module.css'
import AlertRibbon from '@components/ui/AlertRibbon'
import Router from 'next/router'
import Head from 'next/head'
import { CURRENT_THEME } from '@components/utils/constants'
import { GENERAL_COOKIE_TEXT } from '@components/utils/textVariables'
import { stringToBoolean } from '@framework/utils/parse-util'
import BulkAddSidebarView from '@components/bulk-add/BulkAddSidebarView'
import LoginSidebarView from '@components/account/Login/LoginSideBarView'
const ShippingView = dynamic(() => import('@components/checkout/ShippingView'))
const CartSidebarView = dynamic(() => import('@components/cart/CartSidebarView'))
const PaymentMethodView = dynamic(() => import('@components/checkout/PaymentMethodView'))
const CheckoutSidebarView = dynamic(() => import('@components/checkout/CheckoutSidebarView'))
const NotifyUserPopup = dynamic(() => import('@components/ui/NotifyPopup'))
const SearchWrapper = dynamic(() => import('@components/search'))
const ProgressBar = dynamic(() => import('@components/ui/ProgressBar'))
const Loading = () => (
  <div className="fixed z-50 flex items-center justify-center p-3 text-center w-80 h-80">
    <LoadingDots />
  </div>
)

const dynamicProps = {
  loading: Loading,
}

const FeatureBar = dynamic(() => import('@components/common/FeatureBar'), {
  ...dynamicProps,
})
const primaryButtonStyle = { backgroundColor: 'black' }
const secondaryButtonStyle = { backgroundColor: 'gray' }
const Content = () => (
  <>
    <h3></h3>
    <p>{GENERAL_COOKIE_TEXT}</p>
  </>
)
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

const SidebarView: FC<
  React.PropsWithChildren<
    { sidebarView: string; closeSidebar(): any } & IExtraProps
  >
> = ({ sidebarView, closeSidebar, deviceInfo, maxBasketItemsCount, config }) => {
  return (
    <Sidebar
      onClose={closeSidebar}
      deviceInfo={deviceInfo}
      maxBasketItemsCount={maxBasketItemsCount}
    >
      {sidebarView === 'CART_VIEW' && (
        <CartSidebarView
          deviceInfo={deviceInfo}
          maxBasketItemsCount={maxBasketItemsCount}
          config={config}
        />
      )}
      {sidebarView === 'LOGIN_SIDEBAR_VIEW' && <LoginSidebarView />}
      {sidebarView === 'BULK_ADD_VIEW' && <BulkAddSidebarView />}
      {sidebarView === 'WISHLIST_VIEW' && <WishlistSidebarView />}
      {sidebarView === 'CHECKOUT_VIEW' && <CheckoutSidebarView />}
      {sidebarView === 'PAYMENT_VIEW' && <PaymentMethodView />}
      {sidebarView === 'SHIPPING_VIEW' && <ShippingView />}
    </Sidebar>
  )
}

const SidebarUI: FC<React.PropsWithChildren<unknown & IExtraProps>> = ({
  deviceInfo,
  maxBasketItemsCount,
  config,
}: any) => {
  const { displaySidebar, closeSidebar, sidebarView } = useUI()
  return displaySidebar ? (
    <SidebarView
      sidebarView={sidebarView}
      closeSidebar={closeSidebar}
      deviceInfo={deviceInfo}
      maxBasketItemsCount={maxBasketItemsCount}
      config={config}
    />
  ) : null
}

interface LayoutProps {
  nav: []
  footer: []
}

export interface IExtraProps {
  readonly deviceInfo: IDeviceInfo
  readonly maxBasketItemsCount: number
  readonly isIncludeVAT?: boolean
  onIncludeVATChanged?: any
  keywords?: any
  config?: any
}

const Layout: FC<Props & IExtraProps> = ({
  children,
  config,
  pageProps: { categories = [], navTree, reviewData = {}, ...pageProps },
  keywords,
  isLocationLoaded,
  deviceInfo,
  maxBasketItemsCount = 0,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const { showSearchBar, setShowSearchBar, setIsCompared } = useUI()
  const { displayAlert, includeVAT, setIncludeVAT } = useUI()
  const isIncludeVAT = stringToBoolean(includeVAT)
  const [isIncludeVATState, setIsIncludeVATState] =
    useState<boolean>(isIncludeVAT)

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
      Router.events.off('routeChangeStart', () => {})
      Router.events.off('routeChangeComplete', () => {})
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
        <link
          rel="apple-touch-icon"
          sizes="114x114"
          href={`/theme/${CURRENT_THEME}/favicon/apple-icon-114x114.png`}
        />
        <link
          rel="apple-touch-icon"
          sizes="120x120"
          href={`/theme/${CURRENT_THEME}/favicon/apple-icon-120x120.png`}
        />
        <link
          rel="apple-touch-icon"
          sizes="144x144"
          href={`/theme/${CURRENT_THEME}/favicon/apple-icon-144x144.png`}
        />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href={`/theme/${CURRENT_THEME}/favicon/apple-icon-152x152.png`}
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href={`/theme/${CURRENT_THEME}/favicon/apple-icon-180x180.png`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href={`/theme/${CURRENT_THEME}/favicon/android-icon-192x192.png`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href={`/theme/${CURRENT_THEME}/favicon/favicon-32x32.png`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="96x96"
          href={`/theme/${CURRENT_THEME}/favicon/favicon-96x96.png`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href={`/theme/${CURRENT_THEME}/favicon/favicon-16x16.png`}
        />
        <link rel="icon" href={`/theme/${CURRENT_THEME}/favicon/favicon.ico`} />
      </Head>
      <CommerceProvider locale={locale}>
        {isLoading && <ProgressBar />}
        <div className={cn(s.root)}>
          <Navbar
            onIncludeVATChanged={includeVATChanged}
            currencies={config?.currencies}
            config={sortedData}
            configSettings={config?.configSettings}
            languages={config?.languages}
            deviceInfo={deviceInfo}
            maxBasketItemsCount={maxBasketItemsCount}
            keywords={keywords}
          />
          <main className="pt-16 sm:pt-24 fit">
            {displayAlert && <AlertRibbon />}
            {children}
          </main>
          <Footer
            config={navTree?.footer}
            deviceInfo={deviceInfo}
            maxBasketItemsCount={maxBasketItemsCount}
          />
          <ModalUI />
          <SidebarUI
            deviceInfo={deviceInfo}
            maxBasketItemsCount={maxBasketItemsCount}
            config={config}
          />
          <div className="cookie-bannner">
            <CookieBanner
              enableManagement
              managementButtonText="Manage Cookies"
              headingColor="white"
              managementContent={<Content />}
              cookieCategories={['analytics', 'advertisement']}
              infoContent={<Content />}
              primaryButtonStyle={primaryButtonStyle}
              secondaryButtonStyle={secondaryButtonStyle}
            />
          </div>
        </div>
      </CommerceProvider>
    </>
  )
}

export default Layout
