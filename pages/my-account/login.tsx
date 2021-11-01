import { Layout } from '@components/common'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import Form from '@components/customer'
import { NEXT_AUTHENTICATE } from '@components/utils/constants'
import axios from 'axios'
import { useState } from 'react'

function LoginPage({ recordEvent, setEntities }: any) {
  const [noAccount, setNoAccount] = useState(false)
  const handleUserLogin = (values: any) => {
    const asyncLoginUser = async () => {
      const result = await axios.post(NEXT_AUTHENTICATE, { data: values })
      console.log(result)
      if (!result.data) {
        setNoAccount(true)
      } else if (noAccount && result.data) {
        setNoAccount(false)
      }
    }
    asyncLoginUser()
  }
  return (
    <section aria-labelledby="trending-heading" className="bg-white">
      <div className="py-16 sm:py-24 lg:max-w-7xl lg:mx-auto lg:py-32 lg:px-8">
        <div className="px-4 flex flex-col items-center justify-center sm:px-6 lg:px-0">
          <h2 className="text-6xl font-extrabold text-center tracking-tight text-gray-900">
            Login
          </h2>
        </div>
        <Form btnText="Login" type="login" onSubmit={handleUserLogin} />
        <div className="w-full flex flex-col justify-center items-center">
          {noAccount && (
            <span className="text-red-700 text-lg">
              No account has been found with this email/password
            </span>
          )}
        </div>
      </div>
    </section>
  )
}

LoginPage.Layout = Layout

const PAGE_TYPE = PAGE_TYPES.Page
export default withDataLayer(LoginPage, PAGE_TYPE)
