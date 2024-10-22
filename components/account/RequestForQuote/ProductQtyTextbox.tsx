import { useEffect, useState } from 'react'

import useDebounce from '@commerce/utils/use-debounce'
import { UPDATE_BASKET_DEBOUNCE_TIMEOUT } from '@components/utils/constants'

function ProductQtyTextbox({ product, maxBasketItemsCount, onUpdateBasket, onLoading }: any) {
  const [qty, setQty] = useState<undefined | number>(product?.qty)

  useEffect(() => {
    setQty(product?.qty)
  }, [product?.qty])

  const onQtyChange = (e: any) => {
    const inputValue = e.target.value

    // Prevent invalid entries like characters or symbols
    if (!/^\d*$/.test(inputValue)) {
      return // Ignore the change if it's not a valid number
    }

    if (!inputValue || inputValue === "") {
      setQty(undefined)
      return
    }

    const qtyNum = Number(inputValue)

    if (qtyNum === 0) {
      setQty(1)
      onUpdateBasketProduct(1)
    } else if (qtyNum > 100) {
      setQty(100)
      onUpdateBasketProduct(100)
    } else {
      if (maxBasketItemsCount < 1) {
        setQty(qtyNum)
      } else if (qtyNum <= maxBasketItemsCount) {
        setQty(qtyNum)
        onUpdateBasketProduct(qtyNum)
      }
    }
  }

  // Prevent invalid characters from being typed in the input (e.g., letters, symbols)
  const onKeyDown = (e: any) => {
    if (
      (e.key >= '0' && e.key <= '9') || // Allow numbers
      e.key === 'Backspace' || // Allow backspace
      e.key === 'ArrowLeft' || e.key === 'ArrowRight' // Allow arrow keys for navigation
    ) {
      return
    }
    e.preventDefault() // Prevent all other characters (letters, symbols, etc.)
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
      <input
        type="number"
        value={qty || ''}
        onChange={onQtyChange}
        onKeyDown={onKeyDown} // Restrict non-number input
        min="1" // Prevents negative values being entered manually
        className='flex items-center justify-center w-10 !px-0 text-xs text-center text-black bg-transparent border-0'
      />
    </form>
  )
}

export default ProductQtyTextbox
