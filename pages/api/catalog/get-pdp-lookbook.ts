import commerce from '@lib/api/commerce'

const GetPDPLookbookApiMiddleware = async (req: any, res: any) => {
  try {
    const response = await commerce.getPdpLookbook({
      query: req.body.stockCode,
    })
    res.status(200).json(response)
  } catch (error) {
    console.log(error, 'error')
    res.status(500).json({ error })
  }
}

export default GetPDPLookbookApiMiddleware;