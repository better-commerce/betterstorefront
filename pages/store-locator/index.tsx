import { useEffect, useState } from 'react'
import axios from 'axios'
import Layout from '@components/Layout/Layout'
import { NEXT_GET_ALL_STORES, SITE_NAME, SITE_ORIGIN_URL } from '@components/utils/constants'
import NextHead from 'next/head'
import { useRouter } from 'next/router'
import { useTranslation } from '@commerce/utils/use-translation'
import Link from 'next/link'
import MapWithMarkers from '@components/ui/Map/MultiMarker'
import { removeQueryString } from '@commerce/utils/uri-util'
export default function StoreLocatorPage() {
  const translate = useTranslation()
  let absPath = ''
  if (typeof window !== 'undefined') {
    absPath = window?.location?.href
  }
  const [allStores, setAllStores] = useState([])
  const router = useRouter()
  useEffect(() => {
    fetchAllStores()
  }, [])

  const fetchAllStores = async () => {
    try {
      const { data: allStoresResult }: any = await axios.post(NEXT_GET_ALL_STORES)
      setAllStores(allStoresResult)
    } catch (error) {
      setAllStores([])
    }
  }
  
  const cleanPath = removeQueryString(router.asPath)

  return (
    <>
      <NextHead>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <link rel="canonical" href={SITE_ORIGIN_URL + cleanPath} />
        <title>Stores</title>
        <meta name="title" content="Stores" />
        <meta name="description" content="Stores" />
        <meta name="keywords" content="Stores" />
        <meta property="og:image" content="" />
        <meta property="og:title" content="Stores" key="ogtitle" />
        <meta property="og:description" content="Stores" key="ogdesc" />
        <meta property="og:site_name" content={SITE_NAME} key="ogsitename" />
        <meta property="og:url" content={SITE_ORIGIN_URL + cleanPath} key="ogurl" />
      </NextHead>
      <div className='container py-4 mx-auto sm:py-10'>
        <h1 className="pb-6 text-2xl font-semibold text-left text-gray-900 sm:pb-8 sm:text-3xl">
          Find a Store near you
        </h1>
        <div className='grid grid-cols-1 mt-0 sm:gap-4 sm:grid-cols-12'>
          <div className='sm:col-span-4'>
            <div className='grid grid-cols-1 mt-0 sm:gap-2 sm:grid-cols-1'>
              {allStores?.length > 0 && allStores?.map((stores: any, storeIdx: number) => (
                <div className='flex flex-col w-full px-6 py-4 mb-4 border border-slate-200 bg-slate-100 rounded-2xl' key={`stores-${storeIdx}`}>
                  <div className='flex flex-col pt-4'>
                    <Link href={`/store-locator/${stores?.id}`} passHref>
                      <h2 className='font-semibold leading-7 hover:text-sky-800 text-slate-800 dark:text-slate-500 font-20'>{stores?.name} Branch</h2>
                    </Link>
                  </div>
                  <div className='grid grid-cols-1 gap-4 sm:grid-cols-1'>
                    <div className='sm:col-span-1'>
                      <div className='flex flex-col mb-2'>
                        <div className='flex flex-col gap-0 mt-2'>
                          <div dangerouslySetInnerHTML={{ __html: stores?.address1, }} className="text-sm text-gray-700 sm:block" />
                          <div dangerouslySetInnerHTML={{ __html: stores?.address2, }} className="text-sm text-gray-700 sm:block" />
                        </div>
                      </div>
                      <div className='flex flex-col mb-2'>
                        <h4 className='capitalize text-slate-800 font-16'>Telephone:</h4>
                        <div className='flex flex-col gap-0 mt-2'>
                          <span className='dark:text-black'>{stores?.phoneNo}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='flex flex-col flex-1'>
                    <Link className='text-left text-sky-600 hover:underline' passHref href={`/store-locator/${stores?.id}`}>Store Details</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className='sm:col-span-8'>
            <MapWithMarkers locations={allStores} />
          </div>

        </div>
      </div>
      <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyA1v3pkeBrwwbC-0KPCK5Uuhn77iHg2AjY&libraries=places"></script>
    </>
  )
}

StoreLocatorPage.Layout = Layout
