import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { CurrencyDollarIcon } from '@heroicons/react/outline'
import { setCookie } from '@components/utils/cookieHandler'

export default function CurrencySwitcher({ config = [], title, action }: any) {
  return (
    <Menu as="div" className="pr-3 flow-root border-r mr-2 relative">
      <Menu.Button className="group items-center text-center align-center justify-center flex-col mx-auto" aria-label="Currency">
        <CurrencyDollarIcon
          className="flex-shrink-0 h-5 w-5 inline-block text-white group-hover:text-gray-300 mx-auto"
          aria-hidden="true" aria-label="Currency"
        />
         <span className='font-semibold text-sm text-white pl-1 hover:text-gray-300'>Currency</span>
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute z-50 right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="px-1 py-1 flex flex-col text-gray-900 divide-y divide-gray-100">
            <Menu.Item>
              {({ active }) => {
                return (
                  <>
                    <h1 className="text-left font-semibold font-sm uppercase p-2">{title}</h1>
                    {config.map((item: any, idx: number) => {
                      return (
                        <div
                          key={'currency' + idx}
                          className={
                            'text-left p-2 cursor-pointer hover:bg-gray-200'
                          }
                          onClick={() =>
                            action({ Currency: item.currencyCode })
                          }
                        >
                          {item.currencySymbol} {'-'} {item.currencyCode}
                        </div>
                      )
                    })}
                  </>
                )
              }}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
