import commerce from '@lib/api/commerce'
import { Layout } from '@components/common'
import { Hero } from '@components/ui'
import type { GetStaticPropsContext, InferGetStaticPropsType } from 'next'
import { HOMEPAGE_SLUG } from '@components/utils/constants'
import ProductSlider from '@components/product/ProductSlider'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import { EVENTS, KEYS_MAP } from '@components/utils/dataLayer'
import { useEffect } from 'react'
import eventDispatcher from '@components/services/analytics/eventDispatcher'
import { EVENTS_MAP } from '@components/services/analytics/constants'

export async function getStaticProps({
  preview,
  locale,
  locales,
}: GetStaticPropsContext) {
  const config = { locale, locales }
  const slugsPromise = commerce.getSlugs({ slug: HOMEPAGE_SLUG })
  const slugs = await slugsPromise

  const pagesPromise = commerce.getAllPages({ config, preview })
  const siteInfoPromise = commerce.getSiteInfo({ config, preview })
  const { pages } = await pagesPromise
  const { categories, brands } = await siteInfoPromise

  return {
    props: {
      categories,
      brands,
      pages,
      slugs,
    },
    revalidate: 60,
  }
}

const PAGE_TYPE = PAGE_TYPES.Home

function Home({ slugs, setEntities, recordEvent }: any) {
  const { PageViewed } = EVENTS_MAP.EVENT_TYPES

  useEffect(() => {
    eventDispatcher(PageViewed, {
      entity: JSON.stringify({
        id: slugs.id,
        name: slugs.name,
        metaTitle: slugs.metaTitle,
        MetaKeywords: slugs.metaKeywords,
        MetaDescription: slugs.metaDescription,
        Slug: slugs.slug,
        Title: slugs.title,
        ViewType: slugs.viewType,
      }),
      entityName: PAGE_TYPE,
      entityType: 'Page',
      entityId: slugs.id,
    })
  }, [])

  return (
    <>
      <Hero banners={slugs.components[0].images} />
      <ProductSlider config={slugs.components[3]} />
    </>
  )
}

Home.Layout = Layout

export default withDataLayer(Home, PAGE_TYPE)
