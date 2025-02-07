import React from "react";
import { generateUri } from "@commerce/utils/uri-util";
import { IMG_PLACEHOLDER } from "@components/utils/textVariables";

interface IChooseListProps {
  readonly data: any
  readonly info: any
}

const ChooseList: React.FC<IChooseListProps> = ({ info, data }: IChooseListProps) => {
  return (
    data && data?.length > 0 &&
    <section className="py-8 bg-tan-color sm:py-16">
      <div className="container-tools">
        {info?.map((heading: any, hid: number) => (
          <div className="block mb-4" key={`choose-list-${hid}`}>
            <h4 className="font-semibold uppercase text-brand-blue">{heading?.whychoose_title}</h4>
          </div>
        ))}
        <div className="grid grid-cols-1 gap-10 py-6 pb-0 lg:grid-cols-4 md:grid-cols-2">
          {data?.map((infoText: any, infoIdx: number) => (
            <div className="flex flex-col" key={`chosen-list-${infoIdx}`}>
              <div className="min-height-48 img-round-cover">
                <img src={generateUri(infoText?.chooselist_image, 'fm=webp&h=35') || IMG_PLACEHOLDER} className="object-cover object-center" alt="icons" width={40} height={40} loading="lazy" />
              </div>
              <h3 className="mt-1 mb-4 font-semibold leading-7 uppercase dark:text-black sm:w-9/12">
                {infoText?.chooselist_title}
              </h3>
              <div dangerouslySetInnerHTML={{ __html: infoText?.chooselist_shortdescription }} className="font-18 p-font-18 dark:text-black"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
export default ChooseList