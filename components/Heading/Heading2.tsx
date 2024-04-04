import { useTranslation } from "@commerce/utils/use-translation";
import React from "react";
import { ReactNode } from "react";

export interface Heading2Props {
  heading?: ReactNode;
  subHeading?: ReactNode;
  className?: string;
}

const Heading2: React.FC<Heading2Props> = ({
  className = "",
  heading = "Stays in Tokyo",
  subHeading,
}) => {
  const translate = useTranslation()
  return (
    <div className={`mb-12 lg:mb-16 ${className}`}>
      <h2 className="text-4xl font-semibold">{heading}</h2>
      {subHeading ? (
        subHeading
      ) : (
        <span className="block text-neutral-500 dark:text-neutral-400 mt-3">
          {translate('label.header.233StaysText')} <span className="mx-2">·</span>
          {translate('label.header.aug12To18Text')}
          <span className="mx-2">·</span>{translate('label.header.2GuestsText')}
        </span>
      )}
    </div>
  );
};

export default Heading2;
