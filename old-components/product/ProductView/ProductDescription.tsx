export default function ProductDescription({ seoInfo }: any) {
  return (
    <>
      {seoInfo['product.seocontent']?.length > 0 &&
        seoInfo['product.seocontent'].map((seocontent: any, cdx: number) => (
          <div
            key={cdx}
            className="mb-4 text-xs font-normal text-brown seo-info custom-html"
            dangerouslySetInnerHTML={{
              __html: seocontent.value || seocontent.value,
            }}
          />
        ))}
    </>
  )
}
