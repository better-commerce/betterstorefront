import { useEffect, useState } from 'react'

//
import { BTN_NOTIFY_ME, BTN_PRE_ORDER } from '@components/utils/textVariables'
import { PRODUCT_TAGS } from '@components/utils/constants'

interface Props {
  product: any
}

export default function ProductTag({ product }: Props) {
  const [isNotifyMeEnabled, setIsNotifyMeEnabled] = useState(false)
  const [isPreorderEnabled, setIsPreorderEnabled] = useState(false)
  const [tagValues, setTagValues] = useState({
    newLaunch: false,
    onSale: false,
    trending: false,
    exclusive: false,
    bestSeller: false,
  })

  useEffect(() => {
    // check for algolia document object
    if (product?.objectID) {
      setTagValues({
        newLaunch: product?.tags?.indexOf(PRODUCT_TAGS.newLaunch) > -1,
        onSale: product?.tags?.indexOf(PRODUCT_TAGS.onSale) > -1,
        trending: product?.tags?.indexOf(PRODUCT_TAGS.trending) > -1,
        exclusive: product?.tags?.indexOf(PRODUCT_TAGS.exclusive) > -1,
        bestSeller: product?.tags?.indexOf(PRODUCT_TAGS.bestSeller) > -1,
      })
      setIsNotifyMeEnabled(product?.webstock < 1)
      setIsPreorderEnabled(product?.preorder)
    } else {
      setTagValues({
        newLaunch: product?.newLaunch,
        onSale: product?.onSale,
        trending: product?.trending,
        exclusive: product?.exclusive,
        bestSeller: product?.bestSeller,
      })
      setIsNotifyMeEnabled(product?.currentStock < 1 && !product?.preOrder?.isEnabled)
      setIsPreorderEnabled(product?.currentStock < 1 && product?.preOrder?.isEnabled)
    }
  }, [product])

  if (isNotifyMeEnabled) {
    return (
      <div className="w-1/2 !min-w-[100px] text-white bg-red-500 ribbon">
        {BTN_NOTIFY_ME}
      </div>
    )
  }
  if (isPreorderEnabled) {
    return (
      <div className="w-1/2 sm:!min-w-[105px] text-white bg-emerald-500 ribbon">
        {BTN_PRE_ORDER}
      </div>
    )
  }
  if (tagValues?.newLaunch) {
    return <div className="w-1/2 text-white bg-gray-700 ribbon">New</div>
  }

  if (tagValues?.onSale) {
    return <div className="w-1/2 text-white bg-red-700 ribbon">On Sale</div>
  }

  if (tagValues?.bestSeller) {
    return (
      <div className="w-1/2 sm:!min-w-[110px] text-white ribbon bg-sky-800">
        Best Seller
      </div>
    )
  }

  if (tagValues?.trending) {
    return (
      <div className="w-1/2 sm:!min-w-[97px] text-white ribbon bg-sky-800">
        Trending
      </div>
    )
  }

  if (tagValues?.exclusive) {
    return (
      <div className="w-1/2 sm:!min-w-[100px] text-black bg-tan ribbon">
        Exclusive
      </div>
    )
  }

  return <></>
}
