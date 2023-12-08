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
import NotifyUserPopup from '@components/ui/NotifyPopup'
import Router from 'next/router'
import ProgressBar from '@components/ui/ProgressBar'
import {
  BTN_ACCEPT_COOKIE,
  GENERAL_COOKIE_TEXT,
} from '@components/utils/textVariables'
import { IExtraProps } from './Layout'
import { stringToBoolean } from '@framework/utils/parse-util'
import BulkAddSidebarView from '@components/bulk-add/BulkAddSidebarView'

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
    navTree: any
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

const SidebarView: FC<
  { sidebarView: string; closeSidebar(): any } & IExtraProps
> = ({ sidebarView, closeSidebar, deviceInfo, maxBasketItemsCount }) => {
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
        />
      )}
      {sidebarView === 'BULK_ADD_VIEW' && <BulkAddSidebarView />}
      {sidebarView === 'WISHLIST_VIEW' && <WishlistSidebarView />}
    </Sidebar>
  )
}

const SidebarUI: FC = ({ deviceInfo, maxBasketItemsCount }: any) => {
  const { displaySidebar, closeSidebar, sidebarView } = useUI()
  return displaySidebar ? (
    <SidebarView
      sidebarView={sidebarView}
      closeSidebar={closeSidebar}
      deviceInfo={deviceInfo}
      maxBasketItemsCount={maxBasketItemsCount}
    />
  ) : null
}

interface LayoutProps {
  nav: []
  footer: []
}

const LayoutError: FC<Props & IExtraProps> = ({
  children,
  config,
  pageProps: { categories = [], navTree, ...pageProps },
  keywords,
  isLocationLoaded,
  deviceInfo,
  maxBasketItemsCount,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  //const [data, setData] = useState(navTreeFromLocalStorage)

  const { includeVAT, setIncludeVAT } = useUI()
  const isIncludeVAT = stringToBoolean(includeVAT)
  const [isIncludeVATState, setIsIncludeVATState] =
    useState<boolean>(isIncludeVAT)

  //check if nav data is avaialbel in LocalStorage, then dont fetch from Server/API
  useEffect(() => {
    Router.events.on('routeChangeStart', () => setIsLoading(true))
    Router.events.on('routeChangeComplete', () => setIsLoading(false))

    return () => {
      Router.events.off('routeChangeStart', () => {})
      Router.events.off('routeChangeComplete', () => {})
    }
  }, [])

  const { acceptedCookies, onAcceptCookies } = useAcceptCookies()
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
    <CommerceProvider locale={locale}>
      {isLoading && <ProgressBar />}
      <div className={cn(s.root)}>
        <Navbar
          onIncludeVATChanged={includeVATChanged}
          currencies={config?.currencies}
          config={sortedData}
          configSettings={config?.configSettings}
          languages={config?.languages}
          key="navbar"
          deviceInfo={deviceInfo}
          maxBasketItemsCount={maxBasketItemsCount}
        />
        <main className="">{children}</main>
        <Footer
          config={navTree?.footer}
          deviceInfo={deviceInfo}
          maxBasketItemsCount={maxBasketItemsCount}
        />
        <ModalUI />
        <SidebarUI />
        <FeatureBar
          title={GENERAL_COOKIE_TEXT}
          hide={acceptedCookies}
          action={
            <Button
              className="mx-5 btn-c btn-primary"
              onClick={() => onAcceptCookies()}
            >
              {BTN_ACCEPT_COOKIE}
            </Button>
          }
        />
      </div>
    </CommerceProvider>
  )
}

export default LayoutError
