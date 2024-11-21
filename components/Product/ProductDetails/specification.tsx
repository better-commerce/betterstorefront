import groupBy from 'lodash/groupBy'
import React from 'react'
import ProductDisclosure from '@components/Product/ProductDetails/productDisclosure'
export default function ProductSpecifications({ attrGroup, product }: any) {
  const imageTagGroup = groupBy(product?.images, 'tag')
  return (
    <>
      {
        (imageTagGroup["specifications"]?.length > 0 || attrGroup["global.keyinformation"]?.length > 0 || attrGroup["global.technicalspecification"]?.length > 0 || attrGroup["global.warrantydetail"]?.length > 0 || imageTagGroup["downloads"]?.length > 0) &&
        <div className="col-span-12 sm:col-span-12 md:py-10 ipad-py-5">
          <div className="flex-1 pb-0 pr-4 sm:pb-4">
            <h2 className="mb-2 font-semibold text-center text-black font-18 text-dark-brown dark:text-black">Product specification <span className='sr-only'>{' '}of {product?.name}</span></h2>
            {attrGroup['whyweloveit']?.length > 0 && (
              <div className="flex flex-wrap pb-2 mb-1 text-center border-b border-gray-200 ul-li-disc sm:pb-3 sm:mb-3">
                {attrGroup['whyweloveit'].map((detail: any, cdx: number) => (
                  <div key={`product-${cdx}-detail-value`} className="text-sm font-medium leading-7 text-black dark:text-black" dangerouslySetInnerHTML={{ __html: detail.value || detail.value, }} />
                ))}
              </div>
            )}
          </div>
          <ProductDisclosure imageTagGroup={imageTagGroup} pdfs={product?.pdFs} attrGroup={attrGroup} product={product} />
        </div>
      }
    </>
  )
}