import Image, { StaticImageData } from "next/image";

import imageRightPng from "../../../images/hero-right.png";
import imageRightPng2 from "../../../images/hero-right-2.png";
import imageRightPng3 from "../../../images/hero-right-3.png";
import { Route } from "../shared/routers/types";

interface Hero2DataType {
  image: StaticImageData | string;
  heading: string;
  subHeading: string;
  btnText: string;
  btnLink: Route;
}

export const HERO2_DEMO_DATA: Hero2DataType[] = [
  {
    image: imageRightPng2,
    heading: "Exclusive collection for everyone",
    subHeading: "In this season, find the best 🔥",
    btnText: "Explore now",
    btnLink: "/",
  },
  {
    image: imageRightPng3,
    heading: "Exclusive collection for everyone",
    subHeading: "In this season, find the best 🔥",
    btnText: "Explore now",
    btnLink: "/",
  },
  {
    image: imageRightPng,
    heading: "Exclusive collection for everyone",
    subHeading: "In this season, find the best 🔥",
    btnText: "Explore now",
    btnLink: "/",
  },
];
