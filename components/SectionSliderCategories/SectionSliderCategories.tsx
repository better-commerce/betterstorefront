"use client";

import React, { FC, useEffect, useRef, useState } from "react";
import Heading from "@components/Heading/Heading";
// @ts-ignore
import Glide from "@glidejs/glide/dist/glide.esm";
import CardCategory2 from "@components/CardCategories/CardCategory2";
import { StaticImageData } from "next/image";
import Link from "next/link";
import { useTranslation } from "@commerce/utils/use-translation";
import { sanitizeRelativeUrl } from "@framework/utils/app-util";

export interface CardCategoryData {
  name: string;
  desc: string;
  img: string | StaticImageData;
  color?: string;
}

export interface SectionSliderCategoriesProps {
  className?: string;
  itemClassName?: string;
  heading?: any;
  subHeading?: string;
  data?: any;
}

const SectionSliderCategories: FC<SectionSliderCategoriesProps> = ({
  heading,
  subHeading = "",
  className = "",
  itemClassName = "",
  data,
}) => {
  const translate = useTranslation()
  const sliderRef = useRef(null);
  const [isShow, setIsShow] = useState(false);

  useEffect(() => {
    const OPTIONS: Partial<Glide.Options> = {
      perView: 4, gap: 32, bound: true,
      breakpoints: {
        1280: { perView: 4, },
        1024: { gap: 20, perView: 3.4, },
        768: { gap: 20, perView: 3, },
        640: { gap: 20, perView: 2.3, },
        500: { gap: 20, perView: 1.4, },
      },
    };

    if (!sliderRef.current) return;

    let slider = new Glide(sliderRef.current, OPTIONS);
    slider.mount();
    setIsShow(true);
    return () => {
      slider.destroy();
    };
  }, [sliderRef]);

  return (
    <div className={`nc-SectionSliderCategories category-slider-section ${className}`}>
      <div ref={sliderRef} className={`flow-root ${isShow ? "" : "invisible"}`}>
        {heading?.map((h: any, hIdx: number) => (
          <div key={hIdx}>
            <Heading desc={h?.departmentheading_subtitle} hasNextPrev>
              {h?.departmentheading_title}
            </Heading>
          </div>
        ))}
        <div className="glide__track" data-glide-el="track">
          <ul className="glide__slides">
            {data?.map((item: any, index: number) => (
              <li key={index} className={`glide__slide category-card ${itemClassName}`}>
                <CardCategory2 featuredImage={item.departments_image} name={item?.departments_name} desc={item?.departments_subtitle} link={sanitizeRelativeUrl(`/${item?.departments_link}`)} bgClass={item?.color} />
              </li>
            ))}
            <li className={`glide__slide ${itemClassName}`}>
              <div className={`flex-1 relative w-full h-0 rounded-2xl overflow-hidden group aspect-w-1 aspect-h-1 bg-slate-100`} >
                <div>
                  <div className="absolute flex flex-col justify-center inset-y-6 inset-x-10 sm:items-center">
                    <div className="relative flex text-slate-900">
                      <span className="text-lg font-semibold ">
                        {translate('label.section.moreCollectionsText')}
                      </span>
                      <svg className="absolute w-5 h-5 ml-2 transition-transform rotate-45 left-full group-hover:scale-110" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" >
                        <path d="M18.0701 9.57L12.0001 3.5L5.93005 9.57" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" ></path>
                        <path d="M12 20.4999V3.66992" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" ></path>
                      </svg>
                    </div>
                    <span className="mt-1 text-sm text-slate-800">
                      {translate('common.label.showMeMoreText')}
                    </span>
                  </div>
                </div>
                <Link href={"/collection"} className="absolute inset-0 transition-opacity bg-black opacity-0 group-hover:opacity-100 bg-opacity-10" ><span className="sr-only">{translate('common.label.showMeMoreText')}</span></Link>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SectionSliderCategories;
