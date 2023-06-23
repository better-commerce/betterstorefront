import classNames from '@components/utils/classNames'
import { Fragment, useState } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { GENERAL_SORT } from '@components/utils/textVariables'
interface Props {
  products: any
  action: any
  routerSortOption: any
}

export default function ProductSort({
  products,
  action,
  routerSortOption,
}: Props) {
  const router = useRouter()

  const currentOption = products.sortList?.filter(
    (item: any) => item.key === routerSortOption
  )[0]
  return (
    <Menu as="div" className="relative flex mb-0 sm:mb-4 pr-4 sm:pr-0">
      <Menu.Button className="inline-flex justify-center font-semibold text-black text-md group hover:text-gray-900">
        {GENERAL_SORT}{' '}
        <ChevronDownIcon
          className="flex-shrink-0 w-5 h-5 ml-1 -mr-1 text-gray-400 group-hover:text-gray-500"
          aria-hidden="true"
        />
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
        <Menu.Items className="absolute right-0 z-10 w-40 mt-6 text-left origin-top-right bg-white rounded-md shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
          {products.sortList.length &&
            products.sortList.map((option: any) => (
              <Menu.Item key={option.value}>
                {({ active }) => (
                  // <Link
                  //   href={{
                  //     pathname: router.pathname,
                  //     query: { ...router.query, sortBy: option.key },
                  //   }}
                  //   passHref
                  // >
                    <span
                      onClick={() => action(option.key)}
                      className={classNames(
                        'text-gray-500 hover:bg-gray-100',
                        currentOption?.key === option.key ? 'bg-gray-100' : '',
                        'block px-4 py-2 text-sm'
                      )}
                    >
                      {option.value}
                    </span>
                  // </Link>
                )}
              </Menu.Item>
            ))}
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
