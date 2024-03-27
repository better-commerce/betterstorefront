import React from 'react'
import { Switch } from '@headlessui/react'
import { useTranslation } from '@commerce/utils/use-translation'

interface OutOfStockFilterProps {
  onEnableOutOfStockItems: any
  excludeOOSProduct: any
}

const OutOfStockFilter: React.FC<OutOfStockFilterProps> = ({
  onEnableOutOfStockItems,
  excludeOOSProduct,
}) => {
  const translate = useTranslation()
  return (
    <>
      <div className="flex flex-col py-0 pr-1 text-xs font-normal text-black sm:font-14 font-12 whitespace-nowrap dark:text-white"> {translate('label.search.includeOOSProductsText')} </div>
      <Switch checked={!excludeOOSProduct} onChange={onEnableOutOfStockItems} className={`${excludeOOSProduct ? 'bg-gray-300' : 'bg-white'} relative mr-3 inline-flex h-[18px] w-[35px] shrink-0 border-slate-300 cursor-pointer rounded-full border transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`} >
        <span aria-hidden="false" className={`${excludeOOSProduct ? 'translate-x-0' : 'translate-x-4'} pointer-events-none inline-block h-[15px] w-[15px] transform rounded-full bg-black shadow-lg ring-0 transition duration-200 ease-in-out`} />
      </Switch>
    </>
  )
}

export default OutOfStockFilter
