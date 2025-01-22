import dynamic from 'next/dynamic'
import NextHead from 'next/head'
import { useRouter } from 'next/router'

import {
  PAGE_PREVIEW_CONTENT_ENDPOINT,
  SITE_ORIGIN_URL,
} from '@components/utils/constants'
import { BETTERCMS_BASE_URL } from '@framework/utils/constants'
import fetcher from '@framework/fetcher'
import { Layout } from '@components/common'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import BreadCrumbs from '@components/ui/BreadCrumbs'
import isEmpty from 'lodash/isEmpty'
import { Redis } from '@framework/utils/redis-constants'
import { getDataByUID, parseDataValue, setData } from '@framework/utils/redis-util'
import { removeQueryString } from '@commerce/utils/uri-util'
import { IPagePropsProvider } from '@framework/contracts/page-props/IPagePropsProvider'
import { PagePropType, getPagePropType } from '@framework/page-props'
const HeroBannerImage = dynamic(() => import('@components/cms-banner/heroBannerImage'))
const MidBanner = dynamic(() => import('@components/cms-banner/midBanner'))
const MidBannerText = dynamic(() => import('@components/cms-banner/midBannerText'))
const VideoList = dynamic(() => import('@components/brand/VideoList'))
const VideoListImage = dynamic(() => import('@components/brand/VideoListImage'))
const BrandImageSlider = dynamic(() => import('@components/brand/BrandImageSlider'))
const BrandFourImageSlider = dynamic(() => import('@components/brand/BrandFourImageSlider'))
const ImageCard = dynamic(() => import('@components/brand/ImageCard'))
const CategoryLists = dynamic(() => import('@components/brand/CategoryList'))
const PAGE_TYPE = PAGE_TYPES.Home
function PreviewPage({ pageContents }: any) {
  const router = useRouter()
  //const [cleanPath, setCleanPath] = useState(router.asPath);
  //Breadcrumb data
  const breadCrumbItem: any = [
    {
      slug: {
        title: pageContents?.metatitle,
        slug: '/',
        childSlug: null,
      },
    },
  ]
  const cleanPath = removeQueryString(router.asPath)
  
  return (
    <>
      <NextHead>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="canonical" href={SITE_ORIGIN_URL + cleanPath} />
        <title>{pageContents?.metatitle || 'Home BetterTools'}</title>
        <meta name="title" content={pageContents?.metatitle || 'Home BetterTools'} />
        <meta name="description" content={pageContents?.metadescription || 'Home BetterTools'} />
        <meta name="keywords" content={pageContents?.metakeywords || 'Home BetterTools'} />
        <meta property="og:image" content={pageContents?.image || 'Home BetterTools'} />
        <meta property="og:title" content={pageContents?.metatitle || 'Home BetterTools'} key="ogtitle" />
        <meta property="og:description" content={pageContents?.metadescription || 'Home BetterTools'} key="ogdesc" />
        <meta property="og:url" content={SITE_ORIGIN_URL + cleanPath} key="ogurl" />
      </NextHead>

      {/* Breadcrumbs start */}
      <div className="pb-4 sm:pb-2 sm:p-3 container-ffx">
        <BreadCrumbs items={breadCrumbItem} currentProduct={null} />
      </div>

      {/* Main section start */}
      {pageContents?.hero?.length > 0 &&
        pageContents?.hero?.map((header: any, headIdx: number) => (
          <div key={`banner-${headIdx}`}>
            <HeroBannerImage header={header} headIdx={headIdx} />
          </div>
        ))}
      {pageContents?.midhero?.length > 0 &&
        pageContents?.midhero?.map((midbanner: any, mid: number) => (
          <div key={`banner-${mid}`}>
            <MidBanner data={midbanner} mid={mid} />
          </div>
        ))}
      {pageContents?.videogallery?.length > 0 && !isEmpty(pageContents?.videogallery[0]?.videogallery_thumbnailimage) && (
        <VideoList data={pageContents?.videogallery} />
      )}
      {pageContents?.midbanner?.length > 0 && !isEmpty(pageContents?.midbanner[0]?.midbanner_image) &&
        pageContents?.midbanner?.map((Banner: any, mbid: number) => (
          <div key={`banner-${mbid}`}>
            <MidBannerText data={Banner} mid={mbid} />
          </div>
        ))}
      {pageContents?.imagelistsection?.length > 0 && !isEmpty(pageContents?.imagelistsection[0]?.imagelistsection_image) && (
        <BrandImageSlider
          data={pageContents?.imagelistsection}
          header={pageContents?.imagelistheading}
        />
      )}
      {pageContents?.imagelistsecond?.length > 0 && !isEmpty(pageContents?.imagelistsecond[0]?.imagelistsecond_image) && (
        <BrandFourImageSlider
          imageList={pageContents?.imagelistsecond}
          header={pageContents?.imagelistheadingtwo}
        />
      )}
      {pageContents?.imagecardinfo?.length > 0 && !isEmpty(pageContents?.imagecardinfo[0]?.imagecardinfo_image) && (
        <ImageCard data={pageContents?.imagecardinfo} />
      )}

      <CategoryLists
        data={pageContents?.categorylist}
        heading={pageContents?.categoryheading}
      />
      <VideoListImage data={pageContents?.imagevideolist} />
      {/* Main section start */}
    </>
  )
}
export async function getServerSideProps(context: any) {
  const slug = context.query.slug
  const pageContentsUID = `${Redis.Key.HOME_SLUG_CONTENTS}_${slug}`
  const cachedData = await getDataByUID([ pageContentsUID ])
  let pageContentsUIDData: any = parseDataValue(cachedData, pageContentsUID)
  if (!pageContentsUIDData) {
    const { result: pageContents } = await fetcher({
      url: `${PAGE_PREVIEW_CONTENT_ENDPOINT}`,
      method: 'get',
      params: { id: "", slug: "home/" + slug.join("/"), workingVersion: true, cachedCopy: true },
      headers: {
        DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID,
      },
      baseUrl: BETTERCMS_BASE_URL,
    })
    pageContentsUIDData = pageContents
    await setData([{ key: pageContentsUID, value: pageContentsUIDData }])
  }

  const props: IPagePropsProvider = getPagePropType({ type: PagePropType.COMMON })
  const pageProps = await props.getPageProps({ slug, cookies: context?.req?.cookies })

  return {
    props: {
      ...pageProps,
      slug,
      pageContents: pageContentsUIDData || {},
    },
  }
}

PreviewPage.Layout = Layout
export default withDataLayer(PreviewPage, '')
