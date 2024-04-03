
import type { GetStaticPropsContext } from 'next'
import getAllStores from '@framework/storeLocator/getAllStores'
import dynamic from 'next/dynamic';
import NextHead from 'next/head'
import { useRouter } from 'next/router'
import { SITE_ORIGIN_URL } from '@components/utils/constants'
import { getSecondsInMinutes } from '@framework/utils/parse-util'
import { GOOGLE_MAP_API_KEY, STATIC_PAGE_CACHE_INVALIDATION_IN_MINS } from '@framework/utils/constants'
import Layout from '@components/Layout/Layout';
import Link from 'next/link';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import MapWithMarker from '@components/ui/Map/Marker';
import { removeQueryString } from '@commerce/utils/uri-util';
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
  const mapStyles = {
    height: '400px',
    width: '100%'
  };
  const cleanPath = removeQueryString(router.asPath)

  return (
    <>
      <div className="container py-10 mx-auto">
        {data?.length && data?.map((store: any, storeIdx: number) => {
          let openingHours = store?.openingHours;
          openingHours = openingHours.replace(/,/g, "<br/>");
          const defaultCenter = {
            lat: parseFloat(store?.latitude),
            lng: parseFloat(store?.longitude)
          };
          return (
            store?.id == ids &&
            <>
              <NextHead>
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
                <link rel="canonical" href={SITE_ORIGIN_URL + cleanPath} />
                <title>{store?.name}</title>
                <meta name="title" content={store?.name} />
                <meta name="description" content={store?.name} />
                <meta name="keywords" content={store?.name} />
                <meta property="og:image" content="" />
                <meta property="og:title" content={store?.name} key="ogtitle" />
                <meta property="og:description" content={store?.name} key="ogdesc" />
              </NextHead>
              <div className='flex flex-col' key={`store-detail-${storeIdx}`}>
                <div className='flex items-center justify-start gap-1 mb-4 sm:mb-6'>
                  <Link href="/store-locator" passHref>
                    <span className="flex items-end font-14">Stores</span>
                  </Link>
                  <span>
                    <ChevronRightIcon className="w-3 h-3 text-slate-400" />
                  </span>
                  <span className='font-medium text-black font-14'>{store?.name} Branch</span>
                </div>
                <MapWithMarker latitude={defaultCenter?.lat} longitude={defaultCenter?.lng} />
                <h1 className='w-full pt-6 my-4 font-semibold text-left font-24'>{store?.name} Branch</h1>
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                  <div className='sm:col-span-1'>
                    <div className='flex flex-col mb-8'>
                      <h4 className='font-semibold underline'>Address</h4>
                      <div className='flex flex-col gap-0 mt-2'>
                        <div dangerouslySetInnerHTML={{ __html: store?.address1, }} className="text-sm text-gray-700 sm:block" />
                        <div dangerouslySetInnerHTML={{ __html: store?.address2, }} className="text-sm text-gray-700 sm:block" />
                      </div>
                    </div>
                    <div className='flex flex-col mb-8'>
                      <h4 className='font-semibold underline'>Telephone Lines</h4>
                      <div className='flex flex-col gap-0 mt-2'>{store?.phoneNo}</div>
                    </div>
                    <div className='flex flex-col mb-8'>
                      <h4 className='font-semibold underline'>Opening Hours</h4>
                      <div className='flex flex-col gap-2 mt-2'>
                        <div dangerouslySetInnerHTML={{ __html: openingHours }} className="text-sm text-gray-700 sm:block" />
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
      <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyA1v3pkeBrwwbC-0KPCK5Uuhn77iHg2AjY&libraries=places"></script>

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
