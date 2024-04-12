"use client";

import React, { FC, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Heading from "@components/Heading/Heading";
// @ts-ignore
import Glide from "@glidejs/glide/dist/glide.esm";
import Link from "next/link";
import cn from 'classnames'
import Prices from "@components/Prices";
import { getCurrency, getCurrencySymbol, getFeaturesConfig } from "@framework/utils/app-util";
import { priceFormat, roundToDecimalPlaces, stringToBoolean } from "@framework/utils/parse-util";
import { useUI } from "@components/ui";
import { generateUri } from "@commerce/utils/uri-util";
import { IMG_PLACEHOLDER } from "@components/utils/textVariables";
const ProductCard = dynamic(() => import('@components/ProductCard'))
export interface SectionSliderProductCardProps {
  className?: string;
  itemClassName?: string;
  heading?: any;
  subHeading?: string;
  data?: any;
}

const EngageProductCard: FC<SectionSliderProductCardProps> = ({ className, itemClassName, heading, subHeading, data }) => {
  const sliderRef = useRef(null);
  const [isShow, setIsShow] = useState(false);
  const { user, isCompared } = useUI()
  const currencyCode = getCurrencySymbol()
  const isComparedEnabled = useMemo(() => {
    return getFeaturesConfig()?.features?.enableCompare && stringToBoolean(isCompared)
  }, [])
  useEffect(() => {
    const OPTIONS: Partial<Glide.Options> = {
      perView: 4, gap: 32, bound: true, breakpoints: { 1280: { perView: 4 - 1, }, 1024: { gap: 20, perView: 4 - 1, }, 768: { gap: 20, perView: 4 - 2, }, 640: { gap: 20, perView: 1.5, }, 500: { gap: 20, perView: 1.3, }, },
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
    <div className={`nc-SectionSliderProductCard ${className}`}>
      <div ref={sliderRef} className={`flow-root ${isShow ? "" : "invisible"}`}>
        <Heading className="mb-12 lg:mb-14 text-neutral-900 dark:text-neutral-50 " desc="" rightDescText={subHeading} hasNextPrev >
          {heading}
        </Heading>
        <div className="glide__track" data-glide-el="track">
          <ul className="glide__slides">
            {data?.map((item: any, index: number) => (
              <li key={index} className={`glide__slide ${itemClassName}`}>
                <div key={index} className={cn(`nc-ProductCard relative flex flex-col sm:group bg-transparent mb-6`)}>
                  <div className="relative flex-shrink-0 overflow-hidden bg-slate-50 dark:bg-slate-300 rounded-3xl z-1 group">
                    <ButtonLink isComparedEnabled={isComparedEnabled} href={`${item?.product_url}`} itemPrice={item?.price} productName={item?.title}>
                      <div className="flex w-full h-0 aspect-w-11 aspect-h-12">
                        <img src={generateUri(item?.image_url, 'h=400&fm=webp') || IMG_PLACEHOLDER} className="object-cover object-top w-full h-full drop-shadow-xl" alt={item?.title} />
                      </div>
                    </ButtonLink>

                    {/* <LikeButton liked={isInWishList} className="absolute z-0 top-3 end-3" handleWishList={handleWishList} /> */}

                  </div>

                  <ButtonLink isComparedEnabled={isComparedEnabled} href={`${item?.product_url}`} itemPrice={item?.price} productName={item?.title}>
                    <div className="space-y-4 px-2.5 pt-5 pb-2.5">
                      <div>
                        <h2 className="text-base text-left font-semibold transition-colors min-h-[60px] nc-ProductCard__title">{item?.title}</h2>
                        <p className={`text-sm text-left text-slate-500 dark:text-slate-400 mt-1`}>{item?.brand}</p>
                      </div>
                      <div className="flex items-center justify-between ">
                        <div className="font-semibold font-14 text-green">
                          {currencyCode}{item?.price}
                          {item?.sale_price > item?.price &&
                            <span className="px-1 font-normal text-gray-400 line-through font-12">{currencyCode}{item?.sale_price}</span>
                          }
                        </div>
                      </div>
                    </div>
                  </ButtonLink>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
const ButtonLink = (props: any) => {
  const { isComparedEnabled, children, href, handleHover, itemPrice, productName, onClick, } = props
  if (isComparedEnabled) {
    return (
      <div className="flex flex-col w-full" onClick={onClick}>{children}</div>
    )
  }
  return (
    <Link passHref href={href} className="img-link-display" title={`${productName} \t ${itemPrice}`}>
      {children}
    </Link>
  )
}
export default EngageProductCard;
