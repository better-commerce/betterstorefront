import { useRouter } from 'next/router'

export default function Checkout() {
  if (typeof window !== 'undefined') {
    const Router = useRouter()

    const accessToken = localStorage.getItem('user')

    // If there is no access token we redirect to "/" page.
    if (!accessToken) {
      Router.replace('/')
      return null
    }

    // If this is an accessToken we just render the component that was passed with all its props
    return null
  }

  return null
}
