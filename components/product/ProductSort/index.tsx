import classNames from '@components/utils/classNames'
import { Fragment, useState } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { GENERAL_SORT } from '@components/utils/textVariables'
import ToggleSwitch from '@components/common/ToggleSwitch'
import { vatIncluded } from '@framework/utils/app-util'
import { stringToBoolean } from '@framework/utils/parse-util'
import { getItem } from '@components/utils/localStorage'
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
  const [enabled, setEnabled] = useState(false)
  const currentOption = products.sortList?.filter(
    (item: any) => item.key === routerSortOption
  )[0]
  const getCompare = () => {
    return stringToBoolean((getItem('includeVAT') as string) || 'false')
  }
  const isCompaired = getCompare()
  return (
    <div className="flex">
      {/* <div>
        <div className="container flex items-center justify-end w-full px-6 pt-1 mx-auto">
          <div className="flex flex-col py-0 text-xs font-medium text-black uppercase sm:text-xs whitespace-nowrap">
            Compare Items
          </div>
          <div className="flow-root w-10 px-2 sm:w-20">
            <div className="flex justify-center flex-1 mx-auto">
              <label className="relative inline-flex items-center mr-5 cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={enabled}
                  readOnly
                />
                <div
                  onClick={() => {
                    setEnabled(!enabled)
                  }}
                  className="w-11 h-6 bg-gray-200 rounded-full peer  peer-focus:ring-green-300  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"
                ></div>
                <span className="ml-2 text-sm font-medium text-gray-900">
                  {enabled}
                </span>
              </label>
            </div>
          </div>
        </div>
      </div> */}
      <Menu as="div" className="relative flex pr-4 mb-0 sm:mb-4 sm:pr-0">
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
                <Menu.Item key={`short-by-option-${option.value}`}>
                  {({ active }) => (
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
                  )}
                </Menu.Item>
              ))}
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  )
}
