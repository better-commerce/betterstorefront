// apple-gen-secret.js
const nJwt = require('njwt')
const dotenv = require('dotenv')
const { createPrivateKey } = require('crypto')

dotenv.config({ path: '.env' })

const MINUTE = 60
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR
const MONTH = 30 * DAY

const privateKey = createPrivateKey(``) // Copy from the cert you downloaded from Apple
const now = Math.ceil(Date.now() / 1000)
const expires = now + MONTH * 12 * 5

const claims = {
  iss: process.env.APPLE_TEAM_ID,
  iat: now,
  exp: expires,
  aud: 'https://appleid.apple.com',
  sub: process.env.APPLE_CLIENT_ID,
}

const jwt = nJwt.create(claims, privateKey, 'ES256')
jwt.header.kid = kid

console.log(jwt.compact())
