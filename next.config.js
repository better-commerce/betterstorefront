/**
 * @type {import('next').NextConfig}
 */

const {
  withCommerceConfig,
  getProviderName,
} = require('./framework/commerce/config')
const commerce = require('./commerce.config.json')
const provider = commerce.provider || getProviderName()
const isBC = provider === 'bigcommerce'
const isBetterCommerce = provider === 'bettercommerce'

module.exports = withCommerceConfig({  
  images: {
    domains: ['liveocxcdn.azureedge.net','liveocxstorage.blob.core.windows.net', 'cdnbs.bettercommerce.io','dev-da-cdn-erf7a6h0byf7e6f0.z01.azurefd.net' , 'cdn.shopify.com', 'liveocx.imgix.net', 'devocxblob.blob.core.windows.net','img.ffx.co.uk'],
    // for trident need to add domain ('res.cloudinary.com', '99yrs.co.in') for images
  },
  commerce,
  i18n: {
    locales: ['es'],
    defaultLocale: 'en-US',
  },
  rewrites() {
    return [
      {
        source: '/robots.txt',
        destination: '/api/robots',
      },
      (isBC) && {
        source: '/checkout',
        destination: '/api/checkout',
      },
      // The logout is also an action so this route is not required, but it's also another way
      // you can allow a logout!
      isBC && {
        source: '/logout',
        destination: '/api/logout?redirect_to=/',
      },
      // For Vendure, rewrite the local api url to the remote (external) api url. This is required
      // to make the session cookies work.

    ].filter(Boolean)
  },
  env: {
    BETTERCOMMERCE_AUTH_URL: process.env.BETTERCOMMERCE_AUTH_URL,
    BETTERCOMMERCE_BASE_URL: process.env.BETTERCOMMERCE_BASE_URL,
    BETTERCOMMERCE_CLIENT_ID: process.env.BETTERCOMMERCE_CLIENT_ID,
    BETTERCOMMERCE_SHARED_SECRET: process.env.BETTERCOMMERCE_SHARED_SECRET,
    OMS_BASE_URL: process.env.OMS_BASE_URL,
    BETTERCOMMERCE_DEFAULT_CURRENCY: process.env.BETTERCOMMERCE_DEFAULT_CURRENCY,
    BETTERCOMMERCE_DEFAULT_LANGUAGE: process.env.BETTERCOMMERCE_DEFAULT_LANGUAGE,
    BETTERCOMMERCE_DEFAULT_COUNTRY: process.env.BETTERCOMMERCE_DEFAULT_COUNTRY,
    BETTERCOMMERCE_CURRENCY: process.env.BETTERCOMMERCE_CURRENCY,
    BETTERCOMMERCE_LANGUAGE: process.env.BETTERCOMMERCE_LANGUAGE,
    BETTERCOMMERCE_COUNTRY: process.env.BETTERCOMMERCE_COUNTRY,
    BETTERCMS_BASE_URL: process.env.BETTERCMS_BASE_URL,
    BETTERCMS_API_VERSION: process.env.BETTERCMS_API_VERSION,
    BETTERCMS_API_URL: process.env.BETTERCMS_API_URL,
    SITE_ORIGIN_URL: process.env.SITE_ORIGIN_URL,
    SITE_NAME: process.env.SITE_NAME,
    GA4_DISABLED: process.env.GA4_DISABLED,
    GA4_MEASUREMENT_ID: process.env.GA4_MEASUREMENT_ID,
  },
})

// Don't delete this console log, useful to see the commerce config in Vercel deployments
//console.log('next.config.js', JSON.stringify(module.exports, null, 2))
