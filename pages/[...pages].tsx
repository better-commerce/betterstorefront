import { GetServerSideProps } from 'next'
import getBrandBySlug from '@framework/api/endpoints/catalog/getBrandBySlug'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import { PlainText, ProductCollection, Video, Image } from '@components/brand'
import React from 'react'

const COMPONENTS_MAP: any = {
  PlainText: (props: any) => <PlainText {...props} />,
  ProductCollection: (props: any) => <ProductCollection {...props} />,
  Video: (props: any) => <Video {...props} />,
  ImageBanner: (props: any) => <Image {...props} />,
  undefined: () => null,
}

function BrandPage({ brandDetails }: any) {
  const widgetsConfig = JSON.parse(brandDetails.result.widgetsConfig).sort(
    (a: any, b: any) => a.displayOrder - b.displayOrder
  )

  console.log(widgetsConfig)
  return (
    <>
      {widgetsConfig.map((widget: any, idx: number) => {
        const enhancedProps = { ...widget, brandDetails: brandDetails.result }
        return (
          <div key={idx}>
            {COMPONENTS_MAP[widget.manufacturerSettingType]
              ? COMPONENTS_MAP[widget.manufacturerSettingType](enhancedProps)
              : null}
          </div>
        )
      })}
    </>
  )
}

const PAGE_TYPE = PAGE_TYPES['Brand']

export default withDataLayer(BrandPage, PAGE_TYPE)

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const slug: any = context?.query?.pages[0] || ''
  const response = await getBrandBySlug(slug)
  return {
    props: { query: context.query, brandDetails: response }, // will be passed to the page component as props
  }
}
