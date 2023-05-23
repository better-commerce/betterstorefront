import commerce from '@lib/api/commerce'

const GetRelatedProductsApiMiddleware = async (req: any, res: any) => {
  try {
    const response = await commerce.getRelatedProducts({
      query: req.body.recordId,
    })
    res.status(200).json(response)
  } catch (error) {
    console.log(error, 'error')
    res.status(500).json({ error })
  }
};

export default GetRelatedProductsApiMiddleware;