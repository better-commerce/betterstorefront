import type { GetStaticPropsContext } from 'next'
import { GetServerSideProps } from 'next'
import { useEffect } from 'react'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import { Layout } from '@components/common'
import getBrands from '@framework/api/endpoints/catalog/brands'
import { useState } from 'react'
import Link from 'next/link'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { EVENTS_MAP } from '@components/services/analytics/constants'
import useAnalytics from '@components/services/analytics/useAnalytics'

const ALPHABET = '#abcdefghijklmnopqrstuvwxyz'

const dataNormalizr = (data: any = []) => {
  return data.reduce((acc: any, item: any) => {
    let ref = acc.findIndex(
      (i: any) => i.title.toLowerCase() === item.manufacturerName.charAt(0).toLowerCase()
    )
    if (ref >= 0) {
      acc[ref].results = [...acc[ref].results, item]
      return acc
    } else {
      acc = [
        ...acc,
        {
          title: item.manufacturerName.charAt(0),
          results: [item],
        },
      ]
      return acc
    }
  }, [])
}

function BrandsPage({ brands }: any) {
  const data = dataNormalizr(brands.results)
  const [normalizedBrands, setNormalizedBrands] = useState(data)
  const handleSearch = (value: any) => {
    const filteredData = data.filter((item: any) => {
      const result = item.results.find((brand: any) =>
        brand.manufacturerName.toLowerCase().includes(value.toLowerCase())
      )
      if (result) {
        return {
          title: item.title,
          results: [result],
        }
      }
    })
    setNormalizedBrands(filteredData)
  }
  const { BrandViewed } = EVENTS_MAP.EVENT_TYPES

  useAnalytics(BrandViewed, {
    eventType: BrandViewed,
    pageTitle: 'Brands',
  })
  useEffect(() => {}, [])
  const totalResults = normalizedBrands.map((i: any) => i.results).flat().length

  return (
    <div className="bg-white">
      {/* Mobile menu */}
      <main className="pb-24 mx-auto overflow-hidden max-w-7xl sm:px-6 lg:px-8">
        <div className="px-4 py-6 text-center sm:py-16 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Brands
          </h1>
          <h1 className="mt-2 font-medium tracking-tight text-gray-500 sm:text-xl text-md">
            {totalResults} results
          </h1>
          <div className="flex flex-wrap items-center justify-center w-full py-5">
            {ALPHABET.split('').map((letter: any, key: number) => {
              const brandExists = !!normalizedBrands.find(
                (brand: any) =>
                  brand.title.toUpperCase() === letter.toUpperCase()
              )
              if (brandExists) {
                return (
                  <Link key={key} passHref href={`#${letter.toUpperCase()}`}>
                    <span className="px-2 py-1 mt-2 mr-1 text-sm font-extrabold text-gray-900 border hover:bg-indigo-600 hover:text-white sm:mr-3 sm:mt-5 sm:py-2 sm:px-4 sm:text-lg">
                      {letter.toUpperCase()}
                    </span>
                  </Link>
                )
              }
              return (
                <span
                  key={key}
                  className="px-2 py-1 mt-2 mr-1 text-sm font-extrabold text-gray-900 border pointer-events-none sm:mr-3 sm:mt-5 sm:py-2 sm:px-4 sm:text-lg opacity-40"
                >
                  {letter.toUpperCase()}
                </span>
              )
            })}
          </div>
          <div className="flex items-center justify-center w-full py-5">
            <div className="flex flex-row w-1/3 px-4 py-2 border border-gray-300 rounded-md shadow-sm min-w-searchbar ">
              <label className="hidden" htmlFor={'search-bar'}>
                Search
              </label>
              <input
                id={'search-bar'}
                className="w-full min-w-0 text-gray-700 placeholder-gray-500 bg-white appearance-none focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                placeholder="Search..."
                onChange={(e: any) => handleSearch(e.target.value)}
              />
              <div className="text-gray-400">
                <MagnifyingGlassIcon className="w-6 h-6" aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>
        {normalizedBrands.map((brand: any, idx: number) => {
          return (
            <div
              key={idx}
              className="flex flex-col px-4 py-4 border-t sm:px-6 lg:px-8 sm:py-10"
            >
              <h2
                id={brand.title.toUpperCase()}
                className="text-2xl font-extrabold text-gray-900 sm:text-4xl"
              >
                {brand.title.toUpperCase()}
              </h2>
              <div className="flex flex-wrap items-center justify-between py-0 sm:py-2">
                {brand.results.map((result: any, key: number) => {
                  return (
                    <div
                      key={key}
                      style={{ flex: '0 0 33.333333%' }}
                      className="flex text-gray-900 sm:inline-flex "
                    >
                      <Link
                        passHref
                        href={{
                          pathname: `/${result.link}`,
                          query: {
                            id: result.id,
                          },
                        }}
                      >
                        <span className="py-2 text-sm cursor-pointer sm:text-lg sm:py-5 hover:underline">
                          {result.manufacturerName}
                        </span>
                      </Link>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </main>
    </div>
  )
}

export async function getStaticProps({
  params,
  locale,
  locales,
  preview,
}: GetStaticPropsContext) {
  const response = await getBrands({})
  return {
    props: {
      brands: response.result,
      snippets: response.snippets,
    },
    revalidate: 200,
  }
}
/*
export const getServerSideProps: GetServerSideProps = async (context) => {
  const response = await getBrands({})
    //CAN WE PUT SOME CODE HERE TO EXEC AFTER GETBRANDS ???
  return {
    props: {
      brands: response.result,
      snippets: response.snippets,
    }, // will be passed to the page component as props
  }
}
*/
BrandsPage.Layout = Layout

const PAGE_TYPE = PAGE_TYPES['Brand']

export default withDataLayer(BrandsPage, PAGE_TYPE)
