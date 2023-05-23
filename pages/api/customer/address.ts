import commerce from '@lib/api/commerce'

const GetAddressApiMiddleware = async (req: any, res: any) => {
  try {
    const response = await commerce.getAddress({
      query: req.body,
      cookies: req.cookies,
    })
    res.status(200).json(response)
  } catch (error) {
    console.log(error, 'error')
    res.status(500).json({ error })
  }
};

export default GetAddressApiMiddleware;