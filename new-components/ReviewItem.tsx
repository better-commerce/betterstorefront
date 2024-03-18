import { StarIcon } from "@heroicons/react/24/solid";
import React, { FC } from "react";
import Avatar from "./shared/Avatar/Avatar";
import classNames from "classnames";

interface ReviewItemDataType {
  name: string;
  avatar?: string;
  date: string;
  comment: string;
  starPoint: number;
}

export interface ReviewItemProps {
  className?: string;
  data?: ReviewItemDataType;
}

const DEMO_DATA: ReviewItemDataType = {
  name: "Cody Fisher",
  date: "May 20, 2021",
  comment:
    "Very nice feeling sweater. I like it better than a regular hoody because it is tailored to be a slimmer fit. Perfect for going out when you want to stay comfy. The head opening is a little tight which makes it a little.",
  starPoint: 5,
};

const ReviewItem: FC<ReviewItemProps> = ({
  className = "",
  data = DEMO_DATA,
}) => {
  return (
    <div className={`nc-ReviewItem flex flex-col ${className}`} data-nc-id="ReviewItem" >
      <div className="flex space-x-4 ">
        <div className="flex-shrink-0 pt-0.5">
          <Avatar sizeClass="h-10 w-10 text-lg" radius="rounded-full" userName={data?.name} imgUrl={data?.avatar} />
        </div>

        <div className="flex justify-between flex-1">
          <div className="text-sm sm:text-base">
            <span className="block font-semibold">{data?.name}</span>
            <span className="block mt-0.5 text-slate-500 dark:text-slate-400 text-sm">
              {data.date}
            </span>
          </div>

          <div className="mt-0.5 flex">
            {[0, 1, 2, 3, 4].map((rating, idx) => (
              <StarIcon key={'ratingStar' + idx + data?.starPoint} className={classNames(data?.starPoint > rating ? 'text-yellow-500' : 'text-gray-200', 'w-5 h-5 ')} aria-hidden="true" />
            ))}
          </div>
        </div>
      </div>
      <div className="mt-4 prose-sm prose sm:prose dark:prose-invert sm:max-w-2xl">
        <p className="text-slate-600 dark:text-slate-300">{data?.comment}</p>
      </div>
    </div>
  );
};

export default ReviewItem;
