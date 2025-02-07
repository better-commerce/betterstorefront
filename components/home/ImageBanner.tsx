import React from 'react';
import Link from 'next/link'
import { generateUri } from '@commerce/utils/uri-util';
import { IMG_PLACEHOLDER } from '@components/utils/textVariables';
import { IDeviceInfo } from '@components/ui/context';
interface IImageBannerProps {
  readonly data: any
  readonly deviceInfo: IDeviceInfo
}

const ImageBanner: React.FC<IImageBannerProps> = ({ data, deviceInfo }: IImageBannerProps) => {
  const { isMobile } = deviceInfo
  const getClassName = (index: number) => {
    switch (index) {
      case (0):
        return {
          sectionCls: 'bg-blue-web',
          btnCls: 'btn-primary-white',
          textCls: 'order-2 order-sm-2 sm:order-1 white-dot-border',
          imageCls: 'order-1 order-sm-1 sm:order-2',
          textcolor: 'text-white',
          iconCls: 'bg-blue-web left-icon-pos'
        };
      case (1):
        return {
          sectionCls: 'bg-tan-color',
          btnCls: 'btn-primary-blue',
          textCls: 'order-2 order-sm-2 sm:order-2 gray-dot-border',
          imageCls: 'order-1 order-sm-1 sm:order-1',
          textcolor: 'text-brand-blue',
          iconCls: 'bg-tan-color right-icon-pos'
        };
      default:
        return {
          sectionCls: '',
          btnCls: '',
          textCls: '',
          imageCls: '',
          textcolor: '',
          iconCls: ''
        };
    }
  }
  let imageHeight = '508'
  if (isMobile) {
    imageHeight = '308'
  }
  return (
    data?.map((imgBanner: any, ild: number) => (
      <section className={`${getClassName(ild).sectionCls} img-list`} key={ild}>
        <div className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 grid-sm-1">
          <div className={`${getClassName(ild).textCls} flex justify-center flex-col left-image-banner`}>
            <div className={`${getClassName(ild).iconCls} relative icon-div`}>
              <h2 className={`${getClassName(ild).textcolor} uppercase text-white sm:text-6xl text-3xl mb-2 sm:mb-6 font-semibold`}>{imgBanner?.imagelist_title}</h2>
              <div dangerouslySetInnerHTML={{ __html: imgBanner?.imagelist_description, }} className={`${getClassName(ild).textcolor} font-24  mb-6 p-container`} />
              <Link href={imgBanner?.imagelist_buttonlink || '/'} passHref legacyBehavior>
                <a className={`${getClassName(ild).btnCls} font-14 uppercase`}>{imgBanner?.imagelist_buttontext}</a>
              </Link>
            </div>
          </div>
          <div className={`${getClassName(ild).imageCls} right-img-info`}>
            <img src={generateUri(imgBanner?.imagelist_image, `fm=webp&h=${imageHeight}`) || IMG_PLACEHOLDER} className="object-cover object-center w-full h-full" alt={imgBanner?.imagelist_title} width={720} height={imageHeight} loading="lazy" />
          </div>
        </div>
      </section>
    ))
  )
}

export default ImageBanner