import { IMG_PLACEHOLDER } from '@components/utils/textVariables'
import 'swiper/css'
import 'swiper/css/navigation'
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode } from 'swiper'
import Image from 'next/image'
import { groupBy } from 'lodash'
import { useState } from 'react'
import { generateUri } from '@commerce/utils/uri-util'
import { useTranslation } from '@commerce/utils/use-translation'
export default function TechnicalSpecifications({
  attrGroup,
  product,
  deviceInfo,
}: any) {
  const [paddingTop, setPaddingTop] = useState('0')
  const { isOnlyMobile } = deviceInfo
  const translate = useTranslation()
  const AttributeGroup = ({ title, attributes }: any) => {
    if (!attributes?.length) return null;

    return (
      <div className="flex items-center px-3 justify-evenly">
        <div className="flex flex-col w-1/3 py-2">
          <h4 className="text-sm font-medium text-black">{title}</h4>
        </div>
        <div className="flex flex-wrap w-2/3 py-2 pl-4 border-l border-gray-200">
          {attributes.map((attr: any, index: number) => (
            <div className="flex justify-start comma" key={index}>
              <span className="pr-1 text-xs font-normal capitalize text-dark-brown sm:text-sm">
                {attr.fieldText}
                {attributes.length > 1 && index < attributes.length - 1 && (
                  <span className="s-icon">,</span>
                )}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="flex flex-col border border-gray-200 divide-y rounded-2xl">
        <AttributeGroup title={translate('label.product.specifications.collarText')} attributes={attrGroup['product.collar']} />
        <AttributeGroup title={translate('label.product.specifications.fabricText')} attributes={attrGroup['fabric.type']} />
        <AttributeGroup title={translate('label.product.specifications.occasionText')} attributes={attrGroup['occasion.type']} />
        <AttributeGroup title={translate('label.product.specifications.occasionText')} attributes={attrGroup['occasion']} />
        <AttributeGroup title="Event Type" attributes={attrGroup['event.type']} />
        <AttributeGroup title={translate('label.product.specifications.typeText')} attributes={attrGroup['edit.type']} />
        <AttributeGroup title={translate('label.product.specifications.categoriesText')} attributes={attrGroup['Categories']} />
        <AttributeGroup title={translate('label.product.specifications.sleeveStyleText')} attributes={attrGroup['product.sleevestyle']} />
        <AttributeGroup title={translate('label.product.specifications.printText')} attributes={attrGroup['product.print']} />
        <AttributeGroup title={translate('label.product.specifications.collectionTypeText')} attributes={attrGroup['Collection.Type']} />
        <AttributeGroup title={translate('label.product.specifications.fabricText')} attributes={attrGroup['product.fabric']} />
        <AttributeGroup title={translate('label.product.specifications.dressStyleText')} attributes={attrGroup['dress.style']} />
        <AttributeGroup title={translate('label.product.specifications.clothingText')} attributes={attrGroup['clothing.type']} />
      </div>
    </>
  )
}
