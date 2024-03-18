"use client";

import React, { FC, useEffect, useId, useRef, useState } from "react";
import Heading from "@new-components/Heading/Heading";
// @ts-ignore
import Glide from "@glidejs/glide/dist/glide.esm";
import CardCategory2 from "@new-components/CardCategories/CardCategory2";
import department1Png from "images/collections/department1.png";
import department2Png from "images/collections/department2.png";
import department3Png from "images/collections/department3.png";
import department4Png from "images/collections/department4.png";
import { StaticImageData } from "next/image";
import Link from "next/link";
import { useTranslation } from "@commerce/utils/use-translation";

export interface CardCategoryData {
  name: string;
  desc: string;
  img: string | StaticImageData;
  color?: string;
}
const CATS: CardCategoryData[] = [
  {
    name: "Travel Kits",
    desc: "20+ categories",
    img: department1Png,
    color: "bg-indigo-100",
  },
  {
    name: "Beauty Products",
    desc: "10+ categories",
    img: department2Png,
    color: "bg-slate-100",
  },
  {
    name: "Sport Kits",
    desc: "34+ categories",
    img: department3Png,
    color: "bg-sky-100",
  },
  {
    name: "Pets Food",
    desc: "12+ categories",
    img: department4Png,
    color: "bg-orange-100",
  },
];
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
      perView: 4,
      gap: 32,
      bound: true,
      breakpoints: {
        1280: {
          perView: 4,
        },
        1024: {
          gap: 20,
          perView: 3.4,
        },
        768: {
          gap: 20,
          perView: 3,
        },
        640: {
          gap: 20,
          perView: 2.3,
        },
        500: {
          gap: 20,
          perView: 1.4,
        },
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
    <div className={`nc-SectionSliderCategories ${className}`}>
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
              <li key={index} className={`glide__slide ${itemClassName}`}>
                <CardCategory2
                  featuredImage={item.departments_image}
                  name={item.departments_name}
                  desc={item.departments_subtitle}
                  link={item?.departments_link}
                  bgClass={item.color}
                />
              </li>
            ))}
            <li className={`glide__slide ${itemClassName}`}>
              <div
                className={`flex-1 relative w-full h-0 rounded-2xl overflow-hidden group aspect-w-1 aspect-h-1 bg-slate-100`}
              >
                <div>
                  <div className="absolute flex flex-col justify-center inset-y-6 inset-x-10 sm:items-center">
                    <div className="relative flex text-slate-900">
                      <span className="text-lg font-semibold ">
                        {translate('label.section.moreCollectionsText')}
                      </span>
                      <svg
                        className="absolute w-5 h-5 ml-2 transition-transform rotate-45 left-full group-hover:scale-110"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M18.0701 9.57L12.0001 3.5L5.93005 9.57"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeMiterlimit="10"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>
                        <path
                          d="M12 20.4999V3.66992"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeMiterlimit="10"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>
                      </svg>
                    </div>
                    <span className="mt-1 text-sm text-slate-800">
                      {translate('common.label.showMeMoreText')}
                    </span>
                  </div>
                </div>
                <Link
                  href={"/collection"}
                  className="absolute inset-0 transition-opacity bg-black opacity-0 group-hover:opacity-100 bg-opacity-10"
                ></Link>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SectionSliderCategories;
