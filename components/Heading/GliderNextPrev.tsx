import React, { HTMLAttributes, ReactNode } from "react";
import NextPrev from "../shared/NextPrev/NextPrev";
export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  fontClass?: string;
  rightDescText?: ReactNode;
  rightPopoverOptions?: any;
  desc?: ReactNode;
  hasNextPrev?: boolean;
  isCenter?: boolean;
}

const GliderNextPrev: React.FC<HeadingProps> = ({ children, desc = "", className = "text-neutral-900 dark:text-neutral-50", isCenter = false, hasNextPrev = false, fontClass = "text-3xl md:text-4xl font-semibold dark:text-black", rightDescText, rightPopoverOptions, ...args }) => {
  return (
    <div className={`nc-Section-Heading  flex flex-col sm:flex-row sm:items-end justify-between ${className}`} >
      {hasNextPrev && !isCenter && (
        <div className="flex justify-end flex-shrink-0 mt-4 sm:ms-2 sm:mt-0 glider-pos">
          <NextPrev onClickNext={() => {}} onClickPrev={() => {}} />
        </div>
      )}
    </div>
  );
};

export default GliderNextPrev;
