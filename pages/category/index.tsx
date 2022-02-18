import type { GetStaticPathsContext, GetStaticPropsContext } from 'next'
import getCollections from '@framework/api/content/getCollections'

export default function CategoryList(props: any) {
  return null
}

export async function getStaticProps({
  params,
  locale,
  locales,
  preview,
}: GetStaticPropsContext) {
  const collectionData = await getCollections()
  return {
    props: {
      data: collectionData,
    },
    revalidate: 200,
  }
}
