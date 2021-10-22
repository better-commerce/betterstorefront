import { FC } from 'react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import AttributeSelector from './AttributeSelector'
import AddToBasketButton from '@components/ui/AddToBasketButton'

interface Props {
  product: any
}

const colorKey = 'global.colour'

interface Attribute {
  fieldName?: string
  fieldCode?: string
  fieldValues?: []
}

interface ProductData {
  image: string
  slug: string
}

const ProductCard: FC<Props> = ({ product }) => {
  const [currentProductData, setCurrentProductData] = useState({
    image: product.image,
    link: product.slug,
  })

  useEffect(() => {
    setCurrentProductData((prevState): any => {
      if (prevState.link !== product.slug) {
        return { ...prevState, image: product.image, link: product.slug }
      } else return { ...prevState }
    })
  }, [product.slug])

  const productWithColors =
    product.variantProductsAttributeMinimal &&
    product.variantProductsAttributeMinimal.find(
      (item: Attribute) => item.fieldCode === colorKey
    )

  const hasColorVariation =
    productWithColors && productWithColors.fieldValues.length > 1

  const handleVariableProduct = (attr: any, type: string = 'enter') => {
    if (type === 'enter') {
      const variatedProduct = product.variantProductsMinimal.find((item: any) =>
        item.variantAttributes.find(
          (variant: any) => variant.fieldValue === attr.fieldValue
        )
      )
      if (variatedProduct) {
        setCurrentProductData({
          image: variatedProduct.image,
          link: variatedProduct.slug,
        })
      }
    } else {
      setCurrentProductData({ image: product.image, link: product.slug })
    }
  }

  return (
    <div className="border-r border-b border-gray-200">
      <div key={product.id} className="group relative p-4 sm:p-6">
        <Link
          passHref
          href={currentProductData.link}
          key={'data-product' + currentProductData.link}
        >
          <a href={currentProductData.link}>
            <div className="rounded-lg overflow-hidden bg-gray-200 aspect-w-1 aspect-h-1 group-hover:opacity-75">
              <img
                src={currentProductData.image}
                alt={product.name}
                className="w-full h-64 object-center object-cover"
              />
            </div>
          </a>
        </Link>

        <div className="pt-10 pb-4 text-center">
          <h3 className="min-h-50px text-sm font-medium text-gray-900">
            <Link href={currentProductData.link}>
              <a href={currentProductData.link}>
                {/* <span aria-hidden="true" className="absolute inset-0" /> */}
                {product.name}
              </a>
            </Link>
          </h3>

          <p className="mt-4 font-medium text-gray-900">
            {product?.price?.formatted?.withTax}
          </p>
          {hasColorVariation ? (
            <AttributeSelector
              attributes={product.variantProductsAttributeMinimal}
              onChange={handleVariableProduct}
              link={currentProductData.link}
            />
          ) : (
            <div className="h-10 w-10 inline-block" />
          )}
          <div className="flex">
            <AddToBasketButton className="mt-5" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
