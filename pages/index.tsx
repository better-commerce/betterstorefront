import commerce from '@lib/api/commerce'
import { Layout } from '@components/common'
import { Hero } from '@components/ui'
import type { GetStaticPropsContext, InferGetStaticPropsType } from 'next'
import { HOMEPAGE_SLUG } from '@components/utils/constants'
import ProductSlider from '@components/product/ProductSlider'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import { EVENTS, KEYS_MAP } from '@components/utils/dataLayer'

import { useEffect } from 'react'

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
  useEffect(() => {
    const { entityId, entityName, entityType, entity } = KEYS_MAP
    setEntities({
      [entityId]: '84eb4e71-318e-4989-8837-58fcfc9e5066',
      [entityName]: PAGE_TYPE,
      [entityType]: 'Page',
      [entity]: JSON.stringify({
        id: '84eb4e71-318e-4989-8837-58fcfc9e5066',
        name: 'Home',
        metaTitle: 'Home', //TBD
        metaKeywords: null, //TBD
        metaDescription: null, //TBD
        slug: window.location.pathname,
        title: 'Home', //tbd
        viewType: 'home', //tbd
      }),
    })
    recordEvent(EVENTS.PageViewed)
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
