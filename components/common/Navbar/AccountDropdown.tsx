import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { UserIcon } from '@heroicons/react/outline'
import Link from 'next/link'

export default function Account({ config, title }: any) {
  return (
    <Menu as="div" className="relative inline-block text-left border-r border-l border-lime-light">
      <Menu.Button className="px-4 grid grid-cols-1 text-center text-lime hover:text-gray-100 inline-flex justify-center w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">

        <UserIcon
          className="flex-shrink-0 mx-auto h-6 w-6 text-lime group-hover:text-gray-100"
          aria-hidden="true"
        />
        <span className='text-lime pr-2 font-normal text-sm'>My Account</span>
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
          <div className="px-1 py-1 flex flex-col text-lime divide-y divide-gray-100">
            <Menu.Item>
              {({ active }) => {
                return (
                  <>
                    <h1 className="text-left font-bold p-2">{title}</h1>
                    {config.map((item: any, idx: number) => {
                      return (
                        <Link key={idx} passHref href={item.href}>
                          <a
                            className={item.className}
                            onClick={item.onClick || false}
                            href={item.href}
                          >
                            {item.title}
                          </a>
                        </Link>
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
