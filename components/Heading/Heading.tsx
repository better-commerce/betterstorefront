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

const Heading: React.FC<HeadingProps> = ({ children, desc = "", className = "mb-12 lg:mb-14 text-neutral-900 dark:text-neutral-50", isCenter = false, hasNextPrev = false, fontClass = "text-3xl md:text-4xl font-semibold", rightDescText, rightPopoverOptions, ...args }) => {
  return (
    <div className={`nc-Section-Heading relative flex flex-col sm:flex-row sm:items-end justify-between ${className}`} >
      <div className={isCenter ? "flex flex-col items-center text-center w-full mx-auto" : ""} >
        <h2 className={`${isCenter ? "justify-center" : ""} ${fontClass}`} {...args} >
          {children || `Section Heading`}
          {rightDescText && (
            <>
              <span className="">{' '}</span>
              <span className="text-neutral-500 dark:text-neutral-400">
                {rightDescText}
              </span>
            </>
          )}
        </h2>
        {!!desc && (
          <span className="block mt-2 text-base font-normal md:mt-3 sm:text-xl text-neutral-500 dark:text-neutral-400">
            {desc}
          </span>
        )}
      </div>
      {hasNextPrev && !isCenter && (
        <div className="flex justify-end flex-shrink-0 mt-4 sm:ms-2 sm:mt-0">
          <NextPrev onClickNext={() => { }} onClickPrev={() => { }} />
        </div>
      )}
    </div>
  );
};

export default Heading;
