import React, { FC } from "react";
import rightImgDemo from "images/rightLargeImg.png";
import rightLargeImgDark from "images/rightLargeImgDark.png";
import ButtonPrimary from "./shared/Button/ButtonPrimary";
import ButtonSecondary from "./shared/Button/ButtonSecondary";
import NcImage from "./shared/NcImage/NcImage";
import Logo from "./shared/Logo/Logo";
import { useTranslation } from "@commerce/utils/use-translation";
export interface SectionPromo1Props {
  className?: string;
}

const SectionPromo1: FC<SectionPromo1Props> = ({ className = "" }) => {
  const translate = useTranslation()
  return (
    <div
      className={`nc-SectionPromo1 relative flex flex-col lg:flex-row items-center ${className}`}
    >
      <div className="relative flex-shrink-0 mb-16 lg:mb-0 lg:mr-10 lg:w-2/5">
        <Logo className="w-28" />
        <h2 className="font-semibold text-3xl sm:text-4xl xl:text-5xl 2xl:text-6xl mt-6 sm:mt-10 !leading-[1.2] tracking-tight">
          {translate('common.label.earnFreeMoneyText')} <br /> {translate('common.label.withCisecoText')}
        </h2>
        <span className="block mt-6 text-slate-500 dark:text-slate-400 ">
          {translate('common.label.comboTitle')} 
        </span>
        <div className="flex mt-6 space-x-2 sm:space-x-5 sm:mt-12">
          <ButtonPrimary href="/collection" className="">
            {translate('common.label.savingsComboText')} 
          </ButtonPrimary>
          <ButtonSecondary
            href="/search"
            className="border border-slate-100 dark:border-slate-700"
          >
            {translate('common.label.discoverMoreText')} 
          </ButtonSecondary>
        </div>
      </div>
      <div className="relative flex-1 max-w-xl lg:max-w-none">
        <NcImage
          alt=""
          containerClassName="block dark:hidden"
          src={rightImgDemo}
          sizes="(max-width: 768px) 100vw, 50vw"
          className=""
        />
        <NcImage
          alt=""
          containerClassName="hidden dark:block"
          src={rightLargeImgDark}
          sizes="(max-width: 768px) 100vw, 50vw"
          className=""
        />
      </div>
    </div>
  );
};

export default SectionPromo1;
