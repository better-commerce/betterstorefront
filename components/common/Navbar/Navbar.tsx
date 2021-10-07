import { FC, Fragment } from 'react'
import config from './config'
import { classNames } from '../../utils'
import { Popover, Transition } from '@headlessui/react'
import { SearchIcon, ShoppingBagIcon } from '@heroicons/react/outline'
import { Searchbar, UserNav } from '@components/common'
import { Logo } from '@components/ui'
import Link from 'next/link'

const Navbar: FC = ({}) => {
  return (
    <div className="bg-white">
      <header className="relative bg-white">
        <nav aria-label="Top" className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="border-b border-gray-200 px-4 pb-14 sm:px-0 sm:pb-0">
            <div className="h-16 flex items-center justify-between">
              {/* Logo */}
              <Link href="#">
                <div className="flex-1 flex cursor-pointer">
                  <span className="sr-only">Workflow</span>
                  <Logo />
                </div>
              </Link>

              {/* Flyout menus */}
              <Popover.Group className="absolute bottom-0 inset-x-0 sm:static sm:flex-1 sm:self-stretch">
                <div className="border-t h-14 px-4 flex space-x-8 overflow-x-auto pb-px sm:h-full sm:border-t-0 sm:justify-center sm:overflow-visible sm:pb-0">
                  {config.categories.map((category, categoryIdx) => (
                    <Popover key={categoryIdx} className="flex">
                      {({ open }) => (
                        <>
                          <div className="relative flex">
                            <Popover.Button
                              className={classNames(
                                open
                                  ? 'border-indigo-600 text-indigo-600'
                                  : 'border-transparent text-gray-700 hover:text-gray-800',
                                'relative z-10 flex items-center transition-colors ease-out duration-200 text-sm font-medium border-b-2 -mb-px pt-px'
                              )}
                            >
                              {category.name}
                            </Popover.Button>
                          </div>
                          <Transition
                            as={Fragment}
                            enter="transition ease-out duration-200"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="transition ease-in duration-150"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                          >
                            <Popover.Panel className="absolute top-full z-50 inset-x-0 text-gray-500 sm:text-sm">
                              {/* Presentational element used to render the bottom shadow, if we put the shadow on the actual panel it pokes out the top, so we use this shorter element to hide the top of the shadow */}
                              <div
                                className="absolute inset-0 top-1/2 bg-white shadow"
                                aria-hidden="true"
                              />

                              <div className="relative bg-white">
                                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                  <div className="grid grid-cols-1 items-start gap-y-10 gap-x-6 pt-10 pb-12 md:grid-cols-2 lg:gap-x-8">
                                    <div className="grid grid-cols-1 gap-y-10 gap-x-6 lg:gap-x-8">
                                      <div>
                                        <p
                                          id="clothing-heading"
                                          className="font-medium text-gray-900"
                                        >
                                          Clothing
                                        </p>
                                        <div className="mt-4 border-t border-gray-200 pt-6 sm:grid sm:grid-cols-2 sm:gap-x-6">
                                          <ul
                                            role="list"
                                            aria-labelledby="clothing-heading"
                                            className="space-y-6 sm:space-y-4"
                                          >
                                            {category.clothing[0].map(
                                              (item) => (
                                                <li
                                                  key={item.name}
                                                  className="flex"
                                                >
                                                  <Link
                                                    href={item.href}
                                                    passHref
                                                  >
                                                    <a className="hover:text-gray-800">
                                                      {item.name}
                                                    </a>
                                                  </Link>
                                                </li>
                                              )
                                            )}
                                          </ul>
                                          <ul
                                            role="list"
                                            aria-label="More clothing"
                                            className="mt-6 space-y-6 sm:mt-0 sm:space-y-4"
                                          >
                                            {category.clothing[1].map(
                                              (item) => (
                                                <li
                                                  key={item.name}
                                                  className="flex"
                                                >
                                                  <Link
                                                    passHref
                                                    href={item.href}
                                                  >
                                                    <a className="hover:text-gray-800">
                                                      {item.name}
                                                    </a>
                                                  </Link>
                                                </li>
                                              )
                                            )}
                                          </ul>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:gap-x-8">
                                      <div>
                                        <p
                                          id="accessories-heading"
                                          className="font-medium text-gray-900"
                                        >
                                          Accessories
                                        </p>
                                        <ul
                                          role="list"
                                          aria-labelledby="accessories-heading"
                                          className="mt-4 border-t border-gray-200 pt-6 space-y-6 sm:space-y-4"
                                        >
                                          {category.accessories.map((item) => (
                                            <li
                                              key={item.name}
                                              className="flex"
                                            >
                                              <Link href={item.href} passHref>
                                                <a className="hover:text-gray-800">
                                                  {item.name}
                                                </a>
                                              </Link>
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                      <div>
                                        <p
                                          id="categories-heading"
                                          className="font-medium text-gray-900"
                                        >
                                          Categories
                                        </p>
                                        <ul
                                          role="list"
                                          aria-labelledby="categories-heading"
                                          className="mt-4 border-t border-gray-200 pt-6 space-y-6 sm:space-y-4"
                                        >
                                          {category.categories.map((item) => (
                                            <li
                                              key={item.name}
                                              className="flex"
                                            >
                                              <Link href={item.href} passHref>
                                                <a className="hover:text-gray-800">
                                                  {item.name}
                                                </a>
                                              </Link>
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Popover.Panel>
                          </Transition>
                        </>
                      )}
                    </Popover>
                  ))}

                  {config.other.map((item) => (
                    <Link href={item.href} key={item.name} passHref>
                      <a
                        href={item.href}
                        className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-800"
                      >
                        {item.name}
                      </a>
                    </Link>
                  ))}
                </div>
              </Popover.Group>

              <div className="flex-1 flex items-center justify-end">
                {/* Search */}
                {true && <Searchbar />}

                {/* Cart */}
                <div className="ml-4 flow-root lg:ml-8">
                  <button className="group -m-2 p-2 flex items-center">
                    <ShoppingBagIcon
                      className="flex-shrink-0 h-6 w-6 text-gray-400 group-hover:text-gray-500"
                      aria-hidden="true"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
                      0
                    </span>
                    <span className="sr-only">items in cart, view bag</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  )
}
export default Navbar
