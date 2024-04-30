import Link from 'next/link'
import { generateUri } from '@commerce/utils/uri-util'
import { useTranslation } from '@commerce/utils/use-translation'
import { IMG_PLACEHOLDER } from '@components/utils/textVariables'

function OrderItems({ order }: any) {
  const translate = useTranslation()
  const css = { maxWidth: '100%', height: 'auto' }

  return (
    <div>
      {order?.items?.map((product: any) => (
        <div key={product.id} className="flex py-10 space-x-6 border-b border-gray-200" >
          <div className="flex-shrink-0 w-24 h-24 overflow-hidden border border-gray-200 rounded-md">
            <img style={css} src={generateUri(product.image, 'h=200&fm=webp') || IMG_PLACEHOLDER} width={200} height={200} alt={product.name || 'thank you'} className="flex-none object-cover object-center w-20 h-20 bg-gray-100 rounded-lg sm:w-40 sm:h-40" />
          </div>
          <div className="flex flex-col flex-auto">
            <div>
              <h4 className="font-medium text-gray-900">
                <Link href={`/${product.slug}`}>{product.name}</Link>
              </h4>
              <p className="mr-1 text-sm font-medium text-gray-700">
                {translate('label.thankyou.sizeText')}:{' '}
                <span className="uppercase">{product.size}</span>
              </p>
            </div>
            <div className="flex items-end mt-2">
              <dl className="flex space-x-4 text-sm divide-x divide-gray-200 sm:space-x-6">
                <div className="flex">
                  <dt className="font-medium text-gray-900"> {translate('common.label.quantityText')} </dt>
                  <dd className="ml-2 text-gray-700"> {product.qty} </dd>
                </div>
                <div className="flex pl-4 sm:pl-6">
                  <dt className="font-medium text-gray-900"> {translate('common.label.priceText')} </dt>
                  <dd className="ml-2 text-gray-700">
                    {product?.price?.raw?.withTax > 0 ? product.price.formatted.withTax : <span className='font-medium uppercase text-14 xs-text-14 text-emerald-600'>{translate('label.orderSummary.freeText')}</span>}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default OrderItems
