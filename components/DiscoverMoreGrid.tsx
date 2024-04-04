import React from "react";
import CardCategory2 from "./CardCategories/CardCategory2";
import Heading from "./Heading/Heading";
import img1 from "images/discover-more-1.png";
import img2 from "images/discover-more-2.png";
import img3 from "images/discover-more-3.png";
import { useTranslation } from "@commerce/utils/use-translation";

const DiscoverMoreGrid = () => {
  const translate = useTranslation();
  const CATS_DISCOVER = [
    {
      name: translate('label.category.dummyName1Text'),
      desc: translate('label.category.dummyDesc1Text'),
      featuredImage: img1,
    },
    {
      name: translate('label.category.dummyName2Text'),
      desc: translate('label.category.dummyDesc2Text'),
      featuredImage: img2,
      //   "https://images.pexels.com/photos/45238/gift-made-surprise-loop-45238.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
    {
      name: translate('label.category.dummyName3Text'),
      desc: translate('label.category.dummyDesc3Text'),
      featuredImage: img3,
    },
  ];
  return (
    <div className="nc-DiscoverMoreGrid relative">
      <Heading
        className="mb-12 text-neutral-900 dark:text-neutral-50"
        desc=""
        isCenter
        rightDescText={translate('common.label.discoverMoreDescText')}
      >
        {translate('common.label.discoverMoreText')}
      </Heading>
      <div className="relative grid grid-cols-3 gap-8">
        {CATS_DISCOVER?.map((item, index) => (
          <CardCategory2
            key={index}
            name={item?.name}
            desc={item?.desc}
            featuredImage={item?.featuredImage}
          />
        ))}
      </div>
    </div>
  );
};

export default DiscoverMoreGrid;
