import fetcher from '../fetcher'
import { CATEGORY_ENDPOINT } from '@new-components/utils/constants'

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
    throw new Error(error);
  }
}
