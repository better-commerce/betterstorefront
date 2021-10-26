import type {
  GetStaticPathsContext,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from 'next'
import { useRouter } from 'next/router'
import commerce from '@lib/api/commerce'
import { Layout } from '@components/common'
import { ProductView } from '@components/product'
import Head from 'next/head'

export async function getStaticProps({
  params,
  locale,
  locales,
  preview,
}: GetStaticPropsContext<{ slug: string }>) {
  const productPromise = commerce.getProduct({ query: params!.slug })
  const product = await productPromise
  return {
    props: {
      data: product,
    },
    revalidate: 200,
  }
}

export async function getStaticPaths({ locales }: GetStaticPathsContext) {
  const { products } = await commerce.getAllProductPaths()
  return {
    paths: products.map((product: any) => `/${product.slug}`),
    fallback: 'blocking',
  }
}

export default function Slug({
  data,
}: // product,
InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter()
  return router.isFallback ? (
    <h1>Loading...</h1>
  ) : (
    data && <ProductView product={data.product} snippets={data.snippets} />
  )
}

Slug.Layout = Layout
