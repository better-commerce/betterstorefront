import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { XMarkIcon } from '@heroicons/react/24/outline'

//
import withOmnilytics from '@components/shared/withOmnilytics'
import { fetchAnnouncementsByPagePath } from '@components/utils/engageWidgets'
import { useUI } from '@components/ui'

function EngagePromoBar() {
  const { user, cartItems, productInfo } = useUI()
  const router = useRouter()
  const [promoData, setPromoData] = useState<any>(undefined)

  const fetchEngagePromos = useCallback(async () => {
    setPromoData(undefined)
    const promoData = await fetchAnnouncementsByPagePath(router.asPath, {
      user,
      basketItemsCount: cartItems?.lineItems?.length,
      product: productInfo,
    })
    setPromoData(promoData?.messages || [])
  }, [router.asPath, user, cartItems, productInfo])

  useEffect(() => {
    fetchEngagePromos()
  }, [router.asPath, user, cartItems, productInfo])

  if (!promoData) {
    return <></>
  }

  return promoData?.map((promo: any) => (
    <div className="w-full bg-black text-gray-50 flex justify-between items-center text-sm py-2 px-3">
      <div></div>
      <div>
        {promo?.message}
        {promo?.coupon_code && (
          <>
            {' | '}
            <div className="inline-block">
              Coupon code:{' '}
              <span className="font-semibold">
                {promo?.coupon_code}
              </span>
            </div>
          </>
        )}
      </div>
      <div>
        <button
          onClick={() => setPromoData(undefined)}
          className="hover:bg-gray-500 transition-all rounded-full p-1"
        >
          <XMarkIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  ))
}

export default withOmnilytics(EngagePromoBar)
