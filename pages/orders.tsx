import type { GetStaticPropsContext } from 'next'
import commerce from '@lib/api/commerce'
import { Bag } from '@components/shared/icons'
import Layout from '@components/Layout/Layout'
import { Container, Text } from '@components/ui'
import { useTranslation } from '@commerce/utils/use-translation'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { BETTERCOMMERCE_DEFAULT_LANGUAGE } from '@components/utils/constants'

export async function getStaticProps({
  preview,
  locale,
  locales,
}: GetStaticPropsContext) {
  const config = { locale, locales }
  const pagesPromise = commerce.getAllPages({ config, preview })
  const siteInfoPromise = commerce.getSiteInfo({ config, preview })
  const { pages } = await pagesPromise
  const { categories } = await siteInfoPromise

  return {
    props: { 
      ...(await serverSideTranslations(locale ?? BETTERCOMMERCE_DEFAULT_LANGUAGE!)),
      pages, 
      categories 
    },
  }
}

export default function Orders() {
  const translate = useTranslation()
  return (
    <Container>
      <Text variant="pageHeading">{translate('label.order.myOrdersText')}</Text>
      <div className="flex flex-col items-center justify-center flex-1 p-24 ">
        <span className="flex items-center justify-center w-16 h-16 p-12 border border-dashed rounded-full border-secondary bg-primary text-primary">
          <Bag className="absolute" />
        </span>
        <h2 className="pt-6 text-2xl font-bold tracking-wide text-center">
          {translate('label.order.NoOrderFoundText')}
        </h2>
        <p className="px-10 pt-2 text-center text-accent-6">
          {translate('label.order.noOrderFoundDisplayText')}
        </p>
      </div>
    </Container>
  )
}

Orders.Layout = Layout
