import { Menu, Transition } from '@headlessui/react'
import React, { Fragment, useEffect, useState } from 'react'
import { CurrencyDollarIcon } from '@heroicons/react/24/outline'
// Other Imports
import { matchStrings } from '@framework/utils/parse-util'
import { getCurrency } from '@framework/utils/app-util'
import { useUI } from '@components/ui'
import { useTranslation } from '@commerce/utils/use-translation'

export default function CurrencySwitcher({ config = [], title, action }: any) {
  const translate = useTranslation()
  const { setCurrency } = useUI()
  const [currencySymbol, setCurrencySymbol] = useState('')

  useEffect(() => {
    const currencyCode = getCurrency()
    const currency = config?.find((x: any) => matchStrings(x?.currencyCode, currencyCode, true))
    setCurrency(currency)
    setCurrencySymbol(currency?.currencySymbol)
  }, [config])
  return (
    <Menu as="div" className="relative flow-root w-10 px-1 text-left md:w-14 xl:w-16">
      <Menu.Button className="grid flex-col items-center justify-center grid-cols-1 mx-auto text-center group icon-grp align-center" aria-label="Currency" >
        <CurrencyDollarIcon className="flex-shrink-0 block w-6 h-6 mx-auto text-black group-hover:text-gray-500" aria-hidden="true" aria-label="Currency" />
        <span className="hidden text-sm font-normal text-black sm:block text-header-clr text-icon-display">
          {translate('label.navBar.currencyText')} 
        </span>
      </Menu.Button>
      <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95" >
        <Menu.Items className="absolute right-0 z-50 flex flex-col w-56 px-1 py-1 mt-2 text-gray-900 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <Menu.Item>
            {({ active }) => (
              <>
                <h5 className="p-2 font-bold text-left">{title}</h5>
                {config.map((item: any, idx: number) => (
                  <div key={'currency' + idx} className={'text-left p-2 cursor-pointer hover:bg-gray-200'} onClick={() => action({ Currency: item.currencyCode })} >
                    {item.currencyCode} - {item.currencySymbol}
                  </div>
                ))}
              </>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
