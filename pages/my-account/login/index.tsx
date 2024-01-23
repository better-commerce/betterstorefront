import Router from 'next/router'
import { GetServerSideProps } from 'next'
import NextHead from 'next/head'
import { Layout } from '@components/common'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import { useUI } from '@components/ui/context'
import Login from '@components/account/Login'
import { SITE_ORIGIN_URL } from '@components/utils/constants'
import { useRouter } from 'next/router'
function LoginPage() {
  const  router  = useRouter()
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
    <Login />
    </>
    )
      
}

LoginPage.Layout = Layout

const PAGE_TYPE = PAGE_TYPES.Page
export default withDataLayer(LoginPage, PAGE_TYPE)

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  return {
    props: {}, // will be passed to the page component as props
  }
}
