import SiteHeader from "./SiteHeader";
import FooterClean from "../Footer/FooterClean";

export default function ({ children, params, }: {
  children: React.ReactNode;
  params: any;
}) {
  return (
    <div className={`pt-20 text-base bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-200`}>
      <SiteHeader />
      {children}
      <FooterClean />
    </div>
  );
}
