import type { GetStaticPropsContext } from 'next'
import NextHead from 'next/head'
import { useEffect } from 'react'
import withDataLayer, { PAGE_TYPES } from '@new-components/withDataLayer'
import Layout from '@new-components/Layout/Layout'
import getBrands from '@framework/api/endpoints/catalog/brands'
import { useState } from 'react'
import { useTranslation } from '@commerce/utils/use-translation'
import Link from 'next/link'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { EVENTS_MAP } from '@new-components/services/analytics/constants'
import useAnalytics from '@new-components/services/analytics/useAnalytics'
import { BETTERCOMMERCE_DEFAULT_LANGUAGE, SITE_ORIGIN_URL } from '@new-components/utils/constants'
import { useRouter } from 'next/router'
import { STATIC_PAGE_CACHE_INVALIDATION_IN_MINS } from '@framework/utils/constants'
import { getDataByUID, parseDataValue, setData } from '@framework/utils/redis-util'
import { Redis } from '@framework/utils/redis-constants'
import { getSecondsInMinutes } from '@framework/utils/parse-util'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const ALPHABET = '#abcdefghijklmnopqrstuvwxyz'

const dataNormalizr = (data: any = []) => {

  return data.reduce((acc: any, item: any) => {
    let ref = acc.findIndex(
      (i: any) =>
        i.title.toLowerCase() === item.manufacturerName.charAt(0).toLowerCase()
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
  const router = useRouter()
  const data = dataNormalizr(brands.results)
  const translate = useTranslation()
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
  useEffect(() => { }, [])

  function handleScrollView(letter: any) {
    window.location.href = `#${letter.target.text?.toUpperCase()}`
    window.scrollBy(0, -100)
  }

  const totalResults = normalizedBrands.map((i: any) => i.results).flat().length
  let absPath = ''
  if (typeof window !== 'undefined') {
    absPath = window?.location?.href
  }
  return (
    <>
      <NextHead>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5"
        />
        <link rel="canonical" href={SITE_ORIGIN_URL + router.asPath} />
        <title>{translate('common.label.brandsText')}</title>
        <meta name="title" content={translate('common.label.brandsText')} />
        <meta name="description" content={translate('common.label.brandsText')} />
        <meta name="keywords" content={translate('common.label.brandsText')} />
        <meta property="og:image" content="" />
        <meta property="og:title" content={translate('common.label.brandsText')} key="ogtitle" />
        <meta property="og:description" content={translate('common.label.brandsText')} key="ogdesc" />
      </NextHead>
      <div className="bg-white">
        {/* Mobile menu */}
        <main className="container pb-24 mx-auto overflow-hidden">
          <div className="px-4 py-6 text-center sm:py-16 sm:px-6 lg:px-6">
            <h1 className="text-2xl font-semibold text-gray-900 sm:text-5xl">
              {translate('common.label.brandsText')}
            </h1>
            <div className="flex flex-wrap items-center justify-center w-full py-5 mx-auto sm:w-4/5">
              {ALPHABET.split('').map((letter: any, key: number) => {
                const brandExists = !!normalizedBrands.find((brand: any) => brand.title.toUpperCase() === letter.toUpperCase())
                if (brandExists) {
                  return (
                    <div className="flex" key={`brand-letter-${key}`}>
                      <a onClick={(letter: any) => { handleScrollView(letter) }} className="grid items-center justify-center w-8 h-8 mt-1 mr-1 text-sm font-semibold text-gray-900 border cursor-pointer sm:w-12 sm:h-12 hover:bg-slate-600 rounded-xl bg-slate-50 border-slate-400 hover:text-white sm:mr-3 sm:mt-5 sm:text-lg" >
                        {letter.toUpperCase()}
                      </a>
                    </div>
                  )
                }
                return (
                  <span key={key} className="grid items-center justify-center w-8 h-8 mt-1 mr-1 text-sm font-semibold border cursor-not-allowed sm:w-12 sm:h-12 text-slate-300 hover:bg-slate-100 rounded-xl bg-slate-100 border-slate-200 sm:mr-3 sm:mt-5 sm:text-lg" >
                    {letter.toUpperCase()}
                  </span>
                )
              })}
            </div>
            <div className="flex items-center justify-center w-full py-5">
              <div className="flex flex-row w-1/3 px-4 py-2 border border-gray-300 rounded-md shadow-sm min-w-searchbar ">
                <label className="hidden" htmlFor={'search-bar'}>
                  {translate('label.search.searchText')}
                </label>
                <input id={'search-bar'} className="w-full min-w-0 text-gray-700 placeholder-gray-500 bg-white border-0 appearance-none" placeholder="Search..." onChange={(e: any) => handleSearch(e.target.value)} />
                <div className="relative text-gray-400 top-2">
                  <MagnifyingGlassIcon className="w-6 h-6" aria-hidden="true" />
                </div>
              </div>
            </div>
          </div>
          <div className='grid grid-cols-1 gap-10 mx-auto sm:grid-cols-3 sm:w-4/5'>
            {normalizedBrands.map((brand: any, idx: number) => (
              <div key={`brands-${idx}`} className="flex flex-col mb-6 sm:mb-6">
                <h2 id={brand.title.toUpperCase()} className="pb-3 mb-3 text-2xl font-semibold text-gray-900 border-b-2 sm:text-5xl border-sky-700">
                  {brand.title.toUpperCase()}
                </h2>
                <div className="flex flex-col gap-2">
                  {brand.results.map((brands: any, brandIdx: number) => (
                    <div key={`brand-list-${brandIdx}`} className="flex text-gray-900 sm:inline-flex" >
                      <Link passHref href={brands.link}>
                        <span className="py-2 text-sm capitalize cursor-pointer sm:text-lg sm:py-5 hover:text-sky-700 hover:underline hover:font-medium">
                          {brands?.manufacturerName.toLowerCase()}
                        </span>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </>
  )
}

export async function getStaticProps({
  params,
  locale,
  locales,
  preview,
}: GetStaticPropsContext) {
  const cachedDataUID = {
    brandsUID: Redis.Key.Brands.Brand,
  }
  const cachedData = await getDataByUID([
    cachedDataUID.brandsUID,
  ])
  let brandsUIDData: any = parseDataValue(cachedData, cachedDataUID.brandsUID)
  if (!brandsUIDData) {
    brandsUIDData = await getBrands({})
    await setData([{ key: cachedDataUID.brandsUID, value: brandsUIDData }])
  }

  return {
    props: {
      ...(await serverSideTranslations(locale ?? BETTERCOMMERCE_DEFAULT_LANGUAGE!)),
      brands: brandsUIDData?.result,
      snippets: brandsUIDData?.snippets ?? [],
    },
    revalidate: getSecondsInMinutes(STATIC_PAGE_CACHE_INVALIDATION_IN_MINS)
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
