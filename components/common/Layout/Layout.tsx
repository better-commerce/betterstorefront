import { Poppins } from "next/font/google";
import SiteHeader from "./SiteHeader";
import FooterClean from "../Footer/FooterClean";

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export default function ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: any;
}) {
  return (
    <div className={`pt-20 text-base bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-200 ${poppins.className}`}>
      <SiteHeader />
      {children}
      <FooterClean />
    </div>
  );
}
