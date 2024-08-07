"use client";

import React, { FC, useState } from "react";
import backgroundLineSvg from "images/Moon.svg";
import useInterval from "react-use/lib/useInterval";
import useBoolean from "react-use/lib/useBoolean";
import Image from "next/image";
import ButtonPrimary from "../shared/Button/ButtonPrimary";
import Prev from "../shared/NextPrev/Prev";
import Next from "../shared/NextPrev/Next";
import { useTranslation } from "@commerce/utils/use-translation";
import { generateUri } from "@commerce/utils/uri-util";
import { IMG_PLACEHOLDER } from "@components/utils/textVariables";
import { sanitizeRelativeUrl } from "@framework/utils/app-util";
import Link from "next/link";

export interface SectionHero2Props {
  className?: string;
  data?: any
}

let TIME_OUT: NodeJS.Timeout | null = null;

const SectionHero2: FC<SectionHero2Props> = ({ className = "", data }) => {
  const translate = useTranslation()
  const [indexActive, setIndexActive] = useState(0);
  const [isRunning, toggleIsRunning] = useBoolean(true);

  useInterval(
    () => { handleAutoNext(); }, isRunning ? 6000000 : null
  );

  const handleAutoNext = () => {
    setIndexActive((state) => {
      if (state >= data?.length - 1) {
        return 0;
      }
      return state + 1;
    });
  };

  const handleClickNext = () => {
    setIndexActive((state) => {
      if (state >= data?.length - 1) {
        return 0;
      }
      return state + 1;
    });
    handleAfterClick();
  };

  const handleClickPrev = () => {
    setIndexActive((state) => {
      if (state === 0) {
        return data?.length - 1;
      }
      return state - 1;
    });
    handleAfterClick();
  };

  const handleAfterClick = () => {
    toggleIsRunning(false);
    if (TIME_OUT) {
      clearTimeout(TIME_OUT);
    }
    TIME_OUT = setTimeout(() => { toggleIsRunning(true); }, 1000000);
  };

  const renderItem = (index: number) => {
    const isActive = indexActive === index;
    const item = data[index];
    if (!isActive) {
      return null;
    }
    return (
      <div className="group home-banner-group-mob cls-fix-banner" key={`hero-banner-${index}`}>
        <h1 className='sr-only'>{item?.name}</h1>
        <div className={`nc-SectionHero2Item nc-SectionHero2Item--animation flex flex-col-reverse lg:flex-col z-[0] relative sm:!pt-0 ${className}`}>
          <div className="flex justify-center -translate-x-1/2 bottom-4 start-1/2 rtl:translate-x-1/2 absolute z-[999]">
            {data?.map((_: any, index: number) => {
              const isActive = indexActive === index;
              return (
                <div key={`banner-hero-${index}`} onClick={() => { setIndexActive(index); handleAfterClick(); }} className={`relative px-1 py-1.5 cursor-pointer`} >
                  <div className={`${isActive ? 'w-20':'w-4'} relative h-1 shadow-sm rounded-md bg-gray-400 sm:bg-white `} >
                    {isActive && (
                      <div className={`nc-SectionHero2Item__dot absolute inset-0 bg-black rounded-md`} ></div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <Prev className="absolute start-1 sm:start-5 top-1/2 sm:top-1/2 -translate-y-1/2 z-10 !text-slate-700 banner-prev sm:opacity-0 sm:group-hover:opacity-100 transition-opacity ease-in	" btnClassName="sm:w-12 sm:h-12 w-4 h-4 hover:border-slate-400 dark:hover:border-slate-400" svgSize="w-6 h-6" onClickPrev={handleClickPrev} />
          <Next className="absolute end-1 sm:end-5 top-1/2 sm:top-1/2 -translate-y-1/2 z-10 !text-slate-700 banner-next sm:opacity-0 sm:group-hover:opacity-100 ease-in	" btnClassName="sm:w-12 sm:h-12 w-4 h-4 hover:border-slate-400 dark:hover:border-slate-400" svgSize="w-6 h-6" onClickNext={handleClickNext} />

          <div className="absolute inset-0 bg-banner mob-bg-banner-height cls-fix-banner">
            <Image fill sizes="(max-width: 768px) 100vw, 50vw" className="absolute object-contain w-full h-full" src={backgroundLineSvg} alt="hero" />
          </div>

          <Link href={sanitizeRelativeUrl(item?.link)} passHref className="container relative z-0 pb-0 pt-14 sm:pt-20 lg:py-44 hero-container cls-fix-banner mob-hero-container">
            <div>
              <div className="w-full mob-hero inner-container">
                <div className={`relative z-[99] w-full max-w-3xl space-y-4 sm:space-y-14 nc-SectionHero2Item__left mobile-left-center-info`} >
                  <div className="space-y-5 sm:space-y-6 text-info-inner">
                    <span className="block text-base font-medium nc-SectionHero2Item__subheading md:text-xl text-slate-700">
                      {item?.subTitle}
                    </span>
                    <h2 className="nc-SectionHero2Item__heading font-semibold text-3xl sm:text-4xl md:text-5xl xl:text-6xl 2xl:text-7xl !leading-[114%] text-slate-900">
                      {item?.name}
                    </h2>
                  </div>
 
                  <ButtonPrimary className="text-white nc-SectionHero2Item__button dark:bg-slate-900" sizeClass="py-3 px-6 sm:py-5 sm:px-9" href={sanitizeRelativeUrl(item?.link)}>
                    <span className="dark:text-white">{translate('label.home.exploreMoreBtnText')}</span>
                    <span>
                      <svg className="w-5 h-5 ms-2.5 dark:text-white" viewBox="0 0 24 24" fill="none">
                        <path d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M22 22L20 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </ButtonPrimary>
                </div>
                <div className="top-0 bottom-0 w-full z-[1] max-w-2xl mt-10 lg:mt-0 lg:absolute end-0 rtl:-end-28 xl:max-w-3xl 2xl:max-w-4xl banner-image-container">
                  <img className="object-contain object-right-bottom w-full h-full nc-SectionHero2Item__image" src={generateUri(item?.url, 'h=700&fm=webp') || IMG_PLACEHOLDER} alt={item?.name} />
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    );
  };

  return <>{data?.map((_: any, index: number) => renderItem(index))}</>;
};

export default SectionHero2;
