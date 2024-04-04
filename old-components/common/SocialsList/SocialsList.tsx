import React, { FC } from "react";
import facebook from "images/socials/facebook.svg";
import twitter from "images/socials/twitter.svg";
import telegram from "images/socials/telegram.svg";
import youtube from "images/socials/youtube.svg";
import Image from "next/image";
import { SocialType } from "./SocialShare";
import { useTranslation } from "@commerce/utils/use-translation";

export interface SocialsList1Props {
  className?: string;
}


const SocialsList1: FC<SocialsList1Props> = ({ className = "space-y-3" }) => {
  const translate = useTranslation()
  const socials: SocialType[] = [
    { name: translate('label.social.facebookText'), icon: facebook, href: "#" },
    { name: translate('label.social.youtubeText'), icon: youtube, href: "#" },
    { name: translate('label.social.telegramText'), icon: telegram, href: "#" },
    { name: translate('label.social.twitterText'), icon: twitter, href: "#" },
  ];
  const renderItem = (item: SocialType, index: number) => {
    return (
      <a
        href={item?.href}
        className="flex items-center space-x-2 text-2xl leading-none text-neutral-700 hover:text-black dark:text-neutral-300 dark:hover:text-white group"
        key={index}
      >
        <div className="flex-shrink-0 w-5 ">
          <Image sizes="40px" src={item?.icon} alt="" />
        </div>
        <span className="hidden text-sm lg:block">{item?.name}</span>
      </a>
    );
  };

  return (
    <div className={`nc-SocialsList1 ${className}`} data-nc-id="SocialsList1">
      {socials.map(renderItem)}
    </div>
  );
};

export default SocialsList1;
