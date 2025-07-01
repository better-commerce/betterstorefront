"use client";
import React, { FC } from "react";
import { ChevronRightIcon } from '@heroicons/react/24/outline'
export interface NextProps {
  btnClassName?: string;
  className?: string;
  svgSize?: string;
  onClickNext?: () => void;
}

const Next: FC<NextProps> = ({ className = "relative", onClickNext = () => { }, btnClassName = "w-10 h-10" }) => {
  return (
    <div className={`nc-Next text-slate-500 dark:text-slate-400 ${className}`}>
      <button className={`${btnClassName} rounded-full flex items-center justify-center border-2 border-slate-200 dark:hover:border-slate-200 border-transparent`} onClick={onClickNext} title="Next" data-glide-dir=">" >
        <ChevronRightIcon className="text-[#294384] h-5 w-5" />
      </button>
    </div>
  );
};

export default Next;
 