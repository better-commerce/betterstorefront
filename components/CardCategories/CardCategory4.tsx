import React, { FC } from "react";
import NcImage from "../shared/NcImage/NcImage";
import explore1Svg from "images/collections/explore1.svg";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { useTranslation } from "@commerce/utils/use-translation";

export interface CardCategory4Props {
  className?: string;
  featuredImage?: StaticImageData | string;
  bgSVG?: string;
  name: string;
  desc: string;
  color?: string;
  count?: number;
}

const CardCategory4: FC<CardCategory4Props> = ({
  className = "",
  featuredImage = ".",
  bgSVG = explore1Svg,
  name,
  desc,
  color = "bg-rose-50",
  count,
}) => {
  const translate = useTranslation()
  return (
    <div
      className={`nc-CardCategory4 relative w-full aspect-w-12 aspect-h-11 h-0 rounded-3xl overflow-hidden bg-white dark:bg-neutral-900 group hover:nc-shadow-lg transition-shadow ${className}`}
    >
      <div>
        <div className="absolute bottom-0 right-0 max-w-[280px] opacity-80">
          <Image src={bgSVG} alt="" />
        </div>

        <div className="absolute flex flex-col justify-between inset-5 sm:inset-8">
          <div className="flex items-center justify-between">
            <NcImage
              alt=""
              src={featuredImage}
              containerClassName={`w-20 h-20 rounded-full overflow-hidden z-0 ${color}`}
              width={80}
              height={80}
            />
            <span className="text-xs font-medium text-slate-700 dark:text-neutral-300">
              {count}{' '}{translate('common.label.productsText')}
            </span>
          </div>

          <div className="">
            <span
              className={`block mb-2 text-sm text-slate-500 dark:text-slate-400`}
            >
              {desc}
            </span>
            <h2 className={`text-2xl sm:text-3xl font-semibold`}>{name}</h2>
          </div>

          <Link
            href={"/collection"}
            className="flex items-center text-sm font-medium transition-colors group-hover:text-primary-500"
          >
            <span>{translate('common.label.seeCollectionText')}</span>
            <ArrowRightIcon className="w-4 h-4 ml-2.5" />
          </Link>
        </div>
      </div>

      <Link href={"/collection"}></Link>
    </div>
  );
};

export default CardCategory4;
