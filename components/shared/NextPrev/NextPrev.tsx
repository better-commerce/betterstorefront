"use client";
import { useTranslation } from "@commerce/utils/use-translation";
import React, { FC } from "react";

export interface NextPrevProps {
  className?: string;
  currentPage?: number;
  totalPage?: number;
  btnClassName?: string;
  onClickNext?: () => void;
  onClickPrev?: () => void;
  onlyNext?: boolean;
  onlyPrev?: boolean;
}

const NextPrev: FC<NextPrevProps> = ({
  className = "",
  onClickNext = () => {},
  onClickPrev = () => {},
  btnClassName = "w-10 h-10",
  onlyNext = false,
  onlyPrev = false,
}) => {
  const [focus, setFocus] = React.useState<"left" | "right">("right");
  const translate = useTranslation();

  return (
    <div
      className={`nc-NextPrev relative flex items-center text-slate-500 dark:text-slate-400 next-prev-panel ${className}`}
      data-nc-id="NextPrev"
      data-glide-el="controls"
    >
      {!onlyNext && (
        <button
          className={`${btnClassName} ${
            !onlyPrev ? "me-2" : ""
          } border-slate-200 dark:border-slate-200 rounded-full flex items-center justify-center only-next ${
            focus === "left" ? "border-2" : ""
          }`}
          onClick={(e) => {
            e.preventDefault();
            onClickPrev();
          }}
          title={translate('common.label.prevText')}
          data-glide-dir="<"
          onMouseEnter={() => setFocus("left")}
        >
          <svg
            className="w-5 h-5 rtl:rotate-180"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M9.57 5.92993L3.5 11.9999L9.57 18.0699"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M20.5 12H3.67004"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
      {!onlyPrev && (
        <button
          className={`${btnClassName}  border-slate-200 dark:border-slate-200 rounded-full flex items-center justify-center only-prev ${
            focus === "right" ? "border-2" : ""
          }`}
          onClick={(e) => {
            e.preventDefault();
            onClickNext();
          }}
          title={translate('common.label.nextText')}
          data-glide-dir=">"
          onMouseEnter={() => setFocus("right")}
        >
          <svg
            className="w-5 h-5 rtl:rotate-180"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M14.4301 5.92993L20.5001 11.9999L14.4301 18.0699"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M3.5 12H20.33"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default NextPrev;
