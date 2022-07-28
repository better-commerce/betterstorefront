
// Base Imports
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import type { GetStaticPropsContext } from 'next'
import dynamic from 'next/dynamic'

// Other Imports
import commerce from '@lib/api/commerce'
import { Layout } from '@components/common'
import { Hero } from '@components/ui'
import { HOMEPAGE_SLUG, NEXT_GET_PAGE_CONTENT } from '@components/utils/constants'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import { EVENTS_MAP } from '@components/services/analytics/constants'
import useAnalytics from '@components/services/analytics/useAnalytics'

const ProductSlider = dynamic(() => import('@components/product/ProductSlider'));
const CategoryCollection = dynamic(() => import('@components/home/categoryCollection'));
const OfferZone = dynamic(() => import('@components/home/offerZone'));
const ProductCollection = dynamic(() => import('@components/home/productCollection'));
const ShopCollection = dynamic(() => import('@components/home/ShopCollection'));
const FashionIdea = dynamic(() => import('@components/home/fashionIdea'));
const Information = dynamic(() => import('@components/home/infoPanel'));

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

  return {
    props: {
      categories,
      brands,
      pages,
      slugs,
      globalSnippets: infra?.snippets ?? [],
      snippets: slugs?.snippets
    },
    revalidate: 60,
  }
}

const PAGE_TYPE = PAGE_TYPES.Home

function Home({ slugs, setEntities, recordEvent, ipAddress, }: any) {
  const { PageViewed } = EVENTS_MAP.EVENT_TYPES;
  const [pageContent, setPageContent] = useState<any>();

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

  useEffect(() => {
    const getPageContent = async (id: string, slug?: string) => {
      try {
        const { data }: any = await axios.get(`${NEXT_GET_PAGE_CONTENT}?id=${id}&slug=${slugs?.slug}`);
        console.log(data);
        setPageContent(data);
      } catch (error) {
        console.log(error)
      }
    };

    getPageContent("05905b59-84a7-41a3-b992-5137c11f86f7");
  }, []);

  return (
    !pageContent ? (
      <>loading...</>
    ) : (
      <>
        <Hero banners={slugs?.components[0]?.images} />
        <CategoryCollection data={pageContent?.whatsNewSection} />
        <OfferZone data={pageContent?.offerZoneSection}></OfferZone>
        <OfferZone data={pageContent?.shopValuePackSection}></OfferZone>
        <ProductCollection></ProductCollection>
        <ProductSlider
          config={slugs?.components?.find((i?: any) => i.componentType === 52)}
        />
        <ShopCollection data={pageContent?.shopByCollections}></ShopCollection>
        <FashionIdea data={pageContent?.fashionThatThinksSection}></FashionIdea>
        <Information></Information>
      </>
    )
  )
}

Home.Layout = Layout

export default withDataLayer(Home, PAGE_TYPE)
