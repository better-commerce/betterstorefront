const commerce = require('./commerce.config.json')
// const fetcher = require('./fetcher')
const axios = require('axios')
const path = require('path')

const CLIENT_ID = process.env.BETTERCOMMERCE_CLIENT_ID
const SHARED_SECRET = process.env.BETTERCOMMERCE_SHARED_SECRET
const BASE_URL = process.env.BETTERCOMMERCE_BASE_URL
const AUTH_URL = process.env.BETTERCOMMERCE_AUTH_URL
const INFRA_ENDPOINT = `api/${process.env.NEXT_PUBLIC_API_VERSION}/infra/config`
const fs = require('fs')
const locales = require('./locales.json')

const url = new URL('oAuth/token', AUTH_URL)

const getToken = async () => {
  try {
    const response = await axios({
      url: url.href,
      method: 'post',
      data: `client_id=${CLIENT_ID}&client_secret=${SHARED_SECRET}&grant_type=client_credentials`,
    })
    return response.data.access_token
  } catch (error) {
    throw new Error(error)
  }
}

const getSeoConfig = async function (token) {
  try {
    const INFRA_URL = new URL(INFRA_ENDPOINT, BASE_URL).href
    // const token = await getToken()
    const infra = await axios({
      url: `${INFRA_URL}`,
      method: 'get',
      headers: {
        DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID,
        Authorization: 'Bearer ' + token,
      },
    })
    const seoConfig = infra.data.result.configSettings
      .find((i) => i.configType === 'SeoSettings')
      ?.configKeys.reduce((acc, obj) => {
        if (obj.key === 'SeoSettings.DefaultTitle')
          acc['title'] = obj.value || JSON.stringify(obj.value)
        if (obj.key === 'SeoSettings.DefaultMetaDescription')
          acc['description'] = obj.value || JSON.stringify(obj.value)
        if (obj.key === 'SeoSettings.DefaultMetaKeywords')
          acc['keywords'] = obj.value || JSON.stringify(obj.value)
        return acc
      }, {})
    console.log(path.join(__dirname), '====')
    fs.writeFileSync(
      path.join(__dirname, '/seo.json'),
      JSON.stringify(seoConfig),
      (err) => console.log(err)
    )
  } catch (error) {}
}

const handler = async () => {
  const token = await getToken()
  await Promise.all([getSeoConfig(token)])
}

const getKeywords = async function () {
  const token = await getToken()
  const response = await axios({
    method: 'get',
    url: new URL('/api/v2/content/redirects', BASE_URL).href,
    headers: {
      DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID,
      Authorization: 'Bearer ' + token,
    },
  })
  return response.data.result.map((item) => {
    return {
      source: new URL(item.oldUrl).pathname,
      destination: item.newUrl,
      permanent: true,
    }
  })
}

const getMicrosites = () => {
  const microSitesHandler = async () => {
    const token = await getToken()
    const url = new URL('/api/v2/content/microsite/all', BASE_URL).href
    const { data } = await axios({
      method: 'get',
      url: url,
      headers: {
        DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID,
        Authorization: 'Bearer ' + token,
      },
    })
    return {
      locales: data.result.map((i) => i.defaultLangCulture),
      defaultLocale: 'en-GB',
    }
  }
  return microSitesHandler()
}

const localeStore = {}

let func = (async () => {
  let microsites = await getMicrosites()
  console.log(microsites)
  localeStore.i18n = microsites
})()

console.log(locales, '====')
module.exports = {
  //https://nextjs.org/docs/api-reference/next.config.js/redirects nextjs documentation on redirects
  commerce,
  async redirects() {
    const keywords = await getKeywords()
    return keywords
  },
  async rewrites() {
    return [
      {
        //brand
        source: '/:path/b',
        destination: '/brands/:path',
      },
      {
        //collection plp
        source: '/:path*/l',
        destination: '/collection/:path*',
      },
      {
        //category plp
        source: '/:path*/c',
        destination: '/category/:path*',
      },
      {
        //lookbook plp
        source: '/:path*/lb',
        destination: '/lookbook/:path*',
      },
      {
        //pdp
        // dior/sauvage/eau-de-parfum-spray/p/40251
        source: '/:path*/p/:id*',
        destination: '/products/:path*/:id*',
      },
    ]
  },
  i18n: {
    ...locales,
    localeDetection: false,
  },
}

console.log(
  'next.config.js bettercommerce',
  JSON.stringify(module.exports, null, 2)
)
