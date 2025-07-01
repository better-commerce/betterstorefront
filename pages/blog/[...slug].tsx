import { SITE_NAME, SITE_ORIGIN_URL } from '@components/utils/constants'
import commerce from '@lib/api/commerce'
import NextHead from 'next/head'
import { useRouter } from 'next/router'
import { PagePropType, getPagePropType } from '@framework/page-props'
import { ArrowLongLeftIcon } from "@heroicons/react/24/outline";
import { IPagePropsProvider } from '@framework/contracts/page-props/IPagePropsProvider'
import Layout from '@components/Layout/Layout'
import { removeQueryString } from '@commerce/utils/uri-util'
import Link from 'next/link'
import Loader from '@components/Loader'
export default function BlogDetail({ blogData }: any) {
  const router = useRouter()
  const cleanPath = removeQueryString(router.asPath)
  let absPath = ''
  if (typeof window !== 'undefined') {
    absPath = window?.location?.href
  }
  return !blogData ? (
    <>
      <div className="flex w-full text-center flex-con">
        <Loader />
      </div>
    </>
  ) : (
    <>
       <NextHead>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <link rel="canonical" href={SITE_ORIGIN_URL + cleanPath} />
        <title>{blogData?.metatitle || blogData?.hero?.[0]?.hero_title}</title>
        <meta name="title" content={blogData?.metatitle || blogData?.name} />
        <meta name="title" content={blogData?.name || "blog"} />
        <meta name="description" content={blogData?.metadescription} />
        <meta name="keywords" content={blogData?.metakeywords} />
        <meta property="og:image" content="" />
        <meta property="og:title" content={blogData?.metatitle || blogData?.name} key="ogtitle" />
        <meta property="og:description" content={blogData?.metadescription} key="ogdesc" />
        <meta property="og:site_name" content={SITE_NAME} key="ogsitename" />
        <meta property="og:url" content={absPath || SITE_ORIGIN_URL + cleanPath} key="ogurl" />
      </NextHead>
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Hero Section */}
      {blogData?.hero?.map((hero:any, idx:number) => (
      <div className="mb-10" key={idx}>
        <div className="relative w-full h-[400px] mb-6 rounded-lg overflow-hidden">
          <img
            src={hero?.hero_image}
            alt={hero?.hero_title}
            className="object-cover"
          />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">{hero?.hero_title}</h1>
        <div
          className="text-muted-foreground prose prose-sm sm:prose-base"
          dangerouslySetInnerHTML={{
            __html: hero?.hero_description,
          }}
        />
      </div>
      ))}

      {/* Divider */}
      <div className="border-t border-border my-8"></div>

      {/* Main Content */}
      <article>
        <div
          className="prose prose-sm sm:prose-base max-w-none"
          dangerouslySetInnerHTML={{
            __html: blogData?.guidedata,
          }}
        />
      </article>

      {/* Share and Related Posts Section (Optional) */}
      <div className="mt-12 border-t border-border pt-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div className="mt-6 sm:mt-0">
            <Link className="text-sm font-medium flex items-center text-muted-foreground hover:text-foreground transition-colors" href="/blog">
              <ArrowLongLeftIcon className='w-6 h-6 text-black mr-2'/>
              Back to Buying Guides
            </Link>
          </div>
        </div>
      </div>
    </div>
    </>
  )

}

export async function getServerSideProps(context: any) {
  const slug = context?.query?.slug
  const blogUrl = Array.isArray(slug)
  ? `/${slug.join('/')}`
  : '/';
  console.log({blogUrl})
  const blogData = await commerce.getBlogDetail({
    query: `blog${blogUrl}`,
  })
  const props: IPagePropsProvider = getPagePropType({ type: PagePropType.COMMON }) as IPagePropsProvider
  const commonPageProps = await props.getPageProps({ cookies: {} })
  return {
    props: {
      ...commonPageProps,
      blogUrl,
      blogData,
    },
  }
}

BlogDetail.Layout = Layout
