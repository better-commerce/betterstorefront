import Layout from '@components/Layout/Layout'
import { GetServerSideProps } from 'next'
import { useEffect, useState } from 'react'
import { Button } from '@components/ui'
import NextHead from 'next/head'
import { BETTERCOMMERCE_DEFAULT_LANGUAGE, NEXT_FORGOT_PASSWORD, SITE_ORIGIN_URL, } from '@components/utils/constants'
import axios from 'axios'
import { useRouter } from 'next/router'
import { validate } from 'email-validator'
import { useUI } from '@components/ui/context'
import { Messages, EmptyString } from '@components/utils/constants'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import { useTranslation } from '@commerce/utils/use-translation'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
function ForgotPasswordPage() {
  const { setAlert } = useUI()
  const translate = useTranslation()
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
      setAlert({ type: 'error', msg: translate('label.addressBook.updateFailedText') })
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
    <>
      <NextHead>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="canonical" href={SITE_ORIGIN_URL + router.asPath} />
        <title>{translate('label.myAccount.forgotPasswordText')}</title>
        <meta name="title" content={translate('label.myAccount.forgotPasswordText')} />
        <meta name="description" content={translate('label.myAccount.forgotPasswordText')} />
        <meta name="keywords" content={translate('label.myAccount.forgotPasswordText')} />
        <meta property="og:image" content="" />
        <meta property="og:title" content={translate('label.myAccount.forgotPasswordText')} key="ogtitle" />
        <meta property="og:description" content={translate('label.myAccount.forgotPasswordText')} key="ogdesc" />
      </NextHead>

      <section>
        <div className="pt-16 pb-10 sm:pt-24 sm:pb-10 lg:max-w-7xl lg:mx-auto lg:px-8">
          <div className="flex flex-col items-center justify-center px-4 sm:px-6 lg:px-0">
            <div className="flex flex-col items-center justify-center px-4 sm:px-6 lg:px-0">
              <h1 className="mt-20 mb-10 flex items-center text-3xl leading-[115%] md:text-5xl md:leading-[115%] font-semibold text-neutral-900 dark:text-neutral-100 justify-center">
                {translate('label.myAccount.forgotPasswordText')}
              </h1>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center w-full px-5 py-5 font-semibold sm:w-1/2" >
              {config.map((field: any, Idx: any) => {
                return (
                  <div key={Idx} className="w-full mb-4">
                    <label className="text-neutral-800 dark:text-neutral-200">{field.label}</label>
                    <input className="block w-full px-4 py-3 mt-1 text-sm font-normal bg-white border-neutral-200 focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 dark:border-neutral-700 dark:focus:ring-primary-6000 dark:focus:ring-opacity-25 dark:bg-neutral-900 disabled:bg-neutral-200 dark:disabled:bg-neutral-800 rounded-2xl h-11" name={field.name} value={email} type={field.type} placeholder={field.placeholder} onChange={handleChange} onBlur={handleBlur} />
                    {emailStatus !== '' && emailStatus !== Messages.Validations.ResetPassword.VALID_EMAIL && (
                      <div className="w-full text-red-600">{emailStatus}</div>
                    )}
                  </div>
                )
              })}
              <Button type="submit" className="w-full btn btn-primary" loading={isLoading} disabled={isLoading} >
                {!isLoading && translate('common.label.submitText')}
              </Button>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}

ForgotPasswordPage.Layout = Layout
const PAGE_TYPE = PAGE_TYPES.Page
export default withDataLayer(ForgotPasswordPage, PAGE_TYPE)

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const { locale } = context
  return {
    props: {
      ...(await serverSideTranslations(locale ?? BETTERCOMMERCE_DEFAULT_LANGUAGE!)),
    }, // will be passed to the page component as props
  }
}
