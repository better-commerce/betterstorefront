import '@assets/main.css'
import '@assets/chrome-bug.css'
import 'keen-slider/keen-slider.min.css'
import { FC, useEffect } from 'react'
import { Head } from '@components/common'
import { ManagedUIContext } from '@components/ui/context'
import getNavTree from '@framework/api/content/getNavTree'

const Noop: FC = ({ children }) => <>{children}</>

function MyApp({ Component, pageProps, nav, footer }: any) {
  const Layout = (Component as any).Layout || Noop
  useEffect(() => {
    document.body.classList?.remove('loading')
  }, [])

  return (
    <>
      <Head />
      <ManagedUIContext>
        <Layout nav={nav} footer={footer} pageProps={pageProps}>
          <Component {...pageProps} />
        </Layout>
      </ManagedUIContext>
    </>
  )
}

MyApp.getInitialProps = async ({ appContext }: any) => {
  const response = await getNavTree()
  return { nav: response.header, footer: response.footer }
}

export default MyApp
