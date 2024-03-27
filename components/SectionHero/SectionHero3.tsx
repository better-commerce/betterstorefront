import React, { FC } from "react";
import ButtonPrimary from "../shared/Button/ButtonPrimary";
import backgroundLineSvg from "images/Moon.svg";
import imageRightPng2 from "images/hero-2-right-1.png";
import Image from "next/image";
import { useTranslation } from "@commerce/utils/use-translation";

export interface SectionHero3Props {
  className?: string;
}

const SectionHero3: FC<SectionHero3Props> = ({ className = "" }) => {
  const translate = useTranslation()
  return (
    <div
      className={`nc-SectionHero3 relative ${className}`}
      data-nc-id="SectionHero3"
    >
      <div className="relative pt-8 lg:pt-0 lg:absolute z-10 inset-x-0 top-[10%] sm:top-[20%]  container">
        <div className="flex flex-col items-start max-w-lg space-y-5 xl:max-w-2xl xl:space-y-8 ">
          <span className="font-semibold sm:text-lg md:text-xl text-neutral-900">
            {translate('label.section.findTheBestText')}
          </span>
          <h2 className="font-bold text-black text-3xl sm:text-4xl md:text-5xl xl:text-6xl 2xl:text-7xl !leading-[115%] ">
            {translate('label.common.sportsEquipmentCollectionText')}
          </h2>
          <div className="sm:pt-4">
            <ButtonPrimary
              sizeClass="px-6 py-3 lg:px-8 lg:py-4"
              fontSize="text-sm sm:text-base lg:text-lg font-medium"
            >
              {translate('common.label.startYourSearchText')}
            </ButtonPrimary>
          </div>
        </div>
      </div>

      <div className="relative z-[1] lg:aspect-w-16 lg:aspect-h-8 2xl:aspect-h-7">
        <div className="">
          <div className="top-0 bottom-0 right-0 w-full max-w-xl mt-5 ml-auto lg:mt-0 lg:absolute lg:max-w-2xl xl:max-w-3xl 2xl:max-w-4xl">
            <Image
              sizes="(max-width: 768px) 100vw, 50vw"
              fill
              className="object-contain object-right-bottom w-full sm:h-full "
              src={imageRightPng2}
              alt=""
              priority
            />
          </div>
        </div>
      </div>

      {/* BG */}
      <div className="absolute inset-0 bg-[#F7F0EA] rounded-2xl overflow-hidden z-0">
        <Image
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="absolute object-contain w-full h-full"
          src={backgroundLineSvg}
          alt="hero"
        />
      </div>
    </div>
  );
};

export default SectionHero3;
