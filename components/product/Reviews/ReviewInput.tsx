import withAuth from '@components/utils/withAuth'
import { StarIcon } from '@heroicons/react/24/solid'
import classNames from '@components/utils/classNames'
import { useState, useEffect } from 'react'
import {
  BTN_SUBMIT,
  ERROR_WOOPS_SOMETHING_WENT_WRONG,
  GENERAL_REVIEW_OUT_OF_FIVE,
  MESSAGE_CHARACTERS_LEFT,
  POST_YOUR_REVIEW,
  REVIEW_COMMENT,
  REVIEW_TITLE,
} from '@components/utils/textVariables'
import { useFormik } from 'formik'
import * as yup from 'yup'

import { NEXT_CREATE_REVIEW } from '@components/utils/constants'
import axios from 'axios'
import { useUI } from '@components/ui/context'

const MIN_LENGTH = 5
const MAX_LENGTH = 240

const TITLE_MIN_LENGTH = 2
const TITLE_MAX_LENGTH = 20

interface ReviewInputProps {
  productId: string
}

const ReviewInput = ({ productId }: ReviewInputProps) => {
  const [rating, setRating] = useState(5)
  const [asyncMessage, setAsyncMessage] = useState('')

  const { user } = useUI()
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: '',
      comment: '',
    },
    validationSchema: yup.object({
      title: yup.string().required('Title is required.'),
      comment: yup.string().required('Please add your review.'),
    }),
    onSubmit: (values, { setSubmitting, resetForm }) => {
      handleSubmitReview(values, () => {
        setSubmitting(false)
        resetForm()
      })
    },
  })

  const handleRatingChange = (value: number) => setRating(value)

  const handleSubmitReview = (values: any, cb: any) => {
    const createAsyncReview = async () => {
      try {
        const response: any = await axios.post(NEXT_CREATE_REVIEW, {
          title: values?.title,
          rating: rating,
          comment: values?.comment,
          userId: user.userId,
          userEmail: user.email,
          nickname: user.nickname,
          productId,
        })
        setRating(1)
        if (cb) cb()
        setAsyncMessage('Review submitted successfully.')
      } catch (error) {
        setAsyncMessage(ERROR_WOOPS_SOMETHING_WENT_WRONG)
        if (cb) cb()
      }
    }
    createAsyncReview()
  }

  return (
    <>
      <h2 className="font-18 mb-6 font-semibold text-black">
        {POST_YOUR_REVIEW}
      </h2>
      {asyncMessage ? (
        <span className="text-2xl text-gray-900">{asyncMessage}</span>
      ) : (
        <form onSubmit={formik.handleSubmit}>
          <input
            name="title"
            placeholder={REVIEW_TITLE}
            value={formik.values.title}
            onChange={formik.handleChange}
            className="w-full min-w-0 px-4 py-2 mt-2 text-gray-900 placeholder-gray-500 bg-white border border-gray-300 rounded-sm shadow-sm appearance-none sm:mb-5 sm:w-1/3 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 "
          />
          {formik.touched.title && formik.errors.title && (
            <span className="block text-sm text-red-400">
              {formik.errors.title}
            </span>
          )}
          <textarea
            name="comment"
            value={formik.values.comment}
            onChange={formik.handleChange}
            className="w-full h-20 mt-2 px-3 py-2 font-medium leading-normal text-gray-900 placeholder-gray-700 border border-gray-400 rounded-sm bg-gray-50 focus:outline-none focus:bg-white"
            placeholder={REVIEW_COMMENT}
          />
          {formik.touched.comment && formik.errors.comment && (
            <span className="text-sm text-red-400">
              {formik.errors.comment}
            </span>
          )}
          <span className="float-right text-sm text-gray-900">
            {MESSAGE_CHARACTERS_LEFT}:{' '}
            {MAX_LENGTH - formik.values.comment.length}
          </span>
          <div className="flex mt-5 flex-row items-center">
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
            <p className="ml-3 mt-1 text-sm sm:text-[16px]  text-gray-700">
              {rating}
              <span className="sr-only"> {GENERAL_REVIEW_OUT_OF_FIVE}</span>
            </p>
          </div>
          <button
            type="submit"
            className="flex items-center justify-center flex-1 float-right max-w-xs px-4 py-2 btn-primary uppercase sm:w-full disabled:!bg-gray-100 !text-gray-300 disabled:cursor-not-allowed disabled:select-none"
            disabled={formik.isSubmitting}
          >
            {BTN_SUBMIT}
          </button>
        </form>
      )}
    </>
  )
}

export default withAuth(ReviewInput, false)
