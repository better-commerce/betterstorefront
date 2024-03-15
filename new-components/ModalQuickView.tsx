"use client";

import { Dialog, Transition } from "@headlessui/react";
import React, { FC, Fragment } from "react";
import ProductQuickView from "./ProductQuickView";
import ProductQuickView2 from "./ProductQuickView2";
import { usePathname } from "next/navigation";
import ButtonClose from "./shared/ButtonClose/ButtonClose";

export interface ModalQuickViewProps {
  show: boolean;
  productData: any;
  deviceInfo?: any;
  maxBasketItemsCount?: any;
  onCloseModalQuickView: () => void;
}

const ModalQuickView: FC<ModalQuickViewProps> = ({
  show,
  productData,
  deviceInfo,
  maxBasketItemsCount,
  onCloseModalQuickView,
}) => {
  const pathname = usePathname();

  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-50"
        onClose={onCloseModalQuickView}
      >
        <div className="flex items-stretch justify-center h-full text-center md:items-center md:px-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black/40 dark:bg-black/70" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span className="inline-block align-middle" aria-hidden="true">
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="relative inline-flex w-full max-w-5xl max-h-full xl:py-8 z-[99999]">
              <div
                className="flex flex-1 w-full max-h-full p-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl lg:rounded-2xl dark:bg-neutral-900 dark:border dark:border-slate-700 dark:text-slate-100"
              >
                <span className="absolute z-50 end-3 top-3">
                  <ButtonClose onClick={onCloseModalQuickView} />
                </span>

                <div className="flex-1 overflow-y-auto rounded-xl hiddenScrollbar">
                  <ProductQuickView product={productData} onCloseModalQuickView={onCloseModalQuickView} />
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ModalQuickView;
