import { useTranslation } from '@commerce/utils/use-translation'
export default function CheckoutHeading() {
  const translate = useTranslation()
  return (
    <>
      <div className="w-full py-2 bg-white border-b border-black sm:py-4">
        <div className="relative text-center container-ffx">
          <h1 className="sr-only">{translate('label.checkout.checkoutTitleText')}</h1>
          <h2 className="flex items-center justify-center font-semibold mob-font-14 sm:justify-center dark:text-black mob-line-height-1">
            {translate('label.checkout.secureCheckoutText')}{' '}
            <span>
              <i className="ml-4 sprite-icons sprite-secure"></i>
            </span>
          </h2>
        </div>
      </div>
    </>
  )
}
