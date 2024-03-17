import type { GetStaticPropsContext, InferGetStaticPropsType } from 'next'

import commerce from '@lib/api/commerce'
import { STATIC_PAGE_CACHE_INVALIDATION_IN_200_SECONDS } from '@framework/utils/constants'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { BETTERCOMMERCE_DEFAULT_LANGUAGE } from '@components/utils/constants'

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
      ...(await serverSideTranslations(locale ?? BETTERCOMMERCE_DEFAULT_LANGUAGE!)),
      pages,
      categories,
      brands,
    },
    revalidate: STATIC_PAGE_CACHE_INVALIDATION_IN_200_SECONDS
  }
}

export type SearchPropsType = InferGetStaticPropsType<
  typeof getSearchStaticProps
>
