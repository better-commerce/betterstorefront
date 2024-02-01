import { Layout } from '@components/common'
import { GetServerSideProps } from 'next'
import {
  BTN_SUBMIT,
  FORGOT_PASSWORD,
  DETAILS_ERROR,
  ERROR_WOOPS_SOMETHING_WENT_WRONG,
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
import { Messages, EmptyString } from '@components/utils/constants'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'

function ForgotPasswordPage() {
  const { setAlert } = useUI()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [emailStatus, setEmailStatus] = useState('')
  const [form, setForm] = useState({ userName: '', password: '' })
  const router: any = useRouter()

  const handleChange = (e: any) => setEmail(e.target.value)

  const handleBlur = () => {
    const isValid = isValidEmail(email)
    if (!isValid) {
      setEmailStatus(Messages.Validations.ResetPassword.NO_EMAIL)
    }
  }

  const isValidEmail = (email: any) => {
    const emailRegex = Messages.Validations.RegularExpressions.EMAIL
    return emailRegex.test(email)
  }

  useEffect(() => {
    if (
      emailStatus === Messages.Validations.ResetPassword.INVALID_EMAIL ||
      emailStatus === Messages.Validations.ResetPassword.NO_EMAIL
    ) {
      setTimeout(() => setEmailStatus(EmptyString), 5000)
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
          // setEmailStatus(Messages.Validations.ResetPassword.INVALID_EMAIL)
          setAlert({
            type: 'error',
            msg: Messages.Validations.ResetPassword.INVALID_EMAIL,
          })
        } else {
          setEmailStatus(Messages.Validations.ResetPassword.VALID_EMAIL)
          setAlert({
            type: 'success',
            msg: Messages.Validations.ResetPassword.VALID_EMAIL,
          })
        }
        setForm({ ...form, userName: email })
        setEmail('')
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
                  {emailStatus !== '' &&
                    emailStatus !==
                      Messages.Validations.ResetPassword.VALID_EMAIL && (
                      <div className="text-red-600 w-full">{emailStatus}</div>
                    )}
                </div>
              )
            })}
            <Button
              type="submit"
              className="!font-normal w-full button"
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
const PAGE_TYPE = PAGE_TYPES.Page
export default withDataLayer(ForgotPasswordPage, PAGE_TYPE)

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  return {
    props: {}, // will be passed to the page component as props
  }
}
