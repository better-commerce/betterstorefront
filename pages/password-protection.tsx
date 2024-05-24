import { GetServerSideProps } from 'next'
import * as yup from 'yup'
import { useFormik } from 'formik'
import NextHead from 'next/head'

import Button from '@components/ui/Button'
import { BTN_SUBMIT } from '@components/utils/textVariables'
import { matchStrings, stringToBoolean } from '@framework/utils/parse-util'
import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { Logo } from '@components/ui'
import { Cookie } from '@framework/utils/constants'
//import Cookies from 'js-cookie'
//import { getExpiry, getMinutesInDays } from '@components/utils/setSessionId'
import Router from 'next/router'
import { SITE_NAME } from '@components/utils/constants'
import { IPagePropsProvider } from '@framework/contracts/page-props/IPagePropsProvider'
import { getPagePropType, PagePropType } from '@framework/page-props'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import useAnalytics from '@components/services/analytics/useAnalytics'
import { EVENTS_MAP } from '@components/services/analytics/constants'

declare const window: any

function PasswordProtectionPage({ config }: any) {
  let configSettings: any
  if (config) {
    configSettings = config?.configSettings
  }
  const [passwordProtectionSetting, setPasswordProtectionSetting] =
    useState<any>(undefined)
  const [passwordMatched, setPasswordMatched] = useState<boolean | null>(null)

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      password: '',
    },
    validationSchema: yup.object({
      password: yup.string().required('Password is required.'),
    }),
    onSubmit: (values, { setSubmitting }) => {
      if (values?.password === passwordProtectionSetting?.livePassword) {
        /*Cookies.set(`${window.location.hostname}-${Cookie.Key.PASSWORD_PROTECTION_AUTH}`, 'true', {
          expires: getExpiry(getMinutesInDays(30)),
        })*/
        localStorage.setItem(`${window.location.hostname}-${Cookie.Key.PASSWORD_PROTECTION_AUTH}`, 'true')
        setPasswordMatched(true)
      } else {
        setPasswordMatched(false)
      }
      setSubmitting(false)
    },
  })

  const getSeoConfig = () => {
    const seoSetting = configSettings?.find((cnf: any) =>
      matchStrings(cnf.configType, 'SeoSettings', true)
    )
    if (!seoSetting || seoSetting?.configKeys?.length < 1) return
    const title = seoSetting?.configKeys?.find((setting: any) =>
      matchStrings(setting?.key, 'SeoSettings.DefaultTitle', true)
    )?.value
    const keywords = seoSetting?.configKeys?.find((setting: any) =>
      matchStrings(setting?.key, 'SeoSettings.DefaultMetaKeywords', true)
    )?.value
    const description = seoSetting?.configKeys?.find((setting: any) =>
      matchStrings(setting?.key, 'SeoSettings.DefaultMetaDescription', true)
    )?.value
    return {
      title: title,
      keywords: keywords,
      description: description,
    }
  }

  const setPasswordProtectionConfig = useCallback(() => {
    const passwordSetting = configSettings?.find((cnf: any) =>
      matchStrings(cnf.configType, 'PasswordProtectionSettings', true)
    )
    if (!passwordSetting || passwordSetting?.configKeys?.length < 1) return
    const message = passwordSetting?.configKeys?.find((setting: any) =>
      matchStrings(
        setting?.key,
        'PasswordProtectionSettings.PasswordMessage',
        true
      )
    )?.value
    const livePassword = passwordSetting?.configKeys?.find((setting: any) =>
      matchStrings(
        setting?.key,
        'PasswordProtectionSettings.LivePassword',
        true
      )
    )?.value
    const livePasswordEnabled = stringToBoolean(
      passwordSetting?.configKeys?.find((setting: any) =>
        matchStrings(
          setting?.key,
          'PasswordProtectionSettings.LivePasswordEnabled',
          true
        )
      )?.value || ''
    )
    const betaPassword = passwordSetting?.configKeys?.find((setting: any) =>
      matchStrings(
        setting?.key,
        'PasswordProtectionSettings.BetaPassword',
        true
      )
    )?.value
    const betaPasswordEnabled = stringToBoolean(
      passwordSetting?.configKeys?.find((setting: any) =>
        matchStrings(
          setting?.key,
          'PasswordProtectionSettings.LivePasswordEnabled',
          true
        )
      )?.value || ''
    )
    const siteAccessType = passwordSetting?.configKeys?.find((setting: any) =>
      matchStrings(
        setting?.key,
        'PasswordProtectionSettings.SiteAccessType',
        true
      )
    )?.value
    setPasswordProtectionSetting({
      message,
      livePassword,
      livePasswordEnabled,
      betaPassword,
      betaPasswordEnabled,
      siteAccessType,
    })
  }, [configSettings])

  useAnalytics(EVENTS_MAP.EVENT_TYPES.PasswordProtection, {
    entityName: PAGE_TYPES.PasswordProtection,
    entityType: EVENTS_MAP.ENTITY_TYPES.Page,
    eventType: EVENTS_MAP.EVENT_TYPES.PasswordProtection,
  })

  useEffect(() => {
    setPasswordProtectionConfig()
  }, [configSettings])

  useEffect(() => {
    if (passwordMatched) {
      Router.push('/')
    }
  }, [passwordMatched])

  return (
    <>
      <NextHead>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="description" content={getSeoConfig()?.description} />
        <meta name="keywords" content={getSeoConfig()?.keywords} />
        <title>{SITE_NAME} - Password Protection</title>
      </NextHead>
      <header className="fixed top-0 right-0 w-full py-0 bg-white shadow-md lg:top-0 sm:py-3 bg-header-color z-999 navbar-min-64">
        <div className="flex justify-center w-full">
          <Link href="/" title={getSeoConfig()?.title}>
            <div className="flex items-center justify-center cursor-pointer">
              <Logo />
            </div>
          </Link>
        </div>
      </header>
      <main className="grid h-screen px-4 pt-6 pb-24 bg-gray-50 sm:px-4 sm:pt-4 lg:px-8 lg:py-2 place-items-center">
        <div className="w-full max-w-3xl p-4 mx-auto bg-white rounded-md shadow-lg">
          <div className="mb-8">
            <h2 className="font-extrabold tracking-tight text-gray-900">
              {passwordProtectionSetting?.message}
            </h2>
          </div>
          <div>
            <form onSubmit={formik.handleSubmit}>
              <label htmlFor="password" className="text-sm text-gray-700"> Password </label>
              <input name="password" type="password" value={formik.values.password} onChange={formik.handleChange} placeholder="Enter password" className="font-medium text-black checkout-input-field dark:bg-white dark:text-black placeholder:text-gray-400 placeholder:font-normal input-check-default" autoComplete="off" autoFocus />
              {formik.errors.password && (
                <span className="form-input-error !capitalize"> {formik.errors.password} </span>
              )}
              <Button type="submit" className="!font-normal w-full border border-black btn-c btn-primary mt-4" loading={formik.isSubmitting} disabled={formik.isSubmitting} >
                {BTN_SUBMIT}
              </Button>
            </form>
            {passwordMatched !== null && (
              <div className={`mt-4 ${passwordMatched ? 'text-green-600' : 'text-red-600'}`} >
                {passwordMatched ? 'Password matched! Redirecting...' : 'Incorrect password. Please try again.'}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const props: IPagePropsProvider = getPagePropType({ type: PagePropType.COMMON })
  const pageProps = await props.getPageProps({ cookies: context?.req?.cookies })
  return {
    props: {
      ...pageProps,
    },
  }
}

export default withDataLayer(PasswordProtectionPage, PAGE_TYPES.PasswordProtection, false)