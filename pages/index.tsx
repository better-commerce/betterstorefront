import commerce from '@lib/api/commerce'
import { Layout } from '@components/common'
import { Hero } from '@components/ui'
import type { GetStaticPropsContext, InferGetStaticPropsType } from 'next'
import { HOMEPAGE_SLUG } from '@components/utils/constants'
import ProductSlider from '@components/product/ProductSlider'

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

export default function Home({
  slugs,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <Hero banners={slugs.components[0].images} />
      <ProductSlider config={slugs.components[3]} />
    </>
  )
}

Home.Layout = Layout
