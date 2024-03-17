import React, { FC } from "react";
import MainNav2 from "./MainNav2";

export interface HeaderProps {}

const Header: FC<HeaderProps> = () => {
  return (
    <div className="relative z-40 w-full nc-Header ">
      <MainNav2 />
    </div>
  );
};

export default Header;
