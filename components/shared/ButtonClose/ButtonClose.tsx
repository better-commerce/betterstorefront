import React from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import twFocusClass from "@components/shared/utils/twFocusClass";
import { useTranslation } from "@commerce/utils/use-translation";

export interface ButtonCloseProps {
  className?: string;
  IconclassName?: string;
  onClick?: () => void;
}

const ButtonClose: React.FC<ButtonCloseProps> = ({
  className = "",
  IconclassName = "w-5 h-5",
  onClick = () => {},
}) => {
  const translate = useTranslation()
  return (
    <button
      className={
        `w-8 h-8 flex items-center justify-center rounded-full text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 ${className} ` +
        twFocusClass()
      }
      onClick={onClick}
    >
      <span className="sr-only">{translate('common.label.closeText')}</span>
      <XMarkIcon className={IconclassName} />
    </button>
  );
};

export default ButtonClose;
