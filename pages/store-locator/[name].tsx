
import type { GetStaticPropsContext } from 'next'
import getAllStores from '@framework/storeLocator/getAllStores'
import dynamic from 'next/dynamic';
import NextHead from 'next/head'
import { useRouter } from 'next/router'
const BreadCrumbs = dynamic(() => import('@components/ui/BreadCrumbs'));
import { SITE_ORIGIN_URL } from '@components/utils/constants'
import { getSecondsInMinutes } from '@framework/utils/parse-util'
import { STATIC_PAGE_CACHE_INVALIDATION_IN_MINS } from '@framework/utils/constants'
import Layout from '@components/Layout/Layout';
import { IMG_PLACEHOLDER } from '@components/utils/textVariables';
import Link from 'next/link';

interface Props {
  data: any
}

export default function StoreLocatorDetailsPage({ data }: Props) {
  const router = useRouter()
  let absPath = ''
  if (typeof window !== 'undefined') {
    absPath = window?.location?.href
  }

  const ids = router?.query?.name
  let branchName = data?.find((i: any) => i.id === ids)
  const breadcrumbData: any = [{
    slugType: 'Home', slug: {
      title: 'Branch', slug: '/branch', childSlug: {
        title: branchName?.name,
        slug: '',
        childSlug: null,
      }
    }
  }]

  return (
    <>
      <div className="container py-10 mx-auto">
        {/* <div className="mx-auto mb-4 2xl:w-4/5 2xl:px-0 sm:mb-6">
          <BreadCrumbs items={breadcrumbData} currentProduct={''} />
        </div> */}
        {data?.length && data?.map((store: any, storeIdx: number) => {
          const mapUrl = store?.id == '35c3eae6-fe55-ee11-b1c4-000d3a211cf7' ? 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d2502.70845320819!2d0.8538179592468076!3d51.15072722744828!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47deda3beeb4d633%3A0x810bc7066354893a!2sFFX+Ashford!5e0!3m2!1sen!2suk!4v1424179058640' : 'https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d3333.12202896661!2d1.166945338012787!3d51.09627710260628!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1sffx.folkestone!5e0!3m2!1sen!2suk!4v1535705944120'
          return (
            store?.id == ids &&
            <>
              <NextHead>
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
                <link rel="canonical" href={SITE_ORIGIN_URL + router.asPath} />
                <title>{store?.name}</title>
                <meta name="title" content={store?.name} />
                <meta name="description" content={store?.name} />
                <meta name="keywords" content={store?.name} />
                <meta property="og:image" content="" />
                <meta property="og:title" content={store?.name} key="ogtitle" />
                <meta property="og:description" content={store?.name} key="ogdesc" />
              </NextHead>
              <div className='flex flex-col' key={`store-detail-${storeIdx}`}>
                <Link href="/store-locator" passHref>
                  <span className="flex items-end mb-4 upper case font-12">Stores</span>
                </Link>
                <iframe width="100%"
                  height="300"
                  src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.2229138595875!2d${store?.longitude}!2d${store?.latitude}!3d12.972442654034205!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDIyJzA1LjYiTiA3NMKwMDInMjIuNyJF!5e0!3m2!1sen!2sus!4v1648926821092!5m2!1sen!2sus`}>
                </iframe>
                <h1 className='w-full my-4 font-semibold text-left font-24'>{store?.name} Branch</h1>
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                  <div className='sm:col-span-1'>
                    <div className='flex flex-col mb-8'>
                      <h4 className='font-semibold underline'>Address</h4>
                      <div className='flex flex-col gap-0 mt-2'>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: store?.address1,
                          }}
                          className="text-sm text-gray-700 sm:block"
                        />
                        <div
                          dangerouslySetInnerHTML={{
                            __html: store?.address2,
                          }}
                          className="text-sm text-gray-700 sm:block"
                        />
                      </div>
                    </div>
                    <div className='flex flex-col mb-8'>
                      <h4 className='font-semibold underline'>Telephone Lines</h4>
                      <div className='flex flex-col gap-0 mt-2'>
                        <span>{store?.phoneNo}</span>
                      </div>
                    </div>
                    <div className='flex flex-col mb-8'>
                      <h4 className='font-semibold underline'>Opening Hours</h4>
                      <div className='flex flex-col gap-0 mt-2'>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: store?.openingHours,
                          }}
                          className="text-sm text-gray-700 sm:block"
                        />
                      </div>
                    </div>
                  </div>
                  <div className='sm:col-span-1'>
                    {store?.distanceUnit != null &&
                      <div className='flex flex-col my-8'>
                        <h4 className='font-semibold underline'>Directions to {store?.name} Branch</h4>
                        <div className='flex flex-col gap-0 mt-2'>
                          <span>{store?.distanceUnit}</span>
                        </div>
                      </div>
                    }
                    {store?.offers != null &&
                      <div className='flex flex-col mb-8'>
                        <h4 className='font-semibold underline'>Events</h4>
                        <div className='flex flex-col gap-0 mt-2'>
                          <span>{store?.offers}</span>
                        </div>
                      </div>
                    }
                  </div>
                </div>
              </div>
            </>
          )
        })}
      </div>
    </>
  )
}

export async function getStaticPaths() {
  const response = await getAllStores()
  return {
    paths: (response && response?.id) ? [`/store-locator/${response?.id}`] : [],
    fallback: 'blocking',
  }
}

export async function getStaticProps({ params }: GetStaticPropsContext) {
  const response = await getAllStores()
  return {
    props: {
      data: response
    },
    revalidate: getSecondsInMinutes(STATIC_PAGE_CACHE_INVALIDATION_IN_MINS),
  }
}

StoreLocatorDetailsPage.Layout = Layout
