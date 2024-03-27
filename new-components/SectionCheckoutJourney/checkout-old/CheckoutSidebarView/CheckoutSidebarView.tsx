import Link from 'next/link'
import { FC } from 'react'
import { Button, Text } from '@new-components/ui'
import { useUI } from '@new-components/ui/context'
import useCheckout from '@framework/checkout/use-checkout'
import ShippingWidget from '../ShippingWidget'
import s from './CheckoutSidebarView.module.css'
import { useTranslation } from '@commerce/utils/use-translation'
import SidebarLayout from '@new-components/shared/SidebarLayout/SidebarLayout'

const CheckoutSidebarView: FC<React.PropsWithChildren<unknown>> = () => {
  const translate = useTranslation();
  const { setSidebarView, closeSidebar } = useUI()
  const { data: checkoutData, submit: onCheckout } = useCheckout()

  async function handleSubmit(event: React.ChangeEvent<HTMLFormElement>) {
    event.preventDefault()

    await onCheckout()

    closeSidebar()
  }

  return (
    <SidebarLayout
      className={s.root}
      handleBack={() => setSidebarView('CART_VIEW')}
    >
      <div className="flex-1 px-4 sm:px-6">
        <Link href="/cart">
          <Text variant="sectionHeading">{translate('label.basket.checkoutBtnText')}</Text>
        </Link>

        {/*<PaymentWidget
          isValid={checkoutData?.hasPayment}
          onClick={() => setSidebarView('PAYMENT_VIEW')}
        />*/}
        <ShippingWidget
          isValid={checkoutData?.hasShipping}
          onClick={() => setSidebarView('SHIPPING_VIEW')}
        />

        <ul className={s.lineItemsList}></ul>
      </div>

      <form
        onSubmit={handleSubmit}
        className="sticky bottom-0 left-0 right-0 z-20 flex-shrink-0 w-full px-6 py-6 text-sm border-t sm:px-6 bg-accent-0"
      >
        <ul className="pb-2">
          <li className="flex justify-between py-1">
            <span>{translate('label.orderSummary.subTotalText')}</span>
          </li>
          <li className="flex justify-between py-1">
            <span>{translate('label.orderSummary.taxesText')}</span>
            <span>{translate('label.checkout.calculatedAtCheckoutText')}</span>
          </li>
          <li className="flex justify-between py-1">
            <span>{translate('label.orderSummary.shippingText')}</span>
            <span className="font-bold tracking-wide">{translate('label.orderSummary.freeText')}</span>
          </li>
        </ul>
        <div className="flex justify-between py-3 mb-2 font-bold border-t border-accent-2">
          <span>{translate('label.orderSummary.totalText')}</span>
        </div>
        <div>
          {/* Once data is correcly filled */}
          <Button
            type="submit"
            width="100%"
            disabled={!checkoutData?.hasPayment || !checkoutData?.hasShipping}
          >
            {translate('label.checkout.purchaseConfirmationText')}
          </Button>
        </div>
      </form>
    </SidebarLayout>
  )
}

export default CheckoutSidebarView
