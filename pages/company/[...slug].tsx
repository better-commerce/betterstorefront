import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import NextHead from 'next/head'
import Layout from '@components/Layout/Layout'
import {
  PAGE_PREVIEW_CONTENT_ENDPOINT,
  SITE_ORIGIN_URL,
} from '@components/utils/constants'
import withDataLayer from '@components/withDataLayer'
import { BETTERCMS_BASE_URL } from '@framework/utils/constants'
import fetcher from '@framework/fetcher'
import { useTranslation } from '@commerce/utils/use-translation'
const Loader = dynamic(() => import('@components/ui/LoadingDots'))

function PreviewPage({
  slug,
  pageContents,
  deviceInfo,
  config,
  hostName,
}: any) {
  const router = useRouter()
  const translate = useTranslation()
  if (!pageContents) {
    return (
      <div className="flex w-full text-center flex-con">
        {' '}
        <Loader />{' '}
      </div>
    )
  }
  return (
    <>
      {(pageContents?.metatitle ||
        pageContents?.metadescription ||
        pageContents?.metakeywords) && (
        <NextHead>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, maximum-scale=5"
          />
          <link
            rel="canonical"
            id="canonical"
            href={pageContents?.canonical || SITE_ORIGIN_URL + router.asPath}
          />
          <title>
            {pageContents?.metatitle ||
              translate('label.footer.navigation.termsAndConditionsText')}
          </title>
          <meta
            name="title"
            content={
              pageContents?.metatitle ||
              translate('label.footer.navigation.termsAndConditionsText')
            }
          />
          {pageContents?.metadescription && (
            <meta name="description" content={pageContents?.metadescription} />
          )}
          {pageContents?.metakeywords && (
            <meta name="keywords" content={pageContents?.metakeywords} />
          )}
          <meta property="og:image" content={pageContents?.image} />
          {pageContents?.metatitle && (
            <meta
              property="og:title"
              content={pageContents?.metatitle}
              key="ogtitle"
            />
          )}
          {pageContents?.metadescription && (
            <meta
              property="og:description"
              content={pageContents?.metadescription}
              key="ogdesc"
            />
          )}
        </NextHead>
      )}
      {hostName && <input className="inst" type="hidden" value={hostName} />}
      <div className="container mb-10">
        {pageContents?.heading?.map((head: any, Idx: any) => (
          <div key={Idx}>
            <h1 className="text-2xl sm:text-4xl mt-20 mb-10 text-center font-semibold text-green-align">
              {head?.heading_herotitle}
            </h1>
            <div
              dangerouslySetInnerHTML={{
                __html: head?.heading_herodescription,
              }}
              className="terms-text mt-10 break-all"
            />
          </div>
        ))}
      </div>
    </>
  )
}

export async function getServerSideProps(context: any) {
  const slug = context.query.slug
  const { result: pageContents } = await fetcher({
    url: `${PAGE_PREVIEW_CONTENT_ENDPOINT}`,
    method: 'get',
    params: {
      id: '',
      slug: slug.join('/'),
      workingVersion: false,
      cachedCopy: true,
    },
    headers: {
      DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID,
    },
    baseUrl: BETTERCMS_BASE_URL,
  })

  return {
    props: {
      slug: slug,
      pageContents: pageContents || {},
    },
  }
}

PreviewPage.Layout = Layout
export default withDataLayer(PreviewPage, '')
