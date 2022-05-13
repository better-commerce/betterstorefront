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
        className="p-2 text-gray-400 hover:text-gray-500"
      >
        <span className="sr-only">{BTN_SEARCH}</span>
        <SearchIcon className="w-6 h-6" aria-hidden="true" aria-label="Search" />
      </button>
    </div>
  )
}

export default memo(Searchbar)
