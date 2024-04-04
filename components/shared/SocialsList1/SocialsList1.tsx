import React, { FC } from "react";
import { CURRENT_THEME } from "@components/utils/constants";
const featureToggle = require(`../../../public/theme/${CURRENT_THEME}/features.config.json`);
export interface SocialsList1Props {
  className?: string;
}

const SocialsList1: FC<SocialsList1Props> = ({ className = "space-y-3" }) => {
  const renderItem = (item: any, index: number) => {
    return (
      item?.enable && item?.href != "" &&
      <a href={item?.href} className="flex items-center space-x-2 text-2xl leading-none text-neutral-700 hover:text-black dark:text-neutral-300 dark:hover:text-white group" key={index} >
        <div className="flex-shrink-0 w-5 ">
          <img src={item?.icon} alt="" />
        </div>
        <span className="hidden text-sm lg:block">{item?.name}</span>
      </a>
    );
  };

  return (
    <div className={`nc-SocialsList1 ${className}`} data-nc-id="SocialsList1">
      {featureToggle?.social?.map(renderItem)}
    </div>
  );
};

export default SocialsList1;
