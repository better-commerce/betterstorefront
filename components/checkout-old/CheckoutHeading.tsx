import { useTranslation } from '@commerce/utils/use-translation'
import Link from 'next/link'
export default function CheckoutHeading() {
  const translate = useTranslation()
  return (
    <>
      <div className='w-full py-6 pr-4 border-b border-black'>
        <div className='relative text-center container-ffx'>
          <h1 className='sr-only'>{translate('label.basket.checkoutBtnText')}</h1>
          <h2 className='flex items-center justify-end font-semibold uppercase mob-font-16 sm:justify-center dark:text-black mob-line-height-1'>secure checkout <span><i className='ml-4 sprite-icons sprite-secure'></i></span></h2>
          <div className='absolute top-2/4 -translate-y-2/4'>
            <Link
              passHref
              href={`/cart`}
              className="flex items-center mt-0 text-black mob-font-12 font-18"
            >
              <i className='mr-2 sprite-icons sprite-left-arrow sm:mr-4'></i>{translate('label.checkout.backToBasketText')}
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
