import { useEffect, useState } from 'react'
import axios from 'axios'
import Layout from '@components/Layout/Layout'
import { NEXT_GET_ALL_STORES, SITE_NAME, SITE_ORIGIN_URL } from '@components/utils/constants'
import NextHead from 'next/head'
import { useRouter } from 'next/router'
import { useTranslation } from '@commerce/utils/use-translation'
import Link from 'next/link'
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
  return (
    <>
      <NextHead>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <link rel="canonical" href={SITE_ORIGIN_URL + router.asPath} />
        <title>Stores</title>
        <meta name="title" content="Stores" />
        <meta name="description" content="Stores" />
        <meta name="keywords" content="Stores" />
        <meta property="og:image" content="" />
        <meta property="og:title" content="Stores" key="ogtitle" />
        <meta property="og:description" content="Stores" key="ogdesc" />
        <meta property="og:site_name" content={SITE_NAME} key="ogsitename" />
        <meta property="og:url" content={absPath || SITE_ORIGIN_URL + router.asPath} key="ogurl" />
      </NextHead>
      <div className='container py-4 mx-auto sm:py-10'>
        <div className='grid grid-cols-1 mt-0 sm:gap-20 sm:grid-cols-3'>
          {allStores?.length > 0 && allStores?.map((stores: any, storeIdx: number) => (
            <div className='flex flex-col w-full' key={`stores-${storeIdx}`}>
              <div className='flex flex-col pt-4'>
                <Link href={`/store-locator/${stores?.id}`} passHref>
                  <h2 className='font-semibold leading-7 text-slate-800 dark:text-slate-500 font-20'>{stores?.name} Branch</h2>
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
    </>
  )
}

StoreLocatorPage.Layout = Layout
