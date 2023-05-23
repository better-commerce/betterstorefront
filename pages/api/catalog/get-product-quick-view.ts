import commerce from '@lib/api/commerce'

const GetProductQuickviewApiMiddleware = async (req: any, res: any) => {
  try {
    const response = await commerce.getProductQuickview({
      query: req.body.slug,
    })
    res.status(200).json(response)
  } catch (error) {
    console.log(error, 'error')
    res.status(500).json({ error })
  }
};

export default GetProductQuickviewApiMiddleware;