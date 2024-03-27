import React, { FC } from "react";
import NcImage from "../shared/NcImage/NcImage";
import Link from "next/link";
import { StaticImageData } from "next/image";

export interface CardCategory2Props {
  className?: string;
  ratioClass?: string;
  bgClass?: string;
  featuredImage?: any;
  name: string;
  desc: string;
  link?: any
}

const CardCategory2: FC<CardCategory2Props> = ({
  className = "",
  ratioClass = "aspect-w-1 aspect-h-1",
  bgClass = "bg-white",
  featuredImage,
  name,
  desc,
  link
}) => {
  return (
    <Link
      href={`/${link}`}
      className={`nc-CardCategory2 ${className}`}
      data-nc-id="CardCategory2"
    >
      <div
        className={`flex-1 relative w-full h-0 rounded-2xl overflow-hidden group ${ratioClass} ${bgClass}`}
      >
        <div className="pt-14">
          <img
            alt={name}
            src={featuredImage}
            className="flex justify-center object-cover w-full h-full rounded-2xl"
            sizes="400px"
          />
        </div>
        <span className="absolute inset-0 transition-opacity bg-black opacity-0 group-hover:opacity-100 bg-opacity-10 rounded-2xl"></span>
      </div>
      <div className="flex-1 mt-5 text-center">
        <h2 className="text-base font-semibold sm:text-lg text-neutral-900 dark:text-neutral-100">
          {name}
        </h2>
        <span className="block mt-0.5 sm:mt-1.5 text-sm text-neutral-500 dark:text-neutral-400">
          {desc}
        </span>
      </div>
    </Link>
  );
};

export default CardCategory2;
