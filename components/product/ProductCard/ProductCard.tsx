import { FC } from 'react'
import { useState } from 'react'
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
  const originalProductRef = { image: product.image, link: product.slug }
  const [currentProductData, setCurrentProductData] =
    useState(originalProductRef)

  const productWithColors = product.variantProductsAttributeMinimal.find(
    (item: Attribute) => item.fieldCode === colorKey
  )

  const hasColorVariation =
    productWithColors && productWithColors.fieldValues.length > 1

  const handleVariableProduct = (attr: any, type: string = 'enter') => {
    console.log(attr)
    console.log(product)
    console.log(type)
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
      setCurrentProductData(originalProductRef)
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
// import { FC } from 'react'
// import cn from 'classnames'
// import type { Product } from '@commerce/types/product'
// import s from './ProductCard.module.css'
// import Image, { ImageProps } from 'next/image'
// import WishlistButton from '@components/wishlist/WishlistButton'
// import usePrice from '@framework/product/use-price'
// import ProductTag from '../ProductTag'

// interface Props {
//   className?: string
//   product: Product
//   noNameTag?: boolean
//   imgProps?: Omit<ImageProps, 'src' | 'layout' | 'placeholder' | 'blurDataURL'>
//   variant?: 'default' | 'slim' | 'simple'
// }

// const placeholderImg = '/product-img-placeholder.svg'

// const ProductCard: FC<Props> = ({
//   product,
//   imgProps,
//   className,
//   noNameTag = false,
//   variant = 'default',
// }) => {
//   const { price } = usePrice({
//     amount: product.price.value,
//     baseAmount: product.price.retailPrice,
//     currencyCode: product.price.currencyCode!,
//   })

//   const rootClassName = cn(
//     s.root,
//     { [s.slim]: variant === 'slim', [s.simple]: variant === 'simple' },
//     className
//   )

//   return (
//     <Link href={`/product/${product.slug}`}>
//       <a className={rootClassName}>
//         {variant === 'slim' && (
//           <>
//             <div className={s.header}>
//               <span>{product.name}</span>
//             </div>
//             {product?.images && (
//               <Image
//                 quality="85"
//                 src={product.images[0]?.url || placeholderImg}
//                 alt={product.name || 'Product Image'}
//                 height={320}
//                 width={320}
//                 layout="fixed"
//                 {...imgProps}
//               />
//             )}
//           </>
//         )}

//         {variant === 'simple' && (
//           <>
//             {process.env.COMMERCE_WISHLIST_ENABLED && (
//               <WishlistButton
//                 className={s.wishlistButton}
//                 productId={product.id}
//                 variant={product.variants[0]}
//               />
//             )}
//             {!noNameTag && (
//               <div className={s.header}>
//                 <h3 className={s.name}>
//                   <span>{product.name}</span>
//                 </h3>
//                 <div className={s.price}>
//                   {`${price} ${product.price?.currencyCode}`}
//                 </div>
//               </div>
//             )}
//             <div className={s.imageContainer}>
//               {product?.images && (
//                 <Image
//                   alt={product.name || 'Product Image'}
//                   className={s.productImage}
//                   src={product.images[0]?.url || placeholderImg}
//                   height={540}
//                   width={540}
//                   quality="85"
//                   layout="responsive"
//                   {...imgProps}
//                 />
//               )}
//             </div>
//           </>
//         )}

//         {variant === 'default' && (
//           <>
//             {process.env.COMMERCE_WISHLIST_ENABLED && (
//               <WishlistButton
//                 className={s.wishlistButton}
//                 productId={product.id}
//                 variant={product.variants[0] as any}
//               />
//             )}
//             <ProductTag
//               name={product.name}
//               price={`${price} ${product.price?.currencyCode}`}
//             />
//             <div className={s.imageContainer}>
//               {product?.images && (
//                 <Image
//                   alt={product.name || 'Product Image'}
//                   className={s.productImage}
//                   src={product.images[0]?.url || placeholderImg}
//                   height={540}
//                   width={540}
//                   quality="85"
//                   layout="responsive"
//                   {...imgProps}
//                 />
//               )}
//             </div>
//           </>
//         )}
//       </a>
//     </Link>
//   )
// }

// export default ProductCard
