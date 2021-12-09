import { FC, memo, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { SearchIcon } from '@heroicons/react/outline'
import { Transition } from '@headlessui/react'
interface Props {
  id?: string
  onClick: any
}

const Searchbar: FC<Props> = ({ id = 'search', onClick }) => {
  return (
    <div className="flex flex-row">
      <button
        onClick={onClick}
        className="p-2 text-gray-400 hover:text-gray-500"
      >
        <span className="sr-only">Search</span>
        <SearchIcon className="w-6 h-6" aria-hidden="true" />
      </button>
    </div>
  )
}

export default memo(Searchbar)
