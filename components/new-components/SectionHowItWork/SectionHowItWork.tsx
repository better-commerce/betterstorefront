import React, { FC } from "react";
import HIW1img from "images/HIW1img.png";
import HIW2img from "images/HIW2img.png";
import HIW3img from "images/HIW3img.png";
import HIW4img from "images/HIW4img.png";
import VectorImg from "images/VectorHIW.svg";
import Image from "next/image";
import NcImage from "../shared/NcImage/NcImage";
import Badge from "../shared/Badge/Badge";

export interface SectionHowItWorkProps {
  className?: string;
  data?: any;
}

const SectionHowItWork: FC<SectionHowItWorkProps> = ({
  className,
  data,
}) => {
  return (
    <div className={`nc-SectionHowItWork ${className}`}>
      <div className="relative grid gap-10 sm:grid-cols-2 lg:grid-cols-4 sm:gap-16 xl:gap-20">
        <Image
          className="absolute inset-x-0 hidden md:block top-5"
          src={VectorImg}
          alt="vector"
        />
        {data?.map((item: any, index: number) => (
          <div
            key={index}
            className="relative flex flex-col items-center max-w-xs mx-auto"
          >
            <img
              className="rounded-3xl mb-4 sm:mb-10 max-w-[140px] mx-auto"
              src={item.features_image}
              sizes="150px"
              alt={item?.features_title}
            />
            <div className="mt-auto space-y-5 text-center">
              <Badge
                name={`Step ${index + 1}`}
                color={
                  !index
                    ? "red"
                    : index === 1
                    ? "indigo"
                    : index === 2
                    ? "yellow"
                    : "purple"
                }
              />
              <h3 className="text-base font-semibold">{item.features_title}</h3>
              <span className="block text-sm leading-6 text-slate-600 dark:text-slate-400">
                {item.features_shortdescription}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectionHowItWork;
