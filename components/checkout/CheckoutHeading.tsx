import { translate } from '@components/services/localization'
export default function CheckoutHeading() {
  return (
    <>
      <div className="w-full py-2 bg-white border-b border-black sm:py-4">
        <div className="relative text-center container-ffx">
          <h1 className="sr-only">checkout</h1>
          <h2 className="flex items-center justify-center font-semibold mob-font-14 sm:justify-center dark:text-black mob-line-height-1">
            {translate('label.checkout.secureCheckoutText')}t{' '}
            <span>
              <i className="ml-4 sprite-icons sprite-secure"></i>
            </span>
          </h2>
        </div>
      </div>
    </>
  )
}
