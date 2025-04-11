// Base Imports
import React from 'react'
import Link from 'next/link'
import type { GetStaticPropsContext } from 'next'
import dynamic from 'next/dynamic'
import { ArrowLongRightIcon } from "@heroicons/react/24/outline";
// Other Imports
import commerce from '@lib/api/commerce'
import { EmptyGuid, HOMEPAGE_SLUG, SITE_ORIGIN_URL } from '@components/utils/constants'
import { BLOG_PAGE_ID } from '@components/utils/constants'
import { BLOG_COLS } from '@components/utils/constants'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import { EVENTS_MAP } from '@components/services/analytics/constants'
import useAnalytics from '@components/services/analytics/useAnalytics'
import moment from 'moment';
import { DATE_FORMAT } from '@components/utils/constants';
import { IMG_PLACEHOLDER } from '@components/utils/textVariables'
import NextHead from 'next/head'
import { useUI } from '@components/ui/context'
import { useRouter } from 'next/router'
import { IPagePropsProvider } from '@framework/contracts/page-props/IPagePropsProvider'
import { PagePropType, getPagePropType } from '@framework/page-props'
import Layout from '@components/Layout/Layout'

const Loader = dynamic(() => import('@components/ui/LoadingDots'))

declare const window: any

const PAGE_TYPE = PAGE_TYPES.Blog

function BlogList({ slugs, pageContents }: any) {
  let hostName = ''
  if (typeof window !== 'undefined') {
    hostName = window?.location?.hostname ?? ''
  }
  const { user } = useUI()
  const { PageViewed } = EVENTS_MAP.EVENT_TYPES
  useAnalytics(PageViewed, {
    entity: JSON.stringify({
      id: slugs?.id,
      name: slugs?.name,
      metaTitle: slugs?.metaTitle,
      MetaKeywords: slugs?.metaKeywords,
      MetaDescription: slugs?.metaDescription,
      Slug: slugs?.slug,
      Title: slugs?.title,
      ViewType: slugs?.viewType,
    }),
    entityName: PAGE_TYPE,
    pageTitle: slugs?.title,
    entityType: 'Page',
    entityId: slugs?.id,
    eventType: 'PageViewed',
  })

  const router = useRouter()
    const formatDate = (dateString: string) => {
      return moment(dateString).format(DATE_FORMAT)
    }
  return !pageContents ? (
    <>
      <div className="flex w-full text-center flex-con">
        <Loader />
      </div>
    </>
  ) : (
    <>
         <NextHead>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5"
        />
        <link rel="canonical" href={SITE_ORIGIN_URL + router.asPath} />
        <title>Blogs</title>
        <meta name="title" content="Blogs" />
        <meta name="description" content="Blogs" />
        <meta name="keywords" content="Blogs" />
        <meta property="og:image" content="" />
        <meta
          property="og:title"
          content="Blogs"
          key="ogtitle"
        />
        <meta
          property="og:description"
          content="Blogs"
          key="ogdesc"
        />
      </NextHead>
    <div className='container py-8 mx-auto px-4'>
      <div className='mb-8'>
      <h1 className="block  text-2xl font-semibold sm:text-3xl lg:text-4xl sm:mb-0 basket-h1 dark:text-black">
        Blogs
      </h1>
      </div>
    <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-8">
      {pageContents?.pages?.map((post:any, idx:number) => (
        <div
          key={idx}
          className="bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:translate-y-[-5px] flex flex-col h-full"
        >
          <div className="relative h-64 w-full">
            <img
              src={post?.fields?.hero?.[0]?.hero_image || IMG_PLACEHOLDER}
              alt={post?.title}
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>

          <div className="p-6 flex flex-col flex-grow">
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <span className="bg-gray-100 px-2 py-1 rounded-full">{formatDate(post?.lastUpdated)}</span>
            </div>

            <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">{post?.fields?.hero?.[0]?.hero_title}</h2>

            <div
              className="text-gray-600 mb-4 line-clamp-3"
              dangerouslySetInnerHTML={{
                __html: post?.fields?.hero?.[0]?.hero_description,
              }}
            />

            <div className="mt-auto">
              <Link
                href={`/${post?.slug}`}
                className="inline-flex items-center link-clr font-medium hover:text-teal-800 transition-colors"
              >
                Read more <ArrowLongRightIcon className='w-6 h-6 ml-2'/>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
    </div>
    </>
  )
}

BlogList.Layout = Layout

export default withDataLayer(BlogList, PAGE_TYPE, true, Layout)

export async function getStaticProps({
  preview,
  locale,
  locales,
}: GetStaticPropsContext) {
  const config = { locale, locales }
  const slugsPromise = commerce.getSlugs({ slug: HOMEPAGE_SLUG })
  const slugs = await slugsPromise
  const infraPromise = commerce.getInfra()
  const infra = await infraPromise

  const pagesPromise = commerce.getAllPages({ config, preview })
  const siteInfoPromise = commerce.getSiteInfo({ config, preview })
  const { pages } = await pagesPromise
  const { categories, brands } = await siteInfoPromise

  const BlogContentsPromise = commerce.getBlogList({
    pagetypeId: BLOG_PAGE_ID, //Constant pageId,
    skip: 0, //skip,
    pagesize: 100, //pagesize,s
    sortby: 3, //sortby,
    sortorder: 1, //sortorder,
    cols: BLOG_COLS, //"blogheader.blogheader_mainimage",
  })
  const blogContents = await BlogContentsPromise
  const props: IPagePropsProvider = getPagePropType({ type: PagePropType.COMMON }) as IPagePropsProvider
  const commonPageProps = await props.getPageProps({ cookies: {} })
  return {
    props: {
      ...commonPageProps,
      categories,
      brands,
      pages,
      slugs,
      globalSnippets: infra?.snippets ?? [],
      snippets: slugs?.snippets ?? [],
      pageContents: blogContents ?? {},
    },
    revalidate: 60,
  }
}
