import React, { FC } from "react";
import { _getPersonNameRd } from "@components/Header/fakeData";
import Link from "next/link";
import Avatar from "../shared/Avatar/Avatar";
import { useTranslation } from "@commerce/utils/use-translation";

export interface PostCardMetaProps {
  className?: string;
  hiddenAvatar?: boolean;
}

const PostCardMeta: FC<PostCardMetaProps> = ({
  className = "leading-none",
  hiddenAvatar = false,
}) => {
  const translate = useTranslation()
  return (
    <div
      className={`nc-PostCardMeta inline-flex items-center fledx-wrap text-neutral-800 dark:text-neutral-200 text-sm ${className}`}
      data-nc-id="PostCardMeta"
    >
      <Link
        href={"/blog"}
        className="relative flex items-center flex-shrink-0 space-x-2"
      >
        {!hiddenAvatar && (
          <Avatar radius="rounded-full" sizeClass={"h-7 w-7 text-sm"} />
        )}
        <span className="block font-medium text-neutral-6000 hover:text-black dark:text-neutral-300 dark:hover:text-white">
          {_getPersonNameRd()}
        </span>
      </Link>
      <>
        <span className="text-neutral-500 dark:text-neutral-400 mx-[6px] font-medium">
          ·
        </span>
        <span className="font-normal text-neutral-500 dark:text-neutral-400 line-clamp-1">
          {translate('common.label.may20Text')}
        </span>
      </>
    </div>
  );
};

export default PostCardMeta;
