import { uriParams } from '@commerce/utils/uri-util'
import {
  DataSubmit,
  ISubmitStateInterface,
} from '@commerce/utils/use-data-submit'
import { EmptyObject, EmptyString } from '@components/utils/constants'
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
  const queryFilters = decodeURIComponent(qsFilters as string)
  if (queryFilters) {
    const filters: any = tryParseJson(queryFilters) || []
    return filters
  }
  return new Array<any>()
}

export const routeToPLPWithSelectedFilters = (router: any, currentFilters: Array<any>) => {
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
    return {
      locale,
      localized: flattenObject(localized),
    }
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