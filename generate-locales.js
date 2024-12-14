const axios = require('axios')
require('dotenv').config()

const path = require('path')
const fs = require('fs')
const { v4 } = require('uuid')

const CLIENT_ID = process.env.BETTERCOMMERCE_CLIENT_ID
const SHARED_SECRET = process.env.BETTERCOMMERCE_SHARED_SECRET
const BASE_URL = process.env.BETTERCOMMERCE_BASE_URL
const AUTH_URL = process.env.BETTERCOMMERCE_AUTH_URL
const INFRA_ENDPOINT = `api/${process.env.NEXT_PUBLIC_API_VERSION}/infra/config`
const NEXT_PUBLIC_API_CACHING_LOG_ENABLED =
  process.env.NEXT_PUBLIC_API_CACHING_LOG_ENABLED

/**
 * Logs the given request and response objects to a uniquely named file
 * in the '.next/server/api-logs' directory. The function ensures that
 * the necessary directory structure exists before writing the log.
 *
 * The request and response objects are stringified with indentation
 * for readability, and the log includes both the request and response
 * data. A unique filename is generated using a UUID.
 *
 * @param {Object} request - The request object to log.
 * @param {Object} response - The response object to log.
 */
const writeFetcherLog = (request, response) => {
  const objectStrigified = (obj) => {
    return JSON.stringify(obj, null, '\t')
  }

  const workingDir = __dirname
  const dirPath = path.resolve(`${workingDir}/.next/server/api-logs`)

  if (!fs.existsSync(`${workingDir}/.next`)) {
    fs.mkdirSync(`${workingDir}/.next`)
  }

  if (!fs.existsSync(`${workingDir}/.next/server`)) {
    fs.mkdirSync(`${workingDir}/.next/server`)
  }

  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath)
  }

  const filePath = path.resolve(`${dirPath}/${v4()}-response.log`)
  const contents = `Request:\n${objectStrigified(
    request
  )}\n\nResponse:\n${objectStrigified(response)}`
  fs.writeFile(filePath, contents, function (err) {
    if (!err) {
      console.log(`---API Log: ${filePath}---`)
    }
  })
}

/**
 * Fetches an access token from the BetterCommerce API.
 *
 * @returns {Promise<string>} The access token.
 */
const getToken = async () => {
  const url = new URL('oAuth/token', AUTH_URL)
  try {
    const response = await axios({
      url: url.href,
      method: 'post',
      data: `client_id=${CLIENT_ID}&client_secret=${SHARED_SECRET}&grant_type=client_credentials`,
    })
    return response.data.access_token
  } catch (error) {
    console.log(error)
    throw new Error(error)
  }
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
 * This function gets the locales from the infra config and microsites.
 * It sets the default locale based on the regional settings config key "RegionalSettings.DefaultLanguageCode".
 * It gets all microsites and their default locales, and it sets the "locales" property of the locales object to the union of all locales.
 * It writes the locales object to a file in the framework/bettercommerce directory.
 * @returns {Promise<void>}
 */
const getSiteLocales = () => {
  let defaultLocale = `${process.env.BETTERCOMMERCE_DEFAULT_LANGUAGE}-${process.env.BETTERCOMMERCE_DEFAULT_COUNTRY}`

/**
 * This function gets the locales from the infra config and microsites.
 * It sets the default locale based on the regional settings config key "RegionalSettings.DefaultLanguageCode".
 * It gets all microsites and their default locales, and it sets the "locales" property of the locales object to the union of all locales.
 * It writes the locales object to a file in the framework/bettercommerce directory.
 * @returns {Promise<void>}
 */
  const siteLocalesHandler = async () => {
    const token = await getToken()
    const { result: infraConfig } = await getInfraConfig(token)

    const regionalSettingsConfigKeys = infraConfig?.configSettings?.find(x => x?.configType === "RegionalSettings")?.configKeys || []
    if (regionalSettingsConfigKeys?.length) {
      const defaultLanguageCode = regionalSettingsConfigKeys?.find(x => x?.key === "RegionalSettings.DefaultLanguageCode")
      if (defaultLanguageCode) {
        const defaultLanguageCulture = infraConfig?.languages?.find(x => x?.languageCode === defaultLanguageCode)?.languageCulture || ""

        if (defaultLanguageCulture) {
          defaultLocale = defaultLanguageCulture
        }
      }
    }

    let micrositeLocales = []
    const { result: microsites } = await getMicroSites(token)
    if (microsites?.length) {
      micrositeLocales = [...new Set(microsites?.filter((m) => m?.isActive)?.map((m) => m.defaultLangCulture))]
      
      const micrositeSlugs = microsites?.filter((m) => m?.isActive)?.map((m) => {
        let slug = ""
        try {
          const url = new URL(m?.slug)
          slug = url.pathname?.startsWith('/') ? url.pathname?.substring(1) : url.pathname
        } catch(error) {
        }
        return slug
      })
      micrositeLocales = micrositeLocales.concat(micrositeSlugs.filter(Boolean))
    }

    const siteLocales = [...new Set(infraConfig?.languages?.map((i) => i.languageCulture))]
    const allLocales = [...new Set([ ...siteLocales, ... micrositeLocales ])]
    //console.log({ defaultLocale, siteLocales, micrositeLocales, allLocales })
    let locales = {
      locales: infraConfig?.languages?.length ? allLocales : [defaultLocale],
      defaultLocale: defaultLocale,
    }
    console.log("----------------- | Supported i18n | -----------------")
    console.log(locales)
    console.log("------------------------------------------------------")
    // fs.writeFileSync(__dirname.join('/'))
    fs.writeFileSync(__dirname + '/framework/bettercommerce/locales.json', JSON.stringify(locales), (e) => console.log(e))
    fs.writeFileSync(__dirname + '/framework/bettercommerce/microsites.json', JSON.stringify({ microsites: microsites?.map((m) => { 
      let origin = "", slug = ""
      if (m?.slug) {
        try {
          const url = new URL(m?.slug)
          origin = url.origin
          slug = url.pathname?.startsWith('/') ? url.pathname?.substring(1) : url.pathname
        } catch(error) {
        }
      }
      return { id: m?.id, origin, slug, countryCode: m?.countryCode, defaultLangCode: m?.defaultLangCode, defaultLangCulture: m.defaultLangCulture, defaultCurrencyCode: m?.defaultCurrencyCode, } 
    }) || [] }), (e) => console.log(e))
  }
  siteLocalesHandler()
}

/**
 * Gets the SEO config from BetterCommerce infra endpoint
 * @returns {Promise<void>}
 */
const getSeoConfig = async function () {
  try {
    const INFRA_URL = new URL(INFRA_ENDPOINT, BASE_URL).href
    const token = await getToken()
    const infra = await axios({
      url: `${INFRA_URL}`,
      method: 'get',
      headers: { DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID, Authorization: 'Bearer ' + token, },
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
    fs.writeFileSync(path.join(__dirname, '/framework/bettercommerce/seo.json'), JSON.stringify(seoConfig), (err) => console.log(err))
  } catch (error) {
    console.log(error)
  }
}

getSeoConfig()
getSiteLocales()
