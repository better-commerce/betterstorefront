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
  poweredByHeader: false,
  images: {
    domains: [
      'liveocxcdn.azureedge.net',
      'liveocxstorage.blob.core.windows.net',
      'devocxstorage.blob.core.windows.net',
      'www.imagedelivery.space',
      'liveocx.imgix.net',
    ],
    cacheDuration: 31536000,
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
      isBC && {
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
  headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
        ],
      },
    ]
  },
  env: {
    BETTERCOMMERCE_AUTH_URL: process.env.BETTERCOMMERCE_AUTH_URL,
    BETTERCOMMERCE_BASE_URL: process.env.BETTERCOMMERCE_BASE_URL,
    BETTERCOMMERCE_CLIENT_ID: process.env.BETTERCOMMERCE_CLIENT_ID,
    BETTERCOMMERCE_SHARED_SECRET: process.env.BETTERCOMMERCE_SHARED_SECRET,
    OMS_BASE_URL: process.env.OMS_BASE_URL,
    BETTERCOMMERCE_DEFAULT_CURRENCY:
      process.env.BETTERCOMMERCE_DEFAULT_CURRENCY,
    BETTERCOMMERCE_DEFAULT_LANGUAGE:
      process.env.BETTERCOMMERCE_DEFAULT_LANGUAGE,
    BETTERCOMMERCE_DEFAULT_COUNTRY: process.env.BETTERCOMMERCE_DEFAULT_COUNTRY,
    BETTERCOMMERCE_DEFAULT_PHONE_COUNTRY_CODE:
      process.env.BETTERCOMMERCE_DEFAULT_PHONE_COUNTRY_CODE,
    BETTERCOMMERCE_CURRENCY: process.env.BETTERCOMMERCE_CURRENCY,
    BETTERCOMMERCE_LANGUAGE: process.env.BETTERCOMMERCE_LANGUAGE,
    BETTERCOMMERCE_COUNTRY: process.env.BETTERCOMMERCE_COUNTRY,
    BETTERCMS_BASE_URL: process.env.BETTERCMS_BASE_URL,
    BETTERCMS_API_VERSION: process.env.BETTERCMS_API_VERSION,
    BETTERCMS_API_URL: process.env.BETTERCMS_API_URL,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    SITE_HOST: process.env.SITE_HOST,
    SITE_ORIGIN_URL: process.env.SITE_ORIGIN_URL,
    SITE_NAME: process.env.SITE_NAME,
    GA4_DISABLED: process.env.GA4_DISABLED,
    GA4_MEASUREMENT_ID: process.env.GA4_MEASUREMENT_ID,
    CIPHER_ENCRYPTION_KEY: process.env.CIPHER_ENCRYPTION_KEY,
    ENABLE_SECURED_PAYMENT_PAYLOAD: process.env.ENABLE_SECURED_PAYMENT_PAYLOAD,
    SECURE_PAYMENT_METHODS_SETTINGS_FIELDS:
      process.env.SECURE_PAYMENT_METHODS_SETTINGS_FIELDS,
    PAYMENT_METHODS_API_RESULT_UI_SECURED_SETTING_KEYS:
      process.env.PAYMENT_METHODS_API_RESULT_UI_SECURED_SETTING_KEYS,
    OTP_LOGIN_ENABLED: process.env.OTP_LOGIN_ENABLED,
    ERROR_LOG_ENABLED: process.env.ERROR_LOG_ENABLED,
    ERROR_LOG_OUTPUT_DIR: process.env.ERROR_LOG_OUTPUT_DIR,
    CURRENT_THEME: process.env.CURRENT_THEME,
    PDP_SIZE_OPTIONS_COUNT: process.env.PDP_SIZE_OPTIONS_COUNT,
    PRODUCT_IMAGE_CDN_URL: process.env.PRODUCT_IMAGE_CDN_URL,
    OMNILYTICS_DISABLED: process.env.OMNILYTICS_DISABLED,
    ENABLE_ELASTIC_SEARCH: process.env.ENABLE_ELASTIC_SEARCH,
    SEARCH_ENGINE_CONFIG: process.env.SEARCH_ENGINE_CONFIG,
    SEARCH_PROVIDER: process.env.SEARCH_PROVIDER,
  },
})

// Don't delete this console log, useful to see the commerce config in Vercel deployments
//console.log('next.config.js', JSON.stringify(module.exports, null, 2))
