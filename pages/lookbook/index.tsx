import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import { Layout } from '@components/common'
import Link from 'next/link'
import Image from 'next/image'
import type { GetStaticPropsContext } from 'next'
import getLookbooks from '@framework/api/content/lookbook'
import { Swiper, SwiperSlide } from 'swiper/react'
import useAnalytics from '@components/services/analytics/useAnalytics'
import { EVENTS_MAP } from '@components/services/analytics/constants'
import 'swiper/css'
import 'swiper/css/navigation'
import {
  IMG_PLACEHOLDER,
  RESULTS,
  SHOP_BY_LIFESTYLRE,
  SHOP_THE_LOOK,
} from '@components/utils/textVariables'
import SwiperCore, { Navigation } from 'swiper'
import commerce from '@lib/api/commerce'
import { generateUri } from '@commerce/utils/uri-util'

SwiperCore.use([Navigation])

function LookbookPage({ data }: any) {
  const { PageViewed } = EVENTS_MAP.EVENT_TYPES
  const {} = EVENTS_MAP.ENTITY_TYPES

  useAnalytics(PageViewed, {
    eventType: PageViewed,
    pageCategory: 'Lookbook',
    omniImg: (data?.length) ? data[0]?.image : IMG_PLACEHOLDER,
  })

  const css = { maxWidth: '100%', height: 'auto' }
  return (
    <div className="relative mt-6 mb-5">
      <div className="px-4 pt-0 pb-6 text-left sm:px-0 lg:px-0">
        <h1 className="w-full mx-auto text-3xl font-semibold tracking-tight text-black sm:w-4/5">
          {SHOP_BY_LIFESTYLRE}
        </h1>
        <h1 className="w-full mx-auto mt-2 font-normal tracking-tight text-gray-500 sm:w-4/5 text-md">
          {data.length} {RESULTS}
        </h1>
      </div>
      {data.length > 0 && (
        <div className="relative w-full overflow-x-auto">
          <Swiper
            slidesPerView={1.5}
            loopFillGroupWithBlank={true}
            loop={true}
            navigation={true}
          >
            <ul
              role="list"
              className="inline-flex mx-4 space-x-8 sm:mx-6 lg:mx-0 lg:space-x-0 lg:grid lg:grid-cols-4 lg:gap-x-8"
            >
              {data?.map((lookbook: any) => (
                <SwiperSlide className="pr-5" key={lookbook.slug}>
                  <li
                    key={lookbook.id}
                    className="inline-flex flex-col w-64 text-center lg:w-auto"
                  >
                    <div className="relative flex flex-col items-center justify-between group sm:flex-row">
                      <div className="w-full overflow-hidden bg-gray-200 rounded-sm aspect-w-1 aspect-h-1">
                        <div className="image-container">
                          <Image
                            src={
                              generateUri(lookbook.mainImage, 'h=1200&fm=webp') || IMG_PLACEHOLDER
                            }
                            alt={lookbook.name}
                            className="object-cover object-center w-auto h-96 hover:opacity-75 sm:min-h-screen sm:max-h-screen image"
                            fill
                          ></Image>
                        </div>
                      </div>
                      <div className="flex flex-col items-center w-full p-5 sm:w-1/2 justify-left">
                        <h3 className="w-full text-xl font-semibold text-left text-gray-900 sm:text-3xl">
                          {lookbook.name}
                        </h3>
                        <p className="py-5 text-left text-gray-500 text-md sm:text-md line-clip-7">
                          {lookbook.description}
                        </p>
                        <Link href={`/${lookbook.slug}`} passHref>
                          <button
                            type="button"
                            className="flex-col justify-start px-5 py-2 mt-6 font-semibold text-gray-900 uppercase border border-gray-900 cursor-pointer align-left hover:bg-gray-100"
                          >
                            {SHOP_THE_LOOK}
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
      )}
      {data.length == 0 && (
        <>
          <div className="flex flex-col py-32 text-center">
            <h2 className="w-full mx-auto text-4xl font-bold text-gray-200">
              No Lookbook Available
            </h2>
          </div>
        </>
      )}
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

  const infraPromise = commerce.getInfra()
  const infra = await infraPromise

  return {
    props: {
      data: lookbookData,
      globalSnippets: infra?.snippets ?? [],
      snippets: [],
    },
    revalidate: 200,
  }
}

export default withDataLayer(LookbookPage, PAGE_TYPE)
