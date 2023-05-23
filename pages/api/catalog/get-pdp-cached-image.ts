import commerce from '@lib/api/commerce'

const GetPDPCachedImagesApiMiddleware = async (req: any, res: any) => {
  try {
    const response = await commerce.getPdpCachedImage({
      query: req.body.productCode,
    })
    res.status(200).json(response)
  } catch (error) {
    console.log(error, 'error')
    res.status(500).json({ error })
  }
}

export default GetPDPCachedImagesApiMiddleware;