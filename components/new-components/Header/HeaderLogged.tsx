import React, { FC } from "react";
import MainNav2Logged from "./MainNav2Logged";

export interface HeaderLoggedProps {}

const HeaderLogged: FC<HeaderLoggedProps> = () => {
  return (
    <div className="sticky top-0 z-40 w-full nc-HeaderLogged ">
      {/* <MainNav2Logged /> */}
    </div>
  );
};

export default HeaderLogged;
