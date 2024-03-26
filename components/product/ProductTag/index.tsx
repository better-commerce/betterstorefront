import { useEffect, useState } from 'react'
import { PRODUCT_TAGS } from '@components/utils/constants'
import { BellIcon, ClockIcon, ShoppingBagIcon, SparklesIcon, StarIcon, TagIcon } from '@heroicons/react/24/outline'
import IconDiscount from '@new-components/IconDiscount'
import { useTranslation } from '@commerce/utils/use-translation'

interface Props {
  product: any
}

export default function ProductTag({ product }: Props) {
  const translate = useTranslation()
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
      <div className='px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 nc-shadow-lg rounded-full flex items-center justify-center text-slate-900 dark:text-slate-300'>
        <BellIcon className="w-3.5 h-3.5" />
        <div className="leading-none ms-1">
          {translate('label.product.notifyMeText')}
        </div>
      </div>
    )
  }
  if (isPreorderEnabled) {
    return (
      <div className='px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 nc-shadow-lg rounded-full flex items-center justify-center text-slate-900 dark:text-slate-300'>
        <ShoppingBagIcon className="w-3.5 h-3.5" />
        <div className="leading-none ms-1">
          {translate('label.product.preOrderText')}
        </div>
      </div>
    )
  }
  if (tagValues?.newLaunch) {
    return <div className='px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 nc-shadow-lg rounded-full flex items-center justify-center text-slate-900 dark:text-slate-300'><SparklesIcon className="w-3.5 h-3.5" /><div className="leading-none ms-1">{translate('label.filters.newInText')}</div></div>
  }

  if (tagValues?.onSale) {
    return <div className='px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 nc-shadow-lg rounded-full flex items-center justify-center text-slate-900 dark:text-slate-300'><IconDiscount className="w-3.5 h-3.5" /><div className="leading-none ms-1">{translate('label.filters.onSaleText')}</div></div>
  }

  if (tagValues?.bestSeller) {
    return (
      <div className='px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 nc-shadow-lg rounded-full flex items-center justify-center text-slate-900 dark:text-slate-300'>
        <StarIcon className="w-3.5 h-3.5" />
        <div className="leading-none ms-1">
        {translate('label.product.bestSellerText')}
        </div>
      </div>
    )
  }

  if (tagValues?.trending) {
    return (
      <div className='px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 nc-shadow-lg rounded-full flex items-center justify-center text-slate-900 dark:text-slate-300'>
        <TagIcon className="w-3.5 h-3.5" />
        <div className="leading-none ms-1">
        {translate('label.product.trendingText')}
        </div>
      </div>
    )
  }

  if (tagValues?.exclusive) {
    return (
      <div className='px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 nc-shadow-lg rounded-full flex items-center justify-center text-slate-900 dark:text-slate-300'>
        <ClockIcon className="w-3.5 h-3.5" />
        <div className="leading-none ms-1">
        {translate('label.product.exclusiveText')}
        </div>
      </div>
    )
  }

  return <></>
}
