import { FC } from 'react'
import NextHead from 'next/head'
import { DefaultSeo } from 'next-seo'
import config from '@framework/seo.json'

const Head: FC = () => {

  // Include "ch.js" plugin.
  const BC_ENGAGE_PLUGIN_ASSET_URL = process.env.BETTERCOMMERCE_ENGAGE_PLUGIN_ASSET_URL;

  // Include Jquery in project since it is being used in ch.js, which is included above this.
  const JQUERY_CDN_URL = process.env.JQUERY_CDN_URL;
  return (
    <>
      <DefaultSeo {...config} />
      <NextHead>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="manifest" href="/site.webmanifest" key="site-manifest" />
        <script type="text/javascript" src={JQUERY_CDN_URL}></script>
        <script type="text/javascript" src={BC_ENGAGE_PLUGIN_ASSET_URL}></script>
      </NextHead>
    </>
  )
}

export default Head
