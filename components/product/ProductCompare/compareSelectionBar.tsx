import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import ProductCompare from '@components/product/ProductCompare'
import { useUI } from '@components/ui'

export default function CompareSelectionBar({
  name,
  showCompareProducts,
  isCompare,
  maxBasketItemsCount,
  deviceInfo,
  closeCompareProducts,
}: any) {
  const { isCompared, setIsCompared, compareProductList } = useUI()
  const [products, setProducts] = useState([])
  const router = useRouter()

  useEffect(() => {
    setIsCompared('false')
  }, [router.pathname])
  
  useEffect(() => {
    setProducts(Object.values(compareProductList))
  }, [compareProductList])

  if (isCompared !== 'true') {
    return <></>
  }
  
  return (
    <>
      <div className="fixed bottom-0 left-0 z-10 flex items-center justify-between w-full h-20 py-3 bg-tan">
        <div className="container flex items-center mx-auto sm:px-4">
          <div className="flex gap-10">
            <h5 className="font-semibold uppercase">
              {products?.length || "No"} Item(s) Selected
            </h5>
            <h6 className="font-semibold">
              Select other {name} items to compare products
            </h6>
          </div>
          <div className="items-end justify-end flex-1 text-right">
            <button
              type="button"
              onClick={() => showCompareProducts()}
              className="px-5 py-3 text-sm font-semibold text-center text-white uppercase bg-black rounded disabled:cursor-not-allowed disabled:opacity-60"
              disabled={!Boolean(products?.length > 1)}
              title={!Boolean(products?.length > 1) ? 'Please select atleast 2 items.' : ''}
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
