import React from "react";
import Button, { ButtonProps } from "./Button";

export interface ButtonThirdProps extends ButtonProps {}

const ButtonThird: React.FC<ButtonThirdProps> = ({
  className = "border text-neutral-700 border-neutral-200 dark:text-neutral-200 dark:border-neutral-700",
  ...args
}) => {
  return <Button className={`ttnc-ButtonThird ${className}`} {...args} />;
};

export default ButtonThird;
