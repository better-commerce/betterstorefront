import Router from 'next/router'
import { GetServerSideProps } from 'next'
import NextHead from 'next/head'
import { Layout } from '@components/common'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import { useUI } from '@components/ui/context'
import Login from '@components/account/Login'
import { BETTERCOMMERCE_DEFAULT_LANGUAGE, SITE_ORIGIN_URL } from '@components/utils/constants'
import { useRouter } from 'next/router'
import { decrypt } from '@framework/utils/cipher'
import { matchStrings } from '@framework/utils/parse-util'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
function LoginPage({appConfig, pluginConfig = []}: any) {
  const  router  = useRouter()
  let b2bSettings: any = []
  let pluginSettings: any = []

  if (appConfig) {
    appConfig = JSON.parse(decrypt(appConfig))
    if (appConfig?.configSettings?.length) {
      b2bSettings =
        appConfig?.configSettings?.find((x: any) =>
          matchStrings(x?.configType, 'B2BSettings', true)
        )?.configKeys || []
    }
  }

  if (pluginConfig) {
    pluginSettings = pluginConfig
  }

  const { isGuestUser, user } = useUI()

  if (!isGuestUser && user.userId) {
    Router.push('/')
    return <></>
  }

  return (
    <>
      <NextHead>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <link rel="canonical" href={SITE_ORIGIN_URL+router.asPath} />
        <title>Login | Registration</title>
        <meta name="title" content="Login | Registration" />
        <meta name="description" content="Login | Registration" />
        <meta name="keywords" content="Login | Registration" />
        <meta property="og:image" content="" />
        <meta
          property="og:title"
          content="Login | Registration"
          key="ogtitle"
        />
        <meta
          property="og:description"
          content="Login | Registration"
          key="ogdesc"
        />
      </NextHead>
    <Login pluginConfig={pluginConfig}/>
    </>
    )
      
}

LoginPage.Layout = Layout

const PAGE_TYPE = PAGE_TYPES.Page
export default withDataLayer(LoginPage, PAGE_TYPE)

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const { locale } = context
  return {
    props: {
      ...(await serverSideTranslations(locale ?? BETTERCOMMERCE_DEFAULT_LANGUAGE!)),
    }, // will be passed to the page component as props
  }
}
