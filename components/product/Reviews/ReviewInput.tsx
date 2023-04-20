import withAuth from '@components/utils/withAuth'
import { StarIcon } from '@heroicons/react/24/solid'
import classNames from '@components/utils/classNames'
import { useState } from 'react'
import { 
  BTN_SUBMIT, 
  ERROR_WOOPS_SOMETHING_WENT_WRONG, 
  GENERAL_REVIEW_OUT_OF_FIVE, 
  MESSAGE_CHARACTERS_LEFT, 
  MIN_BODY_LENGTH_ERROR, 
  POST_YOUR_REVIEW, 
  REVIEW_COMMENT, REVIEW_TITLE 
} from '@components/utils/textVariables'

import { NEXT_CREATE_REVIEW } from '@components/utils/constants'
import axios from 'axios'
import { useUI } from '@components/ui/context'

const MIN_LENGTH = 5
const MAX_LENGTH = 240 //@TODO TBD with PO

const TITLE_MIN_LENGTH = 2
const TITLE_MAX_LENGTH = 20

interface ReviewInputProps {
  productId: string
}

const ReviewInput = ({ productId }: ReviewInputProps) => {
  const [rating, setRating] = useState(5)
  const [commentBody, setCommentBody] = useState('')
  const [error, setError] = useState('')
  const [commentTitle, setCommentTitle] = useState('')
  const [asyncMessage, setAsyncMessage] = useState('')

  const { user } = useUI()

  const handleCommentChange = (e: any) => {
    if (e.target.value.length <= MAX_LENGTH) {
      setCommentBody(e.target.value)
    }
  }

  const handleRatingChange = (value: number) => setRating(value)

  const handleSubmit = () => {
    if (!error && commentBody.length < MIN_LENGTH) {
      setError(MIN_BODY_LENGTH_ERROR)
    }
    if (error && commentBody.length >= MIN_LENGTH) {
      setError('')
    }
    const createAsyncReview = async () => {
      try {
        const response: any = await axios.post(NEXT_CREATE_REVIEW, {
          title: commentTitle,
          rating: rating,
          comment: commentBody,
          userId: user.userId,
          userEmail: user.email,
          nickname: user.nickname,
          productId,
        })
        setCommentBody('')
        setCommentTitle('')
        setRating(1)
        setAsyncMessage(response.data.message)
      } catch (error) {
        setAsyncMessage(ERROR_WOOPS_SOMETHING_WENT_WRONG)
      }
    }
    createAsyncReview()
  }

  const handleCommentTitle = (e: any) => {
    if (e.target.value.length <= TITLE_MAX_LENGTH) {
      setCommentTitle(e.target.value)
    }
  }

  return (
    <div className="pb-16">
      <h2 className="mb-2 font-mono text-xl font-bold text-gray-900 sm:mb-4">{POST_YOUR_REVIEW}</h2>
      {asyncMessage ? (
        <div>
          <span className="text-2xl text-gray-900">{asyncMessage}</span>
        </div>
      ) : (
        <>
          <input
            placeholder={REVIEW_TITLE}
            onChange={handleCommentTitle}
            value={commentTitle}
            className="w-full min-w-0 px-4 py-2 mt-2 mb-2 text-gray-900 placeholder-gray-500 bg-white border border-gray-300 rounded-sm shadow-sm appearance-none sm:mb-5 sm:w-1/3 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 "
          />
          <textarea
            className="w-full h-20 px-3 py-2 font-medium leading-normal text-gray-900 placeholder-gray-700 border border-gray-400 rounded-sm bg-gray-50 focus:outline-none focus:bg-white"
            placeholder={REVIEW_COMMENT}
            value={commentBody}
            onChange={handleCommentChange}
            required
          />
          <span className="float-right text-sm text-gray-900">
            {MESSAGE_CHARACTERS_LEFT}: {MAX_LENGTH - commentBody.length}
          </span>
          {!!error && <span className="text-sm text-red-900">{error}</span>}
          <div className="flex mt-5 flex-center">
            {[1, 2, 3, 4, 5].map((num) => (
              <StarIcon
                key={`starIcon-${num}`}
                className={classNames(
                  rating >= num ? 'text-yellow-400' : 'text-gray-200',
                  'h-5 w-5 flex-shrink-0'
                )}
                onClick={() => handleRatingChange(num)}
                aria-hidden="true"
              />
            ))}
            <p className="ml-3 text-sm text-gray-700">
              {rating}
              <span className="sr-only"> {GENERAL_REVIEW_OUT_OF_FIVE}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            className="flex items-center justify-center flex-1 float-right max-w-xs px-4 py-2 font-medium text-white uppercase bg-black border border-transparent rounded-sm hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-black sm:w-full"
          >
            {BTN_SUBMIT}
          </button>
        </>
      )}
    </div>
  )
}

export default withAuth(ReviewInput, false)
