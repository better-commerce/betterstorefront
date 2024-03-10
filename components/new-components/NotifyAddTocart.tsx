import React, { FC } from "react";
import { Transition } from "@headlessui/react";
import Prices from "@components/new-components/Prices";

import Image, { StaticImageData } from "next/image";
import { PRODUCTS } from "@components/data/data";

interface Props {
  show: boolean;
  productImage: string | StaticImageData;
  variantActive: number;
  sizeSelected: string;
  qualitySelected: number;
}

const NotifyAddTocart: FC<Props> = ({
  show,
  productImage,
  variantActive,
  qualitySelected,
  sizeSelected,
}) => {
  const { name, price, variants } = PRODUCTS[0];

  const renderProductCartOnNotify = () => {
    return (
      <div className="flex ">
        <div className="relative flex-shrink-0 w-20 h-24 overflow-hidden rounded-xl bg-slate-100">
          <Image
            src={productImage}
            alt={name}
            fill
            sizes="100px"
            className="object-contain object-center w-full h-full"
          />
        </div>

        <div className="flex flex-col flex-1 ml-4">
          <div>
            <div className="flex justify-between ">
              <div>
                <h3 className="text-base font-medium ">{name}</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  <span>
                    {variants ? variants[variantActive].name : `Natural`}
                  </span>
                  <span className="h-4 mx-2 border-l border-slate-200 dark:border-slate-700"></span>
                  <span>{sizeSelected || "XL"}</span>
                </p>
              </div>
              <Prices price={price} className="mt-0.5" />
            </div>
          </div>
          <div className="flex items-end justify-between flex-1 text-sm">
            <p className="text-gray-500 dark:text-slate-400">{`Qty ${qualitySelected}`}</p>

            <div className="flex">
              <button
                type="button"
                className="font-medium text-primary-6000 dark:text-primary-500 "
              >
                View cart
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Transition
      appear
      show={show}
      className="w-full max-w-md p-4 bg-white shadow-lg pointer-events-auto dark:bg-slate-800 rounded-2xl ring-1 ring-black/5 dark:ring-white/10 text-slate-900 dark:text-slate-200"
      enter="transition-all duration-150"
      enterFrom="opacity-0 translate-x-20"
      enterTo="opacity-100 translate-x-0"
      leave="transition-all duration-150"
      leaveFrom="opacity-100 translate-x-0"
      leaveTo="opacity-0 translate-x-20"
    >
      <p className="block text-base font-semibold leading-none">
        Added to cart!
      </p>
      <hr className="my-4 border-slate-200 dark:border-slate-700" />
      {renderProductCartOnNotify()}
    </Transition>
  );
};

export default NotifyAddTocart;
