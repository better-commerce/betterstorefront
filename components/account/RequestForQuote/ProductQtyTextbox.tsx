import { useEffect, useState } from 'react'

//

import useDebounce from '@commerce/utils/use-debounce'
import { UPDATE_BASKET_DEBOUNCE_TIMEOUT } from '@components/utils/constants'

function ProductQtyTextbox({ product, maxBasketItemsCount, onUpdateBasket, onLoading}: any) {
  const [qty, setQty] = useState<undefined | number>(product?.qty)

  useEffect(() => {
    setQty(product?.qty)
  }, [product?.qty])

  const onQtyChange = (e: any) => {
    if (!e.target.value) {
      setQty(e.target.value)
      return
    }
    if (qty === undefined || qty === 0) {
      setQty(product?.qty)
      return
    }
    const qtyNum = e.target.value * 1
    if (qtyNum === 0) {
      setQty(1)
      onUpdateBasketProduct(1)
    } 
    else if (qtyNum > 100) {
        setQty(100)
        onUpdateBasketProduct(100)
      }
    else {
      if (maxBasketItemsCount < 1) {
        setQty(qtyNum)
      }
      if (qtyNum <= maxBasketItemsCount) {
        setQty(qtyNum)
      }
      setQty(qtyNum)
      onUpdateBasketProduct(qtyNum)
    }
  }

  const onUpdateBasketProduct = useDebounce((updateQty: number) => {
    if (product?.qty === updateQty) return
    onLoading(product?.ProductId)
    onUpdateBasket(product, updateQty)
}, UPDATE_BASKET_DEBOUNCE_TIMEOUT)

  const onQtySubmit = (e: any) => {
    e.preventDefault()
  }

  return (
    <form className="flex items-center justify-center w-10 text-sm text-center text-black border-0" onSubmit={onQtySubmit}>
      <input type="number" value={qty || ''} onChange={onQtyChange} className='flex items-center justify-center w-10 !px-0 text-xs text-center text-black bg-transparent border-0' />
    </form>
  )
}

export default ProductQtyTextbox
