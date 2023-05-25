import { StarIcon } from '@heroicons/react/24/solid'
import classNames from '@components/utils/classNames'
import { GENERAL_REVIEWS, GENERAL_REVIEW_OUT_OF_FIVE } from '@components/utils/textVariables'
export default function Reviews({ data }: any) {
  return (
    <div className="px-4 py-0 mx-auto bg-white sm:py-0 sm:px-0 lg:px-0 sm:mt-2 md:w-4/5">
      {data?.productReviews?.length && (
        <>
          <div className='flex gap-8'>
            <h3 className='relative pr-0 text-6xl font-bold text-black -top-1'>{data?.ratingAverage} <span className='absolute bottom-0 text-xl font-semibold text-gray-400 -right-4'>/5</span></h3>
            <h2 className="mb-1 text-2xl font-semibold text-black">{GENERAL_REVIEWS} </h2>
            <p className='mb-4 text-xs font-medium text-gray-400'>{data?.productReviews?.length} Customer Reviews</p>
          </div>
        </>
      )}
      {data?.productReviews?.map((review: any, reviewIdx: number) => (
        <div className='flex flex-col py-6 border-t border-gray-200' key={'dataReview' + reviewIdx}>
          <div className='flex'>
            {[0, 1, 2, 3, 4].map((rating, idx) => (
              <StarIcon key={'ratingStar' + idx + review.postedOn} className={classNames(review.rating > rating ? 'text-yellow-400' : 'text-gray-200', 'h-4 w-4 relative top-0.5 flex-shrink-0')} aria-hidden="true" />
            ))}
            <span className='pl-1 text-sm font-bold'>({review.rating})</span>
            <span className="sr-only"> {GENERAL_REVIEW_OUT_OF_FIVE}</span>
          </div>
          <div className='flex-1'>
            <h4 className='mt-1 font-semibold text-black text-md sm:mt-2'>{review.title}</h4>
            <p className="mt-1 text-sm font-normal text-gray-700 sm:mt-2">{review.comment}</p>
            <h4 className='mt-1 text-xs font-medium text-gray-400 sm:mt-2'>{review.nickName} | {review?.postedOn}</h4>
          </div>
        </div>
      ))}
    </div>
  )
}
