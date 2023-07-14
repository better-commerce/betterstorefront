import Router from 'next/router'
import { GetServerSideProps } from 'next'

import { Layout } from '@components/common'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import { useUI } from '@components/ui/context'
import Login from '@components/account/Login'

function LoginPage() {
  const { isGuestUser, user } = useUI()

  if (!isGuestUser && user.userId) {
    Router.push('/')
    return <></>
  }

  return <Login />
}

LoginPage.Layout = Layout

const PAGE_TYPE = PAGE_TYPES.Page
export default withDataLayer(LoginPage, PAGE_TYPE)

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  return {
    props: {}, // will be passed to the page component as props
  }
}
