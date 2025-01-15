import { NextRouter } from 'next/router'

import { isMicrosite, uriParams } from '@commerce/utils/uri-util'
import { DataSubmit, ISubmitStateInterface, } from '@commerce/utils/use-data-submit'
import { EmptyObject, EmptyString, IGNORE_QUERY_KEYS } from '@components/utils/constants'
import { logError } from '@framework/utils/app-util'
import { tryParseJson } from '@framework/utils/parse-util'
import { getCookie, removeCookie } from '@framework/utils'
import { Cookie } from '@framework/utils/constants'
import { decrypt, encrypt } from '@framework/utils/cipher'
import { setCookie } from '@components/utils/cookieHandler'

const getLocalizationData = (locale: string) => {
  try {
    const module = require(`public/locales/${locale}/common.json`)
    return module || EmptyObject
  } catch (error) {
    logError(error)
    return EmptyObject
  }
}

export const resetSubmitData = (dispatch: any) => {
  if (dispatch) {
    dispatch({ type: DataSubmit.RESET_SUBMITTING })
  }
}
export const sanitizeHtmlContent = (html: any) => {
  try {
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')
    return doc?.body?.innerHTML || EmptyString
  }
  catch (error: any) {
    logError(error)
  }

  return EmptyString
}

export const parsePLPFilters = (qsFilters: string) => {
  if (qsFilters) {
    const filters = new Array<{Key: string, Value: string}>()
    const params = uriParams(decodeURIComponent(qsFilters))
    const keysToIgnore = IGNORE_QUERY_KEYS; // Define the keys to ignore
    if (params) {
      for(var key in params) {
        // Exclude ignore query key if exists for Filter
        if(!keysToIgnore?.includes(key)){
          const paramValue = params[key]
          if (paramValue) {
            const paramValues = paramValue?.split(',')
            paramValues.forEach((value: string) => {
              // Special handling for ampersand in query params
              filters.push({ Key: key, Value: value?.replaceAll('&amp;', '&')?.replaceAll(encodeURIComponent('&'), '&')?.replaceAll('+', ' ') }) // Replacing plus with space
            })
          }
        }
      }
      return filters
    }
  }
  return new Array<any>()
}

export const routeToPLPWithSelectedFilters = (router: NextRouter, currentFilters: Array<any>, shouldRemove = false) => {
  const keysToIgnore = IGNORE_QUERY_KEYS
  const modifiedFiltersObj = currentFilters?.reduce((acc: any, cur: { Key: string, Value: string }) => {
    acc[cur?.Key] = acc[cur?.Key] ? [acc[cur?.Key], cur?.Value].join(',') : cur?.Value
    return acc
  }, {})

  const url = new URL(window.location.origin + window.location.pathname) //new URL(window.location.href)
  for (let key in modifiedFiltersObj) {
    if (shouldRemove) {
      url.searchParams.delete(key)
    } else {
      // Special handling for ampersand in query params
      url.searchParams.set(key, modifiedFiltersObj[key]?.replaceAll('&', '&amp;'))
    }
  }

   const currentSearchParams = new URLSearchParams(window.location.search);
   // Include ignore query key if exists for URL
   currentSearchParams?.forEach((value, key) => {
     if (keysToIgnore?.includes(key)) {
      url.searchParams.set(key, key === 'currentPage' ? '1' : value);  //set currentPage to 1
     }
   });
  
  router.replace(decodeURIComponent(url.toString()), undefined, { shallow: true })
}

export const setPLPFilterSelection = (currentFilters: Array<any>) => {
  const cookieKey = Cookie.Key.APPLIED_PLP_FILTERS
  let filters = new Array<any>()
  if (currentFilters?.length) {
    filters = currentFilters?.map((x: any) => ({ name: x?.Key || x?.Name || x?.name, value: x?.Value }))
    setCookie(cookieKey, encrypt(JSON.stringify(filters)))
  } else {
    if (getCookie(cookieKey)) {
      removeCookie(cookieKey)
    }
  }
}
export const getPLPFilterSelection = () => {
  const cookieKey = Cookie.Key.APPLIED_PLP_FILTERS
  if (getCookie(cookieKey)) {
    const filters: any = tryParseJson(decrypt(getCookie(cookieKey)!))
    return filters
  }
  return new Array<any>()
}
export const resetPLPFilterSelection = () => {
  const cookieKey = Cookie.Key.APPLIED_PLP_FILTERS
  if (getCookie(cookieKey)) {
    removeCookie(cookieKey)
  }
}

export const routeToPLPWithSelectedFiltersOld = (router: any, currentFilters: Array<any>) => {
  const getFilterQuery = () => {
    let qs = EmptyString
    if (currentFilters?.length) {
    qs = JSON.stringify(currentFilters/*?.map((filter: any) => ({ name: filter?.name, value: filter?.Value }))*/)
      qs = `filters=${encodeURIComponent(qs)}`
    }
    return qs
  }

  let filterQuery = getFilterQuery()
  let qsSearchParamsExcludingFilters = EmptyString
  const search = document?.location?.search
  //if (search) {
  const searchParams = uriParams(search)
  const { filters, ...rest } = searchParams
  const searchParamsExcludingFilters = {...rest}
  for (let key in searchParamsExcludingFilters) {
    if (!qsSearchParamsExcludingFilters) {
      qsSearchParamsExcludingFilters = `?${key}=${searchParamsExcludingFilters[key]}`
    } else {
      qsSearchParamsExcludingFilters = `${qsSearchParamsExcludingFilters}&${key}=${searchParamsExcludingFilters[key]}`
    }
  }
  //}
  if (filterQuery) {
    if (!qsSearchParamsExcludingFilters) {
      filterQuery = `?${filterQuery}`
    } else {
      filterQuery = `&${filterQuery}`
    }
    router.replace(`${document?.location?.pathname}${qsSearchParamsExcludingFilters}${filterQuery}`, undefined, { shallow: true })
  } else {
    router.replace(`${document?.location?.pathname}${qsSearchParamsExcludingFilters}`, undefined, { shallow: true })
  }
}

/**
 * Returns the localization data for the given locale, flattened to a single level object.
 * @param {string} locale - The locale code, e.g. "en-GB", "de-DE", etc.
 * @returns {{ locale: string, localized: Object }} - An object with two properties: locale, and localized.
 * localized is an object with the localization data, flattened to a single level.
 * If the locale is not found, or if the locale is empty, an empty object is returned.
 */


// export const i18nLocalization = (locale: string) : { locale: string, localized: Object } => {
//   if (locale) {
//     let localized: any
//     const micrositeConfig = isMicrosite(locale)
//     if (micrositeConfig) {
//       localized = localizations.find(x => x?.locale == micrositeConfig?.defaultLangCulture)?.data || EmptyObject
//     } else {
//       localized = localizations.find(x => x?.locale == locale)?.data || EmptyObject
//     }
//     const localeInfo = {
//       locale,
//       localized: flattenObject(localized),
//     }
//     return localeInfo
//   }
//   return EmptyObject
// }


export const i18nLocalization = (locale: string): any => {
  if (!locale) {
    return EmptyObject
  }

  const micrositeConfig = isMicrosite(locale)
  const resolvedLocale = micrositeConfig?.defaultLangCulture || locale
  const localizationData = getLocalizationData(resolvedLocale)
  return {
    locale,
    localized: flattenObject(localizationData),
  }
}

/**
 * Flattens an object to a single level.
 * @param {Object} obj - The object to flatten.
 * @param {string} [parentKey=''] - The parent key to prefix to each key.
 * @param {Object} [result={}] - The object to store the flattened result in.
 * @returns {Object} - An object with the flattened result.
 * @example
 * flattenObject({ a: { b: 1, c: 2 } }) // { 'a.b': 1, 'a.c': 2 }
 */
export const flattenObject = (obj: any, parentKey = '', result: any = {}) => {
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = parentKey ? `${parentKey}.${key}` : key;
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        flattenObject(obj[key], newKey, result);
      } else {
        result[newKey] = obj[key];
      }
    }
  }
  return result;
}

export const getAppliedFilters = (filters: any[]) => {
  const url = new URL(window.location.href)

  if (filters?.length < 1 || url.searchParams.size < 1) return

  let appliedFilters: any = {}

  url.searchParams.forEach((filterValues: any, filterKey: any) => {
    const selectedFilter = filters?.find(o => o?.key?.toLowerCase()?.includes(filterKey))
    
    if (!selectedFilter) return

    filterValues = filterValues.split(',')

    filterValues?.forEach((filterValue: string) => {
      const selectedFilterName = selectedFilter?.items?.find((o: any) => o?.name?.toLowerCase() === filterValue)?.name

      appliedFilters[selectedFilter?.key] = [
        ...(appliedFilters?.[selectedFilter?.key] || []),
        {
          Key: selectedFilter?.key,
          Value: selectedFilterName,
          IsSelected: true,
          Name: selectedFilter?.name
        }
      ]
    })
  })

  return Object.values(appliedFilters).flat()
}

export const downloadBase64AsFile = (base64: string, fileName: string, fileMime: string) => {
    const downloadFileObject = (base64: string, fileName: string) => {
        const linkSource = base64
        const downloadLink: any = document.createElement("a")
        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        if (downloadLink?.click) {
            downloadLink.click()
        } else if (downloadLink?.onClick) {
            downloadLink.onClick()
        }
    }
 
    const base64String = `data:${fileMime};base64,` + base64
    downloadFileObject(base64String, fileName)
}
 

export function removeTitleTags(html: string): string {
  return html.replace(/<title[^>]*>.*?<\/title>/g, '');
}
