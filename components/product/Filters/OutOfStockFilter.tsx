import React from 'react'
import { Switch } from '@headlessui/react'

interface OutOfStockFilterProps {
  onEnableOutOfStockItems: any
  excludeOOSProduct: any
}

const OutOfStockFilter: React.FC<OutOfStockFilterProps> = ({
  onEnableOutOfStockItems,
  excludeOOSProduct,
}) => {
  return (
    <>
      <div className="flex flex-col py-0 pr-1 mt-3 text-xs font-normal text-black font-14 whitespace-nowrap dark:text-white">
        Include out of stock products
      </div>

      <Switch
        checked={!excludeOOSProduct}
        onChange={onEnableOutOfStockItems}
        className={`${
          excludeOOSProduct ? 'bg-gray-300' : 'bg-green'
        } relative mt-3 mr-3 inline-flex h-[18px] w-[35px] shrink-0 border-black cursor-pointer rounded-full border transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
      >
        <span
          aria-hidden="false"
          className={`${
            excludeOOSProduct ? 'translate-x-0' : 'translate-x-4'
          } pointer-events-none inline-block h-[15px] w-[15px] transform rounded-full bg-black shadow-lg ring-0 transition duration-200 ease-in-out`}
        />
      </Switch>
    </>
  )
}

export default OutOfStockFilter
