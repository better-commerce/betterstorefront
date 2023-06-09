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
import { useAcceptCookies } from '@lib/hooks/useAcceptCookies'
import { Sidebar, Button, Modal, LoadingDots } from '@components/ui'
import s from './Layout.module.css'
import { getData } from '../../utils/clientFetcher'
import { setItem, getItem } from '../../utils/localStorage'
import { NEXT_GET_NAVIGATION } from '@components/utils/constants'
import Router from 'next/router'
import { BTN_ACCEPT_COOKIE, GENERAL_COOKIE_TEXT } from '@components/utils/textVariables'
const ShippingView = dynamic(() => import('@components/checkout/ShippingView'))
const CartSidebarView = dynamic(() => import('@components/cart/CartSidebarView'))
const PaymentMethodView = dynamic(() => import('@components/checkout/PaymentMethodView'))
const CheckoutSidebarView = dynamic(() => import('@components/checkout/CheckoutSidebarView'))
const NotifyUserPopup = dynamic(() => import('@components/ui/NotifyPopup'))
const SearchWrapper = dynamic(() => import('@components/search/index'))
const ProgressBar = dynamic(() => import('@components/ui/ProgressBar'))
const Loading = () => (
  <div className="fixed z-50 flex items-center justify-center p-3 text-center w-80 h-80"><LoadingDots /></div>
)

const dynamicProps = {
  loading: Loading,
}

const FeatureBar = dynamic(() => import('@components/common/FeatureBar'), {
  ...dynamicProps,
})

interface Props {
  children: any
  pageProps: {
    pages?: Page[]
    categories: Category[]
  }
  nav: []
  footer: []
  isLocationLoaded: boolean
  config: any
  keywords: []
}

const ModalView: FC<React.PropsWithChildren<{ modalView: string; closeModal(): any }>> = ({
  modalView,
  closeModal,
}) => {
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

const SidebarView: FC<React.PropsWithChildren<{ sidebarView: string; closeSidebar(): any }>> = ({
  sidebarView,
  closeSidebar,
}) => {
  return (
    <Sidebar onClose={closeSidebar}>
      {sidebarView === 'CART_VIEW' && <CartSidebarView />}
      {sidebarView === 'WISHLIST_VIEW' && <WishlistSidebarView />}
      {sidebarView === 'CHECKOUT_VIEW' && <CheckoutSidebarView />}
      {sidebarView === 'PAYMENT_VIEW' && <PaymentMethodView />}
      {sidebarView === 'SHIPPING_VIEW' && <ShippingView />}
    </Sidebar>
  )
}

const SidebarUI: FC<React.PropsWithChildren<unknown>> = () => {
  const { displaySidebar, closeSidebar, sidebarView } = useUI()
  return displaySidebar ? (
    <SidebarView sidebarView={sidebarView} closeSidebar={closeSidebar} />
  ) : null
}

interface LayoutProps {
  nav: []
  footer: []
}

export interface IExtraProps {
  readonly deviceInfo: IDeviceInfo;
}

const Layout: FC<Props & IExtraProps> = ({
  children,
  config,
  pageProps: { categories = [], ...pageProps },
  keywords,
  isLocationLoaded,
  deviceInfo,
}) => {
  const navTreeFromLocalStorage = getItem('navTree') || { nav: [], footer: [] }
  const [isLoading, setIsLoading] = useState(false)
  const { showSearchBar, setShowSearchBar } = useUI()
  const [data, setData] = useState(navTreeFromLocalStorage)

  const { appConfig, setAppConfig } = useUI()

  useEffect(() => {
    const fetchLayout = async () => {
      try {
        const response: any = await getData(NEXT_GET_NAVIGATION)
        setData(response)
        setItem('navTree', response)
      } catch (error) {
        console.log(error, 'error')
      }
    }
    fetchLayout()
    setAppConfig(config)
  }, [])

  useEffect(() => {
    Router.events.on('routeChangeStart', () => setIsLoading(true))
    Router.events.on('routeChangeComplete', () => setIsLoading(false))

    if (!document.title) {
      document.title = document.location.host;
    }

    return () => {
      Router.events.off('routeChangeStart', () => { });
      Router.events.off('routeChangeComplete', () => { });
    }
  }, [])

  const { acceptedCookies, onAcceptCookies } = useAcceptCookies()
  const { locale = 'en-US', ...rest } = useRouter()

  const sortedData = data.nav?.sort(
    (a: any, b: any) => a.displayOrder - b.displayOrder
  )
  return (
    <CommerceProvider locale={locale}>
      <h1 className='sr-only'>layout</h1>
      {isLoading && <ProgressBar />}
      <div className={cn(s.root)}>
        {showSearchBar && (<SearchWrapper keywords={keywords} closeWrapper={() => setShowSearchBar(false)} />)}
        <Navbar currencies={config?.currencies} config={sortedData} languages={config?.languages} deviceInfo={deviceInfo} />
        <main className="pt-16 fit">{children}</main>
        <Footer config={data.footer} deviceInfo={deviceInfo} />
        <ModalUI />
        <SidebarUI />
        <FeatureBar title={GENERAL_COOKIE_TEXT} hide={acceptedCookies}
          action={<Button className="mx-5 btn-c btn-primary" onClick={() => onAcceptCookies()}>{BTN_ACCEPT_COOKIE}</Button>}
        />
      </div>
    </CommerceProvider>
  )
}

export default Layout
