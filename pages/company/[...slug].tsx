import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import NextHead from 'next/head'
import Layout from '@components/Layout/Layout'
import { PAGE_PREVIEW_CONTENT_ENDPOINT, SITE_ORIGIN_URL } from '@components/utils/constants'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import { BETTERCMS_BASE_URL } from '@framework/utils/constants'
import fetcher from '@framework/fetcher'
import { useTranslation } from '@commerce/utils/use-translation'
import { notFoundRedirect } from '@framework/utils/app-util'
import { IPagePropsProvider } from '@framework/contracts/page-props/IPagePropsProvider'
import { getPagePropType, PagePropType } from '@framework/page-props'
const Loader = dynamic(() => import('@components/ui/LoadingDots'))

const PAGE_TYPE = PAGE_TYPES.Company
function CompanyPages({ slug, pageContents, deviceInfo, config, hostName }: any) {
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
      <NextHead>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <link rel="canonical" id="canonical" href={pageContents?.canonical || SITE_ORIGIN_URL + router.asPath} />
        <title>{pageContents?.metatitle || translate('common.message.companyPagesText')}</title>
        <meta name="title" content={pageContents?.metatitle || translate('common.message.companyPagesText')} />
        {pageContents?.metadescription && <meta name="description" content={pageContents?.metadescription} />}
        {pageContents?.metakeywords && <meta name="keywords" content={pageContents?.metakeywords} />}
        <meta property="og:image" content={pageContents?.image} />
        {pageContents?.metatitle && <meta property="og:title" content={pageContents?.metatitle} key="ogtitle" />}
        {pageContents?.metadescription && <meta property="og:description" content={pageContents?.metadescription} key="ogdesc" />}
      </NextHead>
      {hostName && <input className="inst" type="hidden" value={hostName} />}
      <div className="container mb-10">
        {pageContents?.heading?.length > 0 &&
          pageContents?.heading?.map((head: any, Idx: any) => (
            <div key={Idx}>
              <h1 className="mt-20 mb-10 text-2xl font-semibold text-center sm:text-4xl heading-alignment dark:text-black">{head?.heading_herotitle}</h1>
              <div
                dangerouslySetInnerHTML={{
                  __html: head?.heading_herodescription,
                }}
                className="mt-10 break-all terms-text dark:text-black"
              />
            </div>
          ))}
      </div>
    </>
  )
}

export async function getServerSideProps(context: any) {
  const slug = context.query.slug
  const { locale } = context;

  const { result: pageContents } = await fetcher({
    url: `${PAGE_PREVIEW_CONTENT_ENDPOINT}`,
    method: 'get',
    params: {
      id: '',
      slug: 'company/'+slug.join("/"),
      workingVersion: false,
      cachedCopy: true,
    },
    headers: {
      DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID,
    },
    baseUrl: BETTERCMS_BASE_URL,
  })

  if (pageContents?.slug === 'contact-us') {
    return notFoundRedirect();
  }

  const props: IPagePropsProvider = getPagePropType({ type: PagePropType.COMMON })
  const pageProps = await props.getPageProps({ slug, cookies: context?.req?.cookies })

  return {
    props: {
      ...pageProps,
      slug: slug,
      pageContents: pageContents || {},
    },
  };
}

CompanyPages.Layout = Layout
export default withDataLayer(CompanyPages, 'Company')
