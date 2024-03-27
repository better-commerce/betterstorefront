import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useUI } from '@components//ui'
import { useTranslation } from '@commerce/utils/use-translation'
import ProductCompare from '.'

export default function CompareSelectionBar({ name, showCompareProducts, isCompare, maxBasketItemsCount, deviceInfo, closeCompareProducts }: any) {
  const { isCompared, setIsCompared, compareProductList, resetCompareProducts } = useUI()
  const translate = useTranslation()
  const [products, setProducts] = useState([])
  const router = useRouter()

  useEffect(() => {
    return () => {
      setIsCompared('false')
    }
  }, [])

  useEffect(() => {
    if (!router.pathname.includes('/products')) {
      setIsCompared('false')
    }
  }, [router.pathname, router.asPath])

  useEffect(() => {
    setProducts(Object.values(compareProductList))
  }, [compareProductList])

  if (isCompared !== 'true') {
    return <></>
  }

  const clearAllSelected = () => {
    resetCompareProducts()
  }

  return (
    <>
      <div className={`fixed bottom-0 left-0 flex items-center justify-between w-full h-32 p-2 py-3  ${isCompare ? 'z-999' : 'z-99999'} sm:h-20 md:h-20 lg:h-20 bg-sky-100 lg:p-0 md:p-2`}>
        <div className="container flex flex-col gap-4 py-2 mx-auto sm:items-center sm:justify-center sm:flex-row md:flex-row lg:flex-row sm:px-4">
          <div className="flex flex-col gap-0 sm:items-center sm:gap-10 md:gap-10 lg:gap-10 sm:flex-row lg:flex-row md:flex-row">
            <h5 className="mt-2 text-sm font-semibold uppercase dark:text-black sm:pt-0">{products?.length || 'No'} {translate('label.product.itemssalectedText')}</h5>
            <h6 className="mt-2 text-xs font-semibold dark:text-black ipad-p-200 sm:text-sm sm:mt-0">{translate('label.product.itemssalectedText')} {name} {translate('label.product.selectToCompareText2')}</h6>
          </div>
          <div className="flex items-center flex-1 mb-2 text-right sm:justify-end gap-x-4">
            <button onClick={() => clearAllSelected()} className="order-2 px-4 font-semibold text-black underline sm:order-1 font-14 hover:text-sky-700">{translate('label.filters.clearAllText')}</button>
            <button type="button" onClick={() => showCompareProducts()} className="order-1 p-3 font-semibold text-center text-white uppercase bg-black rounded sm:order-2 sm:truncate disabled:cursor-not-allowed btn-primary disabled:opacity-20 button" disabled={!Boolean(products?.length > 1)} title={!Boolean(products?.length > 1) ? 'Please select at least 2 items.' : ''}>
            {translate('label.product.compareSelectedText')}
            </button>
          </div>
        </div>
      </div>
      <ProductCompare products={products} isCompare={isCompare} maxBasketItemsCount={maxBasketItemsCount} closeCompareProducts={closeCompareProducts} deviceInfo={deviceInfo} />
    </>
  )
}