import { EmptyString } from "@components/utils/constants";
import { Payments } from "@components/utils/payment-constants";
import { matchStrings } from "@framework/utils/parse-util";
import { PaymentMethodType } from "bc-payments-sdk";

interface PaymentMethod  {
    id: number | string;
    systemName: string;
    // Add other necessary properties here
}

interface PaymentMethodOptionsProps {
  paymentMethods: PaymentMethod[];
  basket: any;
  getMethods: (methods: PaymentMethod[]) => PaymentMethod[];
  selectedPaymentMethod: PaymentMethod | null;
  handleMethodSelection: (method: PaymentMethod, forPartialPayment?: boolean) => void;
  translate: (key: string) => string;
  forPartialPayment?: boolean
}

export default function PaymentMethodOptions({ paymentMethods, basket, getMethods, selectedPaymentMethod, handleMethodSelection, translate, forPartialPayment= false }: PaymentMethodOptionsProps) {
  const window: any = global.window
  const methods = getMethods(paymentMethods) ?? [];

  const spriteIcon = (systemName: string) => {
    if (matchStrings(systemName, PaymentMethodType.CHECKOUT, true)) {
      return 'sprite-debit-lg'
    } else if (matchStrings(systemName, PaymentMethodType.CLEAR_PAY, true)) {
      return 'sprite-clearpay-xsm'
    } else if (matchStrings(systemName, PaymentMethodType.PAYPAL, true)) {
      return 'sprite-paypal-xsm'
    } else if (matchStrings(systemName, PaymentMethodType.COD, true)) {
      return 'sprite-cod'
    } else if (matchStrings(systemName, PaymentMethodType.WALLET, true)) {
      return 'sprite-wallet'
    } else if (matchStrings(systemName, PaymentMethodType.KLARNA, true)) {
      return 'sprite-klarna'
    } else if (matchStrings(systemName, PaymentMethodType.STRIPE, true)) {
      return 'sprite-stripe'
    } else if (
      matchStrings(systemName, PaymentMethodType.CHECKOUT_APPLE_PAY, true)
    ) {
      return 'sprite-apple-pay-sm'
    }
    return EmptyString
  }

  const showPaymentOption = (method: any, basket: any): boolean => {
    if (basket?.isPartialPayment) {
      if (![PaymentMethodType.COD.toLocaleLowerCase(), PaymentMethodType.CHEQUE.toLocaleLowerCase()].includes(method?.systemName?.toLocaleLowerCase())) {
        return true
      }
      return false
    } else if (matchStrings( method?.systemName, PaymentMethodType.CHECKOUT_APPLE_PAY, true)) {
        //return isApplePayScriptLoaded
        return (window?.ApplePaySession !== undefined && window?.ApplePaySession?.canMakePaymentsWithActiveCard( Payments.APPLE_PAY_MERCHANT_ID ))
    }
    return true
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:mt-2 mt-0">
      {methods.map((item) => {
        // Skip rendering entirely if this option shouldn’t be shown
        if (!showPaymentOption(item, basket)) {
          return null;
        }

        const isSelected = selectedPaymentMethod?.id === item.id;

        return (
          <div key={item.id} id={`pnl${item.systemName}`} onClick={() => handleMethodSelection(item, forPartialPayment)} className="pointer mb-0 flex justify-start flex-row" >
            <label className="custom-radio w-full mb-0">
              <input className={`pnl${item.systemName}`} type="radio" name="payment" checked={isSelected} readOnly />
              <div className="items-center justify-center w-full h-20 px-3 py-3 bg-white radio-btn orange-border gap-x-4 height-auto-rm">
                <div className="flex items-center justify-center text-span">
                  {/* Always show the sprite icon based on systemName */}
                  <i className={`sprite-icons ${spriteIcon(item.systemName)}`.trim()} />
                  {/* Then render any extra label/icon fragment */}
                  <PaymentLabel systemName={item.systemName} translate={translate} />
                </div>
              </div>
            </label>
          </div>
        );
      })}
    </div>
  );
}


/**
 * Helper component that decides which icon/label to render,
 * based on item.systemName and the various PaymentMethodType checks.
 */
const PaymentLabel: React.FC<{ systemName: string, translate: (key: string) => string }> = ({ systemName, translate }) => {
  // If it’s KLARNA or COD, you were just rendering a blank <i className="sprite-icons" />
  if (matchStrings(systemName, PaymentMethodType.KLARNA, true) || matchStrings(systemName, PaymentMethodType.COD, true)) {
    return <i className="sprite-icons" />;
  }

  if (matchStrings(systemName, PaymentMethodType.ACCOUNT_CREDIT, true)) {
    return (
      <>
        <i className="sprite-icons icon-btn-accountcredit" />
        <span className="pl-2 capitalize font-12 dark:text-black">
          {translate('common.label.accountText')}{' '}
          <span className="block">{translate('label.checkout.creditText')}</span>
        </span>
      </>
    );
  }

  if (matchStrings(systemName, PaymentMethodType.CHEQUE, true)) {
    return (
      <>
        <i className="sprite-icons icon-btn-cheque" />
        <span className="pl-2 capitalize font-12 dark:text-black"> {translate('label.checkout.chequeText')} </span>
      </>
    );
  }

  if (matchStrings(systemName, PaymentMethodType.CHECKOUT, true)) {
    return (
      <span className="pl-2 capitalize font-12 dark:text-black">
        {translate('label.checkout.debitCreditText')}{' '}
        <span className="block">{translate('label.checkout.cardText')}</span>
      </span>
    );
  }

  // Fallback: if none of the above matched, return null (no extra icon/label)
  return null;
};