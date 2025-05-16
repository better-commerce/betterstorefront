import { Button } from '@components/ui'
import { NEXT_TRADE_IN_PRODUCTS } from '@components/utils/constants'
import { callApi } from '@framework/utils/api-util'
import { logError } from '@framework/utils/app-util'
import { AxiosRequestConfig } from 'axios'
import { RequestMethod } from 'bc-payments-sdk/dist/constants'
import { useDebounce } from 'hooks/useDebounce'
import React, { useCallback, useEffect, useState } from 'react'

export default function ProductSearch({ onCloseProduct, updateProductStockCode }: any) {
  const [isLoading, setIsLoading] = useState<any>(false)
  const [selectedProductStockCode, setSelectedProductStockCode] = useState('') 
  const [searchValue, setSearchValue] = useState<string>('')
  const [products, setProducts] = useState<any>([])
  
  const getAllProducts = useCallback(useDebounce(async () => {
    try {
      setIsLoading(true)
      const config: AxiosRequestConfig = { url: NEXT_TRADE_IN_PRODUCTS, method: RequestMethod.POST, data: { searchText: searchValue }, }
      const productResult = await callApi(config)
      if (productResult?.data) setProducts(productResult?.data)
    } catch (error) {
      logError(error)
    } finally {
      setIsLoading(false)
    }
  }, 300), [searchValue])

  const onSelectProduct = (product: any) => setSelectedProductStockCode(product?.stockCode)

  const onUpdateStockcode = useCallback(async () => {
    setIsLoading(true)
    await updateProductStockCode(selectedProductStockCode)
    setIsLoading(false)
  },[selectedProductStockCode, updateProductStockCode, onCloseProduct])

  useEffect(() => {
    if (searchValue && searchValue.length > 3) getAllProducts()
    else if (searchValue.length === 0) setProducts([])
  }, [searchValue, getAllProducts])

  return (
    <>
      <div className="flex items-center gap-2 w-full max-w-lg m-auto mb-3">
        <label htmlFor="search">Product Search:</label>
        <input id="search" required value={searchValue} onChange={(e: any) => setSearchValue(e?.target?.value)} className="flex-1 p-2 border border-gray-300 text-gray-800 bg-white" />
        <Button className="btn btn-danger bg-red-600 h-10" disabled={false} onClick={() => onCloseProduct(false)} > {' '} close{' '} </Button>
      </div>
       {products?.length > 0 ? (
            <>
              <div className='grid grid-cols-6 gap-2 py-1 max-h-[420px] overflow-y-auto'>
                {products?.map((product: any) => (
                  <div className={`relative flex flex-col justify-between text-center items-center cursor-pointer border hover:border-gray-500 rounded ${product?.stockCode == selectedProductStockCode ? 'border-2 border-indigo-600' : ''}`} onClick={() => onSelectProduct(product)} key={product.stockCode}>
                    <img src={product.image} height={120} width={120} />
                    <p className='px-1'>{product.name}</p>
                    <p className='text-red-600 font-bold mb-1'>{product?.sellPrice > 0 ? 'Auto Price' : 'Manual Price'}</p>
                  </div>
                ))}
              </div>
              <Button className="btn btn-primary-green" disabled={isLoading} onClick={onUpdateStockcode} >{isLoading ? 'Submitting':'Submit'}</Button>
            </>
          ) : ( <div className='text-center text-gray-400 my-2'> {isLoading ? "Loading..." : "No products available."} </div> )}
    </>
  )
}
