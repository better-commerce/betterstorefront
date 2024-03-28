import React, { FC } from "react";

import Link from "next/link";
import Image, { StaticImageData } from "next/image";
import { CATS_DISCOVER } from "./data";
import ButtonSecondary from "../shared/Button/ButtonSecondary";
import { useTranslation } from "@commerce/utils/use-translation";

export interface CardCategory3Props {
  className?: string;
  featuredImage?: any;
  name?: string;
  desc?: string;
  color?: string;
  link?: any
}

const CardCategory3: FC<CardCategory3Props> = ({ className, featuredImage, name, desc, color, link }) => {
  const translate = useTranslation()
  return (
    <Link
      href={`/${link}`}
      className={`nc-CardCategory3 block ${className}`}
    >
      <div
        className={`relative w-full aspect-w-16 aspect-h-11 sm:aspect-h-9 rounded-2xl overflow-hidden group ${color}`}
      >
        <div>
          <div className="absolute inset-5 sm:inset-8">
            <img
              alt={name}
              src={featuredImage || ""}
              className="absolute end-0 w-1/2 max-w-[200px] h-full object-contain drop-shadow-xl"
            />
          </div>
        </div>
        <span className="absolute inset-0 transition-opacity opacity-0 group-hover:opacity-40 bg-black/10"></span>

        <div>
          <div className="absolute flex flex-col inset-5 sm:inset-8">
            <div className="max-w-xs">
              <span className={`block mb-2 text-sm text-slate-700`}>
                {name}
              </span>
              {desc && (
                <h2
                  className={`text-xl md:text-2xl text-slate-900 font-semibold`}
                  dangerouslySetInnerHTML={{ __html: desc }}
                ></h2>
              )}
            </div>
            <div className="mt-auto">
              <ButtonSecondary
                sizeClass="py-3 px-4 sm:py-3.5 sm:px-6"
                fontSize="text-sm font-medium"
                className="nc-shadow-lg"
                href={`/${link}`}
              >
                {translate('common.label.showMeAllText')} </ButtonSecondary>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CardCategory3;
