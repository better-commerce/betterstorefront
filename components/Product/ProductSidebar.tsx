import s from './ProductSidebar.module.css'
import { useAddItem } from '@framework/cart'
import { FC, useEffect, useState } from 'react'
import { ProductOptions } from '@old-components/product'
import type { Product } from '@commerce/types/product'
import { Button, Text, Rating, Collapse, useUI } from '@components/ui'

import { useTranslation } from '@commerce/utils/use-translation'
import { SelectedOptions, getProductVariant, selectDefaultOptionFromProduct } from './helpers'

interface ProductSidebarProps {
  product: Product
  className?: string
}

const ProductSidebar: FC<React.PropsWithChildren<ProductSidebarProps>> = ({ product, className }) => {
  const translate = useTranslation()
  const addItem = useAddItem()
  const { openSidebar } = useUI()
  const [loading, setLoading] = useState(false)
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({})

  useEffect(() => {
    selectDefaultOptionFromProduct(product, setSelectedOptions)
  }, [product])

  const variant = getProductVariant(product, selectedOptions)
  const addToCart = async () => {}

  return (
    <div className={className}>
      <ProductOptions
        options={product.options}
        selectedOptions={selectedOptions}
        setSelectedOptions={setSelectedOptions}
      />
      <Text
        className="w-full max-w-xl pb-4 break-words"
        html={product.descriptionHtml || product.description}
      />
      <div className="flex flex-row items-center justify-between">
        <Rating value={4} />
        <div className="pr-1 text-sm font-medium text-accent-6">{translate('label.product.productSidebar.36reviewsText')}</div>
      </div>
      <div>
        {process.env.COMMERCE_CART_ENABLED && (
          <Button
            aria-label={translate('label.basket.addToBagText')}
            type="button"
            className={s.button}
            onClick={addToCart}
            loading={loading}
            disabled={variant?.availableForSale === false}
          >
            {variant?.availableForSale === false
              ? translate('common.label.notAvailableText')
              : translate('label.basket.addToBagText')}
          </Button>
        )}
      </div>
      <div className="mt-6">
        <Collapse title={translate('label.product.productSidebar.careText')}>
          {translate('label.product.productSidebar.careText')}
        </Collapse>
        <Collapse title={translate('common.label.detailsText')}>
          {translate('label.product.productSidebar.detailsDescriptionText')}
        </Collapse>
      </div>
    </div>
  )
}

export default ProductSidebar
