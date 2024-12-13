import { EmptyObject } from "@components/utils/constants";

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

export const micrositeMatch = (pathname: string) => {
   // Match URLs with a microsite slug prefix (e.g., `/us/path*`)
   const micrositeSlugPattern = /^\/([a-z]+)(\/.*)?$/;
   const match = pathname.match(micrositeSlugPattern);
   return match
}

export const isMicrosite = (pathname: string) => {
   const match = micrositeMatch(pathname)
   if (match) {
      const microsite = match[1];
      const micrositeConfig = getMicrositeConfig(microsite)
      if (micrositeConfig) {
         return micrositeConfig
      }
   }
   return null
}

export const getMicrositeConfig = (microsite: string) => {
   if (microsite && microsites?.microsites?.length) {
      const micrositeConfig = microsites?.microsites.find((m: any) => m.slug === microsite);
      if (micrositeConfig) {
         return micrositeConfig
      }
   }
   return null
}