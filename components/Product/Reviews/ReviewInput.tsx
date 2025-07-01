import withAuth from '@components/utils/withAuth'
import { StarIcon } from '@heroicons/react/24/solid'
import classNames from '@components/utils/classNames'
import { useState } from 'react'
import { useFormik } from 'formik'
import * as yup from 'yup'
import cn from 'classnames';

import { NEXT_CREATE_REVIEW } from '@components/utils/constants'
import axios from 'axios'
import { useUI } from '@components/ui/context'
import { useTranslation } from '@commerce/utils/use-translation'

const MIN_LENGTH = 5
const MAX_LENGTH = 240

const TITLE_MIN_LENGTH = 2
const TITLE_MAX_LENGTH = 20
interface ReviewInputProps {
  productId: string
}

const ReviewInput = ({ productId }: ReviewInputProps) => {
  const translate = useTranslation()
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
        setAsyncMessage(translate('common.message.somethingWentWrongMsg'))
        if (cb) cb()
      }
    }
    createAsyncReview()
  }

  return (
    <>
    <div className='p-6 shadow-lg border rounded-sm border-gray-200 bg-gradient-to-br from-white to-gray-50'>
    <h2 className="font-18 mb-6 font-semibold text-black">
        {translate('label.product.postYourReviewText')}
      </h2>
      {asyncMessage ? (
      <div className="bg-green-50 text-green-800 p-4 rounded-md flex items-center justify-center">
        <span className="text-lg">{asyncMessage}</span>
      </div>
      ) : (
        <form onSubmit={formik.handleSubmit}>
          <div className="space-y-2 mb-4">
          <input
            name="title"
            placeholder={translate('label.product.reviewTitleText')}
            value={formik.values.title}
            onChange={formik.handleChange}
            className={cn(
              "border-gray-300 w-full focus:border-purple-400 focus:ring-2 focus:ring-[#536DAE] transition-all shadow-sm",
              formik.touched.title && formik.errors.title ? "border-red-300" : ""
            )}
          />
          {formik.touched.title && formik.errors.title && (
            <span className="block text-sm text-red-400">
              {formik.errors.title}
            </span>
          )}
          </div>
          <div className="space-y-2">
            <textarea
              name="comment"
              value={formik.values.comment}
              onChange={formik.handleChange}
              className={cn(
                "min-h-32 w-full border-gray-300 focus:border-purple-400 focus:ring-2 focus:ring-[#536DAE] transition-all shadow-sm",
                formik.touched.comment && formik.errors.comment ? "border-red-300" : ""
              )}
              placeholder={translate('label.product.typeYourTitleText')}
            />
              <div className="flex justify-between text-right text-sm">
                {formik.touched.comment && formik.errors.comment && (
                  <span className="text-sm w-full text-left text-red-400">
                    {formik.errors.comment}
                  </span>
                )}
                <span className="text-sm w-full text-right font-medium">
                  {translate('label.product.charactersLeftText')}:{' '}
                  {MAX_LENGTH - formik.values.comment.length}
                </span>
            </div>
          </div>
          <div className="space-y-2 mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Rating
          </label>
          <div className="flex mt-5 flex-row items-center">
            {[1, 2, 3, 4, 5].map((num) => (
              <StarIcon
                key={`starIcon-${num}`}
                className={classNames(
                  rating >= num ? 'text-yellow-400' : 'text-gray-200',
                  'h-6 w-6 flex-shrink-0'
                )}
                onClick={() => handleRatingChange(num)}
                aria-hidden="true"
              />
            ))}
            <p className="ml-3 mt-1 text-base sm:text-[16px]  text-gray-700">
              {rating}
              <span className="sr-only"> {translate('label.product.outOf5starsText')}</span>
            </p>
          </div>
          </div>
          <div className="pt-4 flex justify-end">
          <button
            type="submit"
            className="flex items-center justify-center flex-1 float-right max-w-xs btn btn-primary sm:w-full disabled:!bg-gray-100 !text-gray-300 disabled:cursor-not-allowed disabled:select-none"
            disabled={formik.isSubmitting}
          >
            {translate('common.label.submitText')}
          </button>
          </div>
        </form>
      )}
   </div>
    </>
  )
}

export default withAuth(ReviewInput, false)
