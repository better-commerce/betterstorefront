import { StarIcon } from "@heroicons/react/24/solid";
import { productImgs } from "@components//Header/fakeData";
import React, { FC } from "react";
import Prices from "./Prices";
import Link from "next/link";
import { StaticImageData } from "next/image";
import NcImage from "./shared/NcImage/NcImage";

export interface CollectionCard2Props {
  className?: string;
  images?: any;
  name?: any;
  price?: any;
  description?: any;
  primaryImage?: any;
  link?:any
}

const CollectionCard2: FC<CollectionCard2Props> = ({ className, images, name, description, price, primaryImage, link}) => {
  return (
    <div className={`CollectionCard2 group relative ${className}`}>
      <div className="relative flex flex-col">
        <img
          className="object-contain w-full h-full pb-0 overflow-hidden rounded-2xl aspect-w-8 aspect-h-5 bg-neutral-100"
          src={primaryImage}
          alt=""
          sizes="400px"
        />
        <div className="grid grid-cols-3 gap-2.5 mt-2.5">
          {images?.map((img: any, imgIdx: number) => (
            <img key={imgIdx}
              className="object-cover w-full h-24 rounded-2xl sm:h-28"
              src={img}
              alt=""
              sizes="150px"
            />
          ))}
        </div>
      </div>

      <div className="relative flex justify-between mt-5">
        {/* TITLE */}
        <div className="flex-1">
          <h2 className="text-lg font-semibold sm:text-xl ">{name}</h2>
          {/* AUTHOR */}
          <div className="flex items-center mt-3 text-slate-500 dark:text-slate-400">
            <span className="text-sm ">
              <span className="line-clamp-1">{description}</span>
            </span>            
          </div>
        </div>
      </div>
      <Link href={`/${link}`} className="absolute inset-0 "></Link>
    </div>
  );
};

export default CollectionCard2;
