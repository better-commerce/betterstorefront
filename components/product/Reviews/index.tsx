import dynamic from 'next/dynamic'
import { StarIcon } from '@heroicons/react/24/solid'
import classNames from '@components/utils/classNames'
const ReviewInput = dynamic(() => import('./ReviewInput'))
import { GENERAL_REVIEWS, GENERAL_REVIEW_OUT_OF_FIVE } from '@components/utils/textVariables'
export default function Reviews({ data, productId }: any) {
  return (
    <div className="mx-auto bg-white md:w-4/5">
      <div className="w-full px-4 py-0 mx-auto sm:py-0 sm:px-0 lg:px-0 sm:mt-2">
        {data?.productReviews?.length && (
          <h2 className="mb-6 text-2xl font-semibold text-black">{data?.productReviews?.length}{' '}{GENERAL_REVIEWS} </h2>
        )}
        {data?.productReviews?.map((review: any, reviewIdx: number) => (
          <div className='flex flex-col py-6 border-t border-gray-200' key={'dataReview' + reviewIdx}>
            <div className='flex'>
              {[0, 1, 2, 3, 4].map((rating, idx) => (
                <StarIcon
                  key={'ratingStar' + idx + review.postedOn}
                  className={classNames(
                    review.rating > rating
                      ? 'text-yellow-400'
                      : 'text-gray-200',
                    'h-4 w-4 relative top-0.5 flex-shrink-0'
                  )}
                  aria-hidden="true"
                />
              ))}
              <span className='pl-1 text-sm font-bold'>({review.rating})</span>
              <span className="sr-only"> {GENERAL_REVIEW_OUT_OF_FIVE}</span>
            </div>
            <div className='flex-1 mt-1 sm:mt-2'>
              <h4 className='font-semibold text-black text-md'>{review.title}</h4>
            </div>
            <div className='flex-1 mt-1 sm:mt-2'>
              <p className="text-sm font-normal text-gray-700">{review.comment}</p>
            </div>
            <div className='flex-1 mt-1 sm:mt-2'>
              <h4 className='text-xs font-medium text-gray-400'>{review.nickName} | {review?.postedOn}</h4>
            </div>
          </div>
        ))}
      </div>
      <div className='pt-6 mt-6 border-t border-gray-200'>
        <ReviewInput productId={productId} />
      </div>
    </div>
  )
}
