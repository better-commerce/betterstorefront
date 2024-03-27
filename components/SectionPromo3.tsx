import React, { FC } from "react";
import rightImgDemo from "images/promo3.png";
import backgroundLineSvg from "images/BackgroundLine.svg";
import { ArrowSmallRightIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Badge from "./shared/Badge/Badge";
import Input from "./shared/Input/Input";
import ButtonCircle from "./shared/Button/ButtonCircle";
import NcImage from "./shared/NcImage/NcImage";
import { useTranslation } from "@commerce/utils/use-translation";

export interface SectionPromo3Props {
  className?: string;
  data?: any;
}

const SectionPromo3: FC<SectionPromo3Props> = ({ className = "lg:pt-10", data }) => {
  const translate = useTranslation()
  return (
    <div className={`nc-SectionPromo3 ${className}`}>
      {data?.map((subs: any, subsIdx: number) => (
        <div key={subsIdx} className="relative flex flex-col lg:flex-row bg-slate-50 dark:bg-slate-800 rounded-2xl sm:rounded-[40px] p-4 pb-0 sm:p-5 sm:pb-0 lg:p-24">
          <div className="absolute inset-0">
            <Image
              fill
              className="absolute object-contain object-bottom w-full h-full dark:opacity-5"
              src={backgroundLineSvg}
              alt="backgroundLineSvg"
            />
          </div>

          <div className="lg:w-[50%] max-w-lg relative z-[99999]">
            <h2 className="text-4xl font-semibold md:text-5xl">
              {subs?.subscription_title}
            </h2>
            <span className="block mt-5 text-neutral-500 dark:text-neutral-400">
              {subs?.subscription_subtitle}
            </span>
            {/* <div
              dangerouslySetInnerHTML={{
                __html: subs?.subscription_offerslist,
              }}
              className="px-5 py-10 mt-5 text-gray-900"
            /> */}
            <form className="relative max-w-sm mt-10">
              <Input
                required
                aria-required
                placeholder={translate('common.message.enterYourEmailText')}
                type="email"
                rounded="rounded-full"
              />
              <ButtonCircle
                type="submit"
                className="absolute transform -translate-y-1/2 top-1/2 right-1"
              >
                <ArrowSmallRightIcon className="w-6 h-6" />
              </ButtonCircle>
            </form>
          </div>

          <img
            alt={subs?.subscription_title}
            src={subs?.subscription_image}
            sizes="(max-width: 768px) 100vw, 50vw "
            className="relative block lg:absolute lg:right-0 lg:bottom-0 mt-10 lg:mt-0 max-w-lg lg:max-w-[calc(40%-40px)]"
          />
        </div>
      ))}
    </div>
  );
};

export default SectionPromo3;
