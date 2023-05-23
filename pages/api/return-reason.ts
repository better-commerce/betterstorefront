import commerce from '@lib/api/commerce'

const GetReturnReasonApiMiddleware = async (req: any, res: any) => {
  try {
    const response = await commerce.getReturnReason({
      query: req.body,
    })
    res.status(200).json(response)
  } catch (error) {
    console.log(error, 'error')
    res.status(500).json({ error })
  }
};

export default GetReturnReasonApiMiddleware;