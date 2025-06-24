"use client";
import React, { FC } from "react";
import { ChevronLeftIcon } from '@heroicons/react/24/outline'

export interface PrevProps {
  btnClassName?: string;
  className?: string;
  svgSize?: string;
  onClickPrev?: () => void;
}

const Prev: FC<PrevProps> = ({ className = "relative", onClickPrev = () => {}, btnClassName = "w-10 h-10" }) => {
  return (
    <div className={`nc-Prev text-slate-500 dark:text-slate-400 ${className}`}>
      <button className={`${btnClassName} rounded-full flex items-center justify-center border-2 border-slate-200 dark:hover:border-slate-200 border-transparent `} onClick={onClickPrev} title="Prev" data-glide-dir="<" >
          <ChevronLeftIcon className="text-[#294384] h-5 w-5"/>
      </button>
    </div>
  );
};

export default Prev;
