import { StarIcon as SolidStarIcon } from '@heroicons/react/20/solid';
import { StarIcon as OutlineStarIcon } from '@heroicons/react/24/outline';

type ReviewBadgeProps = {
  reviewCountdata: number;
  ratingdata: number;
};

export default function ReviewBadge({ reviewCountdata, ratingdata }: ReviewBadgeProps) {
  const starCount = 5;
  const answers = 123;
  
  return (
    <>
      <div className="flex items-center space-x-4">
        {/* Rating + stars */}
        <div className="flex items-center">
          <span className="text-sm font-semibold text-gray-900 plp-hidden pr-1">
            {ratingdata.toFixed(1)}
          </span>
          <div className="flex text-color-primary-blue">
            {[...Array(starCount)].map((_, i) => (
              i < Math.floor(ratingdata) ? (
                <SolidStarIcon key={i} className="h-4 w-4 text-color-primary-blue" />
              ) : (
                <OutlineStarIcon key={i} className="h-4 w-4 text-color-primary-blue" />
              )
            ))}
          </div>
        </div>

        {/* Reviews */}
        <span className="text-xs text-gray-600 underline no-plp-underline">{reviewCountdata} <span className='plp-hidden'>reviews</span></span>
        {/* Answers */}
        <span className="text-xs text-gray-600 underline plp-hidden">{answers} answers</span>
      </div>
      {/* Deal badge */}
    </>
  );
}
