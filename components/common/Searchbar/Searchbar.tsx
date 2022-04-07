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
    <div className="flex flex-row">
      <button
        onClick={onClick}
        className="px-4 text-lime hover:text-gray-100 grid grid-cols-1 text-center"
      >
        <span className="sr-only">{BTN_SEARCH}</span>
        <SearchIcon className="w-6 h-6 mx-auto" aria-hidden="true" />
        <span className='text-lime pr-2 font-normal text-sm hidden sm:block'>Search</span>
      </button>
    </div>
  )
}

export default memo(Searchbar)
