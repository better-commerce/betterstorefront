import cn from 'classnames'
import React, { FC, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { CommerceProvider } from '@framework'
import { useUI } from '@components/ui/context'
import type { Page } from '@commerce/types/page'
import { Navbar, Footer } from '@components/common'
import type { Category } from '@commerce/types/site'
import ShippingView from '@components/checkout/ShippingView'
import CartSidebarView from '@components/cart/CartSidebarView'
import { useAcceptCookies } from '@lib/hooks/useAcceptCookies'
import { Sidebar, Button, Modal, LoadingDots } from '@components/ui'
import PaymentMethodView from '@components/checkout/PaymentMethodView'
import CheckoutSidebarView from '@components/checkout/CheckoutSidebarView'
import s from './Layout.module.css'
import { getData } from '../../utils/clientFetcher'
import { setItem, getItem } from '../../utils/localStorage'
import NotifyUserPopup from '@components/ui/NotifyPopup'
import Script from 'next/script'
import { NEXT_GET_NAVIGATION } from '@components/utils/constants'
const Loading = () => (
  <div className="w-80 h-80 flex items-center text-center justify-center p-3">
    <LoadingDots />
  </div>
)

const dynamicProps = {
  loading: Loading,
}

const FeatureBar = dynamic(
  () => import('@components/common/FeatureBar'),
  dynamicProps
)

interface Props {
  pageProps: {
    pages?: Page[]
    categories: Category[]
  }
  nav: []
  footer: []
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
      {sidebarView === 'CHECKOUT_VIEW' && <CheckoutSidebarView />}
      {sidebarView === 'PAYMENT_VIEW' && <PaymentMethodView />}
      {sidebarView === 'SHIPPING_VIEW' && <ShippingView />}
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

const Layout: FC<Props> = ({
  children,
  pageProps: { categories = [], ...pageProps },
}) => {
  const navTreeFromLocalStorage = getItem('navTree') || { nav: [], footer: [] }

  const [data, setData] = useState(navTreeFromLocalStorage)

  useEffect(() => {
    const fetchLayout = async () => {
      try {
        const response: any = await getData(NEXT_GET_NAVIGATION)
        console.log(response)
        setData(response)
        setItem('navTree', response)
      } catch (error) {
        console.log(error, 'error')
      }
    }
    fetchLayout()
  }, [])

  const { acceptedCookies, onAcceptCookies } = useAcceptCookies()
  const { locale = 'en-US' } = useRouter()
  return (
    <CommerceProvider locale={locale}>
      <Script
        src="https://engage-asset.bettercommerce.io/_plugins/min/bc/v1/js/ch.js"
        strategy="beforeInteractive"
      />

      <div className={cn(s.root)}>
        <Navbar config={data.nav} />
        <main className="fit">{children}</main>
        <Footer config={data.footer} />
        <ModalUI />
        <SidebarUI />
        <FeatureBar
          title="This site uses cookies to improve your experience. By clicking, you agree to our Privacy Policy."
          hide={acceptedCookies}
          action={
            <Button className="mx-5" onClick={() => onAcceptCookies()}>
              Accept cookies
            </Button>
          }
        />
      </div>
    </CommerceProvider>
  )
}

export default Layout
