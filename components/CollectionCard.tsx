import { StarIcon } from "@heroicons/react/24/solid";
import { productImgs } from "@components//Header/fakeData";
import React, { FC } from "react";

import Prices from "./Prices";
import Link from "next/link";
import { StaticImageData } from "next/image";
import NcImage from "./shared/NcImage/NcImage";
import { useTranslation } from "@commerce/utils/use-translation";

export interface CollectionCard2Props {
  className?: string;
  imgs?: (string | StaticImageData)[];
  name?: string;
  price?: number;
  description?: string;
}

const CollectionCard2: FC<CollectionCard2Props> = ({
  className,
  imgs = [productImgs[9], productImgs[10], productImgs[11], productImgs[8]],
  name = "Product Name",
  description = "Product Description",
  price,
}) => {
  const translate = useTranslation();
  return (
    <div className={`CollectionCard2 group relative ${className}`}>
      <div className="relative flex flex-col">
        <NcImage
          containerClassName="aspect-w-8 aspect-h-5 bg-neutral-100 rounded-2xl overflow-hidden"
          className="object-contain w-full h-full rounded-2xl"
          src={imgs[0]}
          alt=""
          sizes="400px"
        />
        <div className="grid grid-cols-3 gap-2.5 mt-2.5">
          <NcImage
            containerClassName="w-full h-24 sm:h-28"
            className="object-cover w-full h-full rounded-2xl"
            src={imgs[1]}
            alt=""
            sizes="150px"
          />
          <NcImage
            containerClassName="w-full h-24 sm:h-28"
            className="object-cover w-full h-full rounded-2xl"
            src={imgs[2]}
            alt=""
            sizes="150px"
          />
          <NcImage
            containerClassName="w-full h-24 sm:h-28"
            className="object-cover w-full h-full rounded-2xl"
            src={imgs[3]}
            alt=""
            sizes="150px"
          />
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
            <span className="h-5 mx-1 border-l sm:mx-2 border-slate-200 dark:border-slate-700"></span>
            <StarIcon className="w-4 h-4 text-orange-400" />
            <span className="ml-1 text-sm ">
              <span className="line-clamp-1">{translate('common.label.dummyReviewsText')}</span>
            </span>
          </div>
        </div>
        <Prices className="mt-0.5 sm:mt-1 ml-4" listPrice={price} price={price} />
      </div>
      <Link href={"/product-detail-2"} className="absolute inset-0 "></Link>
    </div>
  );
};

export default CollectionCard2;
