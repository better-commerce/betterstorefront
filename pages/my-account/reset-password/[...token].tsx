import { Layout } from '@components/common'
import {
  CHANGE_PASSWORD,
} from '@components/utils/textVariables'
import { useEffect, useState } from 'react'
import {
  NEXT_FORGOT_PASSWORD,
  NEXT_RESET_PASSWORD,
  NEXT_VALIDATE_TOKEN,
} from '@components/utils/constants'
import axios from 'axios'
import { useRouter } from 'next/router'
import { Button } from '@components/ui'
import { useUI } from '@components/ui/context'
import Spinner from '@components/ui/Spinner'
import * as yup from 'yup'
import { useFormik } from 'formik'
export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [token, setToken] = useState(null)
  const router: any = useRouter()
  const { setAlert } = useUI()

  const config = [
    {
      name: 'password',
      label: 'Enter New Password',
      type: 'password',
      placeholder: 'Strong Password',
    },
    {
      name: 'confirmPassword',
      label: 'Confirm New Password',
      type: 'password',
      placeholder: 'Confirm Strong Password',
    },
  ]
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      userName: '',
      password: '',
      confirmPassword: '',
    },
    onSubmit: (values: any, { setSubmitting }) => {
      values = {
        ...values,
        token: token,
      }
      delete values.confirmPassword
      // alert(JSON.stringify(values, null, 2))
      handlePasswordChangeSubmit(values, () => {
        setSubmitting(false)
      })
    },
    validationSchema: yup.object({
      userName: yup.string(),
      password: yup
        .string()
        .required('Password is required.')
        .matches(
          /^(?=.*[A-Z]).{8,}$/,
          'Password should have a minimum of 8 characters and at least 1 uppercase letter.'
        ),
      confirmPassword: yup
        .string()
        .required('Confirm password is required.')
        .oneOf([yup.ref('password')], 'Passwords must match.'),
    }),
  })

  const validateToken = async (token: any) => {
    setIsLoading(true)
    try {
      const { data }: any = await axios.post(NEXT_VALIDATE_TOKEN, { token })
      if (!data.response.result.isValid) throw new Error('error')
      else {
        setToken(token)
      }
      setIsLoading(false)
    } catch (error) {
      // setIsLoading(false)
      setAlert({ type: 'error', msg: 'Woops! Token is expired or invalid' })
      router.push('/my-account/forgot-password')
    }
  }

  useEffect(() => {
    if (router?.query?.token) {
      validateToken(router?.query?.token[0])
    }
  }, [router?.query?.token])

  const handlePasswordChangeSubmit = async (values: any, cb?: any) => {
    setIsLoading(true)

    try {
      await axios.post(NEXT_RESET_PASSWORD, {
        ...values,
      })
      setIsLoading(false)
      setAlert({
        type: 'success',
        msg: 'Success! You will be redirected to login page',
      })
      if (cb) cb()
      router.push('/my-account/login')
    } catch (error) {
      setIsLoading(false)
      if (cb) cb()
    }
  }

  if (isLoading) {
    return <Spinner />
  }

  return (
    <section>
      <div className="py-16 sm:py-24 lg:max-w-7xl lg:mx-auto lg:py-32 lg:px-8">
        <div className="px-4 flex flex-col items-center justify-center sm:px-6 lg:px-0">
          <h1 className="my-4 font-extrabold text-center tracking-tight text-gray-900">
            {CHANGE_PASSWORD}
          </h1>
        </div>
        <form
          onSubmit={formik.handleSubmit}
          className="flex-col m-auto px-5 py-5 flex items-center justify-center font-semibold w-full sm:w-1/2"
        >
          {config.map((field:any,Idx:any) => {
            return (
                <div key={Idx} className="mt-6 w-full sm:w-1/2">
                  <label className="text-gray-700 text-sm">
                    {field.label}
                  </label>
                  <input
                    className="mb-2 mt-2 appearance-none min-w-0 w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    name={field.name}
                    type={field.type}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values[field.name]}
                  />
                  {formik.errors[field.name] && formik.touched[field.name] && (
                    <p className="text-red-500">
                      <>{formik.errors[field.name]}</>
                    </p>
                  )}
                </div>
            )
          })}          
          <div className="mt-10 w-full sm:w-1/2">
            <Button
              type="submit"
              className="!font-normal w-full"
              loading={formik.isSubmitting}
              disabled={!formik.isValid || formik.isSubmitting}
            >
              {CHANGE_PASSWORD}
            </Button>
          </div>
        </form>
      </div>
    </section>
  )
}

ForgotPasswordPage.Layout = Layout
