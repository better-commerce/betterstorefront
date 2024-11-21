import React, { useEffect, useState } from 'react'
import Link from 'next/link'

function ProductDetails({ product, description, handleScrollToSection }: any) {
  const [suppliedWithList, setSuppliedWithList] = useState<any>(null)
  useEffect(() => {
    const extractLiElements = () => {
      const parser = new DOMParser()
      const doc = parser.parseFromString(product?.description, 'text/html')
      const h4Elements = doc.querySelectorAll('h4')

      h4Elements?.forEach((h4Element) => {
        if (h4Element && h4Element?.textContent?.trim().toLowerCase().includes('supplied with')) {
          const ulElement = h4Element.nextElementSibling
          if (ulElement && ulElement.tagName.toLowerCase() === 'ul') {
            const liElements = ulElement.querySelectorAll('li')
            const liTextContent = Array.from(liElements).map(
              (li) => li.textContent
            )
            setSuppliedWithList(liTextContent)
          }
        }
      })
    }
    extractLiElements()
  }, [description])

  const formatDisplayName = (displayName: any) => {
    if (displayName.toLowerCase().startsWith('is')) {
      return displayName.slice(2)
    }
    return displayName.split('_').map((word: any) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  }
  const contentInfo = product?.customAttributes?.filter((attr: any) => attr.key === 'global.contents');
  const PdpCompareAttr = product?.customAttributes?.filter((attr: any) => (attr.compareAtPDP === true && attr.key != 'global.colour'));

  const [brandLink, setBrandLink] = useState('/#')

  useEffect(() => {
    const brand = product?.breadCrumbs?.find((o: any) => o.slugType === 'Manufacturer')
    setBrandLink(`/${brand?.slug?.slug}`)
  }, [product?.breadCrumbs])

  return (
    <div className="px-2 md:px-3 lg:px-4 2xl:px-4 py-[40px]">
      <h2 className="mb-5 font-semibold text-black uppercase font-18 md:mb-5 dark:text-black">Product Details <span className='hidden sm:inline-block'>{' '}of {product?.name}</span></h2>
      <div className="flex flex-col md:flex-row md:gap-40 md:justify-between gap-sm-1">
        <div className="md:w-3/4">
          <div className="mb-5">
            <h3 className="font-semibold text-black uppercase font-18 mob-font-14 dark:text-black">Description</h3>
            <div dangerouslySetInnerHTML={{ __html: description }} className="mt-2 text-sm text-black dark:text-black description-text" />
          </div>
          {PdpCompareAttr?.length > 0 &&
            <div className="mb-5">
              <h2 className="mb-4 font-semibold text-black uppercase font-18 mob-font-14 dark:text-black">Key Features <span className='hidden sm:inline-block'>{' '} of {product?.name}</span></h2>
              <table className="w-full mb-5 font-semibold border border-collapse table-fixed">
                <tbody>
                  {PdpCompareAttr?.map((row: any, index: any) => (
                    <tr key={`key-attributes-${index}`}>

                      <React.Fragment key={`key-attributes-fragment-${index}`}>
                        <td className="px-4 py-2 text-black capitalize border border-black dark:text-black">{formatDisplayName(row?.display)}</td>
                        <td className="px-4 py-2 text-left text-black capitalize border border-black dark:text-black">
                          {row?.value ? row?.value.toLowerCase() == "false" || row?.value.toLowerCase() == "no" ?
                            <><img alt={row?.value} src="/assets/images/cross_icon.svg" width={2} height={2} className='icon-small' /></>
                            : row?.value.toLowerCase() == "true" || row?.value.toLowerCase() == "yes" ?
                              <><img alt={row?.value} src="/assets/images/check_circle.svg" width={2} height={2} className='icon-small-green' /></>
                              : row?.value?.includes('#') ? <span className={`w-4 h-4 ml-1 rounded-full`} style={{ background: row?.value }}></span> : row?.value :
                            <span className='pl-1 font-bold text-gray-900 capitalize'>{'-'}</span>}
                        </td>
                      </React.Fragment>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          }
          <div className="flex flex-col w-full gap-2 mb-5 md:flex-row md:justify-between">
            {/* <button className="btn-primary md:w-2/4" onClick={handleScrollToSection}>Compare Similar products</button> */}
            <Link href={brandLink} passHref legacyBehavior>
              <a className="text-center btn-secondary md:w-full md:mt-0 py-2 btn-radius-sm">Shop All</a>
            </Link>
          </div>
        </div>

        {/* Right Section */}
        {contentInfo?.length > 0 && (
          <div className="md:w-1/4">
            <h3 className="mb-1 font-semibold text-black uppercase font-18 mob-font-14 dark:text-black">What's in the box</h3>
            <ul className='flex flex-col'>
              {contentInfo?.map((item: any, xIdx: number) => (
                <div key={`child-${xIdx}`} className="flex items-center text-black dark:text-black info-ul-div">
                  <div dangerouslySetInnerHTML={{ __html: item?.value }} className="box-item text-sm li-child w-[90%] inner-ul text-black dark:text-black"></div>
                </div>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductDetails
