const axios = require('axios')
require('dotenv').config()

const CLIENT_ID = process.env.BETTERCOMMERCE_CLIENT_ID
const SHARED_SECRET = process.env.BETTERCOMMERCE_SHARED_SECRET
const BASE_URL = process.env.NEXT_PUBLIC_BETTERCOMMERCE_BASE_URL
const AUTH_URL = process.env.BETTERCOMMERCE_AUTH_URL
const fs = require('fs')

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
    let locales = {
      locales: data.result.map((i) => i.defaultLangCulture),
      defaultLocale: 'en-US',
    }
    // fs.writeFileSync(__dirname.join('/'))
    fs.writeFileSync(
      __dirname + '/framework/bettercommerce/locales.json',
      JSON.stringify(locales),
      (e) => console.log(e)
    )
  }
  microSitesHandler()
}

getMicrosites()
