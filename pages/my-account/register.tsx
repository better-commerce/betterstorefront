import { Layout } from '@components/common'
import commerce from '@lib/api/commerce'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import Form from '@components/customer'
import axios from 'axios'
import { NEXT_SIGN_UP } from '@components/utils/constants'
import { data } from 'autoprefixer'
function RegisterPage({ recordEvent, setEntities }: any) {
  const handleUserRegister = (values: any) => {
    const asyncRegisterUser = async () => {
      await axios.post(NEXT_SIGN_UP, { data: values })
    }
    asyncRegisterUser()
  }
  return (
    <section aria-labelledby="trending-heading" className="bg-white">
      <div className="py-16 sm:py-24 lg:max-w-7xl lg:mx-auto lg:py-32 lg:px-8">
        <div className="px-4 flex flex-col items-center justify-center sm:px-6 lg:px-0">
          <h2 className="text-6xl font-extrabold text-center tracking-tight text-gray-900">
            Register for free
          </h2>
        </div>
        <Form type="register" onSubmit={handleUserRegister} />
      </div>
    </section>
  )
}

RegisterPage.Layout = Layout

const PAGE_TYPE = PAGE_TYPES.Page
export default withDataLayer(RegisterPage, PAGE_TYPE)
