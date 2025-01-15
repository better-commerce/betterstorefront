import { EmptyObject } from "@components/utils/constants";
import { Cookie } from '@framework/utils/constants'

const microsites = require('../../bettercommerce/microsites.json')

export const generateUri = (uri: string, qs: string) => {
   if (uri) {
      return uri.indexOf("?") == -1 ? sanitizeUri(`${uri}?${qs}`) : sanitizeUri(`${uri}&${qs}`);
   }
   return null;
};

export const sanitizeUri = (uri: string) => {
   const params = uriParams(uri);
   if (params) {
      var qs;
      for (let key in params) {
         if (!qs) {
            qs = `?${key}=${params[key]}`;
         } else {
            qs = qs + `&${key}=${params[key]}`;
         }
      }
      return `${uri.substring(0, uri.indexOf("?"))}${qs}`;
   }
   return uri;
};

export const uriParams = (uri: string) => {
   if (!uri)
      return EmptyObject
   // Special handling to detect ampersand in query params.
   let url = decodeURI(uri?.replaceAll('&amp;', encodeURIComponent('&')));
   url = url.substring(url.indexOf("?") + 1);
   const params = url.replace('?', '')
      .split('&')
      .map(param => param.split('='))
      .reduce((values: any, [key, value]) => {
         values[key] = value;
         return values;
      }, {});

   return params;
}

export const removeQueryString = (path: any) => {
   const queryStringIndex = path.indexOf('?')
   if (queryStringIndex !== -1) {
      return path.slice(0, queryStringIndex)
   }
   return path
}


export const hasBaseUrl = (uri: string) => {
   if (!uri) {
      return false
   }
   return (uri?.startsWith('http://') || uri?.startsWith('https://'))
}

/**
 * Matches a URL pathname against a pattern to identify a microsite slug.
 * A microsite slug is a prefix in the URL path, typically consisting of lowercase
 * letters (e.g., `/us`, `/uk`). This function checks if the given pathname
 * starts with such a microsite slug and returns the match result.
 * 
 * @param pathname - The URL pathname to check for a microsite slug.
 * @returns An array containing the full match and captured groups if a match is found,
 * or null if there is no match.
 */
export const micrositeMatch = (pathname: string) => {
   // Match URLs with a microsite slug prefix (e.g., `/us/path*`)
   const micrositeSlugPattern = /^\/([a-z]+)(\/.*)?$/;
   const match = pathname.match(micrositeSlugPattern);
   return match
}

/**
 * Checks if the given locale is a microsite slug.
 * If it is, returns the microsite configuration object.
 * Otherwise, returns null.
 * @param {string} locale The locale to check.
 * @returns {object|null} The microsite configuration object, or null if not found.
 */
export const isMicrosite = (locale: string) => {
   const micrositeConfig = getMicrositeConfig(locale)
   if (micrositeConfig) {
      return micrositeConfig
   }
   return null
}

/**
 * Returns the configuration for the given microsite slug.
 * @param {string} microsite The microsite slug to look up.
 * @returns {object} The microsite configuration object, or null if not found.
 */
export const getMicrositeConfig = (microsite: string) => {
   if (microsite && microsites?.microsites?.length) {
      const micrositeConfig = microsites?.microsites.find((m: any) => m?.slug === microsite);
      if (micrositeConfig) {
         return micrositeConfig
      }
   }
   return null
}

/**
 * If the locale is a microsite slug, return the microsite's defaultLangCulture.
 * Otherwise, return the locale as is.
 * @param locale {string} The locale to parse.
 * @returns {string} The parsed locale.
 */
export const parseMicrositeLocale = (locale: string) => {
   const micrositeConfig = isMicrosite(locale)
   if (micrositeConfig) {
      return micrositeConfig?.defaultLangCulture
   }
   return locale
}

export const serverSideMicrositeCookies = (locale: string) => {
   const micrositeConfig = isMicrosite(locale)
   if (micrositeConfig) {
      return {
         [Cookie.Key.COUNTRY]: micrositeConfig?.countryCode,
         [Cookie.Key.LANGUAGE]: micrositeConfig?.defaultLangCulture,
         [Cookie.Key.CURRENCY]: micrositeConfig?.defaultCurrencyCode,
         [Cookie.Key.MICROSITE_ID]: micrositeConfig?.id,
      }
   }
   return { [Cookie.Key.LANGUAGE]: locale }
}