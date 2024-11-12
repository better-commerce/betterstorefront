import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'

//
import { LoadingDots, useUI } from '@components/ui'
import { Cross } from '@components/icons'
import { EmptyGuid, EmptyObject, NEXT_BULK_ADD_TO_CART } from '@components/utils/constants'
import { BASKET_TYPES, Cookie } from '@framework/utils/constants'

export default function KitActiveAlertDialog() {
  const { closeModal, kitBasket, setKitBasket } = useUI()
  const router = useRouter()
  const [brandPagePath, setBrandPagePath] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const cancelBtn: any = document.querySelector('#close-btn')
    cancelBtn.style.display = 'none'
  }, [])

  useEffect(() => {
    if (kitBasket?.lineItems?.length < 1) return
    const { basketItemGroupData, basketItemGroupId } = kitBasket?.lineItems?.[0] || EmptyObject
    setBrandPagePath(`/kit/brand/${basketItemGroupData?.brand}?platform=${basketItemGroupData?.platform}&basketItemGroupId=${basketItemGroupId}`)
  }, [kitBasket])

  const handleClose = () => {
    router.push('/')
    setTimeout(() => {
      closeModal()
    }, 1000)
  }

  const handleGoToActiveKit = () => {
    // redirect to brand page
    router.push(brandPagePath)
    setLoading(true)
    setTimeout(() => {
      closeModal()
      setLoading(false)
    }, 1000)
  }

  const handleStartNewKit = () => {
    setLoading(true)
    removeActiveKitBasket()
    setTimeout(() => {
      closeModal()
      setLoading(false)
    }, 1000)
  }

  const removeActiveKitBasket = async () => {
    const kitBasketId = Cookies.get(Cookie.Key.KIT_BASKET_ID)
    const bulkUpdatePayload: any = {
      basketId: kitBasketId,
      basketName: BASKET_TYPES.KIT,
      products: [],
    }
    if (kitBasket?.id !== EmptyGuid) {
      // remove all KitBasket items
      bulkUpdatePayload.basketId = kitBasketId
      bulkUpdatePayload.products = []
      kitBasket?.lineItems?.forEach((item: any) => {
        bulkUpdatePayload.products.push({
          productId: item?.productId,
          name: item?.name,
          stockCode: item?.stockCode,
          manualUnitPrice: item?.price?.raw?.withoutTax,
          qty: 0,
          displayOrder: item?.displayOrder,
          basketItemGroupId: item?.basketItemGroupId,
          basketItemGroupData: item?.basketItemGroupData,
        })
      })
      const { data: updatedKitBasket }: any = await axios.post(NEXT_BULK_ADD_TO_CART, {
        data: bulkUpdatePayload,
      })
      Cookies.remove(Cookie.Key.KIT_BASKET_ID)
      setKitBasket(null)
    }
  }

  return (
    <div className="w-full max-w-md">
      <button
        id="close-btn"
        onClick={handleClose}
        aria-label="Close panel"
        className="hover:text-accent-5 transition ease-in-out duration-150 absolute right-0 top-0 p-1"
      >
        <Cross className="h-6 w-6" />
      </button>
      <h2 className="text-lg font-semibold text-center">
        Looks like you already have an unfinished kit active
      </h2>
      <div className="flex flex-col mt-6 gap-2">
        <button
          className="btn-secondary"
          onClick={handleGoToActiveKit}
          disabled={loading}
        >
          {loading ? <LoadingDots /> : 'Complete my current kit'}
        </button>
        <button
          className="btn-default-teal hover:bg-white text-black"
          onClick={handleStartNewKit}
          disabled={loading}
        >
          Start a new kit
        </button>
      </div>
    </div>
  )
}
