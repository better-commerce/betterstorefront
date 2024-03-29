import { Fragment, useEffect, useState } from 'react'
import { Popover, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/solid'
import { useRouter } from 'next/router'
import { stringToBoolean } from '@framework/utils/parse-util'
import { getItem } from '@components/utils/localStorage'
import { useUI } from '@components/ui'
import { Switch } from '@headlessui/react'
import Radio from '@components/shared/Radio/Radio'
import { useTranslation } from '@commerce/utils/use-translation'
import featureToggle from 'features.config.json'
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
  const translate = useTranslation()
  const router = useRouter()
  const { isCompared, setIsCompared } = useUI()
  const [enabled, setEnabled] = useState(false)
  const [sortOrderStates, setSortOrderStates] = useState<string>("");
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
  const renderXClear = () => {
    return (
      <span className="flex items-center justify-center flex-shrink-0 w-4 h-4 ml-3 text-white rounded-full cursor-pointer bg-primary-500">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor" >
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </span>
    );
  };
  return (
    <div className="flex items-center space-x-2">
      {featureToggle?.features?.enableCompare &&
        <div>
          <div className="flex items-center justify-end w-full px-0 pt-0 mx-auto sm:pt-1 sm:px-4">
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
      }
      <Popover className="relative">
        {({ open, close }) => (
          <>
            <Popover.Button
              className={`flex items-center justify-center px-4 py-2 text-sm border rounded-full focus:outline-none select-none
              ${open ? "!border-primary-500" : ""}
                ${!!sortOrderStates?.length
                  ? "!border-primary-500 bg-primary-50 text-primary-900"
                  : "border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400 dark:hover:border-neutral-500"
                }
                `}
            >
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none">
                <path d="M11.5166 5.70834L14.0499 8.24168" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M11.5166 14.2917V5.70834" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M8.48327 14.2917L5.94995 11.7583" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M8.48315 5.70834V14.2917" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M10.0001 18.3333C14.6025 18.3333 18.3334 14.6024 18.3334 10C18.3334 5.39763 14.6025 1.66667 10.0001 1.66667C5.39771 1.66667 1.66675 5.39763 1.66675 10C1.66675 14.6024 5.39771 18.3333 10.0001 18.3333Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>

              <span className="ml-2">
                {sortOrderStates ? products?.sortList.filter((i: any) => i.key === sortOrderStates)[0].value : "Sort order"}
              </span>
              {!sortOrderStates.length ? (
                <ChevronDownIcon className="w-4 h-4 ml-3" />
              ) : (
                <span onClick={() => setSortOrderStates("")}> {renderXClear()} </span>
              )}
            </Popover.Button>
            <Transition as={Fragment} enter="transition ease-out duration-200" enterFrom="opacity-0 translate-y-1" enterTo="opacity-100 translate-y-0" leave="transition ease-in duration-150" leaveFrom="opacity-100 translate-y-0" leaveTo="opacity-0 translate-y-1" >
              <Popover.Panel className="absolute right-0 z-40 w-screen max-w-sm px-4 mt-3 sm:px-0 lg:max-w-sm">
                <div className="overflow-hidden bg-white border shadow-xl rounded-2xl dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700">
                  <div className="relative flex flex-col px-5 py-6 space-y-5">
                    {products?.sortList?.map((item: any, index: number) => (
                      <Radio
                        id={item?.key}
                        key={index}
                        name="productSort"
                        label={item?.value}
                        defaultChecked={sortOrderStates === item?.key}
                        onChange={() => action(item?.key)}
                      />
                    ))}
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
  )
}
