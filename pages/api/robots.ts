// Package Imports
import axios from 'axios'

// Other Imports
import { XML_FEED } from '@components/utils/constants'
import fetcher from '@framework/fetcher'
import { apiMiddlewareErrorHandler } from '@framework/utils'

const robotsApiMiddleware = async (req: any, res: any) => {
  try {
    const url = `${XML_FEED}?slug=robots.txt`
    const { result: feedResult }: any = await fetcher({
      url: url,
      method: 'get',
    })

    if (feedResult?.downloadLink) {
      const response = await axios.get(feedResult?.downloadLink)
      res.send(response?.data)
    } else {
      res.status(404).send()
    }

    /*const content =
            "# Allow all crawlers\n" +
            "User-agent: *\n" +
            "Allow: /";
        res.send(content);*/
  } catch (error: any) {
    apiMiddlewareErrorHandler(req, res, error)
  }
}

export default robotsApiMiddleware
