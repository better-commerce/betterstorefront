import dynamic from 'next/dynamic'
// Base Imports
import React from 'react'
import type { GetStaticPropsContext } from 'next'

// Other Imports
import commerce from '@lib/api/commerce'
import { Layout } from '@components/common'
import { Hero } from '@components/ui'
import { HOMEPAGE_SLUG } from '@components/utils/constants'
const ProductSlider = dynamic(() => import('@components/product/ProductSlider'));
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import { EVENTS_MAP } from '@components/services/analytics/constants'
import useAnalytics from '@components/services/analytics/useAnalytics'
import { HOME_PAGE_DEFAULT_SLUG } from '@framework/utils/constants'
import { isMobile } from 'react-device-detect'
import { Swiper, SwiperSlide } from 'swiper/react'
import Image from 'next/image'
import 'swiper/css'
import 'swiper/css/navigation'

import SwiperCore, { Navigation } from 'swiper'
import Link from 'next/link'
import Heading from '@components/home/Heading'
import Categories from '@components/home/Categories'
import Collections from '@components/home/Collections'

export async function getStaticProps({
  preview,
  locale,
  locales,
}: GetStaticPropsContext) {
  const config = { locale, locales };
  const slugsPromise = commerce.getSlugs({ slug: HOMEPAGE_SLUG });
  const slugs = await slugsPromise;
  const infraPromise = commerce.getInfra();
  const infra = await infraPromise;

  const pagesPromise = commerce.getAllPages({ config, preview })
  const siteInfoPromise = commerce.getSiteInfo({ config, preview })
  const { pages } = await pagesPromise
  const { categories, brands } = await siteInfoPromise

  const PageContentsPromiseWeb = commerce.getPagePreviewContent({
    id: "", //pageId,
    slug: HOME_PAGE_DEFAULT_SLUG,
    workingVersion: (process.env.NODE_ENV === "production") ? true : true, // TRUE for preview, FALSE for prod.
    channel: "Web"
  });
  const pageContentsWeb = await PageContentsPromiseWeb;

  const PageContentsPromiseMobileWeb = commerce.getPagePreviewContent({
    id: "", //pageId,
    slug: HOME_PAGE_DEFAULT_SLUG,
    workingVersion: (process.env.NODE_ENV === "production") ? true : true, // TRUE for preview, FALSE for prod.
    channel: "MobileWeb"
  });
  const pageContentsMobileWeb = await PageContentsPromiseMobileWeb;


  return {
    props: {
      categories,
      brands,
      pages,
      slugs,
      globalSnippets: infra?.snippets ?? [],
      snippets: slugs?.snippets,
      pageContentsWeb: pageContentsWeb ?? {},
      pageContentsMobileWeb: pageContentsMobileWeb ?? {},
    },
    revalidate: 60,
  }
}

const PAGE_TYPE = PAGE_TYPES.Home

function Home({ slugs, setEntities, recordEvent, ipAddress, pageContentsWeb, pageContentsMobileWeb }: any) {
  const { PageViewed } = EVENTS_MAP.EVENT_TYPES;
  const pageContents = isMobile ? pageContentsMobileWeb : pageContentsWeb;
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
  });
  const css = { maxWidth: "100%", minHeight: "350px" }
  return (
    <>
      <Hero banners={pageContents?.banner} />
      <div className='w-full pb-4 mx-auto bg-gray-50 sm:pb-8'>
        <div className='container py-3 mx-auto sm:py-6'>
          {pageContents?.heading?.map((heading: any, hId: number) => (
            <Heading title={heading?.heading_title} subTitle={heading?.heading_subtitle} key={hId} />
          ))}
          <Categories data={pageContents?.categorylist} />
        </div>
      </div>

      <div className='container mx-auto'>
        {pageContents?.productheading?.map((productH: any, Pid: number) => (
          <Heading title={productH?.productheading_title} subTitle={productH?.productheading_subtitle} key={Pid} />
        ))}
        <ProductSlider config={pageContents} />
      </div>

      {pageContents?.promotions?.map((banner: any, bId: number) => (
        <div className='relative flex flex-col justify-center w-full text-center' key={bId}>
          <Link href={banner?.promotions_link} passHref legacyBehavior>
            <a>
              <Image src={banner?.promotions_image} className='object-cover object-center' alt={banner?.promotions_title} width={2000} height={800} style={css} />
            </a>
          </Link>
          <div className='absolute text-5xl font-medium text-white top-1/2 right-24'>{banner?.promotions_title}</div>
        </div>
      ))}

      <div className='w-full pb-4 mx-auto bg-gray-50 sm:pb-8'>
        <div className='container px-4 py-3 mx-auto sm:px-0 sm:py-6'>
          {pageContents?.collectionheadings?.map((heading: any, cId: number) => (
            <Heading title={heading?.collectionheadings_title} subTitle={heading?.collectionheadings_subtitle} key={cId} />
          ))}
          <Collections data={pageContents?.collectionlist}/>          
        </div>
      </div>
    </>
  )
}

Home.Layout = Layout
export default withDataLayer(Home, PAGE_TYPE)