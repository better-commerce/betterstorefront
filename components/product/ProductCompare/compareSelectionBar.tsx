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
    if (!router.pathname.includes('/products')) {
      setIsCompared('false')
    }
  }, [router.pathname])

  useEffect(() => {
    setProducts(Object.values(compareProductList))
  }, [compareProductList])

  if (isCompared !== 'true') {
    return <></>
  }
  
  return (
    <>
      <div className="fixed bottom-0 left-0 z-10 flex items-center justify-between w-full h-32 sm:h-20 md:h-20 lg:h-20 py-3 bg-tan lg:p-0 md:p-2 p-2">
        <div className="container flex flex-col sm:flex-row md:flex-row lg:flex-row justify-center items-center mx-auto sm:px-4 gap-4 py-2">
          <div className="flex gap-0 sm:gap-10 md:gap-10 lg:gap-10 flex-col items-center sm:flex-row lg:flex-row md:flex-row">
            <h5 className="font-semibold uppercase text-sm">
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
              className="p-3 font-semibold text-center text-white sm:truncate uppercase bg-black rounded disabled:cursor-not-allowed disabled:opacity-60"
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
