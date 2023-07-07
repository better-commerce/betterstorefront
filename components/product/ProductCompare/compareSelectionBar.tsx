import { useState } from 'react'
import ProductCompare from '@components/product/ProductCompare'
export default function CompareSelectionBar({
  name,
  showCompareProducts,
  products,
  isCompare,
  maxBasketItemsCount,
  deviceInfo,
  closeCompareProducts,
}: any) {
  return (
    <>
      <div className="fixed bottom-0 left-0 z-10 flex items-center justify-between w-full h-20 py-3 bg-tan">
        <div className="container flex items-center mx-auto sm:px-4">
          <div className="flex gap-10">
            <h5 className="font-semibold uppercase">5 Items Selected</h5>
            <h6 className="font-semibold">
              Select other {name} items to compare products
            </h6>
          </div>
          <div className="items-end justify-end flex-1 text-right">
            <button
              type="button"
              onClick={() => showCompareProducts()}
              className="px-5 py-3 text-sm font-semibold text-center text-white uppercase bg-black rounded"
            >
              Compare Selected
            </button>
          </div>
        </div>
      </div>
      <ProductCompare
        products={products}
        isCompare={isCompare}
        maxBasketItemsCount={maxBasketItemsCount}
        closeCompareProducts={closeCompareProducts}
        deviceInfo={deviceInfo}
      />
    </>
  )
}
