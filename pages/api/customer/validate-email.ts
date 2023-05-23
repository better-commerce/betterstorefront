import commerce from '@lib/api/commerce'

const ValidateEmailApiMiddleware = async (req: any, res: any) => {
  try {
    const response = await commerce.validateEmail({
      query: req.body,
      cookie: req.cookies,
    })
    res.status(200).json(response)
  } catch (error) {
    console.log(error, 'error')
    res.status(500).json({ error })
  }
};

export default ValidateEmailApiMiddleware;