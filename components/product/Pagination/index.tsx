// @ts-ignore
import ReactPaginate from 'react-paginate'
import { FC } from 'react'
import classNames from 'classnames'

interface Props {
  currentPage?: string | number
  onPageChange?: any
  pageCount?: string | number
}
const Pagination: FC<React.PropsWithChildren<Props>> = ({
  currentPage = '1',
  onPageChange = () => { },
  pageCount = 20,
}) => {
  return (
    <>
      <ReactPaginate
        previousLabel={'<'}
        previousClassName={classNames(Number(currentPage) === 1 ? 'cursor-not-allowed opacity-30' : '', `px-1 py-1 mr-2`)}
        nextClassName={classNames(Number(currentPage) === pageCount ? 'cursor-not-allowed opacity-30' : '', "px-1 py-1 ml-2")}
        nextLabel={'>'}
        breakLabel={'...'}
        breakClassName={'inline-flex items-center text-gray-500 px-1.5 h-10'}
        pageCount={Number(pageCount)}
        marginPagesDisplayed={1}
        pageRangeDisplayed={5}
        initialPage={Number(currentPage) - 1}
        disableInitialCallback={true}
        pageClassName="px-1 py-1"
        activeLinkClassName="inline-flex items-center px-2 h-8 sm:px-4 sm:h-10 border border-indigo-600 ring-1 ring-indigo-600 rounded-md bg-white hover:bg-gray-100 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-offset-1 focus:ring-offset-indigo-600 focus:ring-indigo-600 focus:ring-opacity-25"
        pageLinkClassName={
          'inline-flex items-center px-2 h-8 sm:px-4 sm:h-10 border border-gray-300 rounded-md bg-white hover:bg-gray-100 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-offset-1 focus:ring-offset-indigo-600 focus:ring-indigo-600 focus:ring-opacity-25'
        }
        hrefBuilder={(pageIndex: number, pageCount: number, selectedPage: number) => {
          if (typeof window !== "undefined") {
            return `${window.location.pathname}?currentPage=${pageIndex}`
          }
          return `#`
        }}
        onPageChange={onPageChange}
        containerClassName={
          'w-full mx-auto px-4 my-6 flex justify-center items-center text-sm font-medium text-gray-700 sm:px-6 lg:px-8 pagination-ul'
        }
      />
    </>
  )
}

export default Pagination
