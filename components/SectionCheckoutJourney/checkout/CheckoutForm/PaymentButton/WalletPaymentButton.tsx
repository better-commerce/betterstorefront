// Component Imports
import { IPartialPaymentProps, IPaymentButtonProps } from './BasePaymentButton'
import BasePaymentButton, { IDispatchState } from './BasePaymentButton'
import PaymentGatewayNotification from '@components/SectionCheckoutJourney/checkout/PaymentGatewayNotification'

// Other Imports
import { EmptyString, Messages, NEXT_WALLET_GET_BALANCE, } from '@components/utils/constants'
import { matchStrings, stringFormat } from '@framework/utils/parse-util'
import { Guid } from '@commerce/types'
import { AxiosRequestConfig } from 'axios'
import { PaymentSelectionType, RequestMethod } from 'bc-payments-sdk/dist/constants'
import { callApi } from '@framework/utils/api-util'
import { getPartialPayableAmount } from '@components/cart/CartSidebarView/CartSidebarView'

export class WalletPaymentButton extends BasePaymentButton {
  /**
   * CTor
   * @param props
   */
  constructor(props: IPaymentButtonProps & IDispatchState & IPartialPaymentProps) {
    super(props)
    this.state = { isPaymentInitiated: false, paymentMethod: super.getPaymentMethod(props?.paymentMethod), walletBalance: 0, orderTotal: props?.basketOrderInfo?.basket?.grandTotal?.raw?.withTax, }
  }

  /**
   * Executes order generation for Account payment method on CommerceHub.
   * @param paymentMethod {Object} PaymentMethod info of the executing payment type.
   * @param basketOrderInfo {Object} Input data object for generating the CommerceHub order.
   * @param uiContext {Object} Method for dispatching global ui state changes.
   * @param dispatchState {Function} Method for dispatching state changes.
   */
  private async onPay(paymentMethod: any, basketOrderInfo: any, uiContext: any, dispatchState: Function) {
    const { translate } = this.props
    dispatchState({ type: 'SET_ERROR', payload: EmptyString })
    if (uiContext?.user?.userId) {

      const amountToBePaid = this.isFullPayment() ? (basketOrderInfo?.basket?.isPartialPayment ? getPartialPayableAmount(basketOrderInfo?.basket?.grandTotal?.raw?.withTax, basketOrderInfo?.basket?.paidAmount) : basketOrderInfo?.basket?.grandTotal?.raw?.withTax) : (this.props?.partialAmount || 0)
      if (amountToBePaid <= 0) {
        dispatchState({ type: 'SET_ERROR', payload: translate('common.message.checkout.paymentAmountRequiredErrorMsg'), })
        return
      }

      const validateAmount = this.isValidPaymentAmount(basketOrderInfo, this.props)
      if (validateAmount) {
        dispatchState({ type: 'SET_ERROR', payload: stringFormat(translate(validateAmount?.msg), { currencySymbol: basketOrderInfo?.basket?.currencySymbol, paymentAmount: validateAmount?.amount }), })
        return
      }

      const userId = uiContext?.user?.userId
      uiContext?.setOverlayLoaderState({ visible: true, message: translate('common.label.validatingAccountText'), })
      const walletId = uiContext?.user?.walletId
      if (walletId && walletId !== Guid.empty) {
        const config: AxiosRequestConfig = { url: NEXT_WALLET_GET_BALANCE, method: RequestMethod.POST, data: { walletId }, }
        const { data, error }: any = await callApi(config)
        const walletBalance = data?.data?.balance
        if (amountToBePaid <= walletBalance) {

          uiContext?.setOverlayLoaderState({ visible: true, message: translate('common.label.pleaseWaitText'), })
          
          const { state, result: orderResult } = await super.confirmOrder(paymentMethod, basketOrderInfo, uiContext, dispatchState, false)
          if (orderResult?.success && orderResult?.result?.id) {
            uiContext?.hideOverlayLoaderState()

            if (state) {
              dispatchState(state)
            }

            this.setState({ isPaymentInitiated: true, })
          } else {
            uiContext?.hideOverlayLoaderState()
            if (state) {
              dispatchState(state)
            } else {
              dispatchState({ type: 'SET_ERROR', payload: translate('common.message.requestCouldNotProcessErrorMsg'), })
            }
          }

        } else {
          uiContext?.hideOverlayLoaderState()
  
          dispatchState({ type: 'SET_ERROR', payload: translate('common.message.checkout.notEnoughBalanceErrorMsg'), })
        }
      } else {
        uiContext?.hideOverlayLoaderState()
        dispatchState({ type: 'SET_ERROR', payload: translate('common.message.walletNotFoundErrorMsg'), })
      }
    }
  }

  /**
   * Called immediately after a component is mounted.
   */
  public componentDidMount(): void {
    const that = this
    const { uiContext, dispatchState, translate, basketOrderInfo, paymentMethod, setPaymentType, setPartialAmount, setSelectedPaymentMethod }: any = this.props
    setPaymentType(PaymentSelectionType.FULL)
    setPartialAmount(0)
    dispatchState({ type: 'SET_ERROR', payload: EmptyString })
    if (basketOrderInfo?.basket?.isPartialPayment && setSelectedPaymentMethod) {
      setSelectedPaymentMethod(paymentMethod)
    }

    const walletId = uiContext?.user?.walletId
    if (walletId && walletId !== Guid.empty) {
      uiContext?.setOverlayLoaderState({ visible: true, message: translate('common.label.pleaseWaitText'), })
      const config: AxiosRequestConfig = { url: NEXT_WALLET_GET_BALANCE, method: RequestMethod.POST, data: { walletId }, }
      callApi(config).then(({ data, error }: any) => {
        if (data?.data?.balance) {
          this.setState({ walletBalance: data?.data?.balance })
        }
        uiContext?.hideOverlayLoaderState()
      }).catch((error: any) => {
        uiContext?.hideOverlayLoaderState()
      })
    }
  }

  /**
   * Renders the component.
   * @returns {React.JSX.Element}
   */
  public render() {
    const that = this
    const { uiContext, setPaymentType, setPartialAmount, paymentTypeSelectionCmp }: any = this.props
    const orderTotalGrThAvailableBalance = (this?.state?.orderTotal > this?.state?.walletBalance)

    return (
      <>
        <div className="w-full">
          <dl className="w-full px-2 py-3 mt-2 space-y-2 sm:space-y-2">
            <div className="flex items-center justify-between">
              <dt className="text-sm text-gray-600">Wallet Balance</dt>
              <dd className="font-semibold text-black text-md">
                {uiContext?.cartItems?.currencySymbol || EmptyString}
                {this.state?.paymentMethod?.settings?.find((x: any) => matchStrings(x?.key, 'WalletBalance', true))?.value || this?.state?.walletBalance?.toString() || EmptyString}
              </dd>
            </div>
          </dl>

          <div className="flex mb-5 w-full">
            {paymentTypeSelectionCmp}
          </div>


          {this.baseRender({
            ...this?.props,
            disabled: (orderTotalGrThAvailableBalance || this?.state?.walletBalance === 0),
            ...{ onPay:(paymentMethod: any, basketOrderInfo: any, uiContext: any, dispatchState: Function) => that.onPay(that.state.paymentMethod, basketOrderInfo, uiContext, dispatchState), },
          })}
        </div>

        {this.state.isPaymentInitiated && (
          <PaymentGatewayNotification isCOD={false} gateway={this.state?.paymentMethod?.systemName} params={{ token: EmptyString, orderId: EmptyString, payerId: EmptyString, }} isCancelled={false} paymentType={this.props?.paymentType} partialAmount={(this.props?.partialAmount || 0)} setPaymentType={setPaymentType} setPartialAmount={setPartialAmount} />
        )}
      </>
    )
  }
}

export default WalletPaymentButton
