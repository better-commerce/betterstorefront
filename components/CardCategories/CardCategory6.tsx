import React, { FC } from "react";
import NcImage from "../shared/NcImage/NcImage";
import explore1Svg from "images/collections/explore1.svg";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { useTranslation } from "@commerce/utils/use-translation";

export interface CardCategory6Props {
  className?: string;
  featuredImage?: string | StaticImageData;
  bgSVG?: string;
  name: string;
  desc: string;
  color?: string;
}

const CardCategory6: FC<CardCategory6Props> = ({
  className = "",
  featuredImage = ".",
  bgSVG = explore1Svg,
  name,
  desc,
  color = "bg-rose-50",
}) => {
  const translate = useTranslation()
  return (
    <div
      className={`nc-CardCategory6 relative w-full aspect-w-1 aspect-h-1 h-0 rounded-3xl overflow-hidden bg-white dark:bg-neutral-900 group hover:nc-shadow-lg transition-shadow ${className}`}
    >
      <div>
        <div className="absolute top-0 bottom-0 right-0 opacity-10">
          <Image src={bgSVG} alt="" />
        </div>

        <div className="absolute flex flex-col items-center justify-between inset-5">
          <div className="flex items-center justify-center">
            <NcImage
              alt=""
              src={featuredImage}
              containerClassName={`w-20 h-20 rounded-full overflow-hidden z-0 ${color}`}
            />
          </div>

          <div className="text-center">
            <span
              className={`block mb-1 text-sm text-slate-500 dark:text-slate-400`}
            >
              {desc}
            </span>
            <h2 className={`text-lg sm:text-xl font-semibold`}>{name}</h2>
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

export default CardCategory6;
