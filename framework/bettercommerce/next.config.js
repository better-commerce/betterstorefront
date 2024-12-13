const commerce = require('./features.config.json')
// const fetcher = require('./fetcher')
const axios = require('axios')
const path = require('path')

const CLIENT_ID = process.env.BETTERCOMMERCE_CLIENT_ID
const SHARED_SECRET = process.env.BETTERCOMMERCE_SHARED_SECRET
const BASE_URL = process.env.BETTERCOMMERCE_BASE_URL
const AUTH_URL = process.env.BETTERCOMMERCE_AUTH_URL
const INFRA_ENDPOINT = `api/${process.env.NEXT_PUBLIC_API_VERSION}/infra/config`
const fs = require('fs')
const localeSettings = require('./locales.json')
const { localizations, ...rest } = localeSettings
const locales = { ...rest }

const url = new URL('oAuth/token', AUTH_URL)

/**
 * Retrieves an access token from the BetterCommerce authorization endpoint.
 * 
 * This function will throw an error if the request to the authorization endpoint fails.
 * @returns {Promise<string>} - A promise that resolves with the access token.
 */
const getToken = async () => {
  try {
    const response = await axios({ url: url.href, method: 'post', data: `client_id=${CLIENT_ID}&client_secret=${SHARED_SECRET}&grant_type=client_credentials`, })
    return response.data.access_token
  } catch (error) {
    throw new Error(error)
  }
}

/**
 * Fetches and writes the SEO configuration to a JSON file.
 * 
 * @param {string} token - The authentication token to access the infra endpoint.
 * @returns {Promise<void>} - A promise that resolves when the operation is complete.
 * 
 * The function retrieves the SEO settings from the BetterCommerce infrastructure endpoint 
 * and writes them to a `seo.json` file. The SEO settings include the default title, 
 * meta description, and meta keywords.
 */
const getSeoConfig = async function (token) {
  try {
    const INFRA_URL = new URL(INFRA_ENDPOINT, BASE_URL).href
    // const token = await getToken()
    const infra = await axios({
      url: `${INFRA_URL}`,
      method: 'get',
      headers: { DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID, Authorization: 'Bearer ' + token, },
    })
    const seoConfig = infra.data.result.configSettings
      ?.find((i) => i.configType === 'SeoSettings')
      ?.configKeys.reduce((acc, obj) => {
        if (obj.key === 'SeoSettings.DefaultTitle')
          acc['title'] = obj.value || JSON.stringify(obj.value)
        if (obj.key === 'SeoSettings.DefaultMetaDescription')
          acc['description'] = obj.value || JSON.stringify(obj.value)
        if (obj.key === 'SeoSettings.DefaultMetaKeywords')
          acc['keywords'] = obj.value || JSON.stringify(obj.value)
        return acc
      }, {})
    //console.log(path.join(__dirname), '====')
    fs.writeFileSync(path.join(__dirname, '/seo.json'), JSON.stringify(seoConfig), (err) => console.log(err))
  } catch (error) { }
}

/**
 * Fetches the redirects from the BetterCommerce API, and maps it to Next.js redirects format.
 * 
 * @param {string} token The access token to authenticate the request.
 * @returns {Promise<import('next').Redirect[]>} The redirects in the Next.js format.
 */
const getRedirects = async function (token) {
  const response = await axios({
    method: 'get',
    url: new URL('/api/v2/content/redirects', BASE_URL).href,
    headers: { DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID, Authorization: 'Bearer ' + token, },
  })
  return response.data.result.map((item) => {
    let pathName = ''
    try {
      pathName = new URL(item.oldUrl).pathname
    } catch (e) {
      // Do nothing
    }

    if (pathName) {
      return {
        source: pathName, //new URL(item.oldUrl).pathname,
        destination: item.newUrl,
        permanent: true,
      }
    }
  })
}

/**
 * Gets the infra config from the infra endpoint.
 * @param {string} token
 * @returns {Promise<*>}
 */
const getInfraConfig = async (token) => {
  const INFRA_URL = new URL(INFRA_ENDPOINT, BASE_URL).href
  const { data } = await axios({
    url: `${INFRA_URL}`,
    method: 'get',
    headers: { DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID, Authorization: 'Bearer ' + token, },
  })
  return data
}

/**
 * Gets all microsites from the API.
 * @param {string} token
 * @returns {Promise<*[]>}
 */
const getMicroSites = async (token) => {
  const url = new URL('/api/v2/content/microsite/all', BASE_URL).href
  const req = {
    method: 'get',
    url: url,
    headers: { DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID, Authorization: 'Bearer ' + token, },
  }
  const { data } = await axios(req)
  return data
}

/**
 * Returns the slug of the microsite from a given URL string.
 * The slug is the part of the URL between the domain and the first slash.
 * If the URL is invalid, an empty string is returned.
 * @param {string} slug - The URL string to extract the slug from.
 * @returns {string} - The microsite slug.
 */
const getMicroSiteSlug = (slug) => {
  try {
    const url = new URL(slug)
    const pathname = url.pathname
    return pathname
  } catch (error) {
  }
  return ""
}

//console.log(locales, '====')
module.exports = {
  //https://nextjs.org/docs/api-reference/next.config.js/redirects nextjs documentation on redirects
  commerce,
  async redirects() {
    const token = await getToken()
    const redirects = await getRedirects(token)
    return redirects
  },

  /*async rewrites() {
    let allReWrites = []
    const token = await getToken()

    // Microsite rewrites
    const { result: microsites } = await getMicroSites(token)
    if (microsites?.length) {
      const micrositeReWrites = microsites?.filter((m) => getMicroSiteSlug(m?.slug) === "/" ? false : true)?.map((m) => ({
        source: `${getMicroSiteSlug(m?.slug)}/:locale(${m?.defaultLangCulture})/:path*`,
        destination: `${getMicroSiteSlug(m?.slug)}/:locale/:path*`,
      }))
      console.log("----------------- | Supported Microsites | -----------------")
      console.log(micrositeReWrites)
      console.log("------------------------------------------------------------")
      allReWrites = allReWrites.concat([...new Set(micrositeReWrites)])
    }

    // Default locale rewrites
    const { result: infraConfig } = await getInfraConfig(token)
    const siteLocales = [...new Set(infraConfig?.languages?.map((i) => i.languageCulture))]
    if (siteLocales?.length) {
      const siteReWrites = siteLocales?.map((locale) => ({
        source: `/:locale(${locale})/:path*`,
        destination: `/:locale/:path*`,
      }))
      allReWrites = allReWrites.concat(siteReWrites)
    }
    console.log("----------------- | Supported Sites | -----------------")
    console.log(allReWrites)
    console.log("------------------------------------------------------")
    return allReWrites
  },*/

  i18n: { ...locales, localeDetection: false, },
}

// console.log(
//   'next.config.js bettercommerce',
//   JSON.stringify(module.exports, null, 2)
// )
