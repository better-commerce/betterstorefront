import fetcher from '../../fetcher'
import { CUSTOMER_BASE_API } from '@components/utils/constants'

/**
 * Retrieves the order details for a specific customer.
 *
 * This function returns an asynchronous function that fetches a customer's orders
 * based on the provided query parameters and cookies. The query can include pagination
 * details such as `pageSize` and `pageNumber`, as well as a flag `hasMembership`
 * to indicate membership status.
 *
 * @returns {Function} An asynchronous function that fetches customer orders.
 */

export default function getOrders() {
  
  /**
   * Retrieves a customer's orders based on the provided query parameters and cookies.
   *
   * The query can include pagination details such as `pageSize` and `pageNumber`, as
   * well as a flag `hasMembership` to indicate membership status.
   *
   * @param {Object} query - Query parameters for the API call.
   * @param {number} query.pageSize - The number of orders to return per page.
   * @param {number} query.pageNumber - The page number to return.
   * @param {boolean} query.hasMembership - If the customer has a membership.
   * @param {Object} cookies - Cookies to send with the API call.
   * @returns {Promise<Object>} A promise resolving to the customer's orders.
   */
  async function getOrdersAsync({ query, cookies }: any) {
    try {
      const { pageSize = 10, pageNumber = 1 } = query

      // TODO: Fix the pagination issue on FE & pass the pageSize and pageNumber to the API20.
      //const url = `${CUSTOMER_BASE_API}${query.id}/orders?hasMembership=${query?.hasMembership ?? false}&pageSize=${pageSize}&pageNumber=${pageNumber}`
      const url = `${CUSTOMER_BASE_API}${query.id}/orders?hasMembership=${query?.hasMembership ?? false}`
      const response: any = await fetcher({
        url,
        method: 'get',
        data: query,
        cookies,
      })
      return response.result
    } catch (error: any) {
      console.log(error, 'error')
      throw new Error(error)
    }
  }
  return getOrdersAsync
}
