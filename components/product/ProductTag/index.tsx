import { useEffect, useState } from 'react'
import { BTN_NOTIFY_ME, BTN_PRE_ORDER } from '@components/utils/textVariables'
import { PRODUCT_TAGS } from '@components/utils/constants'
import { BellIcon, ClockIcon, ShoppingBagIcon, SparklesIcon, StarIcon, TagIcon } from '@heroicons/react/24/outline'
import IconDiscount from '@components/new-components/IconDiscount'

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
      // setIsNotifyMeEnabled(product?.webstock < 1)
      setIsNotifyMeEnabled(product?.notifyme && !product?.backorder)
      setIsPreorderEnabled(product?.preorder)
    } else {
      setTagValues({
        newLaunch: product?.newLaunch,
        onSale: product?.onSale,
        trending: product?.trending,
        exclusive: product?.exclusive,
        bestSeller: product?.bestSeller,
      })
      setIsNotifyMeEnabled(product?.currentStock < 1 && !product?.preOrder?.isEnabled && !product?.flags?.sellWithoutInventory && !product?.fulfilFromSupplier)
      setIsPreorderEnabled(product?.currentStock < 1 && product?.preOrder?.isEnabled)
    }
  }, [product])

  if (isNotifyMeEnabled) {
    return (
      <>
        <BellIcon className="w-3.5 h-3.5" />
        <div className="leading-none ms-1">
          {BTN_NOTIFY_ME}
        </div>
      </>
    )
  }
  if (isPreorderEnabled) {
    return (
      <>
        <ShoppingBagIcon className="w-3.5 h-3.5" />
        <div className="leading-none ms-1">
          {BTN_PRE_ORDER}
        </div>
      </>
    )
  }
  if (tagValues?.newLaunch) {
    return <><SparklesIcon className="w-3.5 h-3.5" /><div className="leading-none ms-1"> New in</div></>
  }

  if (tagValues?.onSale) {
    return <><IconDiscount className="w-3.5 h-3.5" /><div className="leading-none ms-1">On Sale</div></>
  }

  if (tagValues?.bestSeller) {
    return (
      <>
        <StarIcon className="w-3.5 h-3.5" />
        <div className="leading-none ms-1">
          Best Seller
        </div>
      </>
    )
  }

  if (tagValues?.trending) {
    return (
      <>
        <TagIcon className="w-3.5 h-3.5" />
        <div className="leading-none ms-1">
          Trending
        </div>
      </>
    )
  }

  if (tagValues?.exclusive) {
    return (
      <>
        <ClockIcon className="w-3.5 h-3.5" />
        <div className="leading-none ms-1">
          Exclusive
        </div>
      </>
    )
  }

  return <></>
}
