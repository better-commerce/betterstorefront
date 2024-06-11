import { generateUri } from '@commerce/utils/uri-util'
import Link from 'next/link'
import { IMG_PLACEHOLDER } from '@components/utils/textVariables'

export default function BundleProductCard({ product, handleRedirectToPDP, handleClose }: any) {
  const css = { maxWidth: '100%', height: 'auto' }
  return (
    <div key={product?.productId} className="flex items-start mt-4 border-t border-gray-200 pt-4">
      <div className="flex-shrink-0 w-16 h-16 overflow-hidden rounded-md">
        <Link href={`/${product?.slug}`}>
          <img width={64} height={64} style={css} src={generateUri(product?.image, 'h=300&fm=webp') || IMG_PLACEHOLDER} alt={product?.name || 'sub-product-image'} className="object-cover object-center w-full h-full" onClick={handleRedirectToPDP} />
        </Link>
      </div>
      <div className="ml-4">
        <h5 onClick={handleClose} className="text-sm font-medium dark:text-black">
          <Link href={`/${product?.slug}`}> {product?.name} </Link>
        </h5>
      </div>
    </div>
  )
}
