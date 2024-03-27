import { StarIcon } from "@heroicons/react/24/solid";
import React, { FC } from "react";
import classNames from "classnames";
import moment from "moment";
import { DATE_FORMAT } from "@components//utils/constants";

interface ReviewItemDataType {
  name: any;
  avatar?: any;
  date: any;
  comment: any;
  starPoint: any;
}

export interface ReviewItemProps {
  className?: string;
  data?: ReviewItemDataType;
}

const ReviewItem: FC<ReviewItemProps> = ({ className = "", data, }) => {
  return (
    <div className={`nc-ReviewItem flex flex-col ${className}`} data-nc-id="ReviewItem" >
      <div className="flex space-x-4 ">
        <div className="flex-shrink-0 pt-0.5">
          <img className="w-10 h-10 text-lg rounded-full"  alt={data?.name} src={`/assets/user-avatar.png`} />
        </div>

        <div className="flex justify-between flex-1">
          <div className="text-sm sm:text-base">
            <span className="block font-semibold">{data?.name}</span>
            <span className="block mt-0.5 text-slate-500 dark:text-slate-400 text-sm">
              {moment(new Date(data?.date)).format(DATE_FORMAT)}
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
