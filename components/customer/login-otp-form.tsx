import { useCallback, useEffect, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'

import Button from '@components/ui/Button'
import { NEXT_OTP_REQUEST, OTP_TIMER } from '@components/utils/constants'
import { useTranslation } from '@commerce/utils/use-translation'


function LoginOTPForm({ handleUserLogin }: any) {
  const translate = useTranslation()
  const [shouldDisplayOTPField, setShouldDisplayOTPField] = useState(false)
  const formik: any = useFormik({
    enableReinitialize: true,
    initialValues: {
      mobile: '',
      otp: '',
    },
    validationSchema: Yup.object({
      mobile: Yup.string()
        .required('Mobile is required.')
        .matches(
          /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
          'Please input valid mobile.'
        ),
      otp: shouldDisplayOTPField
        ? Yup.string()
            .required('OTP is required')
            .matches(/^[0-9]{6}$/, 'OTP must be 6-digit characters.')
        : Yup.string(),
    }),
    onSubmit: (values, { setSubmitting }) => {
      handleSubmitMobile(values.mobile, shouldDisplayOTPField, () => {
        setSubmitting(false)
      })
    },
  })

  const sendOtpApi = async (values: { mobileNo: string }, cb?: any) => {
    try {
      const res = await axios.post(NEXT_OTP_REQUEST, {
        ...values,
        entityType: 1,
        templateId: 1,
      })
      if (cb) cb()
      if (res.data.success) {
        setShouldDisplayOTPField(true)
        setTimer(OTP_TIMER)
        return res.data.result
      }
      throw new Error('Something went wrong.')
    } catch (error) {
      console.log(error)
      if (cb) cb()
      return false
    }
  }

  const handleSubmitMobile = async (
    mobile: string,
    verifyOtp: boolean,
    cb?: any
  ) => {
    if (verifyOtp) {
      handleUserLogin(
        {
          username: formik.values.mobile,
          password: formik.values.otp,
          isOTPBasedAuthentication: true,
        },
        cb
      )
    } else {
      await sendOtpApi({ mobileNo: mobile }, cb)
    }
  }

  const [timer, setTimer] = useState(0)
  const timeOutCallback = useCallback(
    () => setTimer((currTimer) => currTimer - 1),
    []
  )

  useEffect(() => {
    if (timer > 0) {
      const otpTimer = setTimeout(timeOutCallback, 1000)
      return () => {
        clearTimeout(otpTimer)
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timer])

  const resetTimer = function () {
    if (!timer) {
      setTimer(OTP_TIMER)
    }
  }

  const resendOTP = async (mobile: string) => {
    if (timer > 0) return
    resetTimer()
    formik.handleChange({
      target: {
        name: 'otp',
        value: '',
      },
    })
    await sendOtpApi({ mobileNo: mobile })
  }

  return (
    <div className="flex-col w-full px-5 py-5 flex items-center justify-center mt-5">
      <form
        className="font-semibold w-full sm:w-1/2"
        onSubmit={formik.handleSubmit}
      >
        <div>
          <label className="text-gray-700 text-sm">{translate('label.loginWithOTP.mobileNumberText')}</label>
          <input
            name="mobile"
            onChange={formik.handleChange}
            value={formik.values.mobile}
            type="text"
            className="mb-2 mt-2 appearance-none min-w-0 w-full bg-white border border-gray-300 shadow-sm py-2 px-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 "
          />
          {formik.errors.mobile && formik.touched.mobile && (
            <div className="text-red-400 text-xs capitalize mb-2">
              {formik.errors.mobile}
            </div>
          )}
        </div>
        {shouldDisplayOTPField && (
          <div className="mt-2">
            <div className="flex justify-between">
              <label className="text-gray-700 text-sm">{translate('label.loginWithOTP.verificationCodeText')}</label>
              <button
                type="button"
                disabled={timer > 0}
                onClick={() => resendOTP(formik.values.mobile)}
                className="disabled:cursor-not-allowed disabled:opacity-60 text-sm"
              >
                {timer > 0 && `(${timer}s)`} {translate('label.loginWithOTP.resendCodeText')}
              </button>
            </div>
            <input
              name="otp"
              onChange={formik.handleChange}
              value={formik.values.otp}
              minLength={6}
              maxLength={6}
              type="text"
              className="mb-2 mt-2 appearance-none min-w-0 w-full bg-white border border-gray-300 shadow-sm py-2 px-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 "
            />
            {formik.errors.otp && formik.touched.otp && (
              <div className="text-red-400 text-xs capitalize mb-2">
                {formik.errors.otp}
              </div>
            )}
          </div>
        )}
        <div className="w-full flex justify-center items-center my-5">
          <Button
            type="submit"
            className="!font-normal w-full border border-black !p-0 !h-[56px]"
            disabled={formik.isSubmitting}
            loading={formik.isSubmitting}
          >
            {!shouldDisplayOTPField ? translate('label.loginWithOTP.requestOTPText') : translate('label.loginWithOTP.verifyOTPText')}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default LoginOTPForm
