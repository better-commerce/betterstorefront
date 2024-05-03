"use client";

import React, { FC, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Heading from "@components/Heading/Heading";
// @ts-ignore
import Glide from "@glidejs/glide/dist/glide.esm";
import { CURRENT_THEME } from "./utils/constants";
const ProductCard = dynamic(() => import('@components/ProductCard'))
export interface SectionSliderProductCardProps {
  readonly className?: string;
  readonly itemClassName?: string;
  readonly heading?: any;
  readonly subHeading?: string;
  readonly data?: any;
  readonly featureToggle: any;
}

const SectionSliderProductCard: FC<SectionSliderProductCardProps> = ({ className, itemClassName, heading, subHeading, data, featureToggle }) => {
  const sliderRef = useRef(null);
  const [isShow, setIsShow] = useState(false);
  let dataPerRow = 4
  let dataGap = 32
  if (CURRENT_THEME == "green") {
    dataPerRow = 5.5
  }
  useEffect(() => {
    const OPTIONS: Partial<Glide.Options> = {
      perView: dataPerRow, gap: 32, bound: true, breakpoints: { 1280: { perView: dataPerRow - 1, }, 1024: { gap: 20, perView: dataPerRow - 1, }, 768: { gap: 20, perView: 4 - 2, }, 640: { gap: 20, perView: 1.5, }, 500: { gap: 20, perView: 1.3, }, },
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
    <div className={`nc-SectionSliderProductCard product-card-slider ${className}`}>
      <div ref={sliderRef} className={`flow-root ${isShow ? "" : "invisible"}`}>
        {heading?.map((h: any, iIdx: number) => (
          <Heading key={iIdx} className="mb-12 lg:mb-14 text-neutral-900 dark:text-neutral-50 " desc="" rightDescText={h?.newarrivalheading_subtitle} hasNextPrev >
            {h?.newarrivalheading_title}
          </Heading>
        ))}
        <div className="glide__track" data-glide-el="track">
          <ul className="glide__slides">
            {data?.map((item: any, index: number) => (
              <li key={index} className={`glide__slide product-card-item ${itemClassName}`}>
                <ProductCard data={item} featureToggle={featureToggle} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SectionSliderProductCard;
