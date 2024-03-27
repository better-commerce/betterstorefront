import type { GetStaticPropsContext } from 'next'
import commerce from '@lib/api/commerce'
import { Heart } from '@components//shared/icons'
import Layout from '@components//Layout/Layout'
import { Text, Container, Skeleton } from '@components//ui'
import { useCustomer } from '@framework/customer'
import useWishlist from '@framework/wishlist/use-wishlist'
import rangeMap from '@lib/range-map'
import { useTranslation } from '@commerce/utils/use-translation'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { BETTERCOMMERCE_DEFAULT_LANGUAGE } from '@components//utils/constants'
import { WishlistCard } from 'old-components/wishlist'


export async function getStaticProps({
  preview,
  locale,
  locales,
}: GetStaticPropsContext) {
  // Disabling page if Feature is not available
  if (!process.env.COMMERCE_WISHLIST_ENABLED) {
    return {
      notFound: true,
    }
  }

  const config = { locale, locales }
  const pagesPromise = commerce.getAllPages({ config, preview })
  const siteInfoPromise = commerce.getSiteInfo({ config, preview })
  const { pages } = await pagesPromise
  const { categories } = await siteInfoPromise

  return {
    props: {
      ...(await serverSideTranslations(locale ?? BETTERCOMMERCE_DEFAULT_LANGUAGE!)),
      pages,
      categories,
    },
  }
}

export default function Wishlist() {
  const { data: customer } = useCustomer()
  // @ts-ignore  - Fix this types
  const { data, isLoading, isEmpty } = useWishlist({ includeProducts: true })
  const translate = useTranslation()

  return (
    <Container>
      <div className="mt-3 mb-20">
        <Text variant="pageHeading">
          {translate('label.wishlist.myWishlistText')}
        </Text>
        <div className="flex flex-col group">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rangeMap(12, (i) => (
                <Skeleton key={i}>
                  <div className="w-60 h-60" />
                </Skeleton>
              ))}
            </div>
          ) : isEmpty ? (
            <div className="flex flex-col items-center justify-center flex-1 px-12 py-24 ">
              <span className="flex items-center justify-center w-16 h-16 p-12 border border-dashed rounded-lg border-secondary bg-primary text-primary">
                <Heart className="absolute" />
              </span>
              <h2 className="pt-6 text-2xl font-bold tracking-wide text-center">
                {translate('label.wishlist.emptyWishlistText')}
              </h2>
              <p className="px-10 pt-2 text-center text-accent-6">
                {translate('label.order.noOrderFoundDisplayText')}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data &&
                // @ts-ignore  - Fix this types
                data.items?.map((item) => (
                  <WishlistCard key={item.id} product={item.product! as any} />
                ))}
            </div>
          )}
        </div>
      </div>
    </Container>
  )
}

Wishlist.Layout = Layout
