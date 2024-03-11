"use client";
import React, { FC, useEffect, useState } from "react";
import ButtonPrimary from "./shared/Button/ButtonPrimary";
import LikeButton from "@components/new-components/LikeButton";
import { StarIcon } from "@heroicons/react/24/solid";
import BagIcon from "@components/new-components/BagIcon";
import NcInputNumber from "@components/new-components/NcInputNumber";
import { PRODUCTS } from "@components/data/data";
import {
  NoSymbolIcon,
  ClockIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import IconDiscount from "@components/new-components/IconDiscount";
import Prices from "@components/new-components/Prices";
import toast from "react-hot-toast";
import detail1JPG from "images/products/detail1.jpg";
import detail2JPG from "images/products/detail2.jpg";
import detail3JPG from "images/products/detail3.jpg";
import NotifyAddTocart from "./NotifyAddTocart";
import AccordionInfo from "@components/new-components/AccordionInfo";
import Image from "next/image";
import Link from "next/link";
import { generateUri } from "@commerce/utils/uri-util";
import { IMG_PLACEHOLDER } from "@components/utils/textVariables";
import AttributesHandler from "@components/product/ProductView/AttributesHandler";
import axios from "axios";
import { NEXT_GET_PRODUCT_QUICK_VIEW, NEXT_GET_PRODUCT_REVIEW } from "@components/utils/constants";

export interface ProductQuickViewProps {
  className?: string;
  product?: any;
}

const ProductQuickView: FC<ProductQuickViewProps> = ({ className = "", product }) => {
  const { sizes, variants, status, allOfSizes } = PRODUCTS[0];
  const LIST_IMAGES_DEMO = [detail1JPG, detail2JPG, detail3JPG];

  const [variantActive, setVariantActive] = useState(0);
  const [sizeSelected, setSizeSelected] = useState(sizes ? sizes[0] : "");
  const [qualitySelected, setQualitySelected] = useState(1);
  const [selectedAttrData, setSelectedAttrData] = useState({ productId: product?.recordId, stockCode: product?.stockCode, ...product, })
  const [variantInfo, setVariantInfo] = useState<any>({ variantColour: '', variantSize: '', })
  const [quickViewData, setQuickViewData] = useState<any>(undefined)
  const [reviewData, setReviewData] = useState<any>(undefined)
  const [sizeInit, setSizeInit] = useState('')
  const handleSetProductVariantInfo = ({ colour, clothSize }: any) => {
    if (colour) {
      setVariantInfo((v: any) => ({
        ...v,
        variantColour: colour,
      }))
    }
    if (clothSize) {
      setVariantInfo((v: any) => ({
        ...v,
        variantSize: clothSize,
      }))
    }
  }
  const productSlug: any = product?.slug;
  const handleFetchProductQuickView = (productSlug: any) => {
    const loadView = async (productSlug: string) => {
      const { data: productQuickViewData }: any = await axios.post(NEXT_GET_PRODUCT_QUICK_VIEW, { slug: productSlug })
      const data = productQuickViewData?.product
      const { data: reviewData }: any = await axios.post(NEXT_GET_PRODUCT_REVIEW, { recordId: data?.recordId })
      setQuickViewData(data)
      setReviewData(reviewData?.review)
      if (data) {
        setSelectedAttrData({ productId: data?.recordId, stockCode: data?.stockCode, ...data, })
      }
    }
    if (productSlug) loadView(productSlug)
    return []
  }
  const fetchIsQuickView = () => {
    if (product) {
      const loadView = async (slug: string) => {
        const { data: productQuickViewData }: any = await axios.post(
          NEXT_GET_PRODUCT_QUICK_VIEW,
          { slug: slug }
        )

        const { data: reviewData }: any = await axios.post(
          NEXT_GET_PRODUCT_REVIEW,
          { recordId: productQuickViewData?.product?.recordId }
        )

        const data = productQuickViewData?.product
        setQuickViewData(productQuickViewData?.product)
        setReviewData(reviewData?.review)
        if (data) {
          setSelectedAttrData({ productId: data?.recordId, stockCode: data?.stockCode, ...data, })
        }
        // console.log('QUICKVIEW_PRODUCTDATA:',productQuickViewData?.product)
      }

      if (product?.slug) loadView(product?.slug)
    } else {
      setQuickViewData(undefined)
    }
    return [product]
  }
  useEffect(() => {

    fetchIsQuickView()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  })

  const notifyAddTocart = () => {
    toast.custom(
      (t) => (
        <NotifyAddTocart
          productImage={LIST_IMAGES_DEMO[0]}
          qualitySelected={qualitySelected}
          show={t.visible}
          sizeSelected={sizeSelected}
          variantActive={variantActive}
        />
      ),
      { position: "top-right", id: "nc-product-notify", duration: 3000 }
    );
  };

  const renderVariants = () => {
    return (
      <div>
        {quickViewData &&
          <AttributesHandler
            product={quickViewData}
            variant={selectedAttrData}
            setSelectedAttrData={setSelectedAttrData}
            variantInfo={variantInfo}
            handleSetProductVariantInfo={handleSetProductVariantInfo}
            handleFetchProductQuickView={handleFetchProductQuickView}
            isQuickView={true}
            sizeInit={sizeInit}
            setSizeInit={setSizeInit} />
        }
      </div>
    );
  };

  
  const renderStatus = () => {
    if (!status) {
      return null;
    }
    const CLASSES =
      "absolute top-3 start-3 px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 nc-shadow-lg rounded-full flex items-center justify-center text-slate-700 text-slate-900 dark:text-slate-300";
    if (status === "New in") {
      return (
        <div className={CLASSES}>
          <SparklesIcon className="w-3.5 h-3.5" />
          <span className="leading-none ms-1">{status}</span>
        </div>
      );
    }
    if (status === "50% Discount") {
      return (
        <div className={CLASSES}>
          <IconDiscount className="w-3.5 h-3.5" />
          <span className="leading-none ms-1">{status}</span>
        </div>
      );
    }
    if (status === "Sold Out") {
      return (
        <div className={CLASSES}>
          <NoSymbolIcon className="w-3.5 h-3.5" />
          <span className="leading-none ms-1">{status}</span>
        </div>
      );
    }
    if (status === "limited edition") {
      return (
        <div className={CLASSES}>
          <ClockIcon className="w-3.5 h-3.5" />
          <span className="leading-none ms-1">{status}</span>
        </div>
      );
    }
    return null;
  };

  const renderSectionContent = () => {
    return (
      <div className="space-y-8">
        {/* ---------- 1 HEADING ----------  */}
        <div>
          <h2 className="text-2xl font-semibold transition-colors hover:text-primary-6000">
            <Link href={product?.slug}>{product?.name}</Link>
          </h2>

          <div className="flex items-center justify-start mt-5 space-x-4 rtl:justify-end sm:space-x-5 rtl:space-x-reverse">
            {/* <div className="flex text-xl font-semibold">$112.00</div> */}
            <Prices
              contentClass="py-1 px-2 md:py-1.5 md:px-3 text-lg font-semibold"
              price={product?.price?.formatted?.withTax}
            />

            <div className="h-6 border-s border-slate-300 dark:border-slate-700"></div>

            <div className="flex items-center">
              <Link
                href={product?.slug}
                className="flex items-center text-sm font-medium"
              >
                <StarIcon className="w-5 h-5 pb-[1px] text-yellow-400" />
                <div className="ms-1.5 flex">
                  <span>{product?.rating}</span>
                  <span className="block mx-2">·</span>
                  <span className="underline text-slate-600 dark:text-slate-400">
                    {product?.reviewCount} reviews
                  </span>
                </div>
              </Link>
              <span className="hidden sm:block mx-2.5">·</span>
              <div className="items-center hidden text-sm sm:flex">
                <SparklesIcon className="w-3.5 h-3.5" />
                <span className="leading-none ms-1">{status}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ---------- 3 VARIANTS AND SIZE LIST ----------  */}
        <div className="">{renderVariants()}</div>

        {/*  ---------- 4  QTY AND ADD TO CART BUTTON */}
        <div className="flex space-x-3.5 rtl:space-x-reverse">
          <div className="flex items-center justify-center bg-slate-100/70 dark:bg-slate-800/70 px-2 py-3 sm:p-3.5 rounded-full">
            <NcInputNumber
              defaultValue={qualitySelected}
              onChange={setQualitySelected}
            />
          </div>
          <ButtonPrimary
            className="flex-1 flex-shrink-0"
            onClick={notifyAddTocart}
          >
            <BagIcon className="hidden sm:inline-block w-5 h-5 mb-0.5" />
            <span className="ms-3">Add to cart</span>
          </ButtonPrimary>
        </div>

        {/*  */}
        <hr className=" border-slate-200 dark:border-slate-700"></hr>
        {/*  */}

        {/* ---------- 5 ----------  */}
        <AccordionInfo
          data={[
            {
              name: "Description",
              content:
                product?.brand
            },
            {
              name: "Features",
              content: product?.shortDescription,
            },
          ]}
        />
      </div>
    );
  };

  return (
    <div className={`nc-ProductQuickView ${className}`}>
      {/* MAIn */}
      <div className="lg:flex">
        {/* CONTENT */}
        <div className="w-full lg:w-[50%] ">
          {/* HEADING */}
          <div className="relative">
            <div className="aspect-w-16 aspect-h-16">
              <img src={generateUri(product?.image, 'h=1000&fm=webp') || IMG_PLACEHOLDER} className="object-cover w-full rounded-xl" alt={product?.name} />
            </div>

            {/* STATUS */}
            {renderStatus()}
            {/* META FAVORITES */}
            <LikeButton className="absolute end-3 top-3 " />
          </div>
          <div className="hidden grid-cols-2 gap-3 mt-3 lg:grid sm:gap-6 sm:mt-6 xl:gap-5 xl:mt-5">
            {product?.images?.slice(0, 2).map((item: any, index: number) => {
              return (
                <div key={index} className="aspect-w-3 aspect-h-4">
                  <img
                    src={generateUri(item?.url, 'h=400&fm=webp') || IMG_PLACEHOLDER}
                    className="object-cover w-full rounded-xl"
                    alt={product?.name}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="w-full lg:w-[50%] pt-6 lg:pt-0 lg:ps-7 xl:ps-8">
          {renderSectionContent()}
        </div>
      </div>
    </div>
  );
};

export default ProductQuickView;
