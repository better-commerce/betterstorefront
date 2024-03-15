import classNames from '@components/utils/classNames'
import { Fragment, useEffect, useState } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/solid'
import { useRouter } from 'next/router'
import { GENERAL_SORT } from '@components/utils/textVariables'
import { stringToBoolean } from '@framework/utils/parse-util'
import { getItem } from '@components/utils/localStorage'
import { useUI } from '@components/ui'
import { Switch } from '@headlessui/react'
import { translate } from '@components/services/localization'

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
  const { isCompared, setIsCompared } = useUI()
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    setEnabled(stringToBoolean(isCompared))
  }, [isCompared])

  const handleChange = (val: boolean) => {
    setEnabled(val)
    setIsCompared(String(val))
  }

  const currentOption = products.sortList?.filter(
    (item: any) => item.key === routerSortOption
  )[0]
  const getCompare = () => {
    return stringToBoolean((getItem('includeVAT') as string) || 'false')
  }
  return (
    <div className="flex items-center">
      <div>
        <div className="container flex items-center justify-end w-full px-4 pt-1 mx-auto">
          <div className="flex flex-col py-0 pr-1 text-xs font-normal text-black font-14 whitespace-nowrap dark:text-white">
          {translate('label.product.compareItemsText')}
          </div>
          <div className="flow-root w-10 px-2 sm:w-14">
            <div className="flex justify-center flex-1 mx-auto">
              <Switch checked={enabled} onChange={handleChange} className={`${enabled ? 'bg-white' : 'bg-gray-300'} relative inline-flex h-[18px] w-[35px] shrink-0 cursor-pointer rounded-full border border-slate-300 transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`} >
                <span className="sr-only">{translate('label.product.compareItemsText')}</span>
                <span aria-hidden="true" className={`${enabled ? 'translate-x-4' : 'translate-x-0'} pointer-events-none inline-block h-[15px] w-[15px] transform rounded-full bg-black shadow-lg ring-0 transition duration-200 ease-in-out`} />
              </Switch>
            </div>
          </div>
        </div>
      </div>
      <Menu as="div" className="relative flex pr-4 sm:pr-0">
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
            {products?.sortList?.length > 0
              && products.sortList.map((option: any) => (
                <Menu.Item key={`short-by-option-${option.value}`}>
                  {({ active }) => (
                    <span
                      onClick={() => action(option.key)}
                      className={classNames(
                        'hover:bg-gray-100',
                        currentOption?.key === option.key
                          ? 'bg-gray-100'
                          : '',
                        'block px-4 py-2 text-sm text-black font-normal cursor-pointer hover:font-semibold hover:text-orange-600'
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
