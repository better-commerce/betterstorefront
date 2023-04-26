import dynamic from 'next/dynamic'
import { StarIcon } from '@heroicons/react/24/solid'
import classNames from '@components/utils/classNames'
const ReviewInput = dynamic(() => import('./ReviewInput'))
import { GENERAL_REVIEWS, GENERAL_REVIEW_OUT_OF_FIVE } from '@components/utils/textVariables'
export default function Reviews({ data, productId }: any) {
  return (
    <div className="mx-auto bg-white md:w-4/5">
      <div className="w-full px-4 py-0 mx-auto sm:py-0 sm:px-0 lg:px-0 sm:mt-2">
        <div>
          <ReviewInput productId={productId} />
        </div>
        {data?.length && (
          <h2 className="text-lg font-medium text-gray-900">{GENERAL_REVIEWS}</h2>
        )}
        {data?.productReviews?.length && (
        <div className="pb-10 mt-6 space-y-10 border-t border-b border-gray-200 divide-y divide-gray-200">
          {data?.productReviews?.map((review: any, reviewIdx: number) => (
            <div
              key={'dataReview' + reviewIdx}
              className="pt-10 lg:grid lg:grid-cols-12 lg:gap-x-8"
            >
              <div className="lg:col-start-5 lg:col-span-8 xl:col-start-4 xl:col-span-9 xl:grid xl:grid-cols-3 xl:gap-x-8 xl:items-start">
                <div className="flex items-center xl:col-span-1">
                  <div className="flex items-center">
                    {[0, 1, 2, 3, 4].map((rating, idx) => (
                      <StarIcon
                        key={'ratingStar' + idx + review.postedOn}
                        className={classNames(
                          review.rating > rating
                            ? 'text-yellow-400'
                            : 'text-gray-200',
                          'h-5 w-5 flex-shrink-0'
                        )}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <p className="ml-3 text-sm text-gray-700">
                    {review.rating}
                    <span className="sr-only"> {GENERAL_REVIEW_OUT_OF_FIVE}</span>
                  </p>
                </div>

                <div className="mt-4 lg:mt-6 xl:mt-0 xl:col-span-2">
                  <h3 className="text-sm font-medium text-gray-900">
                    {review.title}
                  </h3>

                  <div className="mt-3 space-y-6 text-sm text-gray-500">
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center mt-6 text-sm lg:mt-0 lg:col-start-1 lg:col-span-4 lg:row-start-1 lg:flex-col lg:items-start xl:col-span-3">
                <p className="font-medium text-gray-900">{review.nickName}</p>
                <p className="py-2 text-gray-500 font-small">
                  {review.postedBy}
                </p>
                <time
                  dateTime={review.postedOn}
                  className="pl-4 ml-4 text-gray-500 border-l border-gray-200 lg:ml-0 lg:mt-2 lg:border-0 lg:pl-0"
                >
                  {new Date(review.postedOn).toLocaleDateString()}
                </time>
              </div>
            </div>
          ))}
        </div>
        )}
      </div>
    </div>
  )
}
