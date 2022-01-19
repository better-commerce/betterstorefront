const commerce = require('./commerce.config.json')
// const fetcher = require('./fetcher')
const axios = require('axios')
const path = require('path')
console.log(__dirname)

const CLIENT_ID = process.env.BETTERCOMMERCE_CLIENT_ID
const SHARED_SECRET = process.env.BETTERCOMMERCE_SHARED_SECRET
const BASE_URL = process.env.NEXT_PUBLIC_BETTERCOMMERCE_BASE_URL
const AUTH_URL = process.env.BETTERCOMMERCE_AUTH_URL
const INFRA_ENDPOINT = `api/${process.env.NEXT_PUBLIC_API_VERSION}/infra/config`
const fs = require('fs')

const url = new URL('oAuth/token', AUTH_URL)

console.log(path.join(__dirname, '/config/seo.json'))
axios({
  url: url.href,
  method: 'post',
  data: `client_id=${CLIENT_ID}&client_secret=${SHARED_SECRET}&grant_type=client_credentials`,
})
  .then((res) => {
    const INFRA_URL = new URL(INFRA_ENDPOINT, BASE_URL)
    axios({
      url: `${INFRA_URL}`,
      method: 'get',
      headers: {
        DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID,
        Authorization: 'Bearer ' + res.data.access_token,
      },
    })
      .then((infra) => {
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
        fs.writeFileSync(
          path.join(__dirname, '/config/seo.json'),
          JSON.stringify(seoConfig),
          (err) => console.log(err)
        )
      })
      .catch((err) => console.log(err))
  })
  .catch((err) => console.log(err))
console.log('axios', axios)
module.exports = {
  commerce,
}
