import { logError } from '@framework/utils/app-util';
import fetcher from '../fetcher'
import { CATEGORY_ENDPOINT } from '@components/utils/constants'

export default async function getCategoryBySlug(slug: string) {
  try {
    const response: any = await fetcher({
      url: CATEGORY_ENDPOINT + `/slug?slug=${slug}`,
      method: 'post',
    });
    //console.log(response);
    return {
      ...response.result,
      ...{ snippets: response?.snippets ?? [] },
      ...{ status: response?.status },
    }
  } catch (error: any) {
    logError(error)
    throw new Error(error);
  }
}
