import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { FlagIcon } from '@heroicons/react/outline'
import Cookies from 'js-cookie'
import { Router } from 'next/router'

export default function CurrencySwitcher({ config, title, action }: any) {
  return (
    <Menu as="div" className="relative flow-root w-10 px-1 text-left sm:w-16">
      <Menu.Button className="grid flex-col items-center justify-center grid-cols-1 mx-auto text-center group align-center"  aria-label="Language">
        <FlagIcon
          className="flex-shrink-0 block w-6 h-6 mx-auto text-black group-hover:text-gray-500"
          aria-hidden="true"  aria-label="Flags"
        />
        <span className='hidden text-sm font-normal text-black sm:block'>Lang</span>
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
        <Menu.Items className="absolute right-0 z-50 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="flex flex-col px-1 py-1 text-gray-900 divide-y divide-gray-100">
            <Menu.Item>
              {({ active }) => {
                return (
                  <>
                    <h1 className="p-2 font-bold text-left">{title}</h1>
                    {config.map((item: any, idx: number) => {
                      return (
                        <div
                          key={'language' + idx}
                          className={
                            'text-left p-2 cursor-pointer hover:bg-gray-200'
                          }
                          onClick={() => {
                            Cookies.set('googtrans', `/en/${item.languageCode}`)
                            action({ Language: item.languageCode })
                          }}
                        >
                          {item.languageCode} - {item.name}
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
