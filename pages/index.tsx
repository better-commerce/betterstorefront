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
import Image from 'next/image'
import Link from 'next/link'

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
    id: "a98303b7-0596-429b-ae59-dbdef0f455f8", //pageId,
    slug: HOME_PAGE_DEFAULT_SLUG,
    workingVersion: (process.env.NODE_ENV === "production") ? true : true, // TRUE for preview, FALSE for prod.
    channel: "Web"
  });
  const pageContentsWeb = await PageContentsPromiseWeb;

  const PageContentsPromiseMobileWeb = commerce.getPagePreviewContent({
    id: "a98303b7-0596-429b-ae59-dbdef0f455f8", //pageId,
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
  const css = { maxWidth: "100%", minHeight: "500px" }
  return (
    <>
      <Hero banners={pageContents?.banner} />
      <div className='w-full pb-4 mx-auto bg-gray-50 sm:pb-8'>
        <div className='container py-3 mx-auto sm:py-6'>
          {pageContents?.heading?.map((heading: any, hId: number) => (
            <div className='flex flex-col justify-center mt-2 mb-4 text-center sm:mb-8 sm:mt-4' key={hId}>
              <h3 className='text-3xl font-bold text-black uppercase'>{heading?.heading_title}</h3>
            </div>
          ))}

          <div className='grid grid-cols-2 gap-4 sm:grid-cols-4'>
            {pageContents?.categorylist?.map((category: any, catId: number) => (
              <div className='sm:col-span-1' key={catId}>
                <div className='relative flex flex-col style-newin_article'>
                  <div className='shadow image-continer group-hover:shadow-md'>
                    <Link href={category?.categorylist_link} passHref legacyBehavior>
                      <a>
                        <Image src={category?.categorylist_image} alt={category?.categorylist_name} width={600} height={800} style={css} />
                      </a>
                    </Link>
                  </div>
                  <div className='flex flex-col w-full px-6 py-2 text-center style-newin_article-title'>
                    <h3 className='mb-4 text-xl font-semibold text-white'>{category?.categorylist_name}</h3>
                    <Link href={category?.categorylist_link} passHref legacyBehavior>
                      <a className='w-full py-2 text-lg font-medium text-black bg-white border border-white'>
                        {category?.categorylist_buttontext}
                      </a>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className='container mx-auto'>
        {pageContents?.productheading?.map((productH: any, Pid: number) => (
          <div className='flex flex-col justify-center my-4 text-center sm:my-8' key={Pid}>
            <h3 className='text-5xl font-bold text-black uppercase'>{productH?.productheading_title}</h3>
            <h5 className='font-normal text-gray-600 text-md sm:mt-2'>{productH?.productheading_subtitle}</h5>
          </div>
        ))}
        <ProductSlider config={pageContents} />
      </div>

      <div className='w-full pb-4 mx-auto bg-gray-50 sm:pb-8'>
        <div className='container py-3 mx-auto sm:py-6'>
          {pageContents?.collectionheadings?.map((heading: any, cId: number) => (
            <div className='flex flex-col justify-center my-4 text-center sm:my-8' key={cId}>
              <h3 className='text-3xl font-bold text-black uppercase'>{heading?.collectionheadings_title}</h3>
            </div>
          ))}

          <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
            {pageContents?.collectionlist?.map((collection: any, colId: number) => (
              <div className='sm:col-span-1' key={colId}>
                <div className='relative flex flex-col'>
                  <div className='shadow image-continer group-hover:shadow-md'>
                    <Link href={collection?.collectionlist_link} passHref legacyBehavior>
                      <a>
                        <Image src={collection?.collectionlist_image} className='object-cover object-center' alt={collection?.collectionlist_title} width={600} height={800} style={css} />
                      </a>
                    </Link>
                  </div>
                  <div className='flex flex-col w-full px-0 py-2 text-left'>
                    <h3 className='mt-3 mb-2 text-xl font-bold text-black'>{collection?.collectionlist_title}</h3>
                    <div dangerouslySetInnerHTML={{
                      __html: collection.collectionlist_shortdescription,
                    }}
                      className='mb-3 text-sm font-normal text-gray-600 h-14'
                    />
                    <Link href={collection?.collectionlist_link} passHref legacyBehavior>
                      <a className='px-4 py-2 text-lg font-medium text-center text-black bg-transparent border border-black'>
                        Shop Now
                      </a>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </>
  )
}

Home.Layout = Layout

export default withDataLayer(Home, PAGE_TYPE)
