import commerce from '@lib/api/commerce'

const GetProductApiMiddleware = async (req: any, res: any) => {
  try {
    const response = await commerce.getProduct({
      query: req.body.slug,
      cookies: req.cookies,
    })
    res.status(200).json(response)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error })
  }
};

export default GetProductApiMiddleware;