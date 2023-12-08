import type { GetStaticPropsContext, InferGetStaticPropsType } from 'next'

import commerce from '@lib/api/commerce'
import { getSecondsInMinutes } from '@framework/utils/parse-util'
import { STATIC_PAGE_CACHE_INVALIDATION_IN_MINS } from '@framework/utils/constants'

export async function getSearchStaticProps({
  preview,
  locale,
  locales,
}: GetStaticPropsContext) {
  const config = { locale, locales }
  const pagesPromise = commerce.getAllPages({ config, preview })
  const siteInfoPromise = commerce.getSiteInfo({ config, preview })
  const { pages } = await pagesPromise
  const { categories, brands } = await siteInfoPromise
  return {
    props: {
      pages,
      categories,
      brands,
    },
    revalidate: getSecondsInMinutes(STATIC_PAGE_CACHE_INVALIDATION_IN_MINS), //200,
  }
}

export type SearchPropsType = InferGetStaticPropsType<
  typeof getSearchStaticProps
>
