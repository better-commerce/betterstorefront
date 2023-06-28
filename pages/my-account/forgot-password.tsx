import { Layout } from '@components/common'
import {
  BTN_SUBMIT,
  FORGOT_PASSWORD,
  DETAILS_ERROR,
} from '@components/utils/textVariables'
import { useEffect, useState } from 'react'
import { Button } from '@components/ui'
import LoadingDots from '@components/ui/LoadingDots'
import {
  NEXT_FORGOT_PASSWORD,
  NEXT_RESET_PASSWORD,
  NEXT_VALIDATE_TOKEN,
} from '@components/utils/constants'
import axios from 'axios'
import { useRouter } from 'next/router'
import { validate } from 'email-validator'
import { useUI } from '@components/ui/context'
import classNames from 'classnames'

const EMAIL_STATUSES_MAP = {
  NO_EMAIL: 0,
  INVALID_EMAIL: 1,
  VALID_EMAIL: 2,
}

const EMAIL_MESSAGES: any = {
  1: "We couldn't find an account with this email",
  2: 'Success! Check your email for the link to change your password',
}

export default function ForgotPasswordPage() {
  const { setAlert } = useUI()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [emailStatus, setEmailStatus] = useState(EMAIL_STATUSES_MAP.NO_EMAIL)
  const [form, setForm] = useState({ userName: '', password: '' })
  const router: any = useRouter()

  const handleChange = (e: any) => setEmail(e.target.value)

  const handleBlur = () => {
    const isValid = isValidEmail(email)
    if (!isValid) {
      setEmailStatus(EMAIL_STATUSES_MAP.INVALID_EMAIL)
    }
  }

  const isValidEmail = (email: any) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateToken = async (token: any) => {
    try {
      const { data }: any = await axios.post(NEXT_VALIDATE_TOKEN, { token })
      if (!data.response.result.isValid) throw new Error('error')
      else {
        setEmailStatus(EMAIL_STATUSES_MAP.VALID_EMAIL)
        setIsLoading(false)
      }
    } catch (error) {
      alert('Woops! Token is invalid')
      router.push('/my-account/forgot-password')
    }
  }

  useEffect(() => {
    const token = router.query.token
    if (token) {
      setIsLoading(true)
      validateToken(token)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (emailStatus === EMAIL_STATUSES_MAP.INVALID_EMAIL) {
      setTimeout(() => setEmailStatus(EMAIL_STATUSES_MAP.NO_EMAIL), 5000)
    }
  }, [emailStatus])

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setIsLoading(true)
    const isValidEmail = validate(email)
    try {
      if (isValidEmail) {
        let { data }: any = await axios.post(NEXT_FORGOT_PASSWORD, { email })
        if (!data.forgotRes.result.isValid) {
          setEmailStatus(EMAIL_STATUSES_MAP.INVALID_EMAIL)
        } else {
          setEmailStatus(EMAIL_STATUSES_MAP.VALID_EMAIL)
        }
        setForm({ ...form, userName: email })
        setEmail('')
        if (data) {
          setAlert({ type: 'success', msg: EMAIL_MESSAGES[2] })
        } else if (!data) {
          setAlert({ type: 'error', msg: EMAIL_MESSAGES[1] })
        }
      }
      setIsLoading(false)
    } catch (error) {
      setAlert({ type: 'error', msg: DETAILS_ERROR })
      setIsLoading(false)
    }
  }

  const config: any = [
    {
      name: 'email',
      label: 'Enter your email',
      type: 'email',
      placeholder: 'joe@example.com',
    },
    // {
    //   name: 'password',
    //   label: 'Enter new password',
    //   type: 'password',
    //   placeholder: '*******',
    // },
  ]
  const stateForm: any = form

  return (
    <section>
      <div className="py-16 sm:py-24 lg:max-w-7xl lg:mx-auto lg:py-32 lg:px-8">
        <div className="px-4 flex flex-col items-center justify-center sm:px-6 lg:px-0">
          <h1 className="my-4 font-extrabold text-center tracking-tight text-gray-900">
            {FORGOT_PASSWORD}
          </h1>
          <form
            onSubmit={handleSubmit}
            className="flex-col px-5 py-5 flex items-center justify-center font-semibold w-full sm:w-1/2"
          >
            {config.map((field: any, Idx: any) => {
              return (
                <div key={Idx} className="w-full">
                  <label className="text-gray-700 text-sm">{field.label}</label>
                  <input
                    className="mb-2 mt-2 appearance-none min-w-0 w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    name={field.name}
                    value={email}
                    type={field.type}
                    placeholder={field.placeholder}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {emailStatus > 0 && (
                    <div className={classNames(emailStatus===2?"text-gray-700":"text-red-600","w-full ")}>
                      {EMAIL_MESSAGES[emailStatus]}
                    </div>
                  )}
                </div>
              )
            })}
            <Button
              type="submit"
              className="!font-normal w-full"
              loading={isLoading}
              disabled={isLoading}
            >
              {!isLoading && BTN_SUBMIT}
            </Button>
          </form>
        </div>
      </div>
    </section>
  )
}

ForgotPasswordPage.Layout = Layout
