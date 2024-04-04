const locales = require('./framework/bettercommerce/locales.json')

/** @type {import('next-i18next').UserConfig} */
module.exports = {
    i18n: {
        ...locales,
        localeDetection: false,
    },
}