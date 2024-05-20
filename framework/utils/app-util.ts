import { uriParams } from '@commerce/utils/uri-util'
import {
  DataSubmit,
  ISubmitStateInterface,
} from '@commerce/utils/use-data-submit'
import { EmptyString } from '@components/utils/constants'
import { logError } from '@framework/utils/app-util'
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

export const getCurrentPLPFilters = (filters: any, state: any) => {
  const currentFilters = filters?.reduce(
    (acc: any, obj: any) => {
      acc.forEach((item: any) => {
        if (item.Key === obj.key) {
          item['name'] = obj.name
          return item
        }
        return acc
      })
      return acc
    },
    [...state?.filters]
  )
  return currentFilters
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

export const extractFiltersFromUrl = (url:string) => {
  if(!url) return []
  const urlObj = new URL(url);
  const queryParams = new URLSearchParams(urlObj.search);

  const filtersParam = queryParams.get('filters');
  const filters = filtersParam ? JSON.parse(decodeURIComponent(filtersParam)) : null;
  
  return  filters ;
};
