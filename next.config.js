const commerce = require('./commerce.config.json')
const {
  withCommerceConfig,
  getProviderName,
} = require('./framework/commerce/config')

const provider = commerce.provider || getProviderName()
const isBC = provider === 'bigcommerce'
const isBetterCommerce = provider === 'bettercommerce'

module.exports = withCommerceConfig({
  commerce,
  images: {
    domains: [
      'liveocxcdn.azureedge.net',
      'res.cloudinary.com',
      '99yrs.co.in',
      'the-fragrance-shop.imgix.net',
    ],
    // for trident need to add domain ('res.cloudinary.com', '99yrs.co.in') for images
  },
  i18n: {
    defaultLocale: 'en-GB',
  },
})

// Don't delete this console log, useful to see the commerce config in Vercel deployments
console.log('next.config.js root', JSON.stringify(module.exports, null, 2))
