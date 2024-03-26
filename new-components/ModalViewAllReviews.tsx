import { Dialog, Transition } from "@headlessui/react";
import { StarIcon } from "@heroicons/react/24/solid";
import React, { FC, Fragment } from "react";
import ButtonClose from "./shared/ButtonClose/ButtonClose";
import SortOrderFilter from "./SectionGridMoreExplore/SortOrderFilter";
import ReviewItem from "./ReviewItem";
import { useTranslation } from "@commerce/utils/use-translation";

export interface ModalViewAllReviewsProps {
  show: boolean;
  onCloseModalViewAllReviews: () => void;
}

const ModalViewAllReviews: FC<ModalViewAllReviewsProps> = ({
  show,
  onCloseModalViewAllReviews,
}) => {
  const translate = useTranslation();
  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-50 overflow-y-auto"
        onClose={onCloseModalViewAllReviews}
      >
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-40" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
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
            <div className="inline-block w-full h-screen max-w-5xl py-8">
              <div className="inline-flex flex-col w-full h-full pb-2 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl dark:bg-neutral-900 dark:border dark:border-neutral-700 dark:text-neutral-100">
                <div className="relative flex-shrink-0 px-6 py-4 text-center border-b border-neutral-200 dark:border-neutral-800">
                  <h3
                    className="text-lg font-medium leading-6 text-gray-900"
                    id="headlessui-dialog-title-70"
                  >
                    {translate('common.label.viewAllReviewsText')}
                  </h3>
                  <span className="absolute left-3 top-3">
                    <ButtonClose onClick={onCloseModalViewAllReviews} />
                  </span>
                </div>
                <div className="flex flex-wrap justify-between px-8 my-5">
                  <h2 className="flex items-center text-xl font-semibold sm:text-2xl">
                    <StarIcon className="w-7 h-7 mb-0.5" />
                    <span className="ml-1.5">{translate('common.label.dummyReviewsText')}</span>
                  </h2>
                  <SortOrderFilter
                    className="my-2"
                    data={[
                      { name: translate('label.filters.sortOrderText') },
                      { name: translate('label.filters.newestRatingsText') },
                      { name: translate('label.filters.highestRatingText') },
                      { name: translate('label.filters.lowestRatingText') },
                    ]}
                  />
                </div>
                <div className="grid grid-cols-1 px-8 py-8 overflow-auto border-t border-slate-200 dark:border-slate-700 md:grid-cols-2 gap-x-14 gap-y-10">
                  <ReviewItem />
                  <ReviewItem />
                  <ReviewItem />
                  <ReviewItem />
                  <ReviewItem />
                  <ReviewItem />
                  <ReviewItem />
                  <ReviewItem />
                  <ReviewItem />
                  <ReviewItem />
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ModalViewAllReviews;
