import { FC, memo, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { SearchIcon } from '@heroicons/react/outline'
import { Transition } from '@headlessui/react'
interface Props {
  id?: string
}

const Searchbar: FC<Props> = ({ id = 'search' }) => {
  const [isSearchOpen, setSearchOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    router.prefetch('/search')
  }, [router])

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault()

    if (e.key === 'Enter') {
      const q = e.currentTarget.value

      router.push(
        {
          pathname: `/search`,
          query: q ? { q } : {},
        },
        undefined,
        { shallow: true }
      )
    }
  }

  const handleSearchInput = () => setSearchOpen(!isSearchOpen)

  return (
    <div className="flex flex-row">
      <Transition show={isSearchOpen} className="px-5">
        <label className="hidden" htmlFor={id}>
          Search
        </label>
        <input
          id={id}
          className="text-gray-700 appearance-none min-w-0 w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-4 placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          placeholder="Search..."
          defaultValue={router.query.q}
          onKeyUp={handleKeyUp}
        />
      </Transition>
      <button
        onClick={handleSearchInput}
        className="p-2 text-gray-400 hover:text-gray-500"
      >
        <span className="sr-only">Search</span>
        <SearchIcon className="w-6 h-6" aria-hidden="true" />
      </button>
    </div>
  )
}

export default memo(Searchbar)
