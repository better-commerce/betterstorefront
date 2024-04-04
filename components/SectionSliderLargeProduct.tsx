"use client";

import React, { FC, useEffect, useId, useRef, useState } from "react";
import Heading from "@components/Heading/Heading";
// @ts-ignore
import Glide from "@glidejs/glide/dist/glide.esm";
import CollectionCard from "./CollectionCard";
import CollectionCard2 from "./CollectionCard2";
import Link from "next/link";
import { useTranslation } from "@commerce/utils/use-translation";

export interface SectionSliderLargeProductProps {
  className?: string;
  itemClassName?: string;
  cardStyle?: "style1" | "style2";
  data?: any;
  heading?: any;
}

const SectionSliderLargeProduct: FC<SectionSliderLargeProductProps> = ({ className = "", cardStyle = "style2", data, heading }) => {
  const sliderRef = useRef(null);

  const [isShow, setIsShow] = useState(false);
  const translate = useTranslation()
  useEffect(() => {
    const OPTIONS: Partial<Glide.Options> = {
      perView: 3,
      gap: 32,
      bound: true,
      breakpoints: {
        1280: {
          gap: 28,
          perView: 2.5,
        },
        1024: {
          gap: 20,
          perView: 2.15,
        },
        768: {
          gap: 20,
          perView: 1.5,
        },

        500: {
          gap: 20,
          perView: 1,
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

  const MyCollectionCard =
    cardStyle === "style1" ? CollectionCard : CollectionCard2;

  return (
    <div className={`nc-SectionSliderLargeProduct ${className}`}>
      <div ref={sliderRef} className={`flow-root ${isShow ? "" : "invisible"}`}>
        {heading?.map((h: any, hIdx: number) => (
          <div key={hIdx}>
            <Heading isCenter={false} hasNextPrev>
              {h?.lookbookheading_title}
            </Heading>
          </div>
        ))}

        <div className="glide__track" data-glide-el="track">
          <ul className="glide__slides">
            {data?.map((product:any, index:number) => (
              <li className={`glide__slide`} key={index}>
                <MyCollectionCard
                  name={product?.newlookbook_name}
                  price={product?.newlookbook_price}
                  images={product?.newlookbook_looksimage}
                  primaryImage={product?.newlookbook_primaryimage}
                  description={product?.newlookbook_category}
                  link={product?.newlookbook_link}
                />
              </li>
            ))}

            <li className={`glide__slide`}>
              <Link href={"/lookbook"} className="relative block group">
                <div className="relative rounded-2xl overflow-hidden h-[410px]">
                  <div className="h-[410px] bg-black/5 dark:bg-neutral-800"></div>
                  <div className="absolute flex flex-col items-center justify-center inset-y-6 inset-x-10">
                    <div className="relative flex items-center justify-center">
                      <span className="text-xl font-semibold">{translate('common.label.moreLooksText')}</span>
                      <svg className="absolute w-5 h-5 ml-2 transition-transform rotate-45 left-full group-hover:scale-110" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" >
                        <path d="M18.0701 9.57L12.0001 3.5L5.93005 9.57" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12 20.4999V3.66992" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <span className="mt-1 text-sm">{translate('common.label.showMeMoreText')}</span>
                  </div>
                </div>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SectionSliderLargeProduct;
