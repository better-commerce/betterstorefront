import { FC, useState } from 'react'
import cn from 'classnames'
import Link from 'next/link'
import s from './WishlistCard.module.css'
import { Trash } from '@components/icons'
import { Button, Text } from '@components/ui'
import type { Product } from '@commerce/types/product'
import usePrice from '@framework/product/use-price'
import useRemoveItem from '@framework/wishlist/use-remove-item'
import {
  IMG_PLACEHOLDER,
} from '@components/utils/textVariables'
import { generateUri } from '@commerce/utils/uri-util'
import { useTranslation } from '@commerce/utils/use-translation'

interface Props {
  product: Product
}

const placeholderImg = '/product-img-placeholder.svg'

const WishlistCard: FC<React.PropsWithChildren<Props>> = ({ product }) => {
  const { price } = usePrice({
    amount: product.price?.value,
    baseAmount: product.price?.retailPrice,
    currencyCode: product.price?.currencyCode!,
  })
  // @ts-ignore Wishlist is not always enabled
  const removeItem = useRemoveItem({ wishlist: { includeProducts: true } })
  const [loading, setLoading] = useState(false)
  const [removing, setRemoving] = useState(false)
  const translate = useTranslation();
  const handleRemove = async () => {
    setRemoving(true)

    try {
      // If this action succeeds then there's no need to do `setRemoving(true)`
      // because the component will be removed from the view
      await removeItem({ id: product.id! })
    } catch (error) {
      setRemoving(false)
    }
  }
  const addToCart = async () => {}

  const css = { maxWidth: '100%', height: 'auto' }
  return (
    <div className={cn(s.root, { 'opacity-75 pointer-events-none': removing })}>
      <div className={`col-span-3 ${s.productBg}`}>
        <img
          src={
            generateUri(product.images[0]?.url, 'h=500&fm=webp') ||
            IMG_PLACEHOLDER
          }
          width={400}
          height={400}
          alt={product.images[0]?.alt || 'Product Image'}
          style={css}
        />
      </div>

      <div className="col-span-7">
        <h3 className="mb-2 text-2xl">
          <Link href={`/product${product.path}`}>{product.name}</Link>
        </h3>
        <div className="mb-4">
          <Text html={product.description} />
        </div>
        <Button
          aria-label={translate('label.basket.addToBagText')}
          type="button"
          className={
            'py-1 px-3 border border-secondary rounded-md shadow-sm hover:bg-primary-hover'
          }
          onClick={addToCart}
          loading={loading}
        >
          {translate('label.basket.addToBagText')}
        </Button>
      </div>
      <div className="flex flex-col justify-between col-span-2">
        <div className="flex justify-end font-bold">{price}</div>
        <div className="flex justify-end">
          <button onClick={handleRemove}>
            <Trash />
          </button>
        </div>
      </div>
    </div>
  )
}

export default WishlistCard
