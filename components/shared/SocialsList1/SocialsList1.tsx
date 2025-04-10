import React, { FC } from "react";
export interface SocialsList1Props {
  className?: string;
  featureToggle?: any
}

const SocialsList1: FC<SocialsList1Props> = ({ className = "space-y-3", featureToggle }: any) => {
  const renderItem = (item: any, index: number) => {
    return (
      item?.enable &&
      <a href={item?.href} target="_blank" className="flex items-center space-x-2 text-2xl leading-none text-neutral-700 hover:text-black dark:text-neutral-300 dark:hover:text-white group" key={index} >
        <div className="flex-shrink-0 w-8">
          <img src={item?.icon} alt={item?.name} className={`${featureToggle?.features?.enableForPCSite ? 'w-8 h-8' : ''}`} />
        </div>
        {featureToggle?.features?.enableForPCSite ? (
          <></>
        ) : (
          <span className="hidden text-sm lg:block">{item?.name}</span>
        )}
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
