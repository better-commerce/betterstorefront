import { Disclosure } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import React from 'react'
type data = {
  details: string
  heading: string
}
const BrandDisclosure = ({ details, heading }: data) => {
  return (
    <div className="w-full">
      <div className="mx-auto w-full bg-white py-2">
        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button className="flex w-full justify-between py-2 text-left text-sm font-medium  focus:outline-none border-b-2 border-black">
                <span className="uppercase">{heading}</span>
                <ChevronDownIcon
                  className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 `}
                />
              </Disclosure.Button>
              <Disclosure.Panel className="p-2 text-sm text-gray-500">
                {details}
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>
    </div>
  )
}

export default BrandDisclosure
