import type { GetStaticPropsContext } from 'next'
import NextHead from 'next/head'
import { useEffect, useState } from 'react'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import Layout from '@components/Layout/Layout'
import getBrands from '@framework/api/endpoints/catalog/brands'
import { useTranslation } from '@commerce/utils/use-translation'
import Link from 'next/link'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { EVENTS_MAP } from '@components/services/analytics/constants'
import useAnalytics from '@components/services/analytics/useAnalytics'
import { SITE_ORIGIN_URL } from '@components/utils/constants'
import { useRouter } from 'next/router'
import { Cookie, STATIC_PAGE_CACHE_INVALIDATION_IN_MINS } from '@framework/utils/constants'
import { getDataByUID, parseDataValue, setData } from '@framework/utils/redis-util'
import { Redis } from '@framework/utils/redis-constants'
import { getSecondsInMinutes } from '@framework/utils/parse-util'
import { IPagePropsProvider } from '@framework/contracts/page-props/IPagePropsProvider'
import { getPagePropType, PagePropType } from '@framework/page-props'
import { AnalyticsEventType } from '@components/services/analytics'

const ALPHABET = '#abcdefghijklmnopqrstuvwxyz'

const dataNormalize = (data: any = []) => {
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
  const { recordAnalytics } = useAnalytics()
  const router = useRouter()
  const data = dataNormalize(brands.results)
  const translate = useTranslation()
  const [normalizedBrands, setNormalizedBrands] = useState(data)
  const handleSearch = (value: any) => {
    if (!value) {
      setNormalizedBrands(data)
      return
    }

    const filteredData = data.map((item: any) => {
      const matchedResults = item.results.filter((brand: any) =>
        brand.manufacturerName.toLowerCase().includes(value.toLowerCase())
      )
      return {
        title: item.title,
        results: matchedResults,
      }
    }).filter((item: any) => item.results.length > 0)

    setNormalizedBrands(filteredData)
  }

  useAnalytics(AnalyticsEventType.ALL_BRANDS_VIEWED, { })

  function handleScrollView(letter: any) {
    letter?.preventDefault()
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
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
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
        <main className="container pb-24 mx-auto overflow-hidden theme-account-container">
          <div className="py-6 text-center sm:py-16">
            <h1 className="text-2xl font-semibold text-gray-900 sm:text-5xl">
              {translate('common.label.brandsText')}
            </h1>
            <div className="flex flex-wrap items-center justify-center w-full py-5">
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
              <div className="flex flex-row w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm sm:w-1/3 min-w-searchbar ">
                <label className="hidden" htmlFor={'search-bar'}>
                  {translate('label.search.searchText')}
                </label>
                <input id={'search-bar'} className="w-full min-w-0 text-gray-700 placeholder-gray-500 bg-white border-0 appearance-none focus:border-0 active:border-0 focus:outline-none active:outline-none" placeholder={`${translate('label.search.searchText')}...`} onChange={(e: any) => handleSearch(e.target.value)} />
                <div className="relative text-gray-400 top-2">
                  <MagnifyingGlassIcon className="w-6 h-6" aria-hidden="true" />
                </div>
              </div>
            </div>
          </div>
          <div className='grid grid-cols-1 gap-10 sm:grid-cols-3'>
            {normalizedBrands.map((brand: any, idx: number) => (
              <div key={`brands-${idx}`} className="flex flex-col mb-6 sm:mb-6">
                <h2 id={brand.title.toUpperCase()} className="pb-3 mb-3 text-2xl font-semibold text-gray-900 border-b-2 sm:text-5xl border-sky-700">
                  {brand.title.toUpperCase()}
                </h2>
                <div className="flex flex-col gap-3">
                  {brand.results.map((brands: any, brandIdx: number) => (
                    brands?.isActive &&
                    <div key={`brand-list-${brandIdx}`} className="flex w-full text-gray-900 sm:inline-flex" >
                      <Link passHref href={brands.link}>
                        <span className="w-full text-sm capitalize cursor-pointer sm:text-lg hover:text-sky-700 hover:underline hover:font-medium">
                          {brands?.manufacturerName.toLowerCase()}
                        </span>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </main >
      </div >
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
    brandsUIDData = await getBrands({},{ [Cookie.Key.LANGUAGE]: locale })
    await setData([{ key: cachedDataUID.brandsUID, value: brandsUIDData }])
  }

  const props: IPagePropsProvider = getPagePropType({ type: PagePropType.COMMON })
  const pageProps = await props.getPageProps({ cookies: { [Cookie.Key.LANGUAGE]: locale } })

  return {
    props: {
      ...pageProps,
      brands: brandsUIDData?.result || { results: new Array<any>() },
      snippets: brandsUIDData?.snippets ?? [],
    },
    revalidate: getSecondsInMinutes(STATIC_PAGE_CACHE_INVALIDATION_IN_MINS)
  }
}
BrandsPage.Layout = Layout

const PAGE_TYPE = PAGE_TYPES['Brand']

export default withDataLayer(BrandsPage, PAGE_TYPE)
