"use client";

import React from "react";
import { usePathname } from "next/navigation";

import HeaderLogged from "../Header/HeaderLogged";
import { useThemeMode } from "hooks/useThemeMode";

const SiteHeader = () => {
  useThemeMode();

  let pathname = usePathname();

  return pathname === "/" ? <HeaderLogged /> : <HeaderLogged />;
};

export default SiteHeader;
