"use client";

import React, { FC, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Heading from "@components/Heading/Heading";
// @ts-ignore
import Glide from "@glidejs/glide/dist/glide.esm";
import { CURRENT_THEME } from "./utils/constants";
import GliderNextPrev from "./Heading/GliderNextPrev";
const ProductCard = dynamic(() => import('@components/ProductCard'))
export interface SectionSliderProductCardProps {
  readonly className?: string;
  readonly itemClassName?: string;
  readonly heading?: any;
  readonly subHeading?: string;
  readonly data?: any;
  readonly featureToggle: any;
  readonly defaultDisplayMembership: any;
  readonly deviceInfo: any;
}

const SectionSliderProductCard: FC<SectionSliderProductCardProps> = ({ className, itemClassName, heading, subHeading, data, featureToggle, defaultDisplayMembership, deviceInfo }) => {
  const sliderRef = useRef(null);
  const [isShow, setIsShow] = useState(false);
  let dataPerRow = 4
  let dataPerRowMed = 4
  let dataGap = 32
  if (CURRENT_THEME == "green") {
    dataPerRow = 6
    dataPerRowMed = 5
    dataGap = 20
  }
  useEffect(() => {
    const OPTIONS: Partial<Glide.Options> = {
      perView: dataPerRow, gap: dataGap, bound: true, breakpoints: { 1280: { perView: dataPerRowMed - 1, }, 1024: { gap: 20, perView: dataPerRowMed - 1, }, 768: { gap: 20, perView: dataPerRowMed - 2, }, 640: { gap: 20, perView: 1.5, }, 500: { gap: 20, perView: 1.3, }, },
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
    <div className={`nc-SectionSliderProductCard product-card-slider relative ${className}`}>
      <div ref={sliderRef} className={`flow-root ${isShow ? "" : "invisible"}`}>
        {CURRENT_THEME != 'green' ? (<>
          {heading?.map((h: any, iIdx: number) => (
            <Heading key={iIdx} className="mb-12 lg:mb-14 text-neutral-900 dark:text-neutral-50 heading-px-4" desc="" rightDescText={h?.newarrivalheading_subtitle || h?.popularheading_subtitle || h?.saleheading_subtitle} hasNextPrev >
              {h?.newarrivalheading_title || h?.saleheading_title || h?.popularheading_title}
            </Heading>
          ))}
        </>) : (<>
          {heading?.map((h: any, iIdx: number) => (
            <GliderNextPrev key={iIdx} className="text-neutral-900 dark:text-neutral-50 heading-px-4" desc="" rightDescText={h?.newarrivalheading_subtitle || h?.popularheading_subtitle || h?.saleheading_subtitle} hasNextPrev >
              {h?.newarrivalheading_title || h?.saleheading_title || h?.popularheading_title}
            </GliderNextPrev>
          ))}
        </>)}

        <div className="glide__track" data-glide-el="track">
          <ul className="glide__slides">
            {data?.map((item: any, index: number) => (
              <li key={index} className={`glide__slide product-card-item home-product-card ${itemClassName}`}>
                <ProductCard deviceInfo={deviceInfo} data={item} featureToggle={featureToggle} defaultDisplayMembership={defaultDisplayMembership} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SectionSliderProductCard;
