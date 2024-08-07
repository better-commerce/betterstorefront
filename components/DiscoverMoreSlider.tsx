"use client";

import React, { useEffect, useRef, useState } from "react";
import Heading from "./Heading/Heading";
import CardCategory3 from "./CardCategories/CardCategory3";
// @ts-ignore
import Glide from "@glidejs/glide/dist/glide.esm";
import { sanitizeRelativeUrl } from "@framework/utils/app-util";

const DiscoverMoreSlider = ({ heading, data }: any) => {
  const sliderRef = useRef(null);
  const [isShow, setIsShow] = useState(false);
  useEffect(() => {
    const OPTIONS: Partial<Glide.Options> = {
      perView: 2.8, gap: 32, bound: true,
      breakpoints: {
        1280: { gap: 28, perView: 2.5, },
        1279: { gap: 20, perView: 2.15, },
        1023: { gap: 20, perView: 1.6, },
        768: { gap: 20, perView: 1.2, },
        500: { gap: 20, perView: 1, },
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
    <div ref={sliderRef} className={`nc-DiscoverMoreSlider more-slider-list-section nc-p-l-container ${isShow ? "" : "invisible"}`} >
      {heading?.map((h: any, iIdx: number) => (
        <Heading key={iIdx} className="mb-12 lg:mb-14 text-neutral-900 dark:text-neutral-50 nc-p-r-container " desc="" rightDescText={h?.categoryheading_subtitle} hasNextPrev >
          {h?.categoryheading_title}
        </Heading>
      ))}

      <div className="" data-glide-el="track">
        <ul className="glide__slides">
          {data?.map((item: any, index: number) => (
            <li key={index} className={`glide__slide`}>
              <CardCategory3 name={item?.category_subtitle} desc={item?.category_title} featuredImage={item?.category_image} color={item?.category_categorycolor} link={sanitizeRelativeUrl(`/${item?.category_link}`)} buttonText={item?.category_buttontext} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DiscoverMoreSlider;
