import { CURRENT_THEME, OMNILYTICS_DISABLED } from '@components/utils/constants'
import NextDocument, { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'
const featureToggle = require(`../public/theme/${CURRENT_THEME}/features.config.json`);
export default class MyDocument extends NextDocument /*Document*/ {
  static async getInitialProps(ctx: any) {
    const initialProps = await NextDocument.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html>
        <Head>
          <link rel="preload" href={`/theme/${CURRENT_THEME}/css/global.css`} as="style" />
          <link rel="stylesheet" href={`/theme/${CURRENT_THEME}/css/global.css`} />
          {featureToggle?.features?.enableStoreLocator &&
            <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyA1v3pkeBrwwbC-0KPCK5Uuhn77iHg2AjY&libraries=places"></script>
          }
        </Head>
        <body className="custom_class promo-banner-inactive">
          <Main />
          <NextScript />
          {OMNILYTICS_DISABLED ? null :
            <Script src="https://engage-asset.bettercommerce.io/_plugins/min/bc/v1/js/ch.js" strategy="beforeInteractive" />
          }
        </body>
      </Html>
    )
  }
}
