import { FC, memo, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { SearchIcon } from '@heroicons/react/outline'
import { Transition } from '@headlessui/react'
import { BTN_SEARCH } from '@components/utils/textVariables'
interface Props {
  id?: string
  onClick: any
}

const Searchbar: FC<Props> = ({ id = 'search', onClick }) => {
  return (
    <div className="flex flex-row sm:mr-8 sm:pr-2 bg-gray-100 border rounded-sm">
      <button
        onClick={onClick}
        className="p-1 pl-3 pr-16 text-gray-400 hover:text-gray-500 relative" aria-label="Search"
      >
        <span className="sr-only" aria-label="Search">{BTN_SEARCH}</span>       
        <span className='text-black pr-2 font-normal text-sm sm:inline-block pr-32 hidden'>Search</span>
        <SearchIcon className="w-4 h-4 absolute top-2 right-0 text-gray-400" aria-hidden="true" aria-label="Search" />
      </button>
    </div>
  )
}

export default memo(Searchbar)
