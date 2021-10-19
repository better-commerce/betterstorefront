import classNames from '@components/utils/classNames'
import { Fragment } from 'react'
import { Disclosure, Menu, Transition, Dialog } from '@headlessui/react'
import { ChevronDownIcon, FilterIcon, XIcon } from '@heroicons/react/solid'
import Link from 'next/link'
import { useRouter } from 'next/router'
interface Props {
  products: any
  action: any
}

export default function ProductSort({ products, action }: Props) {
  const router = useRouter()

  return (
    <Menu as="div" className="relative inline-block">
      <div className="flex">
        <Menu.Button className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
          Sort
          <ChevronDownIcon
            className="flex-shrink-0 -mr-1 ml-1 h-5 w-5 text-gray-400 group-hover:text-gray-500"
            aria-hidden="true"
          />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="z-10 origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-2xl bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {products.sortList.length &&
              products.sortList.map((option: any) => (
                <Menu.Item key={option.value}>
                  {({ active }) => (
                    <Link
                      href={{
                        pathname: '/search',
                        query: {
                          ...router.query,
                          sortBy: option.key,
                        },
                      }}
                      passHref
                    >
                      <a
                        href={option.href}
                        onClick={() => action(option.key)}
                        className={classNames(
                          option.current
                            ? 'font-medium text-gray-900'
                            : 'text-gray-500',
                          active ? 'bg-gray-100' : '',
                          'block px-4 py-2 text-sm'
                        )}
                      >
                        {option.value}
                      </a>
                    </Link>
                  )}
                </Menu.Item>
              ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
