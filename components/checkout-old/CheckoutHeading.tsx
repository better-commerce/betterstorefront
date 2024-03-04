import { Logo } from '@components/ui'
import Link from 'next/link'
export default function CheckoutHeading() {
  return (
    <>
      <div className='w-full py-6 pr-4 border-b border-black'>
        <div className='relative text-center container-ffx'>
          <h1 className='sr-only'>checkout</h1>
          <h2 className='flex items-center justify-end font-semibold uppercase mob-font-16 sm:justify-center dark:text-black mob-line-height-1'>secure checkout <span><i className='ml-4 sprite-icons sprite-secure'></i></span></h2>
          <div className='absolute top-2/4 -translate-y-2/4'>
            <Link
              passHref
              href={`/cart`}
              className="flex items-center mt-0 text-black mob-font-12 font-18"
            >
              <i className='mr-2 sprite-icons sprite-left-arrow sm:mr-4'></i>   Back to basket
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
