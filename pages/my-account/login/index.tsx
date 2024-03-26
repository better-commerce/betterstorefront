import Router from 'next/router'
import { GetServerSideProps } from 'next'
import NextHead from 'next/head'
import Layout from '@new-components/Layout/Layout'
import withDataLayer, { PAGE_TYPES } from '@new-components/withDataLayer'
import { useUI } from '@new-components/ui/context'
import Login from '@components/account/Login'
import { BETTERCOMMERCE_DEFAULT_LANGUAGE, SITE_ORIGIN_URL } from '@new-components/utils/constants'
import { useRouter } from 'next/router'
import { decrypt } from '@framework/utils/cipher'
import { matchStrings } from '@framework/utils/parse-util'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from '@commerce/utils/use-translation'
function LoginPage({appConfig, pluginConfig = []}: any) {
  const  router  = useRouter()
  const translate = useTranslation()
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
        <title>{translate('label.checkout.loginRegistrationText')}</title>
        <meta name="title" content={translate('label.checkout.loginRegistrationText')} />
        <meta name="description" content={translate('label.checkout.loginRegistrationText')} />
        <meta name="keywords" content={translate('label.checkout.loginRegistrationText')} />
        <meta property="og:image" content="" />
        <meta
          property="og:title"
          content={translate('label.checkout.loginRegistrationText')}
          key="ogtitle"
        />
        <meta
          property="og:description"
          content={translate('label.checkout.loginRegistrationText')}
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
