import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import { Layout } from '@components/common'
import Link from 'next/link'
import type { GetStaticPropsContext } from 'next'
import getLookbooks from '@framework/api/content/lookbook'
import { Swiper, SwiperSlide } from 'swiper/react'
import useAnalytics from '@components/services/analytics/useAnalytics'
import { EVENTS_MAP } from '@components/services/analytics/constants'
import 'swiper/css'
import 'swiper/css/navigation'

import SwiperCore, { Navigation } from 'swiper'

SwiperCore.use([Navigation])

const IMG_PLACEHOLDER =
  'https://images.unsplash.com/photo-1640767514388-eef1b79eb036'

const DESCRIPTION_PLACEHOLDER =
  'My ideal home is a personalized handpicked furniture items set that gives you the touch of royalty and the feel of contemporary world yet keeping your living area cool and peace making.'

function LookbookPage({ data }: any) {
  const { PageViewed } = EVENTS_MAP.EVENT_TYPES
  const {} = EVENTS_MAP.ENTITY_TYPES

  useAnalytics(PageViewed, {
    eventType: PageViewed,
    pageCategory: 'Lookbook',
    omniImg: data[0].image,
  })

  return (
    <div className="mt-8 relative mb-5">
      <div className="text-center py-16 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
          Shop by Lifestyle
        </h1>
        <h1 className="text-xl mt-2 font-bold tracking-tight text-gray-500">
          {data.length} results
        </h1>
      </div>
      <div className="relative w-full overflow-x-auto">
        <Swiper
          slidesPerView={1.5}
          loopFillGroupWithBlank={true}
          loop={true}
          navigation={true}
        >
          <ul
            role="list"
            className="mx-4 inline-flex space-x-8 sm:mx-6 lg:mx-0 lg:space-x-0 lg:grid lg:grid-cols-4 lg:gap-x-8"
          >
            {data?.map((lookbook: any) => (
              <SwiperSlide className="px-5" key={lookbook.slug}>
                <li
                  key={lookbook.id}
                  className="w-64 inline-flex flex-col text-center lg:w-auto"
                >
                  <div className="group relative flex flex-col sm:flex-row justify-between items-center">
                    <div className="w-full bg-gray-200 rounded-md overflow-hidden aspect-w-1 aspect-h-1">
                      <img
                        src={lookbook.mainImage || IMG_PLACEHOLDER}
                        alt={lookbook.name}
                        className="w-full h-full object-center object-cover hover:opacity-75"
                      />
                    </div>
                    <div className="w-full sm:w-1/2 p-5 flex justify-between flex-col items-center">
                      <h3 className="font-extrabold w-full text-left text-2xl sm:text-4xl text-gray-900">
                        {lookbook.name}
                      </h3>
                      <p className="text-md sm:text-lg py-5 text-gray-900 text-left">
                        {DESCRIPTION_PLACEHOLDER}
                      </p>
                      <Link href={`/${lookbook.slug}`}>
                        <button
                          type="button"
                          className="mt-5 cursor-pointer font-extrabold border border-gray-900 text-gray-900 py-3 px-3"
                        >
                          Shop lookbook
                        </button>
                      </Link>
                    </div>
                  </div>
                </li>
              </SwiperSlide>
            ))}
          </ul>
        </Swiper>
      </div>
    </div>
  )
}

LookbookPage.Layout = Layout

const PAGE_TYPE = PAGE_TYPES['Page']

export async function getStaticProps({
  params,
  locale,
  locales,
  preview,
}: GetStaticPropsContext) {
  const lookbookData = await getLookbooks()
  return {
    props: {
      data: lookbookData,
    },
    revalidate: 200,
  }
}

export default withDataLayer(LookbookPage, PAGE_TYPE)
