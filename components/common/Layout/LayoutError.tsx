import cn from 'classnames'
import React, { ComponentType, FC, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { CommerceProvider } from '@framework'
import { useUI } from '@components/ui/context'
import type { Page } from '@commerce/types/page'
import { Navbar, Footer } from '@components/common'
import type { Category } from '@commerce/types/site'
import CartSidebarView from '@components/cart/CartSidebarView'
import { WishlistSidebarView } from '@components/wishlist'
import { useAcceptCookies } from '@lib/hooks/useAcceptCookies'
import { Sidebar, Button, Modal, LoadingDots } from '@components/ui'
import s from './Layout.module.css'
import { getData } from '../../utils/clientFetcher'
import { setItem, getItem } from '../../utils/localStorage'
import NotifyUserPopup from '@components/ui/NotifyPopup'
import Script from 'next/script'
import SearchWrapper from '@components/search/index'
import { NEXT_GET_NAVIGATION } from '@components/utils/constants'
import Router from 'next/router'
import ProgressBar from '@components/ui/ProgressBar'
import {
  BTN_ACCEPT_COOKIE,
  GENERAL_COOKIE_TEXT,
} from '@components/utils/textVariables'
import { IDeviceInfo } from '@components/ui/context'

const Loading = () => (
  <div className="fixed z-50 flex items-center justify-center p-3 text-center w-80 h-80">
    <LoadingDots />
  </div>
)

const dynamicProps = {
  loading: Loading,
}

const FeatureBar: ComponentType<any> = dynamic(
  () => import('@components/common/FeatureBar'),
  {
    ...dynamicProps,
  }
)

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

const ModalView: FC<{ modalView: string; closeModal(): any }> = ({
  modalView,
  closeModal,
}) => {
  return (
    <Modal onClose={closeModal}>{modalView === 'NOTIFY_USER' && null}</Modal>
  )
}

const ModalUI: FC = () => {
  const { displayModal, closeModal, modalView, notifyUser, productId } = useUI()
  if (notifyUser) return <NotifyUserPopup />
  if (displayModal)
    return <ModalView modalView={modalView} closeModal={closeModal} />
  return null
}

const SidebarView: FC<{ sidebarView: string; closeSidebar(): any }> = ({
  sidebarView,
  closeSidebar,
}) => {
  return (
    <Sidebar onClose={closeSidebar}>
      {sidebarView === 'CART_VIEW' && <CartSidebarView />}
      {sidebarView === 'WISHLIST_VIEW' && <WishlistSidebarView />}
    </Sidebar>
  )
}

const SidebarUI: FC = () => {
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

const LayoutError: FC<Props & IExtraProps> = ({
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

  //check if nav data is avaialbel in LocalStorage, then dont fetch from Server/API
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
  }, [])

  const { acceptedCookies, onAcceptCookies } = useAcceptCookies()
  const { locale = 'en-US', ...rest } = useRouter()

  const sortedData = data.nav.sort(
    (a: any, b: any) => a.displayOrder - b.displayOrder
  )

  return (
    <CommerceProvider locale={locale}>
      <Script
        src="https://engage-asset.bettercommerce.io/_plugins/min/bc/v1/js/ch.js"
        strategy="beforeInteractive"
      />

      {isLoading && <ProgressBar />}
      <div className={cn(s.root)}>
        <Navbar
          currencies={config?.currencies}
          config={sortedData}
          languages={config?.languages}
          key="navbar"
          deviceInfo={deviceInfo}
        />
        <main className="">{children}</main>
        <Footer config={data.footer} deviceInfo={deviceInfo} />
        <ModalUI />
        <SidebarUI />
        <FeatureBar
          title={GENERAL_COOKIE_TEXT}
          hide={acceptedCookies}
          action={
            <Button className="mx-5" onClick={() => onAcceptCookies()}>
              {BTN_ACCEPT_COOKIE}
            </Button>
          }
        />
      </div>
    </CommerceProvider>
  )
}

export default LayoutError