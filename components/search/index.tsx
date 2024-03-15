import { useState, useEffect } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import axios from 'axios'
import { SEARCH_PROVIDER, NEXT_SEARCH_PRODUCTS, } from '@components/utils/constants'
import Link from 'next/link'
import { XMarkIcon, ChevronLeftIcon } from '@heroicons/react/24/outline'
import rangeMap from '@lib/range-map'
import { useRouter } from 'next/router'
import eventDispatcher from '@components/services/analytics/eventDispatcher'
import { EVENTS_MAP } from '@components/services/analytics/constants'
import { useUI } from '@components/ui/context'
import { BTN_SEARCH, IMG_PLACEHOLDER } from '@components/utils/textVariables'
import { generateUri } from '@commerce/utils/uri-util'
//import ElasticSearchBar from './ElasticSearchBar'
import ElasticSearch from './elastic/ElasticSearch'
import ElasticSearchResult from './elastic/ElasticSearchResult'
import { matchStrings } from '@framework/utils/parse-util'
import { SearchProvider } from '@framework/utils/enums'
import InstantSearchBar from './algolia/InstantSearchBar'
import { pushSearchToNavigationStack } from '@framework/utils/app-util'

export default function Search(props: any) {
  const { closeWrapper = () => { }, keywords, maxBasketItemsCount, deviceInfo } = props;
  const Router = useRouter()
  const [inputValue, setInputValue] = useState('')
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [path, setCurrentPath] = useState(Router.asPath)
  const SearchEvent = EVENTS_MAP.EVENT_TYPES.Search
  const SearchEntity = EVENTS_MAP.ENTITY_TYPES.Search
  
  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading(true)
      try {
        const response: any = await axios.post(NEXT_SEARCH_PRODUCTS, {
          value: inputValue,
        })
        setProducts(response?.data?.products)
        setIsLoading(false)
        eventDispatcher(SearchEvent, {
          entity: JSON.stringify({
            FreeText: inputValue,
            ResultCount: response?.data?.products?.length || 0,
          }),
          entityId: inputValue,
          entityName: inputValue,
          entityType: SearchEntity,
          eventType: SearchEvent,
        })
      } catch (error) {
        console.log(error)
        setIsLoading(false)
      }
    }
    if (inputValue.length > 2) fetchItems()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue])



  useEffect(() => {
    if (path !== Router.asPath) {
      closeWrapper()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Router.asPath])
  const css = { maxWidth: '100%', height: 'auto' }

  const defaultSearch = (
    <div className="fixed top-0 left-0 w-full h-full bg-white z-9999">
      <div
        className="absolute text-gray-900 cursor-pointer h-9 w-9 right-10 top-10 mobile-hidden"
        onClick={closeWrapper}
      >
        <XMarkIcon />
      </div>
      <div className="flex flex-col items-center justify-center w-full px-4 py-5 mt-4 sm:mt-10 sm:px-10">
        <div className="w-full mx-auto mb-4 sm:w-3/5">
          <div className="flex flex-row px-1 rounded-sm mob-center-align">
            <label className="hidden" htmlFor={'search-bar'}>
              {BTN_SEARCH}
            </label>
            <div className="hidden text-gray-900 cursor-pointer h-9 w-9 desktop-hidden mobile-visible" onClick={closeWrapper} >
              <ChevronLeftIcon />
            </div>
            <input id={'search-bar'} autoFocus className="w-full min-w-0 px-3 py-4 text-xl text-gray-700 placeholder-gray-500 bg-white border-0 border-b border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:ring-white focus:border-gray-700 search-input" placeholder={BTN_SEARCH} onChange={(e: any) => setInputValue(e.target.value)} />
            <div className="relative py-4 text-gray-400 right-10 mob-right-pos">
              <MagnifyingGlassIcon className="w-6 h-6" aria-hidden="true" />
            </div>
          </div>
        </div>
        <div className="grid w-full grid-cols-2 sm:w-3/5 sm:mx-0 md:grid-cols-3 lg:grid-cols-4 max-panel-search">
          {isLoading &&
            rangeMap(12, (i) => (
              <div key={i} className="mx-auto mt-20 rounded-md shadow-md w-60 h-72" >
                <div className="flex flex-row items-center justify-center h-full space-x-2 animate-pulse">
                  <div className="flex flex-col space-y-3">
                    <div className="w-full h-48 bg-gray-100 rounded-md "></div>
                    <div className="h-6 mt-40 bg-gray-100 rounded-md w-36 "></div>
                  </div>
                </div>
              </div>
            ))}
          {products?.map((product: any, idx: number) => {
            return (
              <div className="border-b border-r border-gray-200" key={idx} >
                <div className="relative p-4 group sm:p-2" onClick={closeWrapper}>
                  <Link passHref href={`/${product.slug}`}>
                    <div className="relative overflow-hidden bg-gray-200 rounded-lg aspect-w-1 aspect-h-1 group-hover:opacity-75"
                     onClick={() => {
                      if(inputValue){
                        const location = window.location
                        pushSearchToNavigationStack(`${location.pathname}${location.search}`, inputValue)
                      }
                     }}
                    >
                      <div className="image-container">
                        <img src={ generateUri( product.image, 'h=200&fm=webp' ) || IMG_PLACEHOLDER } alt={product.name || "product"} width={20} height={20} style={css} sizes="50vw" className="object-cover object-center w-full h-48 sm:h-72 image" />
                      </div>
                    </div>
                  </Link>

                  <div className="pt-4 pb-1 text-center">
                    <h3 className="text-sm font-medium text-gray-900">
                      <Link href={`/${product.slug}`}>
                        {product.name}
                      </Link>
                    </h3>

                    <p className="mt-1 font-medium text-gray-900">
                      {product?.price?.formatted?.withTax}
                    </p>

                    <div className="flex flex-col"></div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )

  const elasticSearch = (
    <ElasticSearchResult {...props} />
  )

  return (
    <>
      {
        matchStrings(SEARCH_PROVIDER!, SearchProvider.DEFAULT) && (
          <>{defaultSearch}</>
        )
      }
      {
        matchStrings(SEARCH_PROVIDER!, SearchProvider.ELASTIC) && (
          <>{elasticSearch}</>
        )
      }
      {
        matchStrings(SEARCH_PROVIDER!, SearchProvider.ALGOLIA) && (
          <InstantSearchBar maxBasketItemsCount={maxBasketItemsCount} deviceInfo={deviceInfo} />
        )
      }
    </>
  )
}
