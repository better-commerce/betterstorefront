import { generateUri } from '@commerce/utils/uri-util';
import { IMG_PLACEHOLDER } from '@components/utils/textVariables';
import { Disclosure } from '@headlessui/react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const DisclosureSection = ({ title, data, name='', isImage = false, imageAttr = '', isDownload = false, isList = false, isTable = false }: any) => {
  return (
    <Disclosure>
      {({ open }) => (
        <>
          <Disclosure.Button className="flex w-full text-[#212530] justify-between py-4 items-center text-left text-sm font-medium focus:outline-none border-b border-black">
            <span className="font-semibold text-black uppercase dark:text-black">{title}</span>
            <i className={`${open ? 'rotate-180 transform' : ''} sprite-dropdown sprite-icons right-2`}></i>
          </Disclosure.Button>
          <Disclosure.Panel className={isImage ? "pt-5" : "px-0 py-5 text-sm"}>
            <div className={`grid justify-evenly sm:grid sm:grid-cols-${isImage ? 3 : 1}  grid-cols-${isImage ? 3 : 1} gap-${isImage ? 4 : 0} ${isTable ? 'px-0' : 'technical-table'} ${isList ? 'technical-list' : 'px-0'}`}>
              {data?.map((item: any, index: number) => (
                <div key={`${title}-${index}`} className={isImage ? 'flex flex-col border border-black rounded-md' : 'font-medium font-14 li-child dark:text-black'}>
                  {isImage ? (
                    <>
                      <img src={generateUri(item?.image, 'h=300&fm=webp') || IMG_PLACEHOLDER} alt={item?.alt} width={300} height={300} className='object-cover object-center h-full bg-white rounded-t-md' />
                      <div className='py-4 font-semibold text-center text-black uppercase border-t border-black font-12 dark:text-black'>{item?.alt}</div>
                    </>
                  ) : (
                    isDownload ?
                      <div className='flex items-center justify-between pb-2 mb-2 align-middle border-b border-gray-300'>
                        <h3 className='mb-0 font-medium text-black dark:text-black font-14'>{item?.description || 'Download Product Specification PDF'}</h3>
                        <Link href={item?.url?.replace(/\/{2,}/g, '/')} passHref legacyBehavior>
                          <a className='text-gray-500' target='_blank'>
                            <img src="/assets/images/download-icon.svg" className='w-8 h-8' alt="Download File" width={20} height={20} />
                          </a>
                        </Link>
                      </div> :
                      <div className='text-black dark:text-black' dangerouslySetInnerHTML={{ __html: item?.value }} />
                  )}
                </div>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

const ProductSpecification = ({ imageTagGroup, attrGroup, pdfs, product }: any) => {
  return (
    <div className="mx-auto sm:pb-4 specification-container">
      {imageTagGroup && imageTagGroup["specifications"] && imageTagGroup["specifications"]?.length > 0 &&
        <DisclosureSection title="Highlights" data={imageTagGroup["specifications"]} isImage={true} isDownload={false} />
      }
      {attrGroup["global.keyinformation"]?.length > 0 &&
        <DisclosureSection title="Key Information" data={attrGroup["global.keyinformation"]} isDownload={false} isList={true} />
      }
      {attrGroup["global.technicalspecification"]?.length > 0 &&
        <DisclosureSection title="Technical Specification" data={attrGroup["global.technicalspecification"]} isDownload={false} isTable={false} />
      }
      {attrGroup["global.warrantydetail"]?.length > 0 &&
        <DisclosureSection title="Warranty" data={attrGroup["global.warrantydetail"]} isDownload={false} isList={true} />
      }
      {pdfs?.length > 0 &&
        <DisclosureSection title="Downloads" data={pdfs} isImage={false} isDownload={true} name={product?.name} />
      }
      {attrGroup["global.class9detail"]?.length > 0 &&
        <DisclosureSection title="CLASS 9" data={attrGroup["global.class9detail"]} />
      }
    </div>
  );
};

export default ProductSpecification;
