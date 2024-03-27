import axios from 'axios'
import getFeed from '@framework/api/content/getFeed'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { BETTERCOMMERCE_DEFAULT_LANGUAGE } from '@components//utils/constants'

export default function FeedComposer({ feed }: any) {
  return (
    <></>
  )
}

export async function getServerSideProps(context: any) {
  const { res, query, locale } = context
  if (query?.feed && query?.feed[0]?.includes('xml')) {
    const feed = await getFeed(query?.feed[0])
    if (feed?.downloadLink) {
      const response = await axios.get(feed?.downloadLink)
      res.setHeader("content-type", "application/xml")
      res.end(response?.data)
    }
  }

  //if there's no xml in the format the user will be redirected to the homepage, this is used as antispam for feed endpoint
  return {
    props: {
      feed: {
        ...(await serverSideTranslations(locale ?? BETTERCOMMERCE_DEFAULT_LANGUAGE!)),
      },
    },
  }
}
