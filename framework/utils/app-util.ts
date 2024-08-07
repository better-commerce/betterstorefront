import { NextRouter } from 'next/router'

import { uriParams } from '@commerce/utils/uri-util'
import {
  DataSubmit,
  ISubmitStateInterface,
} from '@commerce/utils/use-data-submit'
import { EmptyObject, EmptyString, IGNORE_QUERY_KEYS } from '@components/utils/constants'
import { logError } from '@framework/utils/app-util'
import { tryParseJson } from '@framework/utils/parse-util'
import enGBLocalization from '../../public/locales/en-GB/common.json'
import deDELocalization from '../../public/locales/de-DE/common.json'
import esESLocalization from '../../public/locales/es-ES/common.json'
import frFRLocalization from '../../public/locales/fr-FR/common.json'

const localizations = [{ locale: 'en-GB', data: enGBLocalization }, { locale: 'de-DE', data: deDELocalization }, { locale: 'es-ES', data: esESLocalization }, { locale: 'fr-FR', data: frFRLocalization }]


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

export const i18nLocalization = (locale: string) : { locale: string, localized: Object } => {
  if (locale) {
    const localized = localizations.find(x => x?.locale == locale)?.data || EmptyObject
    const localeInfo = {
      locale,
      localized: flattenObject(localized),
    }
    return localeInfo
  }
  return EmptyObject
}

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
