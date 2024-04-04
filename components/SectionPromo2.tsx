import React, { FC } from "react";
import rightImgDemo from "images/promo2.png";
import backgroundLineSvg from "images/Moon.svg";
import Image from "next/image";
import Logo from "./shared/Logo/Logo";
import ButtonPrimary from "./shared/Button/ButtonPrimary";
import NcImage from "./shared/NcImage/NcImage";
import { useTranslation } from "@commerce/utils/use-translation";

export interface SectionPromo2Props {
  className?: string;
}

const SectionPromo2: FC<SectionPromo2Props> = ({ className = "lg:pt-10" }) => {
  const translate = useTranslation()
  return (
    <div className={`nc-SectionPromo2 ${className}`}>
      <div className="relative flex flex-col lg:flex-row lg:justify-end bg-yellow-50 dark:bg-slate-800 rounded-2xl sm:rounded-[40px] p-4 pb-0 sm:p-5 sm:pb-0 lg:p-24">
        <div className="absolute inset-0">
          <Image
            fill
            className="absolute object-contain w-full h-full dark:opacity-5"
            src={backgroundLineSvg}
            alt="backgroundLineSvg"
          />
        </div>

        <div className="lg:w-[45%] max-w-lg relative">
          <Logo className="w-28" />
          <h2 className="font-semibold text-3xl sm:text-4xl xl:text-5xl 2xl:text-6xl mt-6 sm:mt-10 !leading-[1.13] tracking-tight">
            {translate('common.label.specialOfferText')} <br />
            {translate('common.label.inKidsProductsText')} 
          </h2>
          <span className="block mt-6 text-slate-500 dark:text-slate-400">
            {translate('common.label.fashionDescription')} 
          </span>
          <div className="flex mt-6 space-x-2 sm:space-x-5 sm:mt-12">
            <ButtonPrimary
              href="/search"
              className="dark:bg-slate-200 dark:text-slate-900"
            >
              {translate('common.label.discoverMoreText')} 
            </ButtonPrimary>
          </div>
        </div>

        <NcImage
          alt=""
          containerClassName="relative block lg:absolute lg:left-0 lg:bottom-0 mt-10 lg:mt-0 max-w-xl lg:max-w-[calc(30%-40px)]"
          src={rightImgDemo}
          sizes="(max-width: 768px) 100vw, 50vw"
          className=""
        />
      </div>
    </div>
  );
};

export default SectionPromo2;
