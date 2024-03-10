"use client";

import React, { FC, useState } from "react";
import LikeButton from "./LikeButton";
import Prices from "./Prices";
import { ArrowsPointingOutIcon } from "@heroicons/react/24/outline";

import { StarIcon } from "@heroicons/react/24/solid";
import BagIcon from "./BagIcon";
import toast from "react-hot-toast";
import { Transition } from "@headlessui/react";
import ModalQuickView from "./ModalQuickView";
import ProductStatus from "./ProductStatus";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import NcImage from "./shared/NcImage/NcImage";
import ButtonSecondary from "./shared/Button/ButtonSecondary";
import ButtonPrimary from "./shared/Button/ButtonPrimary";
import { PRODUCTS, Product } from "@components/data/data";

export interface ProductCardProps {
  className?: string;
  data?: any;
  isLiked?: boolean;
}

const ProductCard: FC<ProductCardProps> = ({
  className = "",
  data,
  isLiked,
}) => {
  const [variantActive, setVariantActive] = useState(0);
  const [showModalQuickView, setShowModalQuickView] = useState(false);
  const router = useRouter();

  const notifyAddTocart = ({ size }: { size?: string }) => {
    toast.custom(
      (t) => (
        <Transition
          appear
          show={t.visible}
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
          <div className="my-4 border-t border-slate-200 dark:border-slate-700" />
          {renderProductCartOnNotify({ size })}
        </Transition>
      ),
      {
        position: "top-right",
        id: String(data?.recordId) || "product-detail",
        duration: 3000,
      }
    );
  };

  const renderProductCartOnNotify = ({ size }: { size?: string }) => {
    return (
      <div className="flex ">
        <div className="flex-shrink-0 w-20 h-24 overflow-hidden rounded-xl bg-slate-100">
          <Image
            width={80}
            height={96}
            src={data?.image}
            alt={data?.name}
            className="absolute object-cover object-center"
          />
        </div>

        <div className="flex flex-col flex-1 ms-4">
          <div>
            <div className="flex justify-between ">
              <div>
                <h3 className="text-base font-medium ">{data?.name}</h3>
              </div>
              <Prices price={data?.price} listPrice={data?.listPrice} className="mt-0.5" />
            </div>
          </div>
          <div className="flex items-end justify-between flex-1 text-sm">
            <p className="text-gray-500 dark:text-slate-400">Qty 1</p>

            <div className="flex">
              <button
                type="button"
                className="font-medium text-primary-6000 dark:text-primary-500 "
                onClick={(e) => {
                  e.preventDefault();
                  router.push("/cart");
                }}
              >
                View cart
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const getBorderClass = (Bgclass = "") => {
    if (Bgclass.includes("red")) {
      return "border-red-500";
    }
    if (Bgclass.includes("violet")) {
      return "border-violet-500";
    }
    if (Bgclass.includes("orange")) {
      return "border-orange-500";
    }
    if (Bgclass.includes("green")) {
      return "border-green-500";
    }
    if (Bgclass.includes("blue")) {
      return "border-blue-500";
    }
    if (Bgclass.includes("sky")) {
      return "border-sky-500";
    }
    if (Bgclass.includes("yellow")) {
      return "border-yellow-500";
    }
    return "border-transparent";
  };

  // const renderVariants = () => {
  //   if (!variants || !variants.length || !variantType) {
  //     return null;
  //   }

  //   if (variantType === "color") {
  //     return (
  //       <div className="flex space-x-1">
  //         {variants.map((variant:any, index:number) => (
  //           <div
  //             key={index}
  //             onClick={() => setVariantActive(index)}
  //             className={`relative w-6 h-6 rounded-full overflow-hidden z-10 border cursor-pointer ${
  //               variantActive === index
  //                 ? getBorderClass(variant.color)
  //                 : "border-transparent"
  //             }`}
  //             title={variant.name}
  //           >
  //             <div
  //               className={`absolute inset-0.5 rounded-full z-0 ${variant.color}`}
  //             ></div>
  //           </div>
  //         ))}
  //       </div>
  //     );
  //   }

  //   return (
  //     <div className="flex ">
  //       {variants.map((variant:any, index:number) => (
  //         <div
  //           key={index}
  //           onClick={() => setVariantActive(index)}
  //           className={`relative w-11 h-6 rounded-full overflow-hidden z-10 border cursor-pointer ${
  //             variantActive === index
  //               ? "border-black dark:border-slate-300"
  //               : "border-transparent"
  //           }`}
  //           title={variant.name}
  //         >
  //           <div
  //             className="absolute inset-0.5 rounded-full overflow-hidden z-0 bg-cover"
  //             style={{
  //               backgroundImage: `url(${
  //                 // @ts-ignore
  //                 typeof variant.thumbnail?.src === "string"
  //                   ? // @ts-ignore
  //                     variant.thumbnail?.src
  //                   : typeof variant.thumbnail === "string"
  //                   ? variant.thumbnail
  //                   : ""
  //               })`,
  //             }}
  //           ></div>
  //         </div>
  //       ))}
  //     </div>
  //   );
  // };

  const renderGroupButtons = () => {
    return (
      <div className="absolute bottom-0 flex justify-center invisible transition-all opacity-0 group-hover:bottom-4 inset-x-1 group-hover:opacity-100 group-hover:visible">
        <ButtonPrimary
          className="shadow-lg"
          fontSize="text-xs"
          sizeClass="py-2 px-4"
          onClick={() => notifyAddTocart({ size: "XL" })}
        >
          <BagIcon className="w-3.5 h-3.5 mb-0.5" />
          <span className="ms-1">Add to bag</span>
        </ButtonPrimary>
        <ButtonSecondary
          className="ms-1.5 bg-white hover:!bg-gray-100 hover:text-slate-900 transition-colors shadow-lg"
          fontSize="text-xs"
          sizeClass="py-2 px-4"
          onClick={() => setShowModalQuickView(true)}
        >
          <ArrowsPointingOutIcon className="w-3.5 h-3.5" />
          <span className="ms-1">Quick view</span>
        </ButtonSecondary>
      </div>
    );
  };

  // const renderSizeList = () => {
  //   if (!sizes || !sizes.length) {
  //     return null;
  //   }

  //   return (
  //     <div className="absolute bottom-0 inset-x-1 space-x-1.5 rtl:space-x-reverse flex justify-center opacity-0 invisible group-hover:bottom-4 group-hover:opacity-100 group-hover:visible transition-all">
  //       {sizes.map((size:any, index:number) => {
  //         return (
  //           <div
  //             key={index}
  //             className="flex items-center justify-center w-10 h-10 text-sm font-semibold tracking-tight uppercase transition-colors bg-white cursor-pointer nc-shadow-lg rounded-xl hover:bg-slate-900 hover:text-white text-slate-900"
  //             onClick={() => notifyAddTocart({ size })}
  //           >
  //             {size}
  //           </div>
  //         );
  //       })}
  //     </div>
  //   );
  // };

  return (
    <>
      <div className={`nc-ProductCard relative flex flex-col group bg-transparent ${className}`} >
        <div className="relative flex-shrink-0 overflow-hidden bg-slate-50 dark:bg-slate-300 rounded-3xl z-1 group">
          <Link href={`/${data?.slug}`} className="block">
            <NcImage
              containerClassName="flex aspect-w-11 aspect-h-12 w-full h-0"
              src={data?.image}
              className="object-cover w-full h-full drop-shadow-xl"
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 40vw"
              alt="product"
            />
          </Link>
          <ProductStatus status={data?.newLaunch} />
          <LikeButton liked={isLiked} className="absolute z-10 top-3 end-3" />
          {renderGroupButtons()}
        </div>

        <div className="space-y-4 px-2.5 pt-5 pb-2.5">
          {/* {renderVariants()} */}
          <div>
            <h2 className="text-base font-semibold transition-colors min-h-[60px] nc-ProductCard__title">
              {data?.name}
            </h2>
            <p className={`text-sm text-slate-500 dark:text-slate-400 mt-1 `}>
              {data?.classification?.mainCategoryName}
            </p>
          </div>

          <div className="flex items-end justify-between ">
            <Prices price={data?.price?.formatted?.withTax} listPrice={data?.listPrice?.formatted?.withTax} />
            <div className="flex items-center mb-0.5">
              <StarIcon className="w-5 h-5 pb-[1px] text-amber-400" />
              <span className="text-sm ms-1 text-slate-500 dark:text-slate-400">
                {data?.rating || ""} ({data?.reviewCount || 0} reviews)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* QUICKVIEW */}
      <ModalQuickView
        show={showModalQuickView}
        onCloseModalQuickView={() => setShowModalQuickView(false)}
      />
    </>
  );
};

export default ProductCard;
