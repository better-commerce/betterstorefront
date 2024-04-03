
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
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

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
        {data?.length && data?.map((store: any, storeIdx: number) => {
          const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
          const currentDate = new Date();
          const currentDayIndex = currentDate.getDay();
          const currentDay = days[currentDayIndex];
          let openingHours = store?.openingHours;
          openingHours = openingHours.replace(/,/g, function (match:any) {
            return `<br/> ${currentDay} `;
          });
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
                <div className='flex items-center justify-start gap-1 mb-4 sm:mb-6'>
                  <Link href="/store-locator" passHref>
                    <span className="flex items-end font-14">Stores</span>
                  </Link>
                  <span>
                    <ChevronRightIcon className="w-3 h-3 text-slate-400" />
                  </span>
                  <span className='font-medium text-black font-14'>{store?.name} Branch</span>
                </div>
                {/* <iframe width="100%" height="300" src={`https://www.google.com/maps/embed/v1/view?key=GOOGLE_MAP_API_KEY&center=LONGITUDE,LATITUDE&zoom=15`}></iframe> */}
                <iframe width="100%" height="300" src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.2229138595875!2d${store?.longitude}!2d${store?.latitude}!3d12.972442654034205!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDIyJzA1LjYiTiA3NMKwMDInMjIuNyJF!5e0!3m2!1sen!2sus!4v1648926821092!5m2!1sen!2sus`}></iframe>
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
