import { Layout } from '@components/common'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import Form from '@components/customer'
import axios from 'axios'
import {
  NEXT_SIGN_UP,
  NEXT_VALIDATE_EMAIL,
  NEXT_ASSOCIATE_CART,
} from '@components/utils/constants'
import { useUI } from '@components/ui/context'
import Router from 'next/router'
import { useState, useEffect } from 'react'
import Button from '@components/ui/IndigoButton'
import { validate } from 'email-validator'
import cartHandler from '@components/services/cart'

const EmailInput = ({ value, onChange, submit, apiError = '' }: any) => {
  const [error, setError] = useState(apiError)

  useEffect(() => {
    setError(apiError)
  }, [apiError])

  const handleSubmit = () => {
    const isValidEmail = validate(value)
    if (isValidEmail) {
      error ? setError('') : false
      submit(value)
    } else {
      setError('Please enter a valid email')
    }
  }

  return (
    <div className="w-full flex justify-center mt-10 flex-col items-center">
      <div className="font-semibold w-full sm:w-1/2">
        <label className="text-gray-700 text-sm">Email</label>
        <input
          className="mb-2 mt-2 appearance-none min-w-0 w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 "
          value={value}
          type="email"
          onChange={onChange}
        />
      </div>
      {error ? <span className="text-red-500 capitalize">{error}</span> : null}
      <div className="w-full sm:w-1/2 flex justify-center items-center my-5">
        <Button buttonType="default" action={handleSubmit} title={'Submit'} />
      </div>
    </div>
  )
}
function RegisterPage({ recordEvent, setEntities }: any) {
  const [hasPassedEmailValidation, setHasPassedEmailValidation] =
    useState(false)
  const [userEmail, setUserEmail] = useState('')
  const { user, basketId } = useUI()
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const { addToCart, associateCart } = cartHandler()
  useEffect(() => {
    setError('')
  }, [userEmail])

  if (user.userId) {
    Router.push('/')
  }
  if (user.userId) {
    return (
      <div className="font-extrabold text-center w-full h-full text-gray-900">
        You're already logged in
      </div>
    )
  }

  const handleBasketAssociation = async (userId: string) => {
    const response: any = await associateCart(userId, basketId)
  }

  const handleUserRegister = (values: any) => {
    const asyncRegisterUser = async () => {
      const response: any = await axios.post(NEXT_SIGN_UP, {
        data: { ...values, email: userEmail },
      })
      await handleBasketAssociation(response.data.recordId)
      setSuccessMessage('Success!')
      Router.push('/my-account/login')
    }
    asyncRegisterUser()
  }

  const handleEmailSubmit = (email: string) => {
    const handleAsync = async () => {
      try {
        const { data }: any = await axios.post(NEXT_VALIDATE_EMAIL, {
          data: email,
        })
        if (!data.length) {
          setHasPassedEmailValidation(true)
        } else {
          setError('This email is already in use')
        }
      } catch (error) {
        console.log(error)
      }
    }
    handleAsync()
  }
  return (
    <section aria-labelledby="trending-heading" className="bg-white">
      <div className="py-16 sm:py-24 lg:max-w-7xl lg:mx-auto lg:py-32 lg:px-8">
        <div className="px-4 flex flex-col items-center justify-center sm:px-6 lg:px-0">
          <h2 className="text-6xl font-extrabold text-center tracking-tight text-gray-900">
            Register for free
          </h2>
        </div>
        {!successMessage && (
          <>
            {!hasPassedEmailValidation ? (
              <EmailInput
                value={userEmail}
                onChange={(e: any) => setUserEmail(e.target.value)}
                submit={handleEmailSubmit}
                apiError={error}
              />
            ) : (
              <Form type="register" onSubmit={handleUserRegister} />
            )}
          </>
        )}
        <span className="flex w-full justify-center items-center text-2xl text-indigo-600">
          {successMessage}
        </span>
      </div>
    </section>
  )
}

RegisterPage.Layout = Layout

const PAGE_TYPE = PAGE_TYPES.Page
export default withDataLayer(RegisterPage, PAGE_TYPE)
